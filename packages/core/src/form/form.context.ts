import { createContext } from "react"
import type {
  FormControlAlign,
  FormLabelAlign,
  FormRequired,
  FormValidateTrigger,
} from "./form.shared"

interface FormContextValue {
  name?: string
  colon?: boolean
  required?: FormRequired
  disabled?: boolean
  labelAlign?: FormLabelAlign
  controlAlign?: FormControlAlign
  validateTrigger?: FormValidateTrigger
}

const FormContext = createContext<FormContextValue>({})

export default FormContext
