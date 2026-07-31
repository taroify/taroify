import { createContext } from "react"
import type { CheckboxGroupDirection } from "./checkbox-group.shared"

export interface CheckboxGroupItem {
  name?: any
  disabled?: boolean
}

interface CheckboxGroupContextValue {
  value?: any[]
  max?: number
  disabled?: boolean
  direction?: CheckboxGroupDirection

  onChange?(value: any[]): void

  register?(item: CheckboxGroupItem): () => void
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue>({})

export default CheckboxGroupContext
