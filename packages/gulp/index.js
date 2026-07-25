const { series, parallel } = require("gulp")
const { task } = require("gulp-execa")
const {
  buildTypescript,
  symlinkTypescriptFiles,
  watchTypescript,
  watchTypescriptSymlink,
} = require("./typescript")
const { watchRspressDocs } = require("./readme")
const { buildScss, symlinkScssFiles, watchScss, watchScssSymlink } = require("./scss")
const { createBundle, cleanBundle, copyBundleDirectory } = require("./bundle")
const { detectPort, serveDemo, serveSite } = require("./serve")
const { copyFontFiles, symlinkFontFiles, watchFontFilesSymlink } = require("./font")
const { buildH5, buildSite, copyH5, copySite, copyGitIgnore } = require("./www")

function watch() {
  watchScss("icons")
  watchScss("core")
  watchTypescript("icons")
  watchTypescript("hooks")
  watchTypescript("core")
  watchTypescript("commerce")
  watchRspressDocs()
}

function watchSymlink() {
  watchScssSymlink("icons")
  watchScssSymlink("core")
  watchTypescriptSymlink("icons")
  watchTypescriptSymlink("hooks")
  watchTypescriptSymlink("core")
  watchTypescriptSymlink("commerce")
  watchFontFilesSymlink("core")
  watchFontFilesSymlink("commerce")
  watchRspressDocs()
}

const createBundles = parallel(
  createBundle("icons"),
  createBundle("hooks"),
  createBundle("core"),
  createBundle("commerce"),
  createBundle("cli"),
)

exports.createBundles = createBundles

const symlinkBundles = parallel(
  symlinkScssFiles("icons"),
  symlinkScssFiles("core"),
  symlinkTypescriptFiles("icons"),
  symlinkTypescriptFiles("hooks"),
  symlinkTypescriptFiles("core"),
  symlinkTypescriptFiles("commerce"),
  symlinkFontFiles("core"),
  symlinkFontFiles("commerce"),
)

exports.symlinkBundles = symlinkBundles

exports.clean = series(
  createBundles,
  task("npm run site:clean", {
    cwd: "site",
    stdio: "inherit",
  }),
)

exports.develop = series(
  detectPort,
  createBundles,
  symlinkBundles,
  parallel(watchSymlink, serveDemo, serveSite),
)

exports.watch = watch

exports.buildPackages = series(
  createBundles, //
  copyFontFiles("core"),
  copyFontFiles("commerce"),
  buildScss("icons"),
  buildScss("core"),
  buildScss("commerce"),
  buildTypescript("icons"),
  buildTypescript("hooks"),
  buildTypescript("core"),
  buildTypescript("commerce"),
)

exports.buildCli = series(
  createBundle("cli"),
  task("npm run build", {
    cwd: "packages/cli",
    stdio: "inherit",
  }),
  parallel(
    copyBundleDirectory("cli", "dist"),
    copyBundleDirectory("cli", "data"),
    copyBundleDirectory("cli", "skills"),
  ),
)

exports.buildWww = series(
  cleanBundle("www"),
  buildH5,
  buildSite,
  copyGitIgnore(),
  copyH5(),
  copySite(),
)

exports.serve = parallel(serveDemo, serveSite)
