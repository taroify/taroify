import type { Command } from "commander"

export type ExecuteCommand = <T>(
  command: Command,
  operation: () => T,
  renderer: (data: T) => string,
) => void
