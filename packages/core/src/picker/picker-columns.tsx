import type { ViewProps } from "@tarojs/components/types/View"
import * as _ from "lodash"
import * as React from "react"
import { type CSSProperties, type ReactNode, useCallback, useContext } from "react"
import PickerColumnsRender from "./picker-columns-render"
import PickerContext from "./picker.context"
import { getPickerValue, type PickerOptionObject, validPickerColumn } from "./picker.shared"

export interface PickerColumnsProps extends Omit<ViewProps, "children"> {
  style?: CSSProperties
  children?: ReactNode
}

function PickerColumns(props: PickerColumnsProps) {
  const {
    readonly,
    values,
    siblingCount,
    getValueOptions,
    isMultiValue,
    setValueOptions,
    onChange,
    onClickOption,
    onScrollInto,
  } = useContext(PickerContext)

  const onColumnChange = useCallback(
    (
      option: PickerOptionObject | undefined,
      unverifiedColumn: PickerOptionObject,
      emitChange?: boolean,
    ) => {
      setValueOptions?.(option, unverifiedColumn)
      const column = validPickerColumn(unverifiedColumn)
      if (column && option && emitChange) {
        const { index: columnIndex } = column
        const valueOptions = getValueOptions?.() ?? []
        const hasIncompleteColumn = valueOptions.some(
          (valueOption) => !valueOption || _.isUndefined(valueOption.value),
        )
        if (hasIncompleteColumn) return
        const newValues = valueOptions.map((valueOption) => valueOption!.value!)
        _.set(newValues, columnIndex, option?.value)
        const aValues = getPickerValue(
          newValues,
          isMultiValue?.() || valueOptions.length > 1 || _.size(newValues) > 1,
        )
        onChange?.(aValues, { ...option }, { ...column })
      }
    },
    [getValueOptions, isMultiValue, onChange, setValueOptions],
  )

  return (
    <PickerColumnsRender
      {...props}
      readonly={readonly}
      values={values}
      siblingCount={siblingCount}
      onChange={onColumnChange}
      onClickOption={onClickOption}
      onScrollInto={onScrollInto}
    />
  )
}

export default PickerColumns
