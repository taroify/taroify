import type { Command } from "commander"
import { textRenderers } from "../format.js"
import { getEntryDemo } from "../queries.js"
import type { ExecuteCommand } from "./_shared.js"

interface DemoCommandOptions {
  full?: boolean
}

export function registerDemoCommand(program: Command, execute: ExecuteCommand) {
  program
    .command("demo <entry> [name]")
    .description("列出或查看文档示例，也可返回完整 Demo 页面")
    .option("--full", "返回完整 Taro Demo 页面源码")
    .action(
      (entry: string, name: string | undefined, options: DemoCommandOptions, command: Command) => {
        execute(command, () => getEntryDemo(entry, name, Boolean(options.full)), textRenderers.demo)
      },
    )
}
