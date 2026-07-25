import type commander from "commander"
import { textRenderers } from "../format.js"
import { getEntryInfo } from "../queries.js"
import type { ExecuteCommand } from "./_shared.js"

export function registerInfoCommand(program: commander.Command, execute: ExecuteCommand) {
  program
    .command("info <entry>")
    .description("查看组件或 Hook 的结构化 API")
    .action((entry: string, _options: Record<string, never>, command: commander.Command) => {
      execute(command, () => getEntryInfo(entry), textRenderers.info)
    })
}
