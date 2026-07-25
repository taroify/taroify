# Taroify CLI

`@taroify/cli` 是面向开发者和 AI 编码助手的离线组件知识 CLI。它将 Taroify
组件、Hooks、API、示例、完整 Demo 页面和主题变量随 npm 包分发，查询时不需要网络或
API Key。

发布包将结构化元数据、Markdown 文档与 Demo 源码分别存放在 `data/meta.json`、
`data/docs/` 和 `data/demos/`，查询时按需读取；CLI 和 MCP 不请求官网或外部接口。

## 直接查询组件

推荐通过 `npx` 使用，无需全局安装：

```bash
npx -y @taroify/cli list
npx -y @taroify/cli search 上传
npx -y @taroify/cli info Button
```

也可以全局安装：

```bash
npm install -g @taroify/cli
taroify info Button
```

CLI 需要 Node.js 18.18 或更高版本。

## 按场景搜索

不知道组件名称时，可以使用中文场景词搜索完整文档：

```bash
taroify search 上传
taroify search 地址选择
taroify search 下拉刷新 --limit 5
```

也可以按分类、包或条目类型浏览：

```bash
taroify list --category form
taroify list --package @taroify/commerce
taroify list --kind hook
```

## 查询 API

`info` 返回组件的引入方式、Props、子组件 API、事件、实例方法、示例列表和主题变量数量：

```bash
taroify info Button
taroify info Button.Group
taroify info useCascader
```

组件名称大小写不敏感。未命中时会返回拼写建议：

```bash
taroify info Buttn
# 你是否想找：Button
```

## 获取示例

省略示例名时列出文档中的全部代码片段：

```bash
taroify demo Button
taroify demo Button demo1
```

需要 import、页面结构和所有演示上下文时，获取仓库中的完整 Taro 页面：

```bash
taroify demo Button --full
```

## 查询文档与主题变量

```bash
taroify doc Calendar
taroify token
taroify token Button
```

`token` 同时返回 CSS 变量、对应的 `ConfigProvider` key、默认值和说明。主题定制时应优先
使用这些公开变量。

## 全局参数

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `--format, -f <text\|json>` | 设置查询命令的输出格式；AI Agent 和自动化脚本应优先使用 `json` | `text` |
| `--help, -h` | 显示 CLI 或子命令的帮助信息 | - |
| `--version, -v` | 打印 CLI 版本号 | - |

当前离线 Catalog 仅包含中文文档，因此暂不支持 `--lang, -l <zh|en>`。`search` 子命令中的
`-l` 是 `--limit` 的缩写，用于限制搜索结果数量。

## 命令参考

| 命令 | 作用 |
| --- | --- |
| `list [--category] [--package] [--kind]` | 列出组件、指南与 Hooks |
| `search <query> [-l, --limit]` | 搜索名称、分类、包和完整文档 |
| `info <entry>` | 查询结构化 API，支持 `Button.Group` |
| `doc <entry>` | 返回完整中文 Markdown 文档 |
| `demo <entry> [name]` | 列出或获取文档代码片段 |
| `demo <entry> --full` | 返回完整 Taro Demo 页面 |
| `token [entry]` | 查询全局或组件级主题变量 |
| `mcp` | 启动 stdio MCP Server |

AI Agent 和自动化脚本应使用 JSON：

```bash
taroify info Button --format json
```

成功响应：

```json
{
  "ok": true,
  "data": {}
}
```

失败响应会使用非零退出码，并返回稳定错误码和可选建议：

```json
{
  "ok": false,
  "error": {
    "code": "COMPONENT_NOT_FOUND",
    "message": "未找到 Taroify 条目「Buttn」。",
    "suggestions": ["Button"]
  }
}
```

## 安装 Agent Skill

CLI 随包提供 Taroify Agent Skill，约束 Agent 在编写组件代码前查询真实 API 和示例：

```bash
npm install -D @taroify/cli
npx skills add ./node_modules/@taroify/cli/skills/taroify
```

Skill 支持 Claude Code、Cursor、VS Code、Codex 等兼容 Agent Skills 的工具。

## 接入 MCP

需要让 IDE 自动调用 Taroify 查询工具时，继续阅读 [MCP 配置](/mcp/)。
