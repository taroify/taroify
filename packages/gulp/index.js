const { series, parallel } = require("gulp")
const { task } = require("gulp-execa")
const { buildTypescript, watchTypescript } = require("./typescript")
const { watchRspressDocs } = require("./readme")
const { buildScss, watchScss } = require("./scss")
const { createPublish, cleanPublish, copyPublishDirectory } = require("./publish")
const { detectPort, serveDemo, serveSite } = require("./serve")
const { copyFontFiles } = require("./font")
const { buildH5, buildSite, copyH5 } = require("./www")

function watch() {
  watchScss("icons")
  watchScss("core")
  watchTypescript("icons")
  watchTypescript("hooks")
  watchTypescript("core")
  watchTypescript("commerce")
  watchRspressDocs()
}

const createPublishes = parallel(
  createPublish("icons"),
  createPublish("hooks"),
  createPublish("core"),
  createPublish("commerce"),
  createPublish("cli"),
)

exports.createPublishes = createPublishes

const cleanPublishes = parallel(
  cleanPublish("icons"),
  cleanPublish("hooks"),
  cleanPublish("core"),
  cleanPublish("commerce"),
  cleanPublish("cli"),
)

exports.clean = series(
  cleanPublishes,
  task("pnpm run site:clean", {
    cwd: "site",
    stdio: "inherit",
  }),
)

exports.develop = series(detectPort, createPublishes, parallel(watch, serveDemo, serveSite))

exports.watch = watch

exports.buildPackages = series(
  createPublishes, //
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
  createPublish("cli"),
  task("pnpm run build", {
    cwd: "packages/cli",
    stdio: "inherit",
  }),
  parallel(
    copyPublishDirectory("cli", "dist"),
    copyPublishDirectory("cli", "data"),
    copyPublishDirectory("cli", "skills"),
  ),
)

exports.buildWww = series(buildSite, buildH5, copyH5())

exports.serve = parallel(serveDemo, serveSite)
