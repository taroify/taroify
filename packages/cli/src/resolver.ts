import { CliError, ErrorCodes } from "./error.js"
import type { Meta, MetaEntry } from "./types.js"

function normalize(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[\s_-]+/g, "")
}

function editDistance(left: string, right: string) {
  const matrix = Array.from({ length: left.length + 1 }, (_, row) =>
    Array.from({ length: right.length + 1 }, (_, column) =>
      row === 0 ? column : column === 0 ? row : 0,
    ),
  )
  for (let row = 1; row <= left.length; row++) {
    for (let column = 1; column <= right.length; column++) {
      const cost = left[row - 1] === right[column - 1] ? 0 : 1
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost,
      )
    }
  }
  return matrix[left.length][right.length]
}

export function suggestEntries(meta: Meta, query: string, limit = 3) {
  const normalizedQuery = normalize(query.split(".")[0])
  return Object.values(meta.entries)
    .map((entry) => ({
      entry,
      distance: Math.min(
        ...entry.aliases.map((alias) => editDistance(normalizedQuery, normalize(alias))),
      ),
    }))
    .sort(
      (left, right) =>
        left.distance - right.distance || left.entry.name.localeCompare(right.entry.name),
    )
    .filter(({ distance }) => distance <= Math.max(3, Math.ceil(normalizedQuery.length / 2)))
    .slice(0, limit)
    .map(({ entry }) => entry.name)
}

export interface ResolvedEntry {
  entry: MetaEntry
  subcomponent: string | null
}

export function resolveEntry(meta: Meta, query: string): ResolvedEntry {
  const [rootName, ...subcomponentParts] = query.trim().split(".")
  const normalizedQuery = normalize(rootName)
  const entry = Object.values(meta.entries).find((candidate) =>
    candidate.aliases.some((alias) => normalize(alias) === normalizedQuery),
  )
  if (!entry) {
    throw new CliError(
      {
        code: ErrorCodes.COMPONENT_NOT_FOUND,
        message: `未找到 Taroify 条目「${query}」。`,
        suggestions: suggestEntries(meta, query),
      },
      2,
    )
  }
  return {
    entry,
    subcomponent: subcomponentParts.length ? subcomponentParts.join(".") : null,
  }
}

export function resolveDemo(entry: MetaEntry, query: string) {
  if (query.includes("/") || query.includes("\\") || query.includes("..")) {
    throw new CliError(
      {
        code: ErrorCodes.INVALID_ARGUMENT,
        message: "示例名称不能包含路径字符。",
      },
      2,
    )
  }
  const normalizedQuery = normalize(query)
  const demo = entry.demos.find(
    (candidate) =>
      normalize(candidate.id) === normalizedQuery || normalize(candidate.title) === normalizedQuery,
  )
  if (demo) return demo
  throw new CliError(
    {
      code: ErrorCodes.DEMO_NOT_FOUND,
      message: `${entry.name} 未找到示例「${query}」。`,
      suggestions: entry.demos.slice(0, 8).map((candidate) => candidate.id),
    },
    2,
  )
}
