import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { loadMeta } from "../data.js"
import { CliError, ErrorCodes, toCliError } from "../error.js"
import {
  getCatalogSummary,
  getEntryDemo,
  getEntryDoc,
  getEntryInfo,
  getTokens,
  listEntries,
  searchEntries,
} from "../queries.js"
import type { EntryKind, ErrorResult, SuccessResult } from "../types.js"
import { TAROIFY_EXPERT_PROMPT, TAROIFY_PAGE_GENERATOR_PROMPT } from "./prompts.js"

declare const __CLI_VERSION__: string

const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const

const TOOL_DEFINITIONS = [
  {
    name: "taroify_list",
    description: "按分类、npm 包或类型列出全部 Taroify 组件、指南与 Hooks。",
    inputSchema: {
      type: "object" as const,
      properties: {
        category: { type: "string", description: "分类 id 或中文名" },
        packageName: { type: "string", description: "npm 包名，如 @taroify/core" },
        kind: {
          type: "string",
          enum: ["component", "guide", "hook"],
          description: "条目类型",
        },
      },
      additionalProperties: false,
    },
    annotations: { title: "列出 Taroify 条目", ...READ_ONLY_ANNOTATIONS },
  },
  {
    name: "taroify_search",
    description: "按组件名称、分类、包名和完整文档搜索 Taroify。",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "搜索关键词，可使用中文场景词" },
        limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
      },
      required: ["query"],
      additionalProperties: false,
    },
    annotations: { title: "搜索 Taroify", ...READ_ONLY_ANNOTATIONS },
  },
  {
    name: "taroify_info",
    description: "获取组件或 Hook 的结构化 API、引入方式、示例列表与主题变量数量。",
    inputSchema: {
      type: "object" as const,
      properties: {
        entry: {
          type: "string",
          description: "组件、Hook 或子组件名称，如 Button、Button.Group",
        },
      },
      required: ["entry"],
      additionalProperties: false,
    },
    annotations: { title: "获取 Taroify API", ...READ_ONLY_ANNOTATIONS },
  },
  {
    name: "taroify_doc",
    description: "获取组件、指南或 Hook 的完整中文 Markdown 文档。",
    inputSchema: {
      type: "object" as const,
      properties: {
        entry: { type: "string", description: "条目名称" },
      },
      required: ["entry"],
      additionalProperties: false,
    },
    annotations: { title: "获取 Taroify 文档", ...READ_ONLY_ANNOTATIONS },
  },
  {
    name: "taroify_demo",
    description: "列出或获取组件代码示例。full=true 时返回完整 Taro Demo 页面。",
    inputSchema: {
      type: "object" as const,
      properties: {
        entry: { type: "string", description: "组件或 Hook 名称" },
        name: { type: "string", description: "示例 id 或中文标题，如 demo1" },
        full: { type: "boolean", default: false, description: "是否返回完整 Demo 页面" },
      },
      required: ["entry"],
      additionalProperties: false,
    },
    annotations: { title: "获取 Taroify 示例", ...READ_ONLY_ANNOTATIONS },
  },
  {
    name: "taroify_token",
    description: "查询全局或组件级主题变量，包括 CSS 变量、ConfigProvider key 与默认值。",
    inputSchema: {
      type: "object" as const,
      properties: {
        entry: { type: "string", description: "组件名；省略时查询全局主题变量" },
      },
      additionalProperties: false,
    },
    annotations: { title: "查询 Taroify 主题变量", ...READ_ONLY_ANNOTATIONS },
  },
]

const PROMPTS = [
  {
    name: "taroify-expert",
    description: "Taroify 专家助手：查询真实组件知识后回答",
    content: TAROIFY_EXPERT_PROMPT,
  },
  {
    name: "taroify-page-generator",
    description: "使用 Taroify 生成完整、可运行的 Taro React 页面",
    content: TAROIFY_PAGE_GENERATOR_PROMPT,
  },
]

function requiredString(params: Record<string, unknown>, name: string) {
  const value = params[name]
  if (typeof value !== "string" || !value.trim()) {
    throw new CliError(
      {
        code: ErrorCodes.INVALID_ARGUMENT,
        message: `参数 ${name} 必须是非空字符串。`,
      },
      2,
    )
  }
  return value
}

function optionalString(params: Record<string, unknown>, name: string) {
  const value = params[name]
  if (value === undefined) return undefined
  if (typeof value !== "string") {
    throw new CliError(
      {
        code: ErrorCodes.INVALID_ARGUMENT,
        message: `参数 ${name} 必须是字符串。`,
      },
      2,
    )
  }
  return value
}

function optionalKind(params: Record<string, unknown>) {
  const value = optionalString(params, "kind")
  if (value === undefined) return undefined
  if (!["component", "guide", "hook"].includes(value)) {
    throw new CliError(
      {
        code: ErrorCodes.INVALID_ARGUMENT,
        message: "参数 kind 必须是 component、guide 或 hook。",
      },
      2,
    )
  }
  return value as EntryKind
}

function optionalLimit(params: Record<string, unknown>) {
  const value = params.limit
  if (value === undefined) return 10
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 50) {
    throw new CliError(
      {
        code: ErrorCodes.INVALID_ARGUMENT,
        message: "参数 limit 必须是 1 到 50 之间的整数。",
      },
      2,
    )
  }
  return value
}

