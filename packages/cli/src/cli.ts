import commander from "commander"
import { registerDemoCommand } from "./commands/demo.js"
import { registerDocCommand } from "./commands/doc.js"
import { registerInfoCommand } from "./commands/info.js"
import { registerListCommand } from "./commands/list.js"
import { registerMcpCommand } from "./commands/mcp.js"
import { registerSearchCommand } from "./commands/search.js"
import { registerTokenCommand } from "./commands/token.js"
import { CliError, ErrorCodes, toCliError } from "./error.js"
import { printSuccess } from "./format.js"
import type { OutputFormat } from "./types.js"

const { Command, CommanderError } = commander

declare const __CLI_VERSION__: string

function requestedFormat(argv = process.argv): OutputFormat {
  const formatIndex = argv.findIndex((value) => value === "--format" || value === "-f")
  const explicit =
    formatIndex >= 0
      ? argv[formatIndex + 1]
      : argv.find((value) => value.startsWith("--format="))?.slice("--format=".length)
  return explicit === "json" ? "json" : "text"
}

function commandFormat(command: commander.Command): OutputFormat {
  const format = command.parent?.opts().format ?? command.opts().format
  if (format !== "text" && format !== "json") {
    throw new CliError(
      {
        code: ErrorCodes.INVALID_FORMAT,
        message: `不支持的输出格式「${String(format)}」，可选值为 text 或 json。`,
      },
      2,
    )
  }
  return format
}

function execute<T>(command: commander.Command, operation: () => T, renderer: (data: T) => string) {
  try {
    const format = commandFormat(command)
    printSuccess(format, operation(), renderer)
  } catch (error) {
    printError(toCliError(error), requestedFormat())
  }
}

function printError(error: CliError, format: OutputFormat) {
  process.exitCode = error.exitCode
  if (format === "json") {
    process.stdout.write(`${JSON.stringify(error.toResult(), null, 2)}\n`)
    return
  }
  const suggestions = error.suggestions?.length
    ? `\n你是否想找：${error.suggestions.join(" / ")}`
    : ""
  process.stderr.write(`错误 [${error.code}]：${error.message}${suggestions}\n`)
}

const program = new Command()
program
  .name("taroify")
  .description("Taroify 面向 AI Coding 的离线组件知识 CLI")
  .version(__CLI_VERSION__, "-v, --version")
  .option("-f, --format <format>", "输出格式：text 或 json", "text")
  .exitOverride()
  .configureOutput({
    writeErr: (message: string) => {
      if (requestedFormat() !== "json") process.stderr.write(message)
    },
  })

registerListCommand(program, execute)
registerSearchCommand(program, execute)
registerInfoCommand(program, execute)
registerDocCommand(program, execute)
registerDemoCommand(program, execute)
registerTokenCommand(program, execute)
registerMcpCommand(program)

program.addHelpText(
  "after",
  `
示例：
  taroify list --category form
  taroify search 上传
  taroify info Button --format json
  taroify info Button.Group
  taroify demo Button
  taroify demo Button demo1
  taroify demo Button --full
  taroify token Button
  taroify mcp
`,
)

async function main() {
  try {
    await program.parseAsync(process.argv)
  } catch (error) {
    if (
      error instanceof CommanderError &&
      (error.code === "commander.helpDisplayed" || error.code === "commander.help")
    ) {
      return
    }
    if (error instanceof CommanderError && error.code === "commander.version") return
    if (error instanceof CommanderError) {
      printError(
        new CliError(
          {
            code: ErrorCodes.INVALID_ARGUMENT,
            message: error.message,
          },
          2,
        ),
        requestedFormat(),
      )
      return
    }
    printError(toCliError(error), requestedFormat())
  }
}

void main()
