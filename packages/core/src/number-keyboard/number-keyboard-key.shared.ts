import { type ReactElement, type ReactNode, isValidElement } from "react"
import NumberKeyboardKey from "./number-keyboard-key"

export type NumberKeyboardKeyCode = "extra" | "backspace" | "keyboard-hide"

export type NumberKeyboardKeyValue = string | number

export type NumberKeyboardKeyOnPress = (
  value: NumberKeyboardKeyValue,
  code: NumberKeyboardKeyCode,
) => void

export type NumberKeyboardChangeHandler = (value: string) => void

export type NumberKeyboardEventHandler = () => void

export function isNumberKeyboardKeyElement(node: ReactNode): boolean {
  return isValidElement(node) && (node as ReactElement).type === NumberKeyboardKey
}
