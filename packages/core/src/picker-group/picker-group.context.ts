import { createContext } from "react"
import type { PickerSelectedState } from "../picker/picker.shared"

export interface PickerGroupChild {
  stopMomentum(): void
  confirm(): PickerSelectedState
}

interface PickerGroupContextValue {
  register(picker: PickerGroupChild): () => void
}

const PickerGroupContext = createContext<PickerGroupContextValue | undefined>(undefined)

export default PickerGroupContext
