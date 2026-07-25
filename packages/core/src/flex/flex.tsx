import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as _ from "lodash"
import * as React from "react"
import {
  Children,
  cloneElement,
  useMemo,
  forwardRef,
  isValidElement,
  type ReactNode,
  type CSSProperties,
} from "react"
import { prefixClassname } from "../styles"
import { addUnitPx } from "../utils/format/unit"
import FlexContext from "./flex.context"
import type { FlexAlign, FlexDirection, FlexGutter, FlexJustify, FlexWrap } from "./flex.shared"

function useFlexGutter(gutter?: FlexGutter): [undefined | number, undefined | number] {
  return useMemo(() => {
    if (gutter === undefined) {
      return [undefined, undefined]
    }

    if (_.isNumber(gutter) || _.isString(gutter)) {
      const gutterNumber = _.toNumber(gutter)
      return [gutterNumber, undefined]
    }

    if (_.isArray(gutter)) {
      const [horizontalGutter, verticalGutter] = gutter
      return [_.toNumber(horizontalGutter), _.toNumber(verticalGutter)]
    }

    return [0, 0]
  }, [gutter])
}

function useVerticalGutterIndexes(
  children: ReactNode,
  verticalGutter: number | undefined,
  wrap: FlexWrap,
) {
  return useMemo(() => {
    if (!verticalGutter || verticalGutter < 0 || wrap === "nowrap") {
      return []
    }

    const groups: number[][] = [[]]
    let totalSpan = 0

    Children.forEach(children, (item, index) => {
      if (!isValidElement<{ span?: string | number }>(item)) {
        return
      }

      const span = _.toNumber(item.props.span) || 0
      totalSpan += span

      if (totalSpan > 24) {
        groups.push([index])
        totalSpan = span
      } else {
        groups[groups.length - 1].push(index)
      }
    })

    return groups.slice(0, -1).flat()
  }, [children, verticalGutter, wrap])
}

export interface FlexProps extends ViewProps {
  style?: CSSProperties
  direction?: FlexDirection
  wrap?: FlexWrap
  justify?: FlexJustify
  align?: FlexAlign
  gutter?: FlexGutter
  children?: ReactNode
}

const Flex = forwardRef((props: FlexProps, ref) => {
  const {
    className,
    style,
    gutter: gutterProp,
    direction = "row",
    wrap = "nowrap",
    justify = "start",
    align = "start",
    children: childrenProp,
    ...restProps
  } = props
  const gutter = useFlexGutter(gutterProp)
  const [horizontalGutter, verticalGutter] = gutter
  const verticalGutterIndexes = useVerticalGutterIndexes(childrenProp, verticalGutter, wrap)

  const rowStyle = useMemo<CSSProperties>(() => {
    const rowStyle: CSSProperties = {}
    if (horizontalGutter) {
      const averageMargin = _.toNumber(horizontalGutter) / 2
      rowStyle.marginLeft = addUnitPx(-averageMargin)
      rowStyle.marginRight = addUnitPx(-averageMargin)
    }
    return rowStyle
  }, [horizontalGutter])

  const children = useMemo(
    () =>
      Children.map(childrenProp, (item, index) => {
        return isValidElement<any>(item)
          ? cloneElement(item, {
              __dataIndex__: index,
            })
          : item
      }),
    [childrenProp],
  )

  return (
    <View
      ref={ref}
      className={classNames(
        prefixClassname("flex"),
        {
          // Set flex style
          [prefixClassname("flex--row")]: direction === "row",
          [prefixClassname("flex--row-reverse")]: direction === "row-reverse",
          [prefixClassname("flex--column")]: direction === "column",
          [prefixClassname("flex--column-reverse")]: direction === "column-reverse",
          // Set flex-wrap style
          [prefixClassname("flex--nowrap")]: wrap === "nowrap",
          [prefixClassname("flex--wrap")]: wrap === "wrap",
          [prefixClassname("flex--wrap-reverse")]: wrap === "wrap-reverse",
          // Set justify style
          [prefixClassname("flex--justify-start")]: justify === "start",
          [prefixClassname("flex--justify-center")]: justify === "center",
          [prefixClassname("flex--justify-end")]: justify === "end",
          [prefixClassname("flex--justify-space-around")]: justify === "space-around",
          [prefixClassname("flex--justify-space-between")]: justify === "space-between",
          // Set align style
          [prefixClassname("flex--align-start")]: align === "start",
          [prefixClassname("flex--align-center")]: align === "center",
          [prefixClassname("flex--align-end")]: align === "end",
          [prefixClassname("flex--align-baseline")]: align === "baseline",
          [prefixClassname("flex--align-stretch")]: align === "stretch",
        },
        className,
      )}
      style={{
        ...style,
        ...rowStyle,
      }}
      {...restProps}
    >
      <FlexContext.Provider
        value={{
          gutter,
          verticalGutterIndexes,
        }}
        children={children}
      />
    </View>
  )
})

export default Flex
