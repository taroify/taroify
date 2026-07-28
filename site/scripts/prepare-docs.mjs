import { createRequire } from "node:module"
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import {
  authoredPages,
  componentSidebarTags,
  guideSidebarItems,
  primaryNavigation,
} from "../config/docs.mjs"
import { updateChangelog } from "./generate-changelog.mjs"

const require = createRequire(import.meta.url)
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(scriptDir, "..")
const repoRoot = path.resolve(siteRoot, "..")
const docsRoot = path.join(siteRoot, ".generated/docs")
const sourceRoot = path.join(siteRoot, "content")
const subpackages = require(path.join(repoRoot, "packages/demo/src/subpackages.js"))

const componentReadmeRoots = [
  "packages/core/src",
  "packages/core/docs",
  "packages/commerce/src",
  "packages/commerce/docs",
]

function escapeYaml(value) {
  return JSON.stringify(value)
}

function withFrontmatter(content, metadata) {
  if (content.startsWith("---\n")) {
    return content
  }
  const frontmatter = [
    "---",
    `title: ${escapeYaml(metadata.title)}`,
    `description: ${escapeYaml(metadata.description)}`,
    `pageType: ${metadata.pageType || "doc"}`,
    "---",
    "",
  ].join("\n")
  return `${frontmatter}${content}`
}

function getRspressThemeComponents(content) {
  const components = []
  if (content.includes("<Tag tag=")) {
    components.push("Tag")
  }
  if (content.includes("<PackageManagerTabs")) {
    components.push("PackageManagerTabs")
  }
  return components
}

function withRspressImports(content) {
  const components = getRspressThemeComponents(content)
  const imports = []
  if (components.length > 0) {
    imports.push(`import { ${components.join(", ")} } from "@rspress/core/theme"`)
  }
  if (content.includes("withBase(")) {
    imports.push('import { withBase } from "@rspress/core/runtime"')
  }
  if (imports.length === 0) {
    return content
  }
  return `${imports.join("\n")}\n\n${content}`
}

function withMdxExtension(relativePath, content) {
  if (getRspressThemeComponents(content).length === 0 && !content.includes("withBase(")) {
    return relativePath
  }
  return relativePath.replace(/\.md$/i, ".mdx")
}

async function writeMarkdown(relativePath, content, metadata) {
  const destination = path.join(docsRoot, relativePath)
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, withFrontmatter(content, metadata))
}

