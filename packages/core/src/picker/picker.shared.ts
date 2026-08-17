import * as _ from "lodash"
import type { Key, ReactNode } from "react"

export const DEFAULT_SIBLING_COUNT = 3
export const DEFAULT_OPTION_HEIGHT = 44
export const DEFAULT_SWIPE_DURATION = 800

const DEFAULT_COLUMN_INDEX = 0

export type PickerValue = string | number

export type PickerToolbarPosition = "top" | "bottom"

export interface PickerFieldNames {
  label?: string
  value?: string
}

export interface PickerOptionData<Value extends PickerValue = PickerValue> {
  [x: string]: any
  value?: Value
  label?: ReactNode
  disabled?: boolean
}

export type PickerOption<Value extends PickerValue = PickerValue> = PickerOptionData<Value>

export type PickerColumn<Value extends PickerValue = PickerValue> = PickerOptionData<Value>[]

export type PickerColumns<Value extends PickerValue = PickerValue> = PickerColumn<Value>[]

export interface PickerOptionObject<Value extends PickerValue = PickerValue>
  extends Record<string, any> {
  key?: Key
  index: number
  value?: Value
  disabled?: boolean
  label?: ReactNode
  children?: ReactNode
}

export interface PickerSelectedState<Value extends PickerValue = PickerValue> {
  selectedValues: Value[]
  selectedOptions: PickerOptionObject<Value>[]
  selectedIndexes: number[]
}

export type PickerConfirmEventParams<Value extends PickerValue = PickerValue> =
  PickerSelectedState<Value>

export type PickerCancelEventParams<Value extends PickerValue = PickerValue> =
  PickerConfirmEventParams<Value>

export interface PickerChangeEventParams<Value extends PickerValue = PickerValue>
  extends PickerSelectedState<Value> {
  columnIndex: number
}

export interface PickerClickOptionEventParams<Value extends PickerValue = PickerValue>
  extends PickerSelectedState<Value> {
  columnIndex: number
  currentOption: PickerOptionObject<Value>
}

export interface PickerScrollIntoEventParams<Value extends PickerValue = PickerValue> {
  columnIndex: number
  currentOption: PickerOptionObject<Value>
}

export interface PickerColumnInstance {
  stopMomentum(): void
}

export type PickerThemeVars = {
  pickerBackgroundColor?: string
  pickerMaskColor?: string
  pickerToolbarHeight?: string
  pickerTitleFontSize?: string
  pickerTitleLineHeight?: string
  pickerActionPadding?: string
  pickerActionFontSize?: string
  pickerConfirmActionColor?: string
  pickerCancelActionColor?: string
  pickerSwipeTransitionDuration?: string
  pickerColumnTransitionZeroDuration?: string
  pickerColumnTransitionSwitchDuration?: string
  pickerColumnTransitionDuration?: string
  pickerOptionColor?: string
  pickerOptionPadding?: string
  pickerOptionFontSize?: string
  pickerOptionDisabledOpacity?: number
  pickerOptionHeight?: string
  pickerLoadingIconColor?: string
  pickerLoadingMaskColor?: string
}

export function validPickerColumn(column: PickerOptionObject) {
  const { index } = column
  return _.isNumber(index) && _.gte(index, DEFAULT_COLUMN_INDEX) ? column : undefined
}

export function getPickerOptionKey(option: PickerOptionObject) {
  const { key, value, label, children } = option
  const newKey = key ?? value ?? label
  if (_.isString(newKey) || _.isNumber(newKey)) {
    return newKey
  }
  if (_.isUndefined(newKey) && (_.isString(children) || _.isNumber(children))) {
    return children as Key
  }
  return undefined
}

export function getPickerValue(values: any, multiColumns: boolean): any {
  return multiColumns ? values : _.first(values)
}
