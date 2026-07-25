---
name: taroify
description: >
  Use when a task involves Taroify (@taroify/core, @taroify/icons,
  @taroify/hooks, or @taroify/commerce), including writing Taro React UI,
  selecting components, checking props or subcomponents, debugging usage,
  finding examples, or customizing themes.
allowed-tools:
  - Bash(taroify *)
  - Bash(npx -y @taroify/cli *)
  - Bash(which taroify)
---

# Taroify CLI

Use the bundled offline Taroify Catalog before writing or changing Taroify code. It contains
component and Hook APIs, complete Markdown documentation, focused examples, full Taro Demo pages,
and theme variables.

## Setup

Check for a global binary, otherwise use `npx`:

```bash
which taroify || echo "use npx -y @taroify/cli <command>"
```

Always pass `--format json` when consuming output programmatically.

## Workflow

1. If the correct component is unknown, search by scenario:

   ```bash
   taroify search 上传 --format json
   taroify list --category form --format json
   ```

2. Before writing code, inspect the real API:

   ```bash
   taroify info Button --format json
   taroify info Button.Group --format json
   ```

3. Get a focused example, or request the full Taro page when imports and surrounding context matter:

   ```bash
   taroify demo Button --format json
   taroify demo Button demo1 --format json
   taroify demo Button --full --format json
   ```

4. Read the full document only when the structured API and examples are insufficient:

   ```bash
   taroify doc Button --format json
   ```

5. Query theme variables before customizing component styles:

   ```bash
   taroify token --format json
   taroify token Button --format json
   ```

## Rules

- Query before writing; never guess Taroify component names, Props, enum values, events, or
  subcomponents.
- Treat Taroify Props and inherited Taro native capabilities separately. Platform support is
  determined by the target Taro adapter.
- Use public imports from `@taroify/core`, `@taroify/icons`, `@taroify/hooks`, or
  `@taroify/commerce`.
- Prefer `ConfigProvider` keys or returned CSS variables over internal selectors and hardcoded
  component values.
- Do not repeat a tool call with identical arguments.
- Taroify examples use Taro React semantics; do not replace Taro components with Web-only DOM
  elements unless the user explicitly targets H5.

## MCP

When `taroify_*` MCP tools are available, prefer them over shell commands. They expose the same
offline Catalog through six read-only tools and also provide document/demo resources.
