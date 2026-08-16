import type { Command } from "commander"
import { CliError, ErrorCodes } from "../error.js"
import { textRenderers } from "../format.js"
import { searchEntries } from "../queries.js"
import type { ExecuteCommand } from "./_shared.js"

interface SearchCommandOptions {
  limit: string
}

export function registerSearchCommand(program: Command, execute: ExecuteCommand) {
  program
    .command("search <query>")
    .alias("find")
    .description("按名称、分类和文档全文搜索")
    .option("-l, --limit <number>", "最多返回多少条结果", "10")
    .action((query: string, options: SearchCommandOptions, command: Command) => {
      const parsedLimit = Number(options.limit)
      execute(
        command,
        () => {
          if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
            throw new CliError(
              {
                code: ErrorCodes.INVALID_ARGUMENT,
                message: "limit 必须是大于 0 的整数。",
              },
              2,
            )
          }
          return searchEntries(query, parsedLimit)
        },
        textRenderers.search,
      )
    })
}
