// biome-ignore lint/style/useNodejsImportProtocol: legacy CommonJS build script
const fs = require("fs")
const rimraf = require("rimraf")
const gulp = require("gulp")
const { series } = require("gulp")

function cleanBundle(name) {
  const cleanTask = (cb) => {
    const bundlePath = `./bundles/${name}`
    if (!fs.existsSync(bundlePath)) {
      fs.mkdirSync(bundlePath, { recursive: true })
    }
    const files = fs.readdirSync(bundlePath)
    if (files) {
      for (const file of files) {
        if (file !== "package.json") {
          rimraf.sync(`${bundlePath}/${file}`)
        }
      }
    }
    cb()
  }
  cleanTask.displayName = `clean bundle(${name}) files`
  return cleanTask
}

function initBundle(name) {
  const initPackageTask = (cb) => {
    const packageFile = fs.readFileSync(`./packages/${name}/package.json`, "utf8")
    const packageJson = JSON.parse(packageFile)
    if (packageJson.private) {
      delete packageJson.private
    }
    if (packageJson.name) {
      packageJson.name = packageJson.name.replace("/~", "/")
    }
    fs.writeFileSync(
      `./bundles/${name}/package.json`,
      `${JSON.stringify(packageJson, null, 2)}\n`,
      "utf8",
    )
    cb()
  }
  initPackageTask.displayName = `init package.json to bundles/${name}`
  return initPackageTask
}

function copyBundleFiles(name, filename) {
  const copyBundleFilesTask = () => {
    return gulp
      .src(`./packages/${name}/${filename}`, {
        allowEmpty: true,
      })
      .pipe(gulp.dest(`./bundles/${name}`))
  }
  copyBundleFilesTask.displayName = `copy file(${filename}) to bundles/${name}`
  return copyBundleFilesTask
}

function copyBundleDirectory(name, directory) {
  const copyBundleDirectoryTask = () => {
    return gulp
      .src(`./packages/${name}/${directory}/**/*`, {
        base: `./packages/${name}`,
        allowEmpty: true,
      })
      .pipe(gulp.dest(`./bundles/${name}`))
  }
  copyBundleDirectoryTask.displayName = `copy directory(${directory}) to bundles/${name}`
  return copyBundleDirectoryTask
}

function createBundle(name) {
  return series(
    cleanBundle(name),
    initBundle(name), //
    copyBundleFiles(name, ".npmignore"), //
    copyBundleFiles(name, "README.md"),
  )
}

exports.cleanBundle = cleanBundle
exports.createBundle = createBundle
exports.copyBundleDirectory = copyBundleDirectory
