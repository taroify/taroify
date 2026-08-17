import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as _ from "lodash"
import * as React from "react"
import { type CSSProperties, type ReactNode, useContext, useMemo } from "react"
import { prefixClassname } from "../styles"
import { HAIRLINE_BORDER_UNSET_TOP_BOTTOM } from "../styles/hairline"
import { preventDefault } from "../utils/dom/event"
import { addUnitPx } from "../utils/format/unit"
import { useRendered } from "../utils/state"
import PickerColumn from "./picker-column"
import PickerContext from "./picker.context"
import { getPickerOptionKey, type PickerOptionObject } from "./picker.shared"
import usePickerOptions from "./use-picker-options"

export interface PickerColumnsRenderProps extends Omit<ViewProps, "children"> {
  style?: CSSProperties

  values?: any[]
  readonly?: boolean
  siblingCount: number

  children?: ReactNode

  onChange?(
    option: PickerOptionObject | undefined,
    column: PickerOptionObject,
    emitChange?: boolean,
  ): void

  onClickOption?(option: PickerOptionObject, column: PickerOptionObject): void

  onScrollInto?(option: PickerOptionObject, column: PickerOptionObject): void
}

function PickerColumnsRender(props: PickerColumnsRenderProps) {
  const {
    className,
    style,
    children,
    readonly,
    values,
    siblingCount,
    onChange,
    onClickOption,
    onScrollInto,
    ...restProps
  } = props

  const { setColumnRefs, optionHeight, swipeDuration, loading, empty, renderEmpty } =
    useContext(PickerContext)

  const columns = usePickerOptions(children)
  const hasOptions = columns.some(
    (column) => Array.isArray(column.children) && column.children.length > 0,
  )

  const visibleCount = siblingCount * 2

  const wrapHeight = useMemo(() => optionHeight * visibleCount, [visibleCount, optionHeight])

  const rootStyle = useMemo(
    () => ({
      ...style,
      height: addUnitPx(wrapHeight),
    }),
    [style, wrapHeight],
  )

  const maskStyle = useMemo<CSSProperties>(
    () => ({
      backgroundSize: `100% ${addUnitPx((wrapHeight - optionHeight) / 2)}`,
    }),
    [wrapHeight, optionHeight],
  )

  const frameStyle = useMemo<CSSProperties>(
    () => ({
      height: addUnitPx(optionHeight),
    }),
    [optionHeight],
  )

  const columnsRender = useRendered(() =>
    _.map(columns, (column, columnIndex) => {
      const { children: columnChildren, ...restColumnProps } = column
      const options = Array.isArray(columnChildren) ? (columnChildren as PickerOptionObject[]) : []
      return (
        <PickerColumn
          ref={setColumnRefs?.(columnIndex)}
          key={getPickerOptionKey(column) ?? columnIndex}
          // @ts-ignore
          children={options}
          readonly={readonly}
          {...restColumnProps}
          visibleCount={visibleCount}
          optionHeight={optionHeight}
          swipeDuration={swipeDuration}
          value={_.get(values, columnIndex)}
          onChange={(option, emitChange) =>
            onChange?.(
              option,
              {
                ...column,
                index: columnIndex,
              },
              emitChange,
            )
          }
          onClickOption={(option) =>
            onClickOption?.(option, {
              ...column,
              index: columnIndex,
            })
          }
          onScrollInto={(option) =>
            onScrollInto?.(option, {
              ...column,
              index: columnIndex,
            })
          }
        />
      )
    }),
  )

  if (!loading && !hasOptions) {
    const emptyContent = renderEmpty?.() ?? empty
    if (!_.isUndefined(emptyContent)) {
      return (
        <View
          className={classNames(prefixClassname("picker__empty"), className)}
          style={rootStyle}
          {...restProps}
        >
          {emptyContent}
        </View>
      )
    }
  }

  return (
    <View
      className={classNames(prefixClassname("picker__columns"), className)}
      style={rootStyle}
      catchMove
      onTouchMove={preventDefault}
      {...restProps}
    >
      {columnsRender}
      {hasOptions && (
        <>
          <View className={prefixClassname("picker__mask")} style={maskStyle} />
          <View
            className={classNames([
              HAIRLINE_BORDER_UNSET_TOP_BOTTOM,
              prefixClassname("picker__frame"),
            ])}
            style={frameStyle}
          />
        </>
      )}
    </View>
  )
}

export default PickerColumnsRender
