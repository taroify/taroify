import { createRequire } from "node:module"
import { existsSync } from "node:fs"
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { fromMarkdown } from "mdast-util-from-markdown"
import { gfmFromMarkdown } from "mdast-util-gfm"
import { gfm } from "micromark-extension-gfm"

const require = createRequire(import.meta.url)
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(scriptDirectory, "..")
const outputPath = path.join(repositoryRoot, "packages", "cli", "meta", "catalog.json")
const subpackages = require(path.join(repositoryRoot, "packages/demo/src/subpackages.js"))
const checkOnly = process.argv.includes("--check")

const readmeRoots = ["packages/core/src", "packages/core/docs", "packages/commerce/src"]

const packageVersionFiles = {
  "@taroify/core": "packages/core/package.json",
  "@taroify/commerce": "packages/commerce/package.json",
  "@taroify/hooks": "packages/hooks/package.json",
  "@taroify/icons": "packages/icons/package.json",
}

function normalizeSpace(value) {
  return value.replace(/\s+/g, " ").trim()
}

function nodeText(node) {
  if (!node || typeof node !== "object") {
    return ""
  }
  if (typeof node.value === "string") {
    if (node.type === "html") {
      return node.value.replace(/<[^>]+>/g, "")
    }
    return node.value
  }
  if (typeof node.alt === "string") {
    return node.alt
  }
  if (Array.isArray(node.children)) {
    return node.children.map(nodeText).join("")
  }
  return ""
}

function parseMarkdown(markdown) {
  return fromMarkdown(markdown, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  })
}

function tableRows(table) {
  return table.children.map((row) => row.children.map((cell) => normalizeSpace(nodeText(cell))))
}

function classifyApiTable(name) {
  const normalized = name.toLowerCase()
  if (normalized.includes("prop")) return "props"
  if (normalized.includes("method")) return "methods"
  if (normalized.includes("instance") || normalized.includes("实例")) return "instance"
  if (normalized.includes("event") || normalized.includes("事件")) return "events"
  return "other"
}

function toThemeKey(cssVar) {
  return cssVar
    .replace(/^--/, "")
    .replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase())
}

function uniqueTokens(tokens) {
  const seen = new Set()
  return tokens.filter((token) => {
    if (seen.has(token.cssVar)) return false
    seen.add(token.cssVar)
    return true
  })
}

function parseTokenTable(table) {
  const rows = tableRows(table)
  if (rows.length < 2) return []
  const headers = rows[0].map((value) => value.toLowerCase())
  const nameIndex = headers.findIndex((value) => value.includes("名称") || value.includes("变量"))
  const defaultIndex = headers.findIndex((value) => value.includes("默认"))
  const descriptionIndex = headers.findIndex(
    (value) => value.includes("描述") || value.includes("说明"),
  )
  if (nameIndex < 0) return []

  return rows.slice(1).flatMap((row) => {
    const match = row[nameIndex]?.match(/--[\w-]+/)
    if (!match) return []
    return [
      {
        cssVar: match[0],
        themeKey: toThemeKey(match[0]),
        defaultValue: defaultIndex >= 0 ? row[defaultIndex] || null : null,
        description: descriptionIndex >= 0 ? row[descriptionIndex] || null : null,
      },
    ]
  })
}

function parseTokenCode(code) {
  const tokens = []
  const expression = /^\s*(--[\w-]+)\s*:\s*([^;]+);/gm
  let match = expression.exec(code)
  while (match !== null) {
    tokens.push({
      cssVar: match[1],
      themeKey: toThemeKey(match[1]),
      defaultValue: match[2].trim(),
      description: null,
    })
    match = expression.exec(code)
  }
  return tokens
}

function parseApiTable(table, heading) {
  const rows = tableRows(table)
  if (rows.length < 2) return null
  const headers = rows[0]
  const apiRows = rows.slice(1).map((row) => ({
    name: row[0] || "",
    description: row[1] || "",
    type: row[2] || "",
    defaultValue: row[3] || "",
    extra: row.slice(4),
  }))
  if (!apiRows.some((row) => row.name)) return null
  return {
    name: heading || "API",
    kind: classifyApiTable(heading),
    headers,
    rows: apiRows,
  }
}

