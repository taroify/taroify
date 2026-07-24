import type { ReactNode, CSSProperties } from "react"
import type { ViewProps } from "@tarojs/components/types/View"
export type CellSize =
  | "normal"
  /** @deprecated Use "normal" instead. */
  | "medium"
  | "large"

export type CellAlign = "start" | "center" | "end"

export type ArrowDirection = "right" | "left" | "up" | "down"
export type CellArrowDirection = ArrowDirection

export type CellBaseProps = {
  size?: CellSize
  align?: CellAlign
  icon?: ReactNode
  rightIcon?: ReactNode
  extra?: ReactNode
  required?: boolean
  bordered?: boolean
  clickable?: boolean
  isLink?: boolean
  arrowDirection?: ArrowDirection
  children?: ReactNode
  /** 左侧标题额外样式 */
  titleStyle?: CSSProperties
  /** 左侧标题额外类名 */
  titleClass?: string
  /** 右侧内容额外类名 */
  valueClass?: string
  /** 标题下方的描述信息额外类名 */
  briefClass?: string
} & ViewProps

export type CellThemeVars = {
  cellFontSize?: string
  cellLineHeight?: string
  cellColor?: string
  cellBackgroundColor?: string
  cellBorderColor?: string
  cellValueColor?: string
  cellActiveColor?: string
  cellRequiredColor?: string
  cellRequiredPaddingRight?: string
  cellIconSize?: string
  cellLeftIconMarginRight?: string
  cellRightIconMarginLeft?: string
  cellRightIconColor?: string
  cellExtraMarginLeft?: string
  /** @deprecated Use cellLeftIconMarginRight instead. */
  cellIconMarginLeft?: string
  /** @deprecated Use cellRightIconMarginLeft instead. */
  cellRightIconMarginRight?: string
  cellBriefMarginTop?: string
  cellBriefFontSize?: string
  cellBriefLineHeight?: string
  cellBriefColor?: string
  cellValueFontSize?: string
  cellVerticalPadding?: string
  cellHorizontalPadding?: string
  cellVerticalPaddingLarge?: string
  cellTitleFontSizeLarge?: string
  cellBriefFontSizeLarge?: string
  cellValueFontSizeLarge?: string
  /** @deprecated Use cellBriefFontSizeLarge instead. */
  cellSubtitleFontSizeLarge?: string
  cellGroupBackgroundColor?: string
  cellGroupTitleColor?: string
  cellGroupTitlePadding?: string
  cellGroupTitleFontSize?: string
  cellGroupTitleLineHeight?: string
  cellGroupInsetPadding?: string
  cellGroupInsetBorderRadius?: string
  cellGroupInsetTitlePadding?: string
}
