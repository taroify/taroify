import { createContext, type ReactNode } from "react"
import type { SetRefCallback } from "../utils/state"
import {
  DEFAULT_SIBLING_COUNT,
  DEFAULT_OPTION_HEIGHT,
  DEFAULT_SWIPE_DURATION,
  type PickerColumnInstance,
  type PickerOptionObject,
  type PickerValue,
} from "./picker.shared"

interface PickerContextValue {
  values?: PickerValue[]
  readonly?: boolean
  loading?: boolean
  siblingCount: number
  optionHeight: number
  swipeDuration: number
  empty?: ReactNode
  renderEmpty?(): ReactNode

  isMultiValue?(): boolean

  getValueOptions?(): Array<PickerOptionObject | undefined>

  setValueOptions?(option: PickerOptionObject | undefined, column: PickerOptionObject): void

  setColumnRefs?: SetRefCallback<PickerColumnInstance>

  onChange?(
    values: PickerValue | PickerValue[],
    option: PickerOptionObject,
    column: PickerOptionObject,
  ): void

  onClickOption?(option: PickerOptionObject, column: PickerOptionObject): void

  onScrollInto?(option: PickerOptionObject, column: PickerOptionObject): void

  onConfirm?(): void

  onCancel?(): void
}

const PickerContext = createContext<PickerContextValue>({
  siblingCount: DEFAULT_SIBLING_COUNT,
  optionHeight: DEFAULT_OPTION_HEIGHT,
  swipeDuration: DEFAULT_SWIPE_DURATION,
})

export default PickerContext
