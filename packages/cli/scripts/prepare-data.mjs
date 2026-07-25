import { execFileSync } from "node:child_process"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { dirname, isAbsolute, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const repositoryRoot = resolve(packageRoot, "..", "..")
const catalogPath = resolve(packageRoot, "meta", "catalog.json")
const dataDirectory = resolve(packageRoot, "data")
const metaPath = resolve(dataDirectory, "meta.json")

const extensionByLanguage = {
  bash: "sh",
  css: "css",
  javascript: "js",
  js: "js",
  jsx: "jsx",
  scss: "scss",
  ts: "ts",
  tsx: "tsx",
}

function safeSegment(value, label) {
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(value) || value === "." || value === "..") {
    throw new Error(`${label} 不能作为数据文件路径：${value}`)
  }
  return value
}

function demoExtension(language) {
  return extensionByLanguage[language.toLowerCase()] || "txt"
}

async function writeDataFile(relativePath, content) {
  const outputPath = resolve(dataDirectory, relativePath)
  const resolvedRelativePath = relative(dataDirectory, outputPath)
  if (
    isAbsolute(resolvedRelativePath) ||
    resolvedRelativePath === ".." ||
    resolvedRelativePath.startsWith(`..${sep}`)
  ) {
    throw new Error(`数据文件路径越界：${relativePath}`)
  }
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, content)
}

execFileSync(process.execPath, [resolve(repositoryRoot, "scripts", "build-catalog.mjs")], {
  cwd: repositoryRoot,
  stdio: "inherit",
})

const catalog = JSON.parse(await readFile(catalogPath, "utf8"))
const entries = {}
let documentCount = 0
let demoCount = 0
let fullPageCount = 0

await rm(dataDirectory, { recursive: true, force: true })
await mkdir(dataDirectory, { recursive: true })

for (const [entryId, entry] of Object.entries(catalog.entries)) {
  const safeEntryId = safeSegment(entryId, "条目 id")
  const docs = {}
  for (const [language, content] of Object.entries(entry.docs)) {
    if (!content) continue
    const safeLanguage = safeSegment(language, "文档语言")
    const relativePath = `docs/${safeEntryId}/${safeLanguage}.md`
    await writeDataFile(relativePath, content)
    docs[language] = relativePath
    documentCount += 1
  }

  const demos = []
  for (const demo of entry.demos) {
    const safeDemoId = safeSegment(demo.id, "示例 id")
    const relativePath = `demos/${safeEntryId}/${safeDemoId}.${demoExtension(demo.language)}`
    await writeDataFile(relativePath, `${demo.code}\n`)
    const { code: _code, ...demoMeta } = demo
    demos.push({
      ...demoMeta,
      file: relativePath,
    })
    demoCount += 1
  }

  let demoPage = null
  if (entry.demoPage) {
    demoPage = `demos/${safeEntryId}/index.tsx`
    await writeDataFile(demoPage, entry.demoPage)
    fullPageCount += 1
  }

  entries[entryId] = {
    ...entry,
    docs,
    demos,
    demoPage,
  }
}

const meta = {
  ...catalog,
  schemaVersion: "2.0.0",
  entries,
}
await writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`)

console.log(
  `Prepared packages/cli/data: meta.json, ${documentCount} docs, ${demoCount} demos, ` +
    `${fullPageCount} full pages.`,
)
