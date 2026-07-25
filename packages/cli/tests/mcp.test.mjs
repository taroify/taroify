import assert from "node:assert/strict"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const cli = resolve(packageRoot, "dist/cli.js")

test("MCP exposes tools, prompts, resources, and structured query results", async (context) => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [cli, "mcp"],
    cwd: packageRoot,
    stderr: "pipe",
  })
  const client = new Client({ name: "taroify-cli-test", version: "1.0.0" })
  context.after(async () => {
    await client.close()
  })

  await client.connect(transport)

  const tools = await client.listTools()
  assert.deepEqual(
    tools.tools.map((tool) => tool.name),
    [
      "taroify_list",
      "taroify_search",
      "taroify_info",
      "taroify_doc",
      "taroify_demo",
      "taroify_token",
    ],
  )

  const info = await client.callTool({
    name: "taroify_info",
    arguments: { entry: "Button.Group" },
  })
  assert.equal(info.isError, undefined)
  assert.equal(info.structuredContent.ok, true)
  assert.equal(info.structuredContent.data.api.tables[0].name, "Button.Group Props")

  const prompts = await client.listPrompts()
  assert.equal(prompts.prompts.length, 2)

  const resources = await client.listResources()
  assert.ok(resources.resources.length > 70)

  const doc = await client.readResource({
    uri: "taroify://entries/button/doc",
  })
  assert.match(doc.contents[0].text, /# Button 按钮/)
})