function parseDocument(markdown) {
  const tree = parseMarkdown(markdown)
  const apiTables = []
  const demos = []
  const tokens = []
  const themeCodeTokens = []
  let section = ""
  let heading = ""
  let importStatement = null

  for (const node of tree.children) {
    if (node.type === "heading") {
      heading = normalizeSpace(nodeText(node))
      if (node.depth === 2) {
        section = heading
      }
      continue
    }

    if (node.type === "code") {
      if (!importStatement && /^(引入|安装|使用)/.test(heading)) {
        importStatement = node.value.trim()
      }
      if (section === "代码演示") {
        const index = demos.length + 1
        demos.push({
          id: `demo${index}`,
          title: heading || `示例 ${index}`,
          language: node.lang || "tsx",
          code: node.value.trim(),
        })
      }
      if (section.includes("主题")) {
        themeCodeTokens.push(...parseTokenCode(node.value))
      }
      continue
    }

    if (node.type === "table") {
      if (section === "API") {
        const apiTable = parseApiTable(node, heading)
        if (apiTable) apiTables.push(apiTable)
      }
      if (section.includes("主题")) {
        tokens.push(...parseTokenTable(node))
      }
    }
  }

  return {
    apiTables,
    demos,
    tokens: uniqueTokens(tokens),
    themeCodeTokens: uniqueTokens(themeCodeTokens),
    importStatement,
  }
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(repositoryRoot, relativePath), "utf8"))
}

async function packageVersions() {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(packageVersionFiles).map(async ([packageName, relativePath]) => {
        const packageJson = await readJson(relativePath)
        return [packageName, packageJson.version]
      }),
    ),
  )
}

function packageNameFor(relativeReadmePath, name) {
  if (relativeReadmePath.startsWith("packages/commerce/")) return "@taroify/commerce"
  if (name === "Icon") return "@taroify/icons"
  return "@taroify/core"
}

function kindFor(name) {
  return name === "Style" ? "guide" : "component"
}

