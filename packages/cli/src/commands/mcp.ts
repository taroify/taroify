import type commander from "commander"
import { startMcpServer } from "../mcp/server.js"

export function registerMcpCommand(program: commander.Command) {
  program
    .command("mcp")
    .description("启动只读 stdio MCP Server")
    .action(async () => {
      await startMcpServer()
    })
}
