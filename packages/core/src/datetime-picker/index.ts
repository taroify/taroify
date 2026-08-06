import type { ForwardRefExoticComponent } from "react"
import Picker from "../picker"
import DatetimePickerElement, {
  type DatetimePickerInstance,
  type DatetimePickerProps,
} from "./datetime-picker"

export type { DatetimePickerInstance, DatetimePickerProps }
export type { DatetimePickerColumnType, DatetimePickerType } from "./datetime-picker.shared"

interface DatetimePickerInterface extends ForwardRefExoticComponent<DatetimePickerProps> {
  (props: DatetimePickerProps): JSX.Element

  Toolbar: typeof Picker.Toolbar
  Title: typeof Picker.Title
  Button: typeof Picker.Button
}

const DatetimePicker = DatetimePickerElement as DatetimePickerInterface

DatetimePicker.Toolbar = Picker.Toolbar
DatetimePicker.Title = Picker.Title
DatetimePicker.Button = Picker.Button

export default DatetimePicker
