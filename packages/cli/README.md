# @taroify/cli

面向 AI Coding 的 Taroify 离线组件知识 CLI。组件文档、API、示例、完整 Taro Demo
页面与主题变量在构建期打包，安装后无需网络或 API Key。

## 特性

- 覆盖 `@taroify/core`、`@taroify/icons`、`@taroify/hooks` 与
  `@taroify/commerce`
- 文本与稳定 JSON 双输出，适合人和 Agent
- 中文全文搜索、大小写无关查询、子组件 API 与拼写建议
- CLI、MCP tools/resources/prompts、Agent Skill 共用同一份离线 Catalog
- 元数据、Markdown 文档与 Demo 源码分文件发布，查询时按需读取
- MCP 工具全部只读、幂等，不访问项目文件或外部网络

## 使用

```bash
npx -y @taroify/cli list
npx -y @taroify/cli search 上传
npx -y @taroify/cli info Button --format json
```

也可以全局安装：

```bash
npm i -g @taroify/cli
taroify info Button
```

CLI 需要 Node.js 22.12 或更高版本。

## 命令

| 命令 | 说明 |
| --- | --- |
| `taroify list [--category] [--package] [--kind]` | 按分类、包或类型列出条目 |
| `taroify search <query> [-l, --limit]` | 搜索名称、分类和完整文档 |
| `taroify info <entry>` | 获取组件、子组件或 Hook 的结构化 API |
| `taroify doc <entry>` | 获取完整中文 Markdown 文档 |
| `taroify demo <entry> [name]` | 列出示例或获取代码片段 |
| `taroify demo <entry> --full` | 获取完整 Taro Demo 页面 |
| `taroify token [entry]` | 获取全局或组件级主题变量 |
| `taroify mcp` | 启动 stdio MCP Server |

## 全局参数

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `--format, -f <text\|json>` | 设置查询命令的输出格式；Agent 应优先使用 `json` | `text` |
| `--help, -h` | 显示 CLI 或子命令的帮助信息 | - |
| `--version, -v` | 打印 CLI 版本号 | - |

当前离线 Catalog 仅包含中文文档，因此暂不支持 `--lang, -l <zh|en>`。`search` 子命令中的
`-l` 是 `--limit` 的缩写，用于限制搜索结果数量。

```bash
taroify info Button.Group --format json
taroify demo Button demo1 --format json
taroify token Button --format json
```

## MCP

```json
{
  "mcpServers": {
    "taroify": {
      "command": "npx",
      "args": ["-y", "@taroify/cli", "mcp"]
    }
  }
}
```

Codex `~/.codex/config.toml`：

```toml
[mcp_servers.taroify]
command = "npx"
args = ["-y", "@taroify/cli", "mcp"]
```

MCP 提供六个工具：

- `taroify_list`
- `taroify_search`
- `taroify_info`
- `taroify_doc`
- `taroify_demo`
- `taroify_token`

同时提供可枚举资源、文档与示例资源模板，以及
`taroify-expert`、`taroify-page-generator` 两个提示词。

## Agent Skill

```bash
npm i -D @taroify/cli
npx skills add ./node_modules/@taroify/cli/skills/taroify
```

Skill 会要求 Agent 在编写代码前查询真实 API、示例和主题变量。

## 本地开发

```bash
pnpm generate:catalog
pnpm --filter @taroify/cli typecheck
pnpm test:cli
pnpm build:cli
```

源码按职责分层：`src/commands/` 只负责 CLI 参数适配，`src/queries.ts` 提供 CLI 与 MCP
共用查询，`src/data.ts` 读取离线文件，`src/resolver.ts` 负责条目和 Demo 解析，
`src/mcp/` 提供 MCP tools、resources 与 prompts。

`packages/cli` 是 `@taroify/cli` 的唯一 workspace 包；`pnpm build:cli` 会通过 Gulp
在非 workspace 的 `packages/cli/publish` 中准备发布内容，并复制 `dist/`、`data/`
与 `skills/`。Catalog 来源包括主仓库组件导航、
README、Demo 页面与主题变量定义，并保存为 `meta/catalog.json`。构建和发布前会重新生成
`data/meta.json`、`data/docs/` 与 `data/demos/` 离线快照；CI 使用
`pnpm check:catalog` 检查已提交的源 Catalog 是否与源码一致。
