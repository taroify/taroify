import type { ViewProps } from "@tarojs/components/types/View"
import * as _ from "lodash"
import type { ReactNode } from "react"

export interface CascaderEventOption {
  key?: string | number
  tabIndex: number
  className?: string
  value?: any
  disabled?: boolean
  children?: ReactNode
}

export type CascaderOptionObject = CascaderEventOption & ViewProps
export interface CascaderTabObject {
  className?: string
  options: CascaderOptionObject[]
}

export interface CascaderDataOption {
  [idx: string]: any
  value?: any
  label?: ReactNode
  disabled?: boolean
  children?: CascaderDataOption[]
}

export interface CascaderOptionRenderProps {
  option: CascaderDataOption
  selected: boolean
  tabIndex: number
}

export interface CascaderOptionsRenderProps {
  options: CascaderDataOption[]
  tabIndex: number
}

export interface CascaderFieldNames {
  label?: string
  value?: string
  children?: string
}

export type CascaderThemeVars = {
  cascaderActiveColor?: string
  cascaderHeaderHeight?: string
  cascaderHeaderPadding?: string
  cascaderHeaderFontSize?: string
  cascaderHeaderFontWeight?: string
  cascaderHeaderLineHeight?: string
  cascaderCloseIconSize?: string
  cascaderCloseIconColor?: string
  cascaderTabsHeight?: string
  cascaderTabFontWeight?: string
  cascaderTabColor?: string
  cascaderInactiveTabColor?: string
  cascaderOptionsHeight?: string
  cascaderOptionPadding?: string
  cascaderOptionFontSize?: string
  cascaderOptionLineHeight?: string
  cascaderOptionActiveBackgroundColor?: string
  cascaderDisabledOptionColor?: string
  cascaderActiveOptionColor?: string
  cascaderActiveOptionFontWeight?: string
  cascaderActiveIconFontSize?: string
}

export function isActiveOption(option: CascaderOptionObject, values: any[]) {
  return _.get(values, option.tabIndex) === option.value
}
