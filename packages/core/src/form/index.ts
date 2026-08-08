import type { ForwardRefExoticComponent } from "react"
import FormComponent, { type FormProps } from "./form"
import FormControl from "./form-control"
import FormFeedback from "./form-feedback"
import FormItem from "./form-item"
import FormLabel from "./form-label"
import FormList from "./form-list"

export type {
  FormRule,
  FormInstance,
  FormLabelAlign,
  FormRequired,
  FormValidError,
  FormItemInstance,
  FormListItemField,
  FormListInstance,
  FormFeedbackAlign,
  FormFeedbackStatus,
  FormController,
  FormThemeVars,
} from "./form.shared"

export type { FormItemProps } from "./form-item"

export type { FormLabelProps } from "./form-label"

export type { FormFeedbackProps } from "./form-feedback"

export { default as useFormField } from "./use-form-field"
export { default as useFormValue } from "./use-form-value"

interface FormInterface extends ForwardRefExoticComponent<FormProps> {
  (props: FormProps): JSX.Element

  Item: typeof FormItem
  Label: typeof FormLabel
  Control: typeof FormControl
  Feedback: typeof FormFeedback
  List: typeof FormList
}

const Form = FormComponent as FormInterface

Form.Item = FormItem
Form.Label = FormLabel
Form.Control = FormControl
Form.Feedback = FormFeedback
Form.List = FormList

export default Form
