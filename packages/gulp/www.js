const { task } = require("gulp-execa")
const gulp = require("gulp")

exports.buildH5 = task("taro build --type h5", {
  cwd: "packages/demo",
  stdio: "inherit",
})

exports.buildSite = task("pnpm run site:build", {
  cwd: "site",
  stdio: "inherit",
})

exports.copyH5 = () => {
  const copyH5Task = () =>
    gulp.src("./packages/demo/dist/h5/**").pipe(gulp.dest("./site/doc_build/h5"))
  copyH5Task.displayName = "copy /dist/h5 files to site/doc_build/h5 from packages/demo"
  return copyH5Task
}
