import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as React from "react"
import type { ReactNode } from "react"
import { prefixClassname } from "../styles"
import CellGroupContext from "./cell-group.context"

export interface CellGroupProps extends ViewProps {
  title?: ReactNode
  clickable?: boolean
  inset?: boolean
  bordered?: boolean
  children?: ReactNode
}

export function CellGroup(props: CellGroupProps) {
  const {
    title,
    clickable = false,
    inset = false,
    bordered = true,
    children,
    className,
    ...restProps
  } = props

  const hasTitle = React.Children.toArray(title).length > 0
  const group = (
    <View
      className={classNames(
        prefixClassname("cell-group"),
        {
          [prefixClassname("cell-group--inset")]: inset,
          [prefixClassname("hairline--top-bottom")]: bordered && !inset,
        },
        className,
      )}
      {...restProps}
    >
      {children}
    </View>
  )

  return (
    <CellGroupContext.Provider
      value={{
        clickable,
      }}
    >
      {hasTitle ? (
        <>
          <View
            className={classNames(prefixClassname("cell-group__title"), {
              [prefixClassname("cell-group__title--inset")]: inset,
            })}
            children={title}
          />
          {group}
        </>
      ) : (
        group
      )}
    </CellGroupContext.Provider>
  )
}

export default CellGroup
