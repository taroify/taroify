import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const repositoryRoot = resolve(packageRoot, "..", "..")
const dataRoot = resolve(packageRoot, "data")
const meta = JSON.parse(readFileSync(resolve(dataRoot, "meta.json"), "utf8"))
const require = createRequire(import.meta.url)
const subpackages = require(resolve(repositoryRoot, "packages/demo/src/subpackages.js"))

test("meta covers every documented entry and hook", () => {
  const pages = subpackages.flatMap((group) => group.pages)
  const hookCount = readdirSync(resolve(repositoryRoot, "packages/hooks/src"), {
    withFileTypes: true,
  }).filter(
    (entry) =>
      entry.isDirectory() &&
      existsSync(resolve(repositoryRoot, "packages/hooks/src", entry.name, "README.md")),
  ).length
  const guideCount = pages.filter((page) => page.name.trim() === "Style").length
  assert.equal(meta.statistics.entries, pages.length + hookCount)
  assert.equal(meta.statistics.components, pages.length - guideCount)
  assert.equal(meta.statistics.guides, guideCount)
  assert.equal(meta.statistics.hooks, hookCount)
  assert.ok(meta.statistics.apiTables > 190)
  assert.ok(meta.statistics.demos > 400)
  assert.ok(meta.statistics.componentTokens > 700)
  assert.ok(meta.statistics.globalTokens > 50)
})

test("meta references split docs and demos while keeping structured API and tokens", () => {
  const button = meta.entries.button
  assert.equal(button.name, "Button")
  assert.equal(button.packageName, "@taroify/core")
  assert.ok(button.api.tables.some((table) => table.name === "Button.Group Props"))
  assert.equal(button.demos[0].title, "按钮颜色")
  assert.equal(button.docs.zhCN, "docs/button/zhCN.md")
  assert.equal(button.demos[0].file, "demos/button/demo1.jsx")
  assert.equal(button.demoPage, "demos/button/index.tsx")
  assert.equal("code" in button.demos[0], false)
  assert.match(readFileSync(resolve(dataRoot, button.docs.zhCN), "utf8"), /# Button 按钮/)
  assert.match(readFileSync(resolve(dataRoot, button.demos[0].file), "utf8"), /color="primary"/)
  assert.match(readFileSync(resolve(dataRoot, button.demoPage), "utf8"), /export default/)
  assert.ok(button.tokens.some((token) => token.cssVar === "--button-line-height"))
})

test("catalog is deterministic and checked into source control", () => {
  const result = spawnSync(process.execPath, ["scripts/build-catalog.mjs", "--check"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
})
