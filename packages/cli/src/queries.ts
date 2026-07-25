import { loadMeta, readDataFile } from "./data.js"
import { CliError, ErrorCodes } from "./error.js"
import { resolveDemo, resolveEntry } from "./resolver.js"
import type { ApiTable, EntryKind, MetaEntry } from "./types.js"

function entrySummary(entry: MetaEntry) {
  return {
    id: entry.id,
    name: entry.name,
    title: entry.title,
    description: entry.description,
    kind: entry.kind,
    packageName: entry.packageName,
    version: entry.version,
    category: entry.category,
  }
}

export interface ListOptions {
  category?: string
  packageName?: string
  kind?: EntryKind
}

export function listEntries(options: ListOptions = {}) {
  const meta = loadMeta()
  const categoryQuery = options.category?.toLocaleLowerCase()
  const packageQuery = options.packageName?.toLocaleLowerCase()
  const entries = Object.values(meta.entries).filter((entry) => {
    if (
      categoryQuery &&
      entry.category.id.toLocaleLowerCase() !== categoryQuery &&
      entry.category.name.toLocaleLowerCase() !== categoryQuery
    ) {
      return false
    }
    if (packageQuery && entry.packageName.toLocaleLowerCase() !== packageQuery) return false
    if (options.kind && entry.kind !== options.kind) return false
    return true
  })

  return {
    libraryVersion: meta.libraryVersion,
    total: entries.length,
    categories: meta.categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        entries: category.entries
          .map((id) => entries.find((entry) => entry.id === id))
          .filter((entry): entry is MetaEntry => Boolean(entry))
          .map(entrySummary),
      }))
      .filter((category) => category.entries.length > 0),
  }
}

function markdownText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#_*`[\]()>|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function searchScore(entry: MetaEntry, query: string, docs: string) {
  const normalizedQuery = query.toLocaleLowerCase()
  const name = entry.name.toLocaleLowerCase()
  const title = entry.title.toLocaleLowerCase()
  const category = entry.category.name.toLocaleLowerCase()
  const normalizedDocs = docs.toLocaleLowerCase()
  if (name === normalizedQuery || entry.id.toLocaleLowerCase() === normalizedQuery) return 100
  if (name.startsWith(normalizedQuery)) return 80
  if (title.includes(normalizedQuery)) return 65
  if (category.includes(normalizedQuery) || entry.packageName.includes(normalizedQuery)) return 45
  if (normalizedDocs.includes(normalizedQuery)) return 20
  return 0
}

function searchSnippet(entry: MetaEntry, query: string, docs: string) {
  const text = markdownText(docs)
  const index = text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())
  if (index < 0) return entry.description
  const start = Math.max(0, index - 45)
  const end = Math.min(text.length, index + query.length + 75)
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`
}

export function searchEntries(query: string, limit = 10) {
  if (!query.trim()) {
    throw new CliError(
      {
        code: ErrorCodes.INVALID_ARGUMENT,
        message: "搜索关键词不能为空。",
      },
      2,
    )
  }
  const meta = loadMeta()
  const results = Object.values(meta.entries)
    .map((entry) => {
      const docs = entry.docs.zhCN ? readDataFile(entry.docs.zhCN) : ""
      return { entry, docs, score: searchScore(entry, query, docs) }
    })
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) => right.score - left.score || left.entry.name.localeCompare(right.entry.name),
    )
    .slice(0, Math.max(1, Math.min(limit, 50)))
    .map(({ entry, docs, score }) => ({
      ...entrySummary(entry),
      score,
      snippet: searchSnippet(entry, query, docs),
    }))
  return {
    query,
    total: results.length,
    results,
  }
}

function tablesForSubcomponent(tables: ApiTable[], subcomponent: string | null) {
  if (!subcomponent) return tables
  const query = subcomponent.toLocaleLowerCase()
  return tables.filter((table) => {
    const name = table.name.toLocaleLowerCase()
    return name.includes(query) || name.includes(`.${query}`)
  })
}

export function getEntryInfo(query: string) {
  const { entry, subcomponent } = resolveEntry(loadMeta(), query)
  const tables = tablesForSubcomponent(entry.api.tables, subcomponent)
  if (subcomponent && tables.length === 0) {
    throw new CliError(
      {
        code: ErrorCodes.COMPONENT_NOT_FOUND,
        message: `${entry.name} 没有名为「${subcomponent}」的子组件 API。`,
        suggestions: entry.api.tables.map((table) => table.name),
      },
      2,
    )
  }
  return {
    ...entrySummary(entry),
    query,
    subcomponent,
    importStatement: entry.importStatement,
    api: { tables },
    demos: entry.demos.map(({ id, title, language }) => ({ id, title, language })),
    tokenCount: entry.tokens.length,
    source: entry.source,
  }
}

export function getEntryDoc(query: string) {
  const { entry } = resolveEntry(loadMeta(), query)
  const documentPath = entry.docs.zhCN
  if (!documentPath) {
    throw new CliError({
      code: ErrorCodes.DOCUMENT_NOT_FOUND,
      message: `${entry.name} 暂无中文文档。`,
    })
  }
  const content = readDataFile(documentPath)
  return {
    id: entry.id,
    name: entry.name,
    language: "zh-CN",
    content,
  }
}

export function getEntryDemo(query: string, name?: string, full = false) {
  const { entry } = resolveEntry(loadMeta(), query)
  if (full) {
    if (!entry.demoPage) {
      throw new CliError({
        code: ErrorCodes.DEMO_NOT_FOUND,
        message: `${entry.name} 没有完整 Demo 页面。`,
      })
    }
    return {
      component: entry.name,
      full: true,
      language: "tsx",
      title: `${entry.name} 完整 Demo 页面`,
      code: readDataFile(entry.demoPage),
    }
  }
  if (!name) {
    return {
      component: entry.name,
      full: false,
      demos: entry.demos.map(({ id, title, language }) => ({ id, title, language })),
    }
  }
  const demo = resolveDemo(entry, name)
  const { file, ...metadata } = demo
  return {
    component: entry.name,
    full: false,
    ...metadata,
    code: readDataFile(file),
  }
}

export function getTokens(query?: string) {
  const meta = loadMeta()
  if (!query) {
    return {
      scope: "global",
      tokens: meta.globalTokens,
    }
  }
  const { entry } = resolveEntry(meta, query)
  return {
    scope: entry.id,
    component: entry.name,
    tokens: entry.tokens,
  }
}

export function getCatalogSummary() {
  const meta = loadMeta()
  return {
    schemaVersion: meta.schemaVersion,
    libraryVersion: meta.libraryVersion,
    statistics: meta.statistics,
    categories: meta.categories.map(({ id, name, entries }) => ({
      id,
      name,
      entries: entries.length,
    })),
  }
}
