import { default as CheckboxComponent } from "./checkbox"
import CheckboxGroup from "./checkbox-group"

export type { CheckboxInstance, CheckboxProps } from "./checkbox"
export type {
  CheckboxGroupInstance,
  CheckboxGroupProps,
  CheckboxGroupToggleAll,
  CheckboxGroupToggleAllOptions,
} from "./checkbox-group"

export type { CheckboxShape, CheckboxThemeVars } from "./checkbox.shared"

type CheckboxInterface = typeof CheckboxComponent & {
  Group: typeof CheckboxGroup
}

const Checkbox = CheckboxComponent as CheckboxInterface

Checkbox.Group = CheckboxGroup

export default Checkbox
