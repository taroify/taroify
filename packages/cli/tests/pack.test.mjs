import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const publishRoot = resolve(packageRoot, "publish")

test("source package is canonical and generated manifest is publishable", () => {
  const sourcePackageJson = JSON.parse(readFileSync(resolve(packageRoot, "package.json"), "utf8"))
  const publishPackageJson = JSON.parse(readFileSync(resolve(publishRoot, "package.json"), "utf8"))
  assert.equal(sourcePackageJson.name, "@taroify/cli")
  assert.equal(sourcePackageJson.private, undefined)
  assert.equal(publishPackageJson.name, "@taroify/cli")
  assert.equal(publishPackageJson.private, undefined)
  assert.equal(publishPackageJson.bin.taroify, "dist/cli.js")
  assert.equal(publishPackageJson.publishConfig.directory, undefined)
  assert.equal(publishPackageJson.publishConfig.access, "public")
})

test("published package contains runtime, split docs and demos, skill, and no source tree", () => {
  const result = spawnSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd: publishRoot,
    encoding: "utf8",
  })
  assert.equal(result.status, 0, result.stderr)
  const [manifest] = JSON.parse(result.stdout)
  const files = manifest.files.map((file) => file.path)
  assert.ok(files.includes("dist/cli.js"))
  assert.ok(files.includes("dist/mcp.js"))
  assert.ok(files.includes("data/meta.json"))
  assert.ok(files.includes("data/docs/button/zhCN.md"))
  assert.ok(files.includes("data/demos/button/demo1.jsx"))
  assert.ok(files.includes("data/demos/button/index.tsx"))
  assert.ok(files.includes("skills/taroify/SKILL.md"))
  assert.ok(!files.includes("data/catalog.json"))
  assert.ok(!files.some((file) => file.startsWith("meta/")))
  assert.ok(!files.some((file) => file.startsWith("src/")))
})
