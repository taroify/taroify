export type InputAlign = "left" | "center" | "right"

export type InputColor = "primary" | "info" | "success" | "warning" | "danger"

export type InputClearTrigger = "always" | "focus"

export type InputFormatTrigger = "onChange" | "onBlur"

export type InputFormatter = (value: string) => string

export type InputThemeVars = {
  inputHeight?: string
  inputLineHeight?: string
  inputFontSize?: string
  inputColor?: string
  inputPrimaryColor?: string
  inputInfoColor?: string
  inputSuccessColor?: string
  inputWarningColor?: string
  inputDangerColor?: string
  inputDisabledColor?: string
  inputPlaceholderColor?: string
  inputClearIconSize?: string
  inputClearIconColor?: string
}
