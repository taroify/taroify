import type { ErrorPayload, ErrorResult } from "./types.js"

export const ErrorCodes = {
  COMPONENT_NOT_FOUND: "COMPONENT_NOT_FOUND",
  DEMO_NOT_FOUND: "DEMO_NOT_FOUND",
  DOCUMENT_NOT_FOUND: "DOCUMENT_NOT_FOUND",
  INVALID_ARGUMENT: "INVALID_ARGUMENT",
  INVALID_FORMAT: "INVALID_FORMAT",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const

export class CliError extends Error {
  readonly code: string
  readonly suggestions?: string[]
  readonly details?: unknown
  readonly exitCode: number

  constructor(payload: ErrorPayload, exitCode = 1) {
    super(payload.message)
    this.name = "CliError"
    this.code = payload.code
    this.suggestions = payload.suggestions
    this.details = payload.details
    this.exitCode = exitCode
  }

  toResult(): ErrorResult {
    return {
      ok: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.suggestions?.length ? { suggestions: this.suggestions } : {}),
        ...(this.details === undefined ? {} : { details: this.details }),
      },
    }
  }
}

export function toCliError(error: unknown): CliError {
  if (error instanceof CliError) return error
  return new CliError(
    {
      code: ErrorCodes.INTERNAL_ERROR,
      message: error instanceof Error ? error.message : String(error),
    },
    1,
  )
}
