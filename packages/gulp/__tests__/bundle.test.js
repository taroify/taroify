jest.mock("gulp", () => ({
  src: jest.fn(),
  dest: jest.fn(),
  series: jest.fn(),
}))
jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  readFileSync: jest.fn(),
  readdirSync: jest.fn(),
  writeFileSync: jest.fn(),
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

  it("initializes a public bundle package manifest", () => {
    fs.readFileSync.mockReturnValue(
      JSON.stringify({
        name: "@taroify/~cli",
        version: "1.0.2",
        private: true,
      }),
    )
    const callback = jest.fn()

    bundle.createBundle("cli")
    const initPackageTask = gulp.series.mock.calls[0][1]
    initPackageTask(callback)

    expect(initPackageTask.displayName).toBe("init package.json to bundles/cli")
    expect(fs.readFileSync).toHaveBeenCalledWith("./packages/cli/package.json", "utf8")
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "./bundles/cli/package.json",
      `${JSON.stringify({ name: "@taroify/cli", version: "1.0.2" }, null, 2)}\n`,
      "utf8",
    )
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
