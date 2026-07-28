# For Agents

本页面为 AI 编程 Agent 提供一段可直接使用的提示词，并说明如何通过 Agent Skill、CLI、
MCP 和 LLMs.txt 获取准确的 Taroify 组件知识。

## 复制这段 Prompt

将下面的内容复制到 Agent 对话、项目规则或自动化流程中：

```text
你正在为 Taro React 项目使用 Taroify。你训练数据中的组件 API、事件、子组件和主题变量
可能与当前版本不同。在编写或修改代码前，请先阅读
https://taroify.github.io/taroify.com/agents/index.md
以及
https://raw.githubusercontent.com/mallfoundry/taroify/main/packages/cli/skills/taroify/SKILL.md，
查询真实 API 和示例，不要猜测组件用法。

如果可以安装 Agent Skill，请运行：
npm install -D @taroify/cli
npx skills add ./node_modules/@taroify/cli/skills/taroify

如果存在 taroify_* MCP 工具，请优先使用 MCP；否则使用 Taroify CLI，并在程序化查询时
添加 --format json。
```

## Agent 可以获得什么

### Agent Skill — 工作流与约束

`@taroify/cli` 随包提供 Taroify Agent Skill。它会要求 Agent 在写代码前搜索组件、检查
Props 和子组件、读取示例，并在定制样式前查询公开主题变量。

```bash
npm install -D @taroify/cli
npx skills add ./node_modules/@taroify/cli/skills/taroify
```

Skill 支持 Claude Code、Cursor、VS Code、Codex 等兼容 Agent Skills 的工具。完整的
Skill 内容可以在
[GitHub](https://raw.githubusercontent.com/mallfoundry/taroify/main/packages/cli/skills/taroify/SKILL.md)
查看。

### CLI — 离线组件知识

[Taroify CLI](/cli/) 将组件、Hooks、API、示例、完整 Demo 页面和主题变量随 npm 包分发，
查询时不需要网络或 API Key。

```bash
npx -y @taroify/cli search 上传 --format json
npx -y @taroify/cli info Button.Group --format json
npx -y @taroify/cli demo Button --full --format json
npx -y @taroify/cli token Button --format json
```

### MCP Server — IDE 集成

[Taroify MCP](/mcp/) 将同一份离线 Catalog 暴露为六个只读工具，并提供文档、Demo
Resources 和任务 Prompts。支持 MCP 的 Agent 可以自动查询所需内容，不必由用户手动执行命令。

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

### LLMs.txt — 在线 Markdown 文档

无法安装 Skill 或 MCP 时，可以直接把官网 Markdown 文档提供给 Agent。

| 文件 | 说明 |
| --- | --- |
| [llms.txt](https://taroify.github.io/taroify.com/llms.txt) | 官网文档索引，适合先定位相关页面 |
| [llms-full.txt](https://taroify.github.io/taroify.com/llms-full.txt) | 完整官网文档，适合离线索引或全局分析 |
| [Button 文档](https://taroify.github.io/taroify.com/components/button/index.md) | 单个组件的介绍、示例、API 和主题变量 |

更多读取方式请参考 [LLMs.txt 文档](/llms/)。

## 推荐工作流

Agent 编写 Taroify 代码时，建议按以下顺序工作：

1. 不确定组件名称时，按使用场景执行 `search` 或按分类执行 `list`。
2. 编码前使用 `info` 确认 Props、事件、子组件和引入方式。
3. 使用 `demo` 获取最小示例；需要完整 imports 和页面上下文时添加 `--full`。
4. 只有结构化 API 和示例不足时，才使用 `doc` 读取完整文档。
5. 定制样式前使用 `token` 查询 `ConfigProvider` key 和 CSS 变量。

使用 MCP 时，对应调用 `taroify_search`、`taroify_list`、`taroify_info`、
`taroify_demo`、`taroify_doc` 和 `taroify_token`。

## 使用约束

- 不要猜测 Taroify 组件名、Props、枚举值、事件或子组件。
- 区分 Taroify Props 与继承的 Taro 原生能力；平台支持由目标 Taro 适配器决定。
- 只从 `@taroify/core`、`@taroify/icons`、`@taroify/hooks` 或
  `@taroify/commerce` 的公开入口引入。
- 优先使用 `ConfigProvider` 配置或公开 CSS 变量，不依赖内部选择器和硬编码组件值。
- 示例采用 Taro React 语义；除非目标明确为 H5，否则不要替换为 Web 专用 DOM 元素。
