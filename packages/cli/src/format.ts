import type { ApiTable, OutputFormat, Result, Token } from "./types.js"

function displayWidth(value: string) {
  return Array.from(value).reduce(
    (width, character) =>
      width + (/[\u1100-\u115f\u2e80-\u9fff\uf900-\ufaff]/.test(character) ? 2 : 1),
    0,
  )
}

function pad(value: string, width: number) {
  return `${value}${" ".repeat(Math.max(0, width - displayWidth(value)))}`
}

export function renderTable(headers: string[], rows: string[][]) {
  const normalizedRows = rows.map((row) => headers.map((_, index) => row[index] || ""))
  const widths = headers.map((header, index) =>
    Math.max(displayWidth(header), ...normalizedRows.map((row) => displayWidth(row[index]))),
  )
  const renderRow = (row: string[]) =>
    row
      .map((value, index) => pad(value, widths[index]))
      .join("  ")
      .trimEnd()
  return [
    renderRow(headers),
    widths.map((width) => "─".repeat(width)).join("  "),
    ...normalizedRows.map(renderRow),
  ].join("\n")
}

function renderApiTable(table: ApiTable) {
  const headers = ["参数", "说明", "类型", "默认值"]
  const rows = table.rows.map((row) => [row.name, row.description, row.type, row.defaultValue])
  return `${table.name}\n${renderTable(headers, rows)}`
}

function renderTokens(tokens: Token[]) {
  if (!tokens.length) return "暂无主题变量。"
  return renderTable(
    ["CSS 变量", "ConfigProvider Key", "默认值", "说明"],
    tokens.map((token) => [
      token.cssVar,
      token.themeKey,
      token.defaultValue || "",
      token.description === "-" ? "" : token.description || "",
    ]),
  )
}

export const textRenderers = {
  list(data: ReturnType<typeof import("./queries.js").listEntries>) {
    if (!data.total) return "没有符合条件的 Taroify 条目。"
    return data.categories
      .map(
        (category) =>
          `${category.name} (${category.entries.length})\n${renderTable(
            ["名称", "说明", "类型", "包"],
            category.entries.map((entry) => [
              entry.name,
              entry.description,
              entry.kind,
              entry.packageName,
            ]),
          )}`,
      )
      .join("\n\n")
  },

  search(data: ReturnType<typeof import("./queries.js").searchEntries>) {
    if (!data.results.length) return `没有找到与「${data.query}」相关的条目。`
    return renderTable(
      ["名称", "分类", "包", "匹配内容"],
      data.results.map((entry) => [
        entry.name,
        entry.category.name,
        entry.packageName,
        entry.snippet,
      ]),
    )
  },

  info(data: ReturnType<typeof import("./queries.js").getEntryInfo>) {
    const sections = [
      `${data.title}\n包：${data.packageName}@${data.version}\n分类：${data.category.name}`,
    ]
    if (data.importStatement) sections.push(`引入\n${data.importStatement}`)
    if (data.api.tables.length) {
      sections.push(data.api.tables.map(renderApiTable).join("\n\n"))
    } else {
      sections.push("暂无结构化 API 表。")
    }
    sections.push(
      `示例：${data.demos.length} 个；主题变量：${data.tokenCount} 个；文档：${data.source.docs}`,
    )
    return sections.join("\n\n")
  },

  doc(data: ReturnType<typeof import("./queries.js").getEntryDoc>) {
    return data.content
  },

  demo(data: ReturnType<typeof import("./queries.js").getEntryDemo>) {
    if ("code" in data) return data.code
    if (!data.demos?.length) return `${data.component} 暂无示例。`
    return renderTable(
      ["示例名", "标题", "语言"],
      data.demos.map((demo) => [demo.id, demo.title, demo.language]),
    )
  },

  token(data: ReturnType<typeof import("./queries.js").getTokens>) {
    const title = data.scope === "global" ? "Taroify 全局主题变量" : `${data.component} 主题变量`
    return `${title}（${data.tokens.length} 个）\n${renderTokens(data.tokens)}`
  },
}

export function printSuccess<T>(format: OutputFormat, data: T, renderText: (value: T) => string) {
  const result: Result<T> = { ok: true, data }
  process.stdout.write(
    format === "json" ? `${JSON.stringify(result, null, 2)}\n` : `${renderText(data)}\n`,
  )
}
