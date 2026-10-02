import PickerButton from "../picker/picker-button"
import PickerTitle from "../picker/picker-title"
import PickerToolbar from "../picker/picker-toolbar"
import PickerGroupComponent from "./picker-group"

export type { PickerGroupProps } from "./picker-group"
export type { PickerGroupConfirmEventParams, PickerGroupThemeVars } from "./picker-group.shared"

const PickerGroup = Object.assign(PickerGroupComponent, {
  Toolbar: PickerToolbar,
  Title: PickerTitle,
  Button: PickerButton,
})

export default PickerGroup