function optionalBoolean(params: Record<string, unknown>, name: string) {
  const value = params[name]
  if (value === undefined) return false
  if (typeof value !== "boolean") {
    throw new CliError(
      {
        code: ErrorCodes.INVALID_ARGUMENT,
        message: `参数 ${name} 必须是布尔值。`,
      },
      2,
    )
  }
  return value
}

function toolSuccess(data: Record<string, unknown>) {
  const payload: SuccessResult<Record<string, unknown>> = { ok: true, data }
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload) }],
    structuredContent: payload,
  }
}

function toolError(error: unknown) {
  const payload: ErrorResult = toCliError(error).toResult()
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload) }],
    structuredContent: payload,
    isError: true,
  }
}

async function callTool(name: string, params: Record<string, unknown>) {
  try {
    switch (name) {
      case "taroify_list":
        return toolSuccess(
          listEntries({
            category: optionalString(params, "category"),
            packageName: optionalString(params, "packageName"),
            kind: optionalKind(params),
          }),
        )
      case "taroify_search":
        return toolSuccess(searchEntries(requiredString(params, "query"), optionalLimit(params)))
      case "taroify_info":
        return toolSuccess(getEntryInfo(requiredString(params, "entry")))
      case "taroify_doc":
        return toolSuccess(getEntryDoc(requiredString(params, "entry")))
      case "taroify_demo":
        return toolSuccess(
          getEntryDemo(
            requiredString(params, "entry"),
            optionalString(params, "name"),
            optionalBoolean(params, "full"),
          ),
        )
      case "taroify_token":
        return toolSuccess(getTokens(optionalString(params, "entry")))
      default:
        throw new CliError({
          code: ErrorCodes.INVALID_ARGUMENT,
          message: `未知 MCP 工具：${name}`,
        })
    }
  } catch (error) {
    return toolError(error)
  }
}

function resourceText(uri: string, text: string, mimeType = "application/json") {
  return {
    contents: [{ uri, mimeType, text }],
  }
}

function readResource(uri: string) {
  const parsed = new URL(uri)
  if (parsed.protocol !== "taroify:") {
    throw new CliError({
      code: ErrorCodes.RESOURCE_NOT_FOUND,
      message: `不支持的资源协议：${parsed.protocol}`,
    })
  }
  if (parsed.hostname === "catalog") {
    return resourceText(uri, JSON.stringify(getCatalogSummary(), null, 2))
  }
  if (parsed.hostname === "tokens" && parsed.pathname === "/global") {
    return resourceText(uri, JSON.stringify(getTokens(), null, 2))
  }
  if (parsed.hostname === "entries") {
    const [, encodedEntry, resourceType, encodedName] = parsed.pathname.split("/")
    const entry = decodeURIComponent(encodedEntry || "")
    if (resourceType === "doc") {
      const doc = getEntryDoc(entry)
      return resourceText(uri, doc.content, "text/markdown")
    }
    if (resourceType === "demo") {
      const demo = getEntryDemo(
        entry,
        encodedName ? decodeURIComponent(encodedName) : undefined,
        !encodedName,
      )
      return resourceText(uri, JSON.stringify(demo, null, 2))
    }
  }
  throw new CliError({
    code: ErrorCodes.RESOURCE_NOT_FOUND,
    message: `未知 Taroify 资源：${uri}`,
  })
}

export async function startMcpServer() {
  if (process.stdin.isTTY) {
    process.stderr.write(
      "Taroify MCP 使用 stdio 通信，请通过 Claude Code、Cursor、VS Code 或 Codex 配置启动。\n",
    )
  }
  const server = new Server(
    {
      name: "taroify",
      version: __CLI_VERSION__,
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
        resources: {},
      },
    },
  )

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS,
  }))
  server.setRequestHandler(CallToolRequestSchema, async (request) =>
    callTool(
      request.params.name,
      (request.params.arguments as Record<string, unknown> | undefined) || {},
    ),
  )
  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: PROMPTS.map(({ name, description }) => ({ name, description })),
  }))
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const prompt = PROMPTS.find((candidate) => candidate.name === request.params.name)
    if (!prompt) throw new Error(`未知提示词：${request.params.name}`)
    return {
      description: prompt.description,
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: prompt.content,
          },
        },
      ],
    }
  })
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const meta = loadMeta()
    return {
      resources: [
        {
          uri: "taroify://catalog",
          name: "Taroify Catalog",
          description: "Taroify 离线知识库摘要",
          mimeType: "application/json",
        },
        {
          uri: "taroify://tokens/global",
          name: "Taroify 全局主题变量",
          mimeType: "application/json",
        },
        ...Object.values(meta.entries).map((entry) => ({
          uri: `taroify://entries/${encodeURIComponent(entry.id)}/doc`,
          name: `${entry.name} 文档`,
          description: entry.title,
          mimeType: "text/markdown",
        })),
      ],
    }
  })
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
    resourceTemplates: [
      {
        uriTemplate: "taroify://entries/{entry}/doc",
        name: "Taroify 条目文档",
        description: "读取组件、指南或 Hook 的完整 Markdown 文档",
        mimeType: "text/markdown",
      },
      {
        uriTemplate: "taroify://entries/{entry}/demo/{name}",
        name: "Taroify 示例",
        description: "读取指定条目的代码示例；省略 name 时读取完整 Demo 页面",
        mimeType: "application/json",
      },
    ],
  }))
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    try {
      return readResource(request.params.uri)
    } catch (error) {
      throw new Error(toCliError(error).message)
    }
  })

  await server.connect(new StdioServerTransport())
}
