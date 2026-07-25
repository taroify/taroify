import type commander from "commander"
import { textRenderers } from "../format.js"
import { getTokens } from "../queries.js"
import type { ExecuteCommand } from "./_shared.js"

export function registerTokenCommand(program: commander.Command, execute: ExecuteCommand) {
  program
    .command("token [entry]")
    .description("查看全局或组件级主题变量")
    .action(
      (entry: string | undefined, _options: Record<string, never>, command: commander.Command) => {
        execute(command, () => getTokens(entry), textRenderers.token)
      },
    )
}
