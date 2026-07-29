import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const packagesDirectory = path.join(repositoryRoot, "packages")
const bundlesDirectory = path.join(repositoryRoot, "bundles")

const packageDirectories = (await readdir(packagesDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

const preparedBundles = []

for (const packageDirectory of packageDirectories) {
  const packageFile = path.join(packagesDirectory, packageDirectory, "package.json")
  let packageJson

  try {
    packageJson = JSON.parse(await readFile(packageFile, "utf8"))
  } catch (error) {
    if (error.code === "ENOENT") {
      continue
    }
    throw error
  }

  if (!packageJson.name?.includes("/~")) {
    continue
  }

  delete packageJson.private
  packageJson.name = packageJson.name.replace("/~", "/")

  const bundleDirectory = path.join(bundlesDirectory, packageDirectory)
  await mkdir(bundleDirectory, { recursive: true })
  await writeFile(
    path.join(bundleDirectory, "package.json"),
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  )
  preparedBundles.push(packageJson.name)
}

if (preparedBundles.length === 0) {
  throw new Error("No bundle workspaces were found")
}

console.log(`Prepared bundle workspaces: ${preparedBundles.join(", ")}`)
