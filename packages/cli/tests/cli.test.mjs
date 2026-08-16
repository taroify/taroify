import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const cli = resolve(packageRoot, "dist/cli.js")

function run(args) {
  return spawnSync(process.execPath, [cli, ...args, "--format", "json"], {
    cwd: packageRoot,
    encoding: "utf8",
  })
}

function json(result) {
  assert.ok(result.stdout, result.stderr)
  return JSON.parse(result.stdout)
}

test("list and search return structured results", () => {
  const list = run(["list", "--category", "form"])
  assert.equal(list.status, 0)
  assert.equal(json(list).data.total, 18)

  const search = run(["search", "上传"])
  assert.equal(search.status, 0)
  assert.equal(json(search).data.results[0].name, "Uploader")
})

test("info resolves subcomponent API", () => {
  const result = run(["info", "Button.Group"])
  assert.equal(result.status, 0)
  const payload = json(result)
  assert.equal(payload.data.api.tables.length, 1)
  assert.equal(payload.data.api.tables[0].name, "Button.Group Props")
})

test("demo supports snippets and complete Taro pages", () => {
  const snippet = run(["demo", "Button", "demo1"])
  assert.equal(snippet.status, 0)
  assert.match(json(snippet).data.code, /color="primary"/)

  const full = run(["demo", "Button", "--full"])
  assert.equal(full.status, 0)
  assert.match(json(full).data.code, /export default/)
})

test("unknown entries return a stable error and suggestion", () => {
  const result = run(["info", "Buttn"])
  assert.equal(result.status, 2)
  const payload = json(result)
  assert.equal(payload.error.code, "COMPONENT_NOT_FOUND")
  assert.deepEqual(payload.error.suggestions, ["Button"])
})

test("command parser returns clean JSON usage errors", () => {
  for (const args of [["unknown"], ["info", "Button", "extra"]]) {
    const result = run(args)
    assert.equal(result.status, 2)
    assert.equal(result.stderr, "")
    assert.equal(json(result).error.code, "INVALID_ARGUMENT")
  }
})
