#!/usr/bin/env node

import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(scriptDirectory, "..")
const minimumSizeDeltaBytes = 64

function parseArguments(argv) {
  const args = {}

  for (let index = 2; index < argv.length; index += 1) {
    const argument = argv[index]
    if (!argument.startsWith("--")) continue

    const key = argument.slice(2)
    const value = argv[index + 1]
    if (value && !value.startsWith("--")) {
      args[key] = value
      index += 1
    } else {
      args[key] = true
    }
  }

  return args
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"))
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8")
}

function discoverBundles(bundlesDirectory) {
  if (!existsSync(bundlesDirectory)) {
    throw new Error(`Bundles directory does not exist: ${bundlesDirectory}`)
  }

  return readdirSync(bundlesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(bundlesDirectory, entry.name))
    .filter((directory) => existsSync(path.join(directory, "package.json")))
    .sort()
}

function discoverPublishDirectories(packagesDirectory) {
  if (!existsSync(packagesDirectory)) {
    throw new Error(`Packages directory does not exist: ${packagesDirectory}`)
  }

  return readdirSync(packagesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(packagesDirectory, entry.name, "publish"))
    .filter((directory) => existsSync(path.join(directory, "package.json")))
    .sort()
}

function measureBundle(bundleDirectory) {
  const output = execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd: bundleDirectory,
    encoding: "utf8",
    env: {
      ...process.env,
      npm_config_loglevel: "silent",
    },
    maxBuffer: 10 * 1024 * 1024,
    stdio: ["ignore", "pipe", "inherit"],
  })
  const [result] = JSON.parse(output)

  if (!result?.name || typeof result.size !== "number") {
    throw new Error(`npm pack returned invalid data for ${bundleDirectory}`)
  }

  return {
    name: result.name,
    tarballBytes: result.size,
    unpackedBytes: result.unpackedSize,
    fileCount: result.entryCount ?? result.files?.length ?? 0,
  }
}

function measure(packageDirectories, sourceDirectory) {
  const bundles = {}

  for (const bundleDirectory of packageDirectories) {
    const result = measureBundle(bundleDirectory)
    bundles[result.name] = result
    console.log(
      `${result.name}: tarball=${formatBytes(result.tarballBytes)}, unpacked=${formatBytes(result.unpackedBytes)}, files=${result.fileCount}`,
    )
  }

  if (Object.keys(bundles).length === 0) {
    throw new Error(`No publishable packages found in ${sourceDirectory}`)
  }

  return {
    schemaVersion: 1,
    bundles,
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B"

  const absolute = Math.abs(bytes)
  if (absolute < 1024) return `${absolute} B`

  const kilobytes = absolute / 1024
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} kB`

  return `${(kilobytes / 1024).toFixed(2)} MB`
}

function formatSize(value) {
  return typeof value === "number" ? formatBytes(value) : "—"
}

function formatDelta(current, base) {
  if (typeof current !== "number") return "removed"
  if (typeof base !== "number") return "new"

  const difference = current - base
  if (Math.abs(difference) < minimumSizeDeltaBytes) return "no change"

  const sign = difference > 0 ? "+" : "-"
  const percentage = base === 0 ? null : (difference / base) * 100
  const formattedPercentage = percentage === null ? "∞" : `${Math.abs(percentage).toFixed(1)}%`
  const text = `${sign}${formatBytes(difference)} (${sign}${formattedPercentage})`

  return percentage !== null && Math.abs(percentage) >= 5 ? `**${text}**` : text
}

function formatCount(value) {
  return typeof value === "number" ? String(value) : "—"
}

function formatCountDelta(current, base) {
  if (typeof current !== "number") return "removed"
  if (typeof base !== "number") return "new"

  const difference = current - base
  if (difference === 0) return "no change"
  return difference > 0 ? `+${difference}` : String(difference)
}

function escapeTableCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ")
}

function sumMetric(bundles, metric) {
  return Object.values(bundles).reduce((total, bundle) => total + (bundle[metric] ?? 0), 0)
}

function hasSizeChanged(current, base) {
  if (typeof current !== "number" || typeof base !== "number") {
    return current !== base
  }

  return Math.abs(current - base) >= minimumSizeDeltaBytes
}

function compare(baseReport, currentReport) {
  const baseBundles = baseReport.bundles ?? {}
  const currentBundles = currentReport.bundles ?? {}
  const names = [...new Set([...Object.keys(baseBundles), ...Object.keys(currentBundles)])].sort()
  const changedNames = names.filter((name) => {
    const base = baseBundles[name]
    const current = currentBundles[name]

    return (
      hasSizeChanged(current?.tarballBytes, base?.tarballBytes) ||
      hasSizeChanged(current?.unpackedBytes, base?.unpackedBytes) ||
      base?.fileCount !== current?.fileCount
    )
  })

  const lines = ["## Package Size Report", ""]
  if (changedNames.length === 0) {
    lines.push("No published package size changes detected.", "")
  } else {
    lines.push(`${changedNames.length} package(s) changed.`, "")
  }

  lines.push(
    "| Package | Tarball | Delta | Unpacked | Delta | Files | Delta |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  )

  for (const name of names) {
    const base = baseBundles[name]
    const current = currentBundles[name]
    lines.push(
      `| \`${escapeTableCell(name)}\` | ${formatSize(current?.tarballBytes)} | ${formatDelta(current?.tarballBytes, base?.tarballBytes)} | ${formatSize(current?.unpackedBytes)} | ${formatDelta(current?.unpackedBytes, base?.unpackedBytes)} | ${formatCount(current?.fileCount)} | ${formatCountDelta(current?.fileCount, base?.fileCount)} |`,
    )
  }

  const totalBaseTarball = sumMetric(baseBundles, "tarballBytes")
  const totalCurrentTarball = sumMetric(currentBundles, "tarballBytes")
  const totalBaseUnpacked = sumMetric(baseBundles, "unpackedBytes")
  const totalCurrentUnpacked = sumMetric(currentBundles, "unpackedBytes")

  lines.push(
    "",
    `**Total tarball:** ${formatBytes(totalCurrentTarball)} (${formatDelta(totalCurrentTarball, totalBaseTarball)})`,
    `**Total unpacked:** ${formatBytes(totalCurrentUnpacked)} (${formatDelta(totalCurrentUnpacked, totalBaseUnpacked)})`,
    "",
    "_Measured from `npm pack --dry-run` after building each publishable package. Deltas below 64 bytes are treated as build noise. This reflects npm package download and installed sizes, not the tree-shaken size of a consumer application._",
    "",
  )

  return lines.join("\n")
}

function main() {
  const args = parseArguments(process.argv)
  const outputPath = path.resolve(args.output || "bundle-sizes.json")

  if (args.compare) {
    const basePath = path.resolve(args.compare)
    const currentPath = path.resolve(args.current || "current.json")
    const markdown = compare(readJson(basePath), readJson(currentPath))

    writeFileSync(outputPath, markdown, "utf8")
    console.log(markdown)
    return
  }

  const sourceDirectory = path.resolve(
    args["bundles-dir"] || args["packages-dir"] || path.join(repositoryRoot, "packages"),
  )
  const packageDirectories = args["bundles-dir"]
    ? discoverBundles(sourceDirectory)
    : discoverPublishDirectories(sourceDirectory)
  const report = measure(packageDirectories, sourceDirectory)
  writeJson(outputPath, report)
  console.log(`Measured ${Object.keys(report.bundles).length} packages → ${outputPath}`)
}

try {
  main()
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
