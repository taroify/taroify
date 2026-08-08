import type { ReactNode } from "react"

export interface FormInstance {
  /**
   * @deprecated
   */
  validateFields(name?: string | string[]): Promise<void>

  /**
   * @deprecated
   */
  setFieldsValue(values: any): void

  /**
   * @deprecated
   */
  getFieldsValue<V>(): V

  submit(): void

  getErrors(name?: string | string[]): FormValidError[]

  setErrors(errors: FormValidError[]): void

  getValues<V>(name?: string | string[]): V

  setValues(values: any, emitChange?: boolean): void

  validate<V>(name?: string | string[]): Promise<V>

  reset(): void
}

export type FormLabelAlign = "left" | "center" | "right" | "top"

export type FormRequired = boolean | "auto"

export type FormControlAlign = "left" | "center" | "right"

export type FormFeedbackAlign = "left" | "center" | "right"

export type FormFeedbackStatus = "valid" | "warning" | "invalid"

export type FormValidateTrigger = "onBlur" | "onChange" | "onSubmit"

export type FormValidateStatus = FormFeedbackStatus

export interface FormValidError {
  name?: string
  errors: ReactNode[]
}

export type FormRuleMessage = string | ((value: any, rule: FormRule) => string)

export type FormRuleValidator = (
  value: any,
  rule: FormRule,
) => boolean | string | Error | Promise<boolean | string | Error>

export type FiledRuleFormatter = (value: any, rule: FormRule) => string

export interface FormRule {
  pattern?: RegExp
  trigger?: FormValidateTrigger
  message?: FormRuleMessage
  required?: boolean
  validator?: FormRuleValidator
  formatter?: FiledRuleFormatter
}

export interface FormController<V> {
  name?: string
  value?: V
  validateStatus?: FormValidateStatus
  disabled?: boolean

  onChange?(value: V): void

  onBlur?(value: V): void
}

export interface FormItemInstance {
  readonly name?: string

  getValue(): any

  setValue(value: any): void

  validate(rules?: FormRule[]): Promise<void>
}

export interface FormListInstance {
  add(defaultValue?: any): void
  remove(index: number): void
}

export interface FormListItemField {
  name: string
  key: number
}

export type FormThemeVars = {
  formLabelWidth?: string
  formLabelColor?: string
  formLabelMarginRight?: string
  formLabelTopMarginBottom?: string
  formLabelRequiredColor?: string
  formLabelDisabledColor?: string
  formItemIconSize?: string
  formItemRightIconColor?: string
  formItemRightIconPadding?: string
  formItemRightIconMarginRight?: string
  formItemRightButtonMarginLeft?: string
  formControlColor?: string
  formControlMinHeight?: string
  formFeedbackFontSize?: string
  formFeedbackValidColor?: string
  formFeedbackWarningColor?: string
  formFeedbackInvalidColor?: string
}
