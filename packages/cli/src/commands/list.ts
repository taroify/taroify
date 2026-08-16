import { type Command, Option } from "commander"
import { textRenderers } from "../format.js"
import { listEntries } from "../queries.js"
import type { EntryKind } from "../types.js"
import type { ExecuteCommand } from "./_shared.js"

interface ListCommandOptions {
  category?: string
  package?: string
  kind?: EntryKind
}

export function registerListCommand(program: Command, execute: ExecuteCommand) {
  program
    .command("list")
    .alias("ls")
    .description("按分类列出 Taroify 组件、指南与 Hooks")
    .option("-c, --category <category>", "按分类 id 或中文名筛选")
    .option("-p, --package <package>", "按 npm 包名筛选")
    .addOption(
      new Option("-k, --kind <kind>", "按条目类型筛选").choices(["component", "guide", "hook"]),
    )
    .action((options: ListCommandOptions, command: Command) => {
      execute(
        command,
        () =>
          listEntries({
            category: options.category,
            packageName: options.package,
            kind: options.kind,
          }),
        textRenderers.list,
      )
    })
}
