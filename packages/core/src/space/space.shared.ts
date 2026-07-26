export type SpaceDirection = "horizontal" | "vertical"

export type SpaceSizePreset = "mini" | "small" | "medium" | "large"

export type SpaceSizeValue = SpaceSizePreset | number | (string & {})

export type SpaceSize = SpaceSizeValue | [SpaceSizeValue, SpaceSizeValue?]

export type SpaceJustify = "start" | "center" | "end" | "space-around" | "space-between"

export type SpaceWrap = "nowrap" | "wrap" | "wrap-reverse"

export type SpaceAlign = "start" | "center" | "end" | "baseline" | "stretch"

export type SpaceThemeVars = {
  spaceItemGapMini?: string
  spaceItemGapSmall?: string
  spaceItemGapMedium?: string
  spaceItemGapLarge?: string
  spaceItemVerticalGapMini?: string
  spaceItemVerticalGapSmall?: string
  spaceItemVerticalGapMedium?: string
  spaceItemVerticalGapLarge?: string
  spaceItemHorizontalGapMini?: string
  spaceItemHorizontalGapSmall?: string
  spaceItemHorizontalGapMedium?: string
  spaceItemHorizontalGapLarge?: string
}
