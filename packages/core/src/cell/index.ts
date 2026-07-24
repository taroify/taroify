import CellElement, { type CellProps } from "./cell"
import CellGroup from "./cell-group"
import CellLink from "./cell-link"

export type {
  ArrowDirection,
  CellAlign,
  CellArrowDirection,
  CellBaseProps,
  CellSize,
  CellThemeVars,
} from "./cell.shared"
export { default as CellBase } from "./cell-base"
export { default as CellTitle } from "./cell-title"
export { default as CellValue } from "./cell-value"
export type { CellProps } from "./cell"
export type { CellGroupProps } from "./cell-group"
export type { CellLinkProps } from "./cell-link"

interface CellInterface {
  (props: CellProps): JSX.Element

  Group: typeof CellGroup
  Link: typeof CellLink
}

const Cell = CellElement as CellInterface
Cell.Group = CellGroup
Cell.Link = CellLink

export default Cell
