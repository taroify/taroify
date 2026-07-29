jest.mock("gulp", () => ({
  src: jest.fn(),
  dest: jest.fn(),
  series: jest.fn(),
}))
jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(),
}))
jest.mock("rimraf", () => ({
  sync: jest.fn(),
}))

const fs = require("node:fs")
const gulp = require("gulp")
const rimraf = require("rimraf")
const bundle = require("../bundle")

describe("gulp bundle", () => {
  it("preserves workspace metadata and installed dependency links while cleaning", () => {
    fs.existsSync.mockReturnValue(true)
    fs.readdirSync.mockReturnValue(["package.json", "node_modules", "index.js"])
    const callback = jest.fn()

    const task = bundle.cleanBundle("core")
    task(callback)

    expect(rimraf.sync).toHaveBeenCalledTimes(1)
    expect(rimraf.sync).toHaveBeenCalledWith("./bundles/core/index.js")
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("copies a directory while preserving its package-relative path", () => {
    const pipe = jest.fn().mockReturnValue("stream")
    gulp.src.mockReturnValue({ pipe })
    gulp.dest.mockReturnValue("destination")

    const task = bundle.copyBundleDirectory("cli", "data")
    const result = task()

    expect(task.displayName).toBe("copy directory(data) to bundles/cli")
    expect(gulp.src).toHaveBeenCalledWith("./packages/cli/data/**/*", {
      base: "./packages/cli",
      allowEmpty: true,
    })
    expect(gulp.dest).toHaveBeenCalledWith("./bundles/cli")
    expect(pipe).toHaveBeenCalledWith("destination")
    expect(result).toBe("stream")
  })
})
