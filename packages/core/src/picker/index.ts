import type { ForwardRefExoticComponent } from "react"
import PickerComponent, { type PickerProps } from "./picker"
import PickerButton from "./picker-button"
import PickerColumns from "./picker-columns"
import PickerOption from "./picker-option"
import PickerTitle from "./picker-title"
import PickerToolbar from "./picker-toolbar"
import { PickerColumn } from "./picker.composition"

export type { PickerBaseProps, PickerInstance, PickerProps } from "./picker"
export type {
  PickerCancelEventParams,
  PickerChangeEventParams,
  PickerClickOptionEventParams,
  PickerColumn,
  PickerColumnInstance,
  PickerColumns,
  PickerConfirmEventParams,
  PickerFieldNames,
  PickerOption,
  PickerOptionData,
  PickerOptionObject,
  PickerScrollIntoEventParams,
  PickerSelectedState,
  PickerThemeVars,
  PickerToolbarPosition,
  PickerValue,
} from "./picker.shared"
export type { PickerColumnsProps } from "./picker-columns"
export type { PickerColumnProps } from "./picker.composition"
export type { PickerOptionProps } from "./picker-option"
export type { PickerButtonProps } from "./picker-button"
export type { PickerTitleProps } from "./picker-title"
export type { PickerToolbarProps } from "./picker-toolbar"
export { default as PickerContext } from "./picker.context"

interface PickerInterface extends ForwardRefExoticComponent<PickerProps> {
  Toolbar: typeof PickerToolbar
  Title: typeof PickerTitle
  Button: typeof PickerButton
  Columns: typeof PickerColumns
  Column: typeof PickerColumn
  Option: typeof PickerOption
}

const Picker = PickerComponent as PickerInterface

Picker.Toolbar = PickerToolbar
Picker.Title = PickerTitle
Picker.Button = PickerButton
Picker.Columns = PickerColumns
Picker.Column = PickerColumn
Picker.Option = PickerOption

export default Picker
