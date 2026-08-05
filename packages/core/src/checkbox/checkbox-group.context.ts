import { createContext } from "react"
import type { CheckboxGroupDirection } from "./checkbox-group.shared"
import type { CheckboxShape } from "./checkbox.shared"

export interface CheckboxGroupItem {
  name?: any
  disabled?: boolean
}

interface CheckboxGroupContextValue {
  value?: any[]
  max?: number
  disabled?: boolean
  direction?: CheckboxGroupDirection
  shape?: CheckboxShape
  checkedColor?: string

  onChange?(value: any[]): void

  register?(item: CheckboxGroupItem): () => void
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue>({})

export default CheckboxGroupContext