async function findReadme(slug) {
  const matches = readmeRoots
    .map((root) => path.join(root, slug, "README.md"))
    .filter((relativePath) => existsSync(path.join(repositoryRoot, relativePath)))

  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one README for "${slug}", found ${matches.length}: ${matches.join(", ")}`,
    )
  }
  return matches[0]
}

function categoryId(group) {
  return group.root.replace(/^pages\//, "").replace(/\//g, "-")
}

async function buildPageEntry(group, page, versions) {
  const id = page.path.replace(/\/index$/, "")
  const name = page.name.trim()
  const readmePath = await findReadme(id)
  const markdown = await readFile(path.join(repositoryRoot, readmePath), "utf8")
  const parsed = parseDocument(markdown)
  const demoPath = path.join("packages/demo/src", group.root, `${page.path}.tsx`)
  if (!existsSync(path.join(repositoryRoot, demoPath))) {
    throw new Error(`Missing demo page for "${name}": ${demoPath}`)
  }
  const packageName = packageNameFor(readmePath, name)

  return {
    id,
    name,
    title: page.title,
    description: page.title.startsWith(name) ? page.title.slice(name.length).trim() : page.title,
    aliases: Array.from(new Set([id, name, page.title])),
    kind: kindFor(name),
    packageName,
    version: versions[packageName],
    category: {
      id: categoryId(group),
      name: group.title,
    },
    importStatement: parsed.importStatement,
    api: {
      tables: parsed.apiTables,
    },
    demos: parsed.demos,
    demoPage: await readFile(path.join(repositoryRoot, demoPath), "utf8"),
    tokens: name === "ConfigProvider" ? [] : parsed.tokens,
    docs: {
      zhCN: markdown,
    },
    source: {
      docs: readmePath,
      demo: demoPath,
    },
    _themeCodeTokens: parsed.themeCodeTokens,
  }
}

async function buildHookEntries(versions) {
  const hooksRoot = path.join(repositoryRoot, "packages/hooks/src")
  const directories = await readdir(hooksRoot, { withFileTypes: true })
  const entries = []

  for (const directory of directories) {
    if (!directory.isDirectory()) continue
    const readmePath = path.join("packages/hooks/src", directory.name, "README.md")
    if (!existsSync(path.join(repositoryRoot, readmePath))) continue
    const markdown = await readFile(path.join(repositoryRoot, readmePath), "utf8")
    const parsed = parseDocument(markdown)
    const titleMatch = markdown.match(/^#\s+(.+)$/m)
    const title = normalizeSpace(titleMatch?.[1] || directory.name)
    const name = title.split(/\s+/)[0]

    entries.push({
      id: directory.name,
      name,
      title,
      description: title === name ? "React Hook" : title.slice(name.length).trim(),
      aliases: Array.from(new Set([directory.name, name, title])),
      kind: "hook",
      packageName: "@taroify/hooks",
      version: versions["@taroify/hooks"],
      category: {
        id: "hooks",
        name: "Hooks",
      },
      importStatement: parsed.importStatement,
      api: {
        tables: parsed.apiTables,
      },
      demos: parsed.demos,
      demoPage: null,
      tokens: [],
      docs: {
        zhCN: markdown,
      },
      source: {
        docs: readmePath,
        demo: null,
      },
    })
  }

  return entries.sort((left, right) => left.id.localeCompare(right.id))
}

async function createCatalog() {
  const versions = await packageVersions()
  const entries = []
  const categories = []

  for (const group of subpackages) {
    const componentIds = []
    for (const page of group.pages) {
      const entry = await buildPageEntry(group, page, versions)
      entries.push(entry)
      componentIds.push(entry.id)
    }
    categories.push({
      id: categoryId(group),
      name: group.title,
      entries: componentIds,
    })
  }

  const hookEntries = await buildHookEntries(versions)
  if (hookEntries.length) {
    entries.push(...hookEntries)
    categories.push({
      id: "hooks",
      name: "Hooks",
      entries: hookEntries.map((entry) => entry.id),
    })
  }

  const configProvider = entries.find((entry) => entry.name === "ConfigProvider")
  const globalTokens = configProvider?._themeCodeTokens || []
  for (const entry of entries) {
    entry._themeCodeTokens = undefined
  }

  const duplicateIds = entries
    .map((entry) => entry.id)
    .filter((id, index, values) => values.indexOf(id) !== index)
  if (duplicateIds.length) {
    throw new Error(`Duplicate catalog ids: ${duplicateIds.join(", ")}`)
  }

  return {
    schemaVersion: "1.0.0",
    libraryVersion: versions["@taroify/core"],
    statistics: {
      entries: entries.length,
      components: entries.filter((entry) => entry.kind === "component").length,
      guides: entries.filter((entry) => entry.kind === "guide").length,
      hooks: entries.filter((entry) => entry.kind === "hook").length,
      apiTables: entries.reduce((total, entry) => total + entry.api.tables.length, 0),
      demos: entries.reduce((total, entry) => total + entry.demos.length, 0),
      componentTokens: entries.reduce((total, entry) => total + entry.tokens.length, 0),
      globalTokens: globalTokens.length,
    },
    categories,
    globalTokens,
    entries: Object.fromEntries(entries.map((entry) => [entry.id, entry])),
  }
}

const catalog = await createCatalog()
const serialized = `${JSON.stringify(catalog, null, 2)}\n`

if (checkOnly) {
  if (!existsSync(outputPath)) {
    console.error("packages/cli/meta/catalog.json does not exist. Run pnpm generate:catalog.")
    process.exit(1)
  }
  const current = await readFile(outputPath, "utf8")
  if (current !== serialized) {
    console.error(
      "packages/cli/meta/catalog.json is stale. Run pnpm generate:catalog and commit the result.",
    )
    process.exit(1)
  }
  console.log(`Catalog is current (${catalog.statistics.entries} entries).`)
} else {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, serialized)
  console.log(
    `Generated packages/cli/meta/catalog.json: ${catalog.statistics.entries} entries, ` +
      `${catalog.statistics.apiTables} API tables, ${catalog.statistics.demos} demos, ` +
      `${catalog.statistics.componentTokens + catalog.statistics.globalTokens} tokens.`,
  )
}
