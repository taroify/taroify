import type commander from "commander"

export type ExecuteCommand = <T>(
  command: commander.Command,
  operation: () => T,
  renderer: (data: T) => string,
) => void
