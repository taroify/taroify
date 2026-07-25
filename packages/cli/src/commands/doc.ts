import type commander from "commander"
import { textRenderers } from "../format.js"
import { getEntryDoc } from "../queries.js"
import type { ExecuteCommand } from "./_shared.js"

export function registerDocCommand(program: commander.Command, execute: ExecuteCommand) {
  program
    .command("doc <entry>")
    .description("查看完整中文 Markdown 文档")
    .action((entry: string, _options: Record<string, never>, command: commander.Command) => {
      execute(command, () => getEntryDoc(entry), textRenderers.doc)
    })
}
