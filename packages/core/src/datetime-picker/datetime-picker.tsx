import { useUncontrolled } from "@taroify/hooks"
// biome-ignore lint/correctness/noUnusedImports: the classic JSX runtime requires React in scope
import * as React from "react"
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type ForwardedRef,
  type ReactNode,
} from "react"
import Picker, { type PickerInstance, type PickerProps } from "../picker"
import type { DatetimePickerColumnType, DatetimePickerType } from "./datetime-picker.shared"
import useDatetimePicker from "./use-datetime-picker"

export interface DatetimePickerInstance {
  confirm(): void
  getSelectedDate(): Date
}

export interface DatetimePickerProps
  extends Omit<
    PickerProps,
    | "columns"
    | "columnsFieldNames"
    | "title"
    | "confirmText"
    | "cancelText"
    | "optionHeight"
    | "defaultValue"
    | "value"
    | "onChange"
    | "onConfirm"
    | "onCancel"
  > {
  type?: DatetimePickerType
  fields?: DatetimePickerColumnType[]
  columnsType?: DatetimePickerColumnType[]
  defaultValue?: Date
  value?: Date
  min?: Date
  max?: Date

  filter?(type: DatetimePickerColumnType, values: string[]): string[]

  formatter?(type: DatetimePickerColumnType, value: string): string

  onChange?(date: Date): void

  onConfirm?(date: Date): void

  onCancel?(date: Date): void
}

function DatetimePickerElement(
  props: DatetimePickerProps,
  ref: ForwardedRef<DatetimePickerInstance>,
) {
  const {
    className,
    readonly,
    loading,
    type,
    fields,
    columnsType,
    filter,
    formatter,
    min,
    max,
    defaultValue: defaultValueProp,
    value: valueProp,
    siblingCount,
    children,
    onChange: onChangeProp,
    onConfirm,
    onCancel,
    ...restProps
  } = props

  const { value: dateValue, setValue: setDateValue } = useUncontrolled({
    value: valueProp,
    onChange: onChangeProp,
  })

  const { defaultValue, value, selectedDate, columns, toDate } = useDatetimePicker({
    defaultValue: defaultValueProp,
    value: dateValue,
    min,
    max,
    type,
    fields,
    columnsType,
    filter,
    formatter,
  })

  const pickerRef = useRef<PickerInstance>(null)

  const getSelectedDate = useCallback(() => {
    const selectedValues = pickerRef.current
      ?.getSelectedOptions()
      .map(({ value: selectedValue }) => selectedValue)
      .filter((selectedValue): selectedValue is string => typeof selectedValue === "string")
    if (selectedValues?.length) {
      return toDate(selectedValues)
    }
    return new Date(selectedDate.getTime())
  }, [selectedDate, toDate])

  useImperativeHandle(
    ref,
    () => ({
      confirm() {
        pickerRef.current?.confirm()
      },
      getSelectedDate,
    }),
    [getSelectedDate],
  )

  return (
    <Picker
      ref={pickerRef}
      className={className}
      readonly={readonly}
      loading={loading}
      siblingCount={siblingCount}
      defaultValue={defaultValue}
      value={value}
      onChange={(aValue) => setDateValue(toDate(aValue as string[]))}
      onConfirm={(aValue) => onConfirm?.(toDate(aValue as string[]))}
      onCancel={(aValue) => onCancel?.(toDate(aValue as string[]))}
      {...restProps}
    >
      {children}
      <Picker.Columns children={columns as ReactNode} />
    </Picker>
  )
}

const DatetimePicker = forwardRef(DatetimePickerElement)

export default DatetimePicker
