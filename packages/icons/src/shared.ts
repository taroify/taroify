import type { ViewProps } from "@tarojs/components/types/View"
import type { CSSProperties, ReactNode } from "react"

export const ICON_TYPE = Symbol("__iconType__")

type LiteralString = string & Record<never, never>

export type IconSize = "inherit" | "mini" | "small" | "medium" | "large"
export type IconSizeValue = IconSize | number | LiteralString

export const ICON_PRESET_SIZES = ["inherit", "mini", "small", "medium", "large"]

export type IconColor =
  | "inherit"
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
export type IconColorValue = IconColor | LiteralString

export const ICON_PRESET_COLORS = [
  "inherit",
  "default",
  "primary",
  "info",
  "success",
  "warning",
  "danger",
]

export interface IconProps extends ViewProps {
  className?: string
  style?: CSSProperties
  size?: IconSizeValue
  color?: IconColorValue
  src?: string
  children?: ReactNode
}
