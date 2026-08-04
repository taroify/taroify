#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(scriptDirectory, "..")
const packagesDirectory = path.join(repositoryRoot, "packages")
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm"
const defaultRegistry = "https://registry.npmjs.org/"

function parseArguments(argv) {
  const argumentsList = argv.slice(2)
  const supportedArguments = new Set(["--dry-run"])
  const unsupportedArgument = argumentsList.find((argument) => !supportedArguments.has(argument))

  if (unsupportedArgument) {
    throw new Error(`Unsupported argument: ${unsupportedArgument}`)
  }

  return {
    dryRun: argumentsList.includes("--dry-run"),
  }
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"))
}

function discoverPackages() {
  if (!existsSync(packagesDirectory)) {
    throw new Error(`Packages directory does not exist: ${packagesDirectory}`)
  }

  const packages = readdirSync(packagesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(packagesDirectory, entry.name, "publish"))
    .filter((directory) => existsSync(path.join(directory, "package.json")))
    .map((directory) => {
      const manifest = readJson(path.join(directory, "package.json"))

      if (!manifest.name || !manifest.version) {
        throw new Error(`Invalid package manifest: ${path.join(directory, "package.json")}`)
      }

      return {
        directory,
        manifest,
        name: manifest.name,
        version: manifest.version,
      }
    })
    .filter(({ manifest }) => manifest.private !== true && manifest.private !== "true")

  if (packages.length === 0) {
    throw new Error("No publishable package outputs were found. Run the build first.")
  }

  return packages
}

function internalDependencies(pkg, packagesByName) {
  const manifest = pkg.manifest
  const dependencies = {
    ...manifest.dependencies,
    ...manifest.optionalDependencies,
    ...manifest.peerDependencies,
  }

  return Object.keys(dependencies)
    .filter((name) => packagesByName.has(name))
    .sort()
}

function sortPackages(packages) {
  const packagesByName = new Map(packages.map((pkg) => [pkg.name, pkg]))
  const sortedPackages = []
  const visited = new Set()
  const visiting = new Set()

  function visit(pkg) {
    if (visited.has(pkg.name)) return
    if (visiting.has(pkg.name)) {
      throw new Error(`Circular package dependency detected at ${pkg.name}`)
    }

    visiting.add(pkg.name)
    for (const dependencyName of internalDependencies(pkg, packagesByName)) {
      visit(packagesByName.get(dependencyName))
    }
    visiting.delete(pkg.name)
    visited.add(pkg.name)
    sortedPackages.push(pkg)
  }

  for (const pkg of [...packages].sort((left, right) => left.name.localeCompare(right.name))) {
    visit(pkg)
  }

  return sortedPackages
}

function runNpm(argumentsList, captureOutput = false) {
  const result = spawnSync(npmCommand, argumentsList, {
    cwd: repositoryRoot,
    encoding: "utf8",
    stdio: captureOutput ? ["ignore", "pipe", "pipe"] : "inherit",
  })

  if (result.error) {
    throw result.error
  }

  return result
}

function isPublished(pkg) {
  const registry = pkg.manifest.publishConfig?.registry ?? defaultRegistry
  const spec = `${pkg.name}@${pkg.version}`
  const result = runNpm(["view", spec, "version", "--json", "--registry", registry], true)

  if (result.status === 0) return true

  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`
  if (/\bE404\b|404 Not Found/i.test(output)) return false

  throw new Error(`Unable to check ${spec} in ${registry}:\n${output.trim()}`)
}

function publishPackage(pkg) {
  const registry = pkg.manifest.publishConfig?.registry ?? defaultRegistry
  const access = pkg.manifest.publishConfig?.access
  const argumentsList = ["publish", pkg.directory, "--registry", registry]

  if (access) argumentsList.push("--access", access)

  const result = runNpm(argumentsList)
  if (result.status !== 0) {
    throw new Error(`npm publish failed for ${pkg.name}@${pkg.version}`)
  }
}

function checkPackage(pkg) {
  const result = runNpm(["pack", pkg.directory, "--dry-run", "--json"], true)

  if (result.status !== 0) {
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`
    throw new Error(`npm pack failed for ${pkg.name}@${pkg.version}:\n${output.trim()}`)
  }

  const [packResult] = JSON.parse(result.stdout)
  if (!packResult?.filename) {
    throw new Error(`npm pack returned invalid data for ${pkg.name}@${pkg.version}`)
  }

  console.log(
    `Checked ${pkg.name}@${pkg.version}: ${packResult.entryCount ?? packResult.files?.length ?? 0} files, ${packResult.size ?? 0} bytes`,
  )
}

function main() {
  const { dryRun } = parseArguments(process.argv)
  const packages = sortPackages(discoverPackages())

  console.log(`Publish order: ${packages.map(({ name }) => name).join(" -> ")}`)

  let publishedCount = 0
  let skippedCount = 0

  for (const pkg of packages) {
    const spec = `${pkg.name}@${pkg.version}`

    if (dryRun) {
      checkPackage(pkg)
      publishedCount += 1
      continue
    }

    if (isPublished(pkg)) {
      console.log(`Skipping ${spec}: already published`)
      skippedCount += 1
      continue
    }

    console.log(`Publishing ${spec}`)
    publishPackage(pkg)
    publishedCount += 1
  }

  console.log(
    dryRun
      ? `Dry run completed for ${publishedCount} package(s)`
      : `Published ${publishedCount} package(s); skipped ${skippedCount} package(s)`,
  )
}

try {
  main()
} catch (error) {
  console.error(`Publish failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
