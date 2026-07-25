export type PopupPlacement = "top" | "right" | "bottom" | "left" | "center"

export type PopupCloseAction = "backdrop" | "close"

export type PopupTransitionTimeout =
  | number
  | {
      appear?: number
      enter?: number
      exit?: number
    }

export type PopupThemeVars = {
  popupZIndex?: string
  popupBackgroundColor?: string
  popupAnimationDuration?: string
  popupRoundedBorderRadius?: string
  popupCloseIconZIndex?: string | number
  popupCloseIconSize?: string
  popupCloseIconColor?: string
  popupCloseIconActiveColor?: string
  popupCloseIconMargin?: string
}
