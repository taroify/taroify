import type { Command } from "commander"
import { startMcpServer } from "../mcp/server.js"

export function registerMcpCommand(program: Command) {
  program
    .command("mcp")
    .description("启动只读 stdio MCP Server")
    .action(async () => {
      await startMcpServer()
    })
}
