import * as React from "react"
import type { ComponentType, ReactNode } from "react"
import CellBase from "./cell-base"
import CellBrief from "./cell-brief"
import CellTitle from "./cell-title"
import CellValue from "./cell-value"
import type { CellBaseProps } from "./cell.shared"

export interface CellProps extends CellBaseProps {
  title?: ReactNode
  brief?: ReactNode
}

type CellRootProps = CellProps & {
  component?: ComponentType<any>
}

export function CellRoot(props: CellRootProps) {
  const { title, brief, children, titleStyle, titleClass, valueClass, briefClass, ...restProps } =
    props
  const hasTitle = React.Children.toArray(title).length > 0
  const hasBrief = React.Children.toArray(brief).length > 0
  return (
    <CellBase {...restProps}>
      {hasTitle && (
        <CellTitle titleStyle={titleStyle} titleClass={titleClass}>
          {title}
          {hasBrief && <CellBrief children={brief} briefClass={briefClass} />}
        </CellTitle>
      )}
      <CellValue alone={!hasTitle} children={children} valueClass={valueClass} />
    </CellBase>
  )
}

function Cell(props: CellProps) {
  return <CellRoot {...props} />
}

export default Cell
