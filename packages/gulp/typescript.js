const { Transform } = require("node:stream")
const path = require("node:path")
const gulp = require("gulp")
const fs = require("fs-extra")
const { series, watch } = require("gulp")
const ts = require("gulp-typescript")
const { treeShakingLodash } = require("./treeshaking-lodash")
const ignore = ["node_modules", "**/__tests__", "**/?(*.)+(spec|test).[tj]s?(x)"]

function getPublishDirectory(bundle) {
  return `./packages/${bundle}/publish`
}

function copyTypescriptFiles(bundle) {
  const copyTypescriptFilesTask = () =>
    gulp
      .src([`./packages/${bundle}/src/**/*.[jt]s?(x)`], {
        ignore,
      })
      .pipe(gulp.dest(getPublishDirectory(bundle)))
  copyTypescriptFilesTask.displayName = `copy typescript files to packages/${bundle}/publish`
  return copyTypescriptFilesTask
}

function copyDeclarationFiles(bundle) {
  const copyDeclarationFilesTask = () =>
    gulp
      .src([`./packages/${bundle}/src/**/*.d.ts`], {
        ignore,
      })
      .pipe(gulp.dest(getPublishDirectory(bundle)))
  copyDeclarationFilesTask.displayName = `copy typescript declaration files to packages/${bundle}/publish`
  return copyDeclarationFilesTask
}

function compileTypescript(bundle) {
  const tsProject = ts.createProject("tsconfig.json", {
    noImplicitAny: false,
    declaration: false,
    declarationMap: false,
    allowJs: true,
  })
  const compileTypescriptTask = () =>
    gulp
      .src([`./packages/${bundle}/src/**/*.[jt]s?(x)`], {
        ignore,
      })
      .pipe(tsProject())
      .pipe(gulp.dest(getPublishDirectory(bundle)))
  compileTypescriptTask.displayName = `compile typescript files to packages/${bundle}/publish`
  return compileTypescriptTask
}

function generateDeclarationFiles(bundle) {
  const dtsProject = ts.createProject("tsconfig.d.json")
  const generateTypescriptDeclarationTask = () =>
    gulp
      .src([`./packages/${bundle}/src/**/*.[t]s?(x)`], {
        ignore,
      })
      .pipe(dtsProject())
      .pipe(gulp.dest(getPublishDirectory(bundle)))
  generateTypescriptDeclarationTask.displayName = `generate typescript declaration files to packages/${bundle}/publish`
  return generateTypescriptDeclarationTask
}

function addJsExt(bundle) {
  const addJsExtTask = () =>
    gulp
      .src([`${getPublishDirectory(bundle)}/**/*.js`])
      .pipe(new AddExtTransform())
      .pipe(new LodashTransform())
      .pipe(gulp.dest(getPublishDirectory(bundle)))
  addJsExtTask.displayName = `add js ext to packages/${bundle}/publish`
  return addJsExtTask
}

class AddExtTransform extends Transform {
  constructor() {
    super({ objectMode: true })
    this.packagesPath = path.resolve(process.cwd(), "./packages")
  }

  _transform(file, encoding, callback) {
    if (file.isBuffer() && file.extname === ".js") {
      const content = file.contents.toString(encoding)
      let newContent = content
      const importPathRegex = /(?:import|export)[\s|\S]+?"((?:@taroify|\.)\S+)";/g

      let match = importPathRegex.exec(content)
      while (match !== null) {
        const isTaroifyPackage = match[1].startsWith("@taroify/")
        const [, packageName, ...subpath] = isTaroifyPackage ? match[1].split("/") : []
        const dirname = isTaroifyPackage
          ? path.join(this.packagesPath, packageName, "publish")
          : file.dirname
        const matchPath = isTaroifyPackage
          ? subpath.length > 0
            ? `./${subpath.join("/")}`
            : "."
          : match[1]

        if (fs.existsSync(path.resolve(dirname, `${matchPath}.js`))) {
          newContent = newContent.replace(`"${match[1]}"`, `"${match[1]}.js"`)
        } else if (fs.existsSync(path.resolve(dirname, `${matchPath}/index.js`))) {
          newContent = newContent.replace(`"${match[1]}"`, `"${match[1]}/index.js"`)
        }
        match = importPathRegex.exec(content)
      }
      file.contents = Buffer.from(newContent)
    }

    callback(null, file)
  }
}

class LodashTransform extends Transform {
  constructor() {
    super({ objectMode: true })
  }

  _transform(file, encoding, callback) {
    if (file.isBuffer() && file.extname === ".js") {
      const content = file.contents.toString(encoding)
      file.contents = Buffer.from(treeShakingLodash(content))
      callback(null, file)
    }
  }
}

function buildTypescript(module) {
  return series(
    //
    // copyTypescriptFiles(module, dist), //
    copyDeclarationFiles(module), //
    compileTypescript(module), //
    addJsExt(module),
    generateDeclarationFiles(module), //
  )
}

function watchTypescript(module) {
  watch(
    [`./packages/${module}/src/**/*.[jt]s?(x)`],
    {
      // events: "all",
      ignoreInitial: false,
    },
    series(
      //
      copyTypescriptFiles(module), //
      compileTypescript(module), //
      generateDeclarationFiles(module),
    ), //
  )
}

exports.buildTypescript = buildTypescript
exports.watchTypescript = watchTypescript
