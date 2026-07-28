# LLMs.txt

Taroify 为 AI 编码助手提供结构化的 Markdown 文档入口。你可以先通过 `llms.txt` 了解官网内容，再按需读取组件、Hooks 或指南页面，避免从完整 HTML 中提取正文。遵循 [llms.txt 规范](https://llmstxt.org/)。

## 可用资源

| 资源 | 地址 | 用途 |
| --- | --- | --- |
| 文档索引 | [llms.txt](https://taroify.github.io/taroify.com/llms.txt) | 按官网导航列出页面标题、摘要和 Markdown 地址 |
| 完整文档 | [llms-full.txt](https://taroify.github.io/taroify.com/llms-full.txt) | 在单个文件中提供全部官网文档，适合离线索引或全局分析 |
| 单页文档 | [Button 文档](https://taroify.github.io/taroify.com/components/button/index.md) | 只读取一个组件的介绍、示例、API 和主题变量 |

每个官网文档页面都有对应的 Markdown 文件。例如：

```text
https://taroify.github.io/taroify.com/quickstart/index.md
https://taroify.github.io/taroify.com/components/form/index.md
https://taroify.github.io/taroify.com/hooks/use-cascader/index.md
```

## 推荐读取方式

为了减少无关上下文，建议 AI 工具按以下顺序读取：

1. 先读取 `llms.txt`，确定与任务相关的指南、组件或 Hook。
2. 根据索引读取一个或多个单页 `.md` 文档。
3. 只有在离线建立知识库、跨组件分析或无法按需抓取时，才读取 `llms-full.txt`。

例如，让 AI 使用 Taroify 编写页面时可以提供以下指令：

```text
先阅读 https://taroify.github.io/taroify.com/llms.txt，
再按需读取其中的组件 Markdown 文档。
请只使用文档中存在的 Taroify 组件、Props、事件和主题变量，
为 Taro React 项目生成代码。
```

查询单个组件时可以直接指定页面：

```text
阅读 https://taroify.github.io/taroify.com/components/button/index.md，
根据文档说明使用 Taroify Button 完成提交按钮和加载状态。
```

## 在 AI 工具中使用

只要 AI 工具能够读取 URL，就可以把 `llms.txt` 地址直接放入提示词。对于支持文档知识源
或持久规则的工具，也可以将同一地址保存为项目级文档入口。

需要避免每次手动提供 URL 时，可以将下面的规则加入项目的 Agent 指令：

```text
阅读 `https://taroify.github.io/taroify.com/llms.txt` 并理解 Taroify 组件库，
在编写 Taroify 代码时使用这些知识。
```