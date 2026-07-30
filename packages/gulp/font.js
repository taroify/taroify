const gulp = require("gulp")

function copyFontFiles(bundle, dist) {
  const copyFontFilesTask = () =>
    gulp
      .src(`./packages/${bundle}/src/**/*.{eot,svg,ttf,woff}`) //
      .pipe(gulp.dest(`./packages/${dist ?? bundle}/publish`))
  copyFontFilesTask.displayName = `copy font files to packages/${
    dist ?? bundle
  }/publish from packages/${bundle}`
  return copyFontFilesTask
}

exports.copyFontFiles = copyFontFiles
