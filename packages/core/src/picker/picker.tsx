import { useUncontrolled } from "@taroify/hooks"
import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as _ from "lodash"
import * as React from "react"
import {
  Children,
  forwardRef,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react"
import Loading from "../loading"
import { prefixClassname } from "../styles"
import { useRefs, useToRef } from "../utils/state"
import { isElementOf } from "../utils/validate"
import { unitToPx } from "../utils/format/unit"
import PickerColumns from "./picker-columns"
import PickerToolbar from "./picker-toolbar"
import PickerTitle from "./picker-title"
import PickerButton from "./picker-button"
import { PickerColumn } from "./picker.composition"
import PickerContext from "./picker.context"
import PickerOption from "./picker-option"
import {
  DEFAULT_OPTION_HEIGHT,
  DEFAULT_SIBLING_COUNT,
  DEFAULT_SWIPE_DURATION,
  type PickerClickOptionEventParams,
  type PickerColumnInstance,
  type PickerFieldNames,
  type PickerOptionData,
  type PickerOptionObject,
  type PickerScrollIntoEventParams,
  type PickerSelectedState,
  type PickerToolbarPosition,
  type PickerValue,
  validPickerColumn,
} from "./picker.shared"

function usePickerValues(value?: PickerValue | PickerValue[]): Array<PickerValue | undefined> {
  return _.isArray(value) ? value : [value]
}

export interface PickerBaseProps extends ViewProps {
  readonly?: boolean
  loading?: boolean
  showToolbar?: boolean
  toolbarPosition?: PickerToolbarPosition
  siblingCount?: number
  optionHeight?: string | number
  swipeDuration?: string | number
  title?: ReactNode
  confirmText?: ReactNode
  cancelText?: ReactNode
  columns?: PickerOptionData[] | PickerOptionData[][]
  columnsFieldNames?: PickerFieldNames
  empty?: ReactNode
  renderEmpty?(): ReactNode
  columnsTop?: ReactNode
  columnsBottom?: ReactNode
  children?: ReactNode
}

export interface PickerProps extends PickerBaseProps {
  defaultValue?: PickerValue | PickerValue[]
  value?: PickerValue | PickerValue[]

  onChange?(
    values: PickerValue | PickerValue[],
    option: PickerOptionObject,
    column: PickerOptionObject,
  ): void

  onConfirm?(
    values: PickerValue | PickerValue[],
    option: PickerOptionObject | PickerOptionObject[],
  ): void

  onCancel?(
    values: PickerValue | PickerValue[],
    option: PickerOptionObject | PickerOptionObject[],
  ): void

  onClickOption?(params: PickerClickOptionEventParams): void

  onScrollInto?(params: PickerScrollIntoEventParams): void
}

export interface PickerInstance {
  confirm(): void
  getSelectedOptions(): PickerOptionObject[]
}

const defaultFieldNames = {
  label: "label",
  value: "value",
}

function PickerElement(props: PickerProps, ref: ForwardedRef<PickerInstance>) {
  const {
    defaultValue,
    value: valueProp,
    className,
    loading,
    readonly,
    showToolbar = true,
    toolbarPosition = "top",
    title,
    confirmText = "确认",
    cancelText = "取消",
    columns: columnsProp,
    columnsFieldNames: columnsFieldNamesProp,
    siblingCount = DEFAULT_SIBLING_COUNT,
    optionHeight: optionHeightProp,
    swipeDuration: swipeDurationProp = DEFAULT_SWIPE_DURATION,
    empty,
    renderEmpty,
    columnsTop,
    columnsBottom,
    children: childrenProp,
    onChange,
    onCancel,
    onConfirm,
    onClickOption,
    onScrollInto,
    ...restProps
  } = props

  const { getRefs: getColumnRefs, setRefs: setColumnRefs } = useRefs<PickerColumnInstance>()

  const { value, setValue } = useUncontrolled({ value: valueProp, defaultValue })

  const multiValueRef = useToRef(_.isArray(value))

  const values = usePickerValues(value).filter((item): item is PickerValue => !_.isUndefined(item))

  const fieldNames: PickerBaseProps["columnsFieldNames"] = useMemo(() => {
    if (!_.isEmpty(columnsFieldNamesProp) && _.isObject(columnsFieldNamesProp)) {
      return Object.assign({ ...defaultFieldNames }, columnsFieldNamesProp)
    }
    return defaultFieldNames
  }, [columnsFieldNamesProp])

  const { children, columnCount } = useMemo(() => {
    let toolbar: ReactNode = null
    const __children__: ReactNode[] = []
    const columns: ReactNode[] = []
    // biome-ignore lint/complexity/noForEach: compound children are partitioned into ordered groups
    Children.toArray(childrenProp).forEach((child: ReactNode) => {
      if (isElementOf(child, PickerColumn)) {
        const element = child as ReactElement
        columns.push(element)
      } else if (isElementOf(child, PickerColumns)) {
        const element = child as ReactElement
        const columnChildren = element.props.children
        if (!_.isUndefined(columnChildren) && columnChildren !== null) {
          columns.push(...(Array.isArray(columnChildren) ? columnChildren : [columnChildren]))
        }
      } else if (isElementOf(child, PickerToolbar)) {
        toolbar = child
      } else {
        __children__.push(child)
      }
    })
    if (!toolbar && showToolbar && (title || confirmText || cancelText)) {
      toolbar = (
        <PickerToolbar key="-2">
          <PickerButton type="cancel">{cancelText}</PickerButton>
          <PickerTitle>{title}</PickerTitle>
          <PickerButton type="confirm">{confirmText}</PickerButton>
        </PickerToolbar>
      )
    }
    if (!showToolbar) {
      toolbar = null
    }
    if (_.isEmpty(columns) && columnsProp && columnsProp.length > 0) {
      ;(Array.isArray(columnsProp[0]) ? columnsProp : [columnsProp]).forEach((col, i) => {
        columns.push(
          <PickerColumn key={i}>
            {col.map((data, ii) => (
              <PickerOption
                key={ii}
                label={data[fieldNames.label!]}
                value={data[fieldNames.value!]}
                disabled={data.disabled}
              />
            ))}
          </PickerColumn>,
        )
      })
    }

    const pickerColumns = <PickerColumns key="-1" children={columns} />
    const pickerBody = [
      <React.Fragment key="columns-top">{columnsTop}</React.Fragment>,
      pickerColumns,
      <React.Fragment key="columns-bottom">{columnsBottom}</React.Fragment>,
    ]
    if (toolbarPosition === "bottom") {
      __children__.unshift(...pickerBody, toolbar)
    } else {
      __children__.unshift(toolbar, ...pickerBody)
    }
    return { children: __children__, columnCount: columns.length }
  }, [
    cancelText,
    childrenProp,
    columnsBottom,
    columnsProp,
    columnsTop,
    confirmText,
    fieldNames,
    showToolbar,
    title,
    toolbarPosition,
  ])

  const valueOptionsRef = useRef<Array<PickerOptionObject | undefined>>([])
  valueOptionsRef.current.length = columnCount

  const optionHeight = useMemo(
    () => (optionHeightProp ? unitToPx(optionHeightProp) : DEFAULT_OPTION_HEIGHT),
    [optionHeightProp],
  )

  const swipeDuration = useMemo(
    () => Math.max(0, Number(swipeDurationProp) || 0),
    [swipeDurationProp],
  )

  const setValueOptions = useCallback(
    (option: PickerOptionObject | undefined, unverifiedColumn: PickerOptionObject) => {
      const column = validPickerColumn(unverifiedColumn)
      /* istanbul ignore next -- columns rendered by Picker always carry a valid numeric index */
      if (column) {
        const { index: columnIndex } = column
        valueOptionsRef.current[columnIndex] = option
      }
    },
    [],
  )

  const handleChange = useCallback(
    (values: any, option: PickerOptionObject, column: PickerOptionObject) => {
      setValue(values)
      onChange?.(values, option, column)
    },
    [onChange, setValue],
  )

  const stopMomentum = useCallback(
    () =>
      // biome-ignore lint/complexity/noForEach: every mounted column must stop independently
      getColumnRefs()
        .filter((columnRef) => columnRef.current)
        .forEach((columnRef) => columnRef.current.stopMomentum()),
    [getColumnRefs],
  )

  const getSelectedState = useCallback((): PickerSelectedState => {
    const selectedOptions = valueOptionsRef.current.filter((option): option is PickerOptionObject =>
      Boolean(option && !option.disabled),
    )
    return {
      selectedValues: selectedOptions.map(({ value: selectedValue }) => selectedValue!),
      selectedOptions: selectedOptions.map((option) => ({ ...option })),
      selectedIndexes: selectedOptions.map(({ index }) => index),
    }
  }, [])

  const handleAction = useCallback(
    (action?: PickerProps["onConfirm"]) => () => {
      stopMomentum()
      const { selectedValues, selectedOptions } = getSelectedState()
      action?.(selectedValues, selectedOptions)
    },
    [getSelectedState, stopMomentum],
  )

  const getSelectedOptions = useCallback(
    () => getSelectedState().selectedOptions,
    [getSelectedState],
  )

  useImperativeHandle(
    ref,
    () => ({
      confirm: handleAction(onConfirm),
      getSelectedOptions,
    }),
    [getSelectedOptions, handleAction, onConfirm],
  )

  const getValueOptions = useCallback(() => valueOptionsRef.current, [])

  const isMultiValue = useCallback(() => multiValueRef.current, [multiValueRef])

  const handleClickOption = useCallback(
    (currentOption: PickerOptionObject, unverifiedColumn: PickerOptionObject) => {
      const column = validPickerColumn(unverifiedColumn)
      /* istanbul ignore next -- columns rendered by Picker always carry a valid numeric index */
      if (!column) return
      onClickOption?.({
        ...getSelectedState(),
        columnIndex: column.index,
        currentOption: { ...currentOption },
      })
    },
    [getSelectedState, onClickOption],
  )

  const handleScrollInto = useCallback(
    (currentOption: PickerOptionObject, unverifiedColumn: PickerOptionObject) => {
      const column = validPickerColumn(unverifiedColumn)
      /* istanbul ignore next -- columns rendered by Picker always carry a valid numeric index */
      if (!column) return
      onScrollInto?.({
        columnIndex: column.index,
        currentOption: { ...currentOption },
      })
    },
    [onScrollInto],
  )

  return (
    <PickerContext.Provider
      value={{
        readonly,
        loading,
        siblingCount,
        optionHeight,
        swipeDuration,
        empty,
        renderEmpty,
        values,
        getValueOptions,
        isMultiValue,
        setValueOptions,
        setColumnRefs,
        onChange: handleChange,
        onClickOption: handleClickOption,
        onScrollInto: handleScrollInto,
        onConfirm: handleAction(onConfirm),
        onCancel: handleAction(onCancel),
      }}
    >
      <View className={classNames(prefixClassname("picker"), className)} {...restProps}>
        {loading && <Loading className={prefixClassname("picker__loading")} />}
        {children}
      </View>
    </PickerContext.Provider>
  )
}

const Picker = forwardRef(PickerElement)

export default Picker
