import { useUncontrolled } from "@taroify/hooks"
import { View } from "@tarojs/components"
import type { BaseEventOrig } from "@tarojs/components/types/common"
import type { InputProps as TaroInputProps } from "@tarojs/components/types/Input"
import type { TextareaProps as TaroTextareaProps } from "@tarojs/components/types/Textarea"
import classNames from "classnames"
import * as _ from "lodash"
import * as React from "react"
import { prefixClassname } from "../styles"
import type { InputFormatter, InputFormatTrigger } from "../input/input.shared"
import NativeTextarea, { type NativeTextareaProps } from "./native-textarea"
import { getStringLength, truncateString } from "./textarea.shared"

export interface TextareaProps extends NativeTextareaProps {
  limit?: number | boolean
  readonly?: boolean
  formatter?: InputFormatter
  formatTrigger?: InputFormatTrigger

  onChange?(event: BaseEventOrig<TaroInputProps.inputEventDetail>): void
}

function Textarea(props: TextareaProps) {
  const {
    className,
    placeholderClass,
    value: valueProp,
    readonly,
    disabled,
    limit,
    maxlength: maxlengthProp,
    formatter,
    formatTrigger = "onChange",
    onInput,
    onChange,
    onBlur,
    ...restProps
  } = props
  const maxlength = _.isNumber(limit) ? limit : maxlengthProp
  const { value, setValue } = useUncontrolled({ value: valueProp })

  const formatValue = (inputValue: string, trigger: InputFormatTrigger) => {
    if (!formatter || formatTrigger !== trigger) {
      return inputValue
    }

    const formattedValue = formatter(inputValue)
    return _.isNumber(maxlength) && maxlength >= 0
      ? truncateString(formattedValue, maxlength)
      : formattedValue
  }

  const handleInput = (event: BaseEventOrig<TaroInputProps.inputEventDetail>) => {
    const inputValue = event.detail.value
    const limitedValue =
      _.isNumber(limit) && limit >= 0 ? truncateString(inputValue, limit) : inputValue
    const nextValue = formatValue(limitedValue, "onChange")
    const nextEvent =
      nextValue === inputValue
        ? event
        : Object.assign({}, event, {
            detail: {
              ...event.detail,
              value: nextValue,
            },
          })

    setValue(nextValue)
    onInput?.(nextEvent)
    onChange?.(nextEvent)
  }

  const handleBlur = (event: BaseEventOrig<TaroTextareaProps.onBlurEventDetail>) => {
    const inputValue = event.detail.value
    const nextValue = formatValue(inputValue, "onBlur")
    const nextEvent =
      nextValue === inputValue
        ? event
        : Object.assign({}, event, {
            detail: {
              ...event.detail,
              value: nextValue,
            },
          })

    if (nextValue !== inputValue) {
      setValue(nextValue)
      onChange?.(nextEvent as unknown as BaseEventOrig<TaroInputProps.inputEventDetail>)
    }
    onBlur?.(nextEvent)
  }

  return (
    <View className={prefixClassname("textarea__wrapper")}>
      <NativeTextarea
        className={classNames(
          prefixClassname("textarea"),
          {
            [prefixClassname("textarea--readonly")]: readonly,
          },
          className,
        )}
        placeholderClass={classNames(
          prefixClassname("textarea__placeholder"),
          {
            [prefixClassname("textarea__placeholder--readonly")]: readonly,
          },
          placeholderClass,
        )}
        disabled={readonly || disabled}
        readonly={readonly}
        maxlength={maxlength}
        value={value}
        onInput={handleInput}
        onBlur={handleBlur}
        {...restProps}
      />
      {limit && (
        <View className={prefixClassname("textarea__limit")}>
          {getStringLength(value)}/{maxlength}
        </View>
      )}
    </View>
  )
}

export default Textarea
