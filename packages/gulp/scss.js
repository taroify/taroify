const path = require("node:path")
const autoprefixer = require("autoprefixer")
const cssnano = require("cssnano")
const gulp = require("gulp")
const { watch, series } = require("gulp")
const postcss = require("gulp-postcss")
const sass = require("gulp-sass")(require("sass"))

function copyScssFiles(bundle, dist) {
  const copyScssFilesTask = () =>
    gulp
      .src(`./packages/${bundle}/src/**/*.scss`) //
      .pipe(gulp.dest(`./packages/${dist ?? bundle}/publish`))
  copyScssFilesTask.displayName = `copy scss files to packages/${
    dist ?? bundle
  }/publish from packages/${bundle}`
  return copyScssFilesTask
}

function addScssFileExtname(id) {
  return path.extname(id) === "scss" ? id : `${id}.scss`
}

function getScssPartialBasename(basename) {
  return `_${basename}`
}

function compileScss(bundle, dist) {
  const plugins = [
    autoprefixer(),
    cssnano({
      preset: [
        "default",
        {
          calc: false,
        },
      ],
    }),
  ]

  const compileScssTask = () =>
    gulp
      .src(`./packages/${bundle}/src/**/index.scss`)
      .pipe(
        sass({
          importers: [
            {
              findFileUrl(url) {
                const packageName = url.startsWith("~@taroify/core")
                  ? "~@taroify/core"
                  : "@taroify/core"
                if (!url.startsWith(packageName)) return null
                const relativeUrl = url.substring(packageName.length)
                const realUrl = path.join(__dirname, "../core/src", relativeUrl)
                const dirname = path.dirname(realUrl)
                const basename = path.basename(realUrl)
                const partialBasename = getScssPartialBasename(basename)
                const partialFilename = addScssFileExtname(partialBasename)
                const partialFilepath = path.join(dirname, partialFilename)
                return new URL(`file://${partialFilepath}`)
              },
            },
          ],
          style: "compressed",
        }).on("error", sass.logError),
      )
      .pipe(postcss(plugins))
      .pipe(gulp.dest(`./packages/${dist ?? bundle}/publish`))

  compileScssTask.displayName = `compile scss files to packages/${
    dist ?? bundle
  }/publish from packages/${bundle}`
  return compileScssTask
}

function buildScss(module, dist) {
  return series(copyScssFiles(module, dist), compileScss(module, dist))
}

function watchScss(module) {
  watch(
    [`./packages/${module}/src/**/*.scss`],
    {
      ignoreInitial: false,
    },
    series(copyScssFiles(module), compileScss(module)),
  )
}

exports.buildScss = buildScss
exports.watchScss = watchScss
