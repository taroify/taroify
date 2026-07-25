import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as React from "react"
import { type CSSProperties, type ReactNode, useContext } from "react"
import { prefixClassname } from "../styles"
import { addUnitPx } from "../utils/format/unit"
import FlexContext from "./flex.context"

export interface FlexItemProps extends ViewProps {
  __dataIndex__?: number
  style?: CSSProperties
  span?: string | number
  offset?: string | number
  children?: ReactNode
}

export default function FlexItem(props: FlexItemProps) {
  const { __dataIndex__ = 0, className, style, span, offset, ...restProps } = props
  const { gutter: gutters, verticalGutterIndexes } = useContext(FlexContext)
  const [horizontalGutter, verticalGutter] = gutters

  const gutterStyle: CSSProperties = {}
  if (horizontalGutter) {
    const averagePadding = horizontalGutter / 2
    gutterStyle.paddingLeft = addUnitPx(averagePadding)
    gutterStyle.paddingRight = addUnitPx(averagePadding)
  }
  if (verticalGutter && verticalGutterIndexes.includes(__dataIndex__)) {
    gutterStyle.marginBottom = addUnitPx(verticalGutter)
  }

  return (
    <View
      className={classNames(
        prefixClassname("flex-item"),
        {
          [prefixClassname(`flex-item-${span}`)]: span !== undefined,
          [prefixClassname(`flex-item-offset-${offset}`)]: offset !== undefined,
        },
        className,
      )}
      style={{
        ...style,
        ...gutterStyle,
      }}
      {...restProps}
    />
  )
}
