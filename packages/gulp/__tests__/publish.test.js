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
const publish = require("../publish")

describe("gulp publish", () => {
  it("cleans and recreates a package publish directory", () => {
    const callback = jest.fn()

    const task = publish.cleanPublish("core")
    task(callback)

    expect(rimraf.sync).toHaveBeenCalledTimes(1)
    expect(rimraf.sync).toHaveBeenCalledWith("./packages/core/publish")
    expect(fs.mkdirSync).toHaveBeenCalledWith("./packages/core/publish", {
      recursive: true,
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("initializes a publish manifest with registry-safe workspace dependencies", () => {
    fs.readFileSync.mockImplementation((file) => {
      if (file === "./packages/core/package.json") {
        return JSON.stringify({
          name: "@taroify/core",
          version: "1.0.2",
        })
      }
      return JSON.stringify({
        name: "@taroify/cli",
        version: "1.0.2",
        private: false,
        scripts: {
          build: "tsup",
        },
        devDependencies: {
          tsup: "^8.0.0",
        },
        dependencies: {
          "@taroify/core": "workspace:^",
        },
        publishConfig: {
          directory: "publish",
          access: "public",
        },
      })
    })
    const callback = jest.fn()

    publish.createPublish("cli")
    const initPackageTask = gulp.series.mock.calls[0][1]
    initPackageTask(callback)

    expect(initPackageTask.displayName).toBe("init package.json to packages/cli/publish")
    expect(fs.readFileSync).toHaveBeenCalledWith("./packages/cli/package.json", "utf8")
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "./packages/cli/publish/package.json",
      `${JSON.stringify(
        {
          name: "@taroify/cli",
          version: "1.0.2",
          scripts: {
            build: "tsup",
          },
          devDependencies: {
            tsup: "^8.0.0",
          },
          dependencies: {
            "@taroify/core": "^1.0.2",
          },
          publishConfig: {
            access: "public",
          },
        },
        null,
        2,
      )}\n`,
      "utf8",
    )
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("copies a directory while preserving its package-relative path", () => {
    const pipe = jest.fn().mockReturnValue("stream")
    gulp.src.mockReturnValue({ pipe })
    gulp.dest.mockReturnValue("destination")

    const task = publish.copyPublishDirectory("cli", "data")
    const result = task()

    expect(task.displayName).toBe("copy directory(data) to packages/cli/publish")
    expect(gulp.src).toHaveBeenCalledWith("./packages/cli/data/**/*", {
      base: "./packages/cli",
      allowEmpty: true,
    })
    expect(gulp.dest).toHaveBeenCalledWith("./packages/cli/publish")
    expect(pipe).toHaveBeenCalledWith("destination")
    expect(result).toBe("stream")
  })
})
