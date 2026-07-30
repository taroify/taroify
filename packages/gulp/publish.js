const fs = require("node:fs")
const rimraf = require("rimraf")
const gulp = require("gulp")
const { series } = require("gulp")

const dependencyFields = ["dependencies", "optionalDependencies", "peerDependencies"]

function getPublishDirectory(name) {
  return `./packages/${name}/publish`
}

function cleanPublish(name) {
  const cleanTask = (cb) => {
    const publishDirectory = getPublishDirectory(name)
    rimraf.sync(publishDirectory)
    fs.mkdirSync(publishDirectory, { recursive: true })
    cb()
  }
  cleanTask.displayName = `clean publish(${name}) files`
  return cleanTask
}

function resolveWorkspaceVersion(dependencyName, workspaceRange) {
  const dependencyDirectory = dependencyName.split("/").at(-1)
  const dependencyPackage = JSON.parse(
    fs.readFileSync(`./packages/${dependencyDirectory}/package.json`, "utf8"),
  )
  const version = dependencyPackage.version

  if (!version) {
    throw new Error(`Workspace dependency ${dependencyName} does not have a version`)
  }

  const range = workspaceRange.slice("workspace:".length)
  if (!range || range === "*") return version
  if (range === "^" || range === "~") return `${range}${version}`
  return range
}

function createPublishPackageJson(packageJson) {
  const publishPackageJson = JSON.parse(JSON.stringify(packageJson))

  delete publishPackageJson.private

  if (publishPackageJson.publishConfig) {
    delete publishPackageJson.publishConfig.directory
  }

  for (const field of dependencyFields) {
    const dependencies = publishPackageJson[field]
    if (!dependencies) continue

    for (const [dependencyName, dependencyRange] of Object.entries(dependencies)) {
      if (dependencyRange.startsWith("workspace:")) {
        dependencies[dependencyName] = resolveWorkspaceVersion(dependencyName, dependencyRange)
      }
    }
  }

  return publishPackageJson
}

function initPublish(name) {
  const initPackageTask = (cb) => {
    const packageFile = fs.readFileSync(`./packages/${name}/package.json`, "utf8")
    const packageJson = createPublishPackageJson(JSON.parse(packageFile))
    fs.writeFileSync(
      `${getPublishDirectory(name)}/package.json`,
      `${JSON.stringify(packageJson, null, 2)}\n`,
      "utf8",
    )
    cb()
  }
  initPackageTask.displayName = `init package.json to packages/${name}/publish`
  return initPackageTask
}

function copyPublishFiles(name, filename) {
  const copyPublishFilesTask = () => {
    return gulp
      .src(`./packages/${name}/${filename}`, {
        allowEmpty: true,
      })
      .pipe(gulp.dest(getPublishDirectory(name)))
  }
  copyPublishFilesTask.displayName = `copy file(${filename}) to packages/${name}/publish`
  return copyPublishFilesTask
}

function copyPublishDirectory(name, directory) {
  const copyPublishDirectoryTask = () => {
    return gulp
      .src(`./packages/${name}/${directory}/**/*`, {
        base: `./packages/${name}`,
        allowEmpty: true,
      })
      .pipe(gulp.dest(getPublishDirectory(name)))
  }
  copyPublishDirectoryTask.displayName = `copy directory(${directory}) to packages/${name}/publish`
  return copyPublishDirectoryTask
}

function createPublish(name) {
  return series(
    cleanPublish(name),
    initPublish(name), //
    copyPublishFiles(name, ".npmignore"), //
    copyPublishFiles(name, "README.md"),
  )
}

exports.cleanPublish = cleanPublish
exports.createPublish = createPublish
exports.createPublishPackageJson = createPublishPackageJson
exports.copyPublishDirectory = copyPublishDirectory