async function findReadme(slug) {
  const candidates = componentReadmeRoots.map((root) =>
    path.join(repoRoot, root, slug, "README.md"),
  )
  const matches = candidates.filter(existsSync)
  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one README for component "${slug}", found ${matches.length}: ${matches.join(", ")}`,
    )
  }
  return matches[0]
}

async function copyAuthoredPages() {
  for (const page of authoredPages) {
    const source = path.join(sourceRoot, page.source)
    const content = await readFile(source, "utf8")
    await writeMarkdown(withMdxExtension(page.source, content), withRspressImports(content), page)
  }
}

async function updateGeneratedChangelog() {
  const target = path.join(docsRoot, "changelog/index.md")

  try {
    const { added } = await updateChangelog(target)
    if (added.length > 0) {
      console.log(`Added changelog releases: ${added.join(", ")}.`)
    }
  } catch (error) {
    if (process.env.CHANGELOG_STRICT === "true") {
      throw error
    }
    console.warn(`Skipped changelog refresh: ${error.message}`)
  }
}

async function copyAuthoredAssets(
  sourceDirectory = sourceRoot,
  destinationDirectory = path.join(docsRoot, "public"),
) {
  const entries = await readdir(sourceDirectory, { withFileTypes: true })

  for (const entry of entries) {
    const source = path.join(sourceDirectory, entry.name)
    const destination = path.join(destinationDirectory, entry.name)

    if (entry.isDirectory()) {
      await copyAuthoredAssets(source, destination)
      continue
    }

    if (/\.mdx?$/i.test(entry.name)) {
      continue
    }

    await mkdir(destinationDirectory, { recursive: true })
    await cp(source, destination)
  }
}

async function copyComponents() {
  const seen = new Set()
  for (const group of subpackages) {
    for (const page of group.pages) {
      const slug = page.path.replace(/\/index$/, "")
      if (seen.has(slug)) {
        throw new Error(`Duplicate component route: ${slug}`)
      }
      seen.add(slug)
      const source = await findReadme(slug)
      const content = await readFile(source, "utf8")
      const extension = getRspressThemeComponents(content).length > 0 ? "mdx" : "md"
      await writeMarkdown(`components/${slug}/index.${extension}`, withRspressImports(content), {
        title: page.title,
        description: `Taroify ${page.title}组件文档，包含代码演示、API 和主题定制说明。`,
      })
    }
  }
  return seen
}

async function copyHooks() {
  const hooksRoot = path.join(repoRoot, "packages/hooks/src")
  const entries = await readdir(hooksRoot, { withFileTypes: true })
  const hooks = []
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }
    const readme = path.join(hooksRoot, entry.name, "README.md")
    if (!existsSync(readme)) {
      continue
    }
    const content = await readFile(readme, "utf8")
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const title = titleMatch?.[1] || entry.name
    await writeMarkdown(`hooks/${entry.name}/index.md`, content, {
      title,
      description: `Taroify ${title} Hook 的用法、参数与类型定义。`,
    })
    hooks.push({ slug: entry.name, title })
  }
  return hooks
}

function customLink(label, link, tag) {
  return { type: "custom-link", label, link, ...(tag ? { tag } : {}) }
}

async function writeNavigation(hooks) {
  const sidebar = [
    { type: "section-header", label: "开发指南" },
    ...guideSidebarItems.map((item) => customLink(item.label, item.link)),
    { type: "section-header", label: "AI" },
    customLink("For Agents", "/agents/"),
    customLink("LLMs.txt", "/llms/"),
    customLink("CLI", "/cli/"),
    customLink("MCP", "/mcp/"),
  ]

  for (const group of subpackages) {
    sidebar.push({ type: "section-header", label: group.title })
    sidebar.push(
      ...group.pages.map((page) => {
        const slug = page.path.replace(/\/index$/, "")
        return customLink(page.title, `/components/${slug}/`, componentSidebarTags[slug])
      }),
    )
  }

  sidebar.push(
    { type: "section-header", label: "Hooks" },
    customLink("介绍", "/hooks/"),
    ...hooks.map((hook) => customLink(hook.title, `/hooks/${hook.slug}/`)),
  )

  await Promise.all([
    writeFile(path.join(docsRoot, "_nav.json"), `${JSON.stringify(primaryNavigation, null, 2)}\n`),
    writeFile(path.join(docsRoot, "_meta.json"), `${JSON.stringify(sidebar, null, 2)}\n`),
  ])
}

async function writeManifest() {
  const manifest = subpackages.flatMap((group) =>
    group.pages.map((page) => {
      const slug = page.path.replace(/\/index$/, "")
      return {
        slug,
        name: page.name.trim(),
        title: page.title,
        demoPath: `${group.root}/${page.path}`,
      }
    }),
  )
  const target = path.join(siteRoot, "theme/generated/component-manifest.ts")
  const entries = manifest.map((item) =>
    [
      "  {",
      ...Object.entries(item).map(([key, value]) => `    ${key}: ${JSON.stringify(value)},`),
      "  },",
    ].join("\n"),
  )
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(
    target,
    [
      "export const componentManifest = [",
      ...entries,
      "] as const",
      "",
      "export type ComponentManifestItem = (typeof componentManifest)[number]",
      "",
    ].join("\n"),
  )
}

async function main() {
  await rm(docsRoot, { recursive: true, force: true })
  await mkdir(docsRoot, { recursive: true })
  await cp(path.join(siteRoot, "assets"), path.join(docsRoot, "public"), {
    recursive: true,
  })
  await copyAuthoredAssets()
  await copyAuthoredPages()
  await updateGeneratedChangelog()
  const components = await copyComponents()
  const hooks = await copyHooks()
  await writeNavigation(hooks)
  await writeManifest()

  console.log(
    `Prepared ${authoredPages.length + components.size + hooks.length} routes (${components.size} components, ${hooks.length} hooks).`,
  )
}

await main()
