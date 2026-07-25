# Taroify MCP

Taroify MCP 通过 `@taroify/cli` 的只读 stdio Server，将与 CLI 相同的离线 Catalog
提供给 Claude Code、Cursor、VS Code、Codex 等 AI 编码工具。

MCP 不读取当前项目文件、不访问外部网络，也不执行修改操作。

## 配置客户端

Claude Code、Cursor 和 VS Code 可以使用以下配置：

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

Codex 在 `~/.codex/config.toml` 中配置：

```toml
[mcp_servers.taroify]
command = "npx"
args = ["-y", "@taroify/cli", "mcp"]
```

重新启动客户端后，可以让 Agent 执行类似任务：

- “查一下 Taroify Button.Group 的 Props”
- “搜索适合文件上传的组件并生成 Taro 页面”
- “读取 Calendar 的完整文档”
- “用公开主题变量修改 Button 的主色和圆角”

## 可用工具

| 工具 | 作用 |
| --- | --- |
| `taroify_list` | 按分类、包或类型列出组件、指南与 Hooks |
| `taroify_search` | 按名称、分类和完整文档搜索 |
| `taroify_info` | 获取组件、子组件或 Hook 的结构化 API |
| `taroify_doc` | 获取完整中文 Markdown 文档 |
| `taroify_demo` | 列出/获取示例，或返回完整 Demo 页面 |
| `taroify_token` | 查询全局或组件级主题变量 |

工具返回与 CLI `--format json` 一致的 `ok/data` 或 `ok/error` 结构。所有工具都声明为
只读、幂等和封闭世界查询。

## Resources

MCP 客户端可以枚举并读取以下资源：

- `taroify://catalog`：Catalog 版本、统计和分类摘要
- `taroify://tokens/global`：全局主题变量
- `taroify://entries/{entry}/doc`：指定条目的 Markdown 文档
- `taroify://entries/{entry}/demo/{name}`：指定代码示例

服务同时发布文档与 Demo 的 Resource Template，支持客户端按需发现。

## Prompts

| Prompt | 作用 |
| --- | --- |
| `taroify-expert` | 组件选型、API 查询、排错和主题定制 |
| `taroify-page-generator` | 查询真实组件知识后生成完整 Taro React 页面 |

两个 Prompt 都要求 Agent 先查后写，并区分 Taroify Props 与 Taro 原生平台能力。

## 从 `@taroify/mcp` 迁移

旧配置仍可以继续运行独立的 `@taroify/mcp`：

```json
{
  "mcpServers": {
    "@taroify/mcp": {
      "command": "npx",
      "args": ["-y", "@taroify/mcp"]
    }
  }
}
```

新项目建议切换到 `@taroify/cli mcp`。CLI、命令行查询、MCP、Resources 和 Agent Skill
共用主仓库构建的同一份 Catalog，可以避免独立数据快照与组件版本不同步。
