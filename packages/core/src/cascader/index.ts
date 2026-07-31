import CascaderComponent, { type CascaderProps } from "./cascader"
import CascaderHeader from "./cascader-header"
import CascaderOption from "./cascader-option"
import CascaderTab from "./cascader-tab"

export type {
  CascaderThemeVars,
  CascaderDataOption,
  CascaderEventOption,
  CascaderFieldNames,
  CascaderOptionRenderProps,
  CascaderOptionsRenderProps,
} from "./cascader.shared"

interface CascaderInterface {
  (props: CascaderProps): JSX.Element

  Header: typeof CascaderHeader
  Tab: typeof CascaderTab
  Option: typeof CascaderOption
}

const Cascader = CascaderComponent as CascaderInterface

Cascader.Header = CascaderHeader
Cascader.Tab = CascaderTab
Cascader.Option = CascaderOption

export default Cascader
