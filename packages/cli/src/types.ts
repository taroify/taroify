export type OutputFormat = "text" | "json"
export type EntryKind = "component" | "guide" | "hook"
export type ApiTableKind = "props" | "methods" | "instance" | "events" | "other"

export interface ApiRow {
  name: string
  description: string
  type: string
  defaultValue: string
  extra: string[]
}

export interface ApiTable {
  name: string
  kind: ApiTableKind
  headers: string[]
  rows: ApiRow[]
}

export interface Demo {
  id: string
  title: string
  language: string
  file: string
}

export interface Token {
  cssVar: string
  themeKey: string
  defaultValue: string | null
  description: string | null
}

export interface MetaEntry {
  id: string
  name: string
  title: string
  description: string
  aliases: string[]
  kind: EntryKind
  packageName: string
  version: string
  category: {
    id: string
    name: string
  }
  importStatement: string | null
  api: {
    tables: ApiTable[]
  }
  demos: Demo[]
  demoPage: string | null
  tokens: Token[]
  docs: {
    zhCN: string
  }
  source: {
    docs: string
    demo: string | null
  }
}

export interface Meta {
  schemaVersion: string
  libraryVersion: string
  statistics: {
    entries: number
    components: number
    guides: number
    hooks: number
    apiTables: number
    demos: number
    componentTokens: number
    globalTokens: number
  }
  categories: Array<{
    id: string
    name: string
    entries: string[]
  }>
  globalTokens: Token[]
  entries: Record<string, MetaEntry>
}

export interface SuccessResult<T> {
  ok: true
  data: T
}

export interface ErrorPayload {
  code: string
  message: string
  suggestions?: string[]
  details?: unknown
}

export interface ErrorResult {
  ok: false
  error: ErrorPayload
}

export type Result<T> = SuccessResult<T> | ErrorResult
