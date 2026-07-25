jest.mock("gulp", () => ({
  src: jest.fn(),
  dest: jest.fn(),
  series: jest.fn(),
}))

const gulp = require("gulp")
const bundle = require("../bundle")

describe("gulp bundle", () => {
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
