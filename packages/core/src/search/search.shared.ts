export type SearchShape = "square" | "rounded" | "round"

export interface SearchInstance {
  focus(): void
  blur(): void
}

export type SearchThemeVars = {
  searchPadding?: string
  searchBackgroundColor?: string
  searchContentPaddingLeft?: string
  searchContentBackgroundColor?: string
  searchContentBorderRadius?: string
  searchContentSquareBorderRadius?: string
  searchContentRoundedBorderRadius?: string
  searchInputHeight?: string
  searchLabelPadding?: string
  searchLabelColor?: string
  searchLabelFontSize?: string
  searchLabelLineHeight?: string
  searchFieldPadding?: string
  searchLeftIconColor?: string
  searchActionPadding?: string
  searchActionColor?: string
  searchActionLineHeight?: string
  searchActionFontSize?: string
  searchActionActiveBackgroundColor?: string
}
