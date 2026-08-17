import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as React from "react"
import { type CSSProperties, isValidElement, type ReactNode, useMemo, useContext } from "react"
import { prefixClassname } from "../styles"
import { isTextElement } from "../utils/validate"
import PickerContext from "./picker.context"
import type { PickerValue } from "./picker.shared"

export interface PickerOptionProps extends ViewProps {
  className?: string
  style?: CSSProperties
  value?: PickerValue
  label?: ReactNode
  disabled?: boolean
  children?: ReactNode
}

export default function PickerOption(props: PickerOptionProps) {
  const {
    className,
    style,
    disabled,
    // @ts-ignore
    index,
    value,
    label,
    children: childrenProp,
    ...restProps
  } = props
  const { optionHeight } = useContext(PickerContext)

  const children = useMemo(() => {
    if (isValidElement(childrenProp)) {
      return childrenProp
    }
    if (isTextElement(childrenProp)) {
      return <View className={prefixClassname("ellipsis")}>{childrenProp}</View>
    }
    if (isValidElement(label)) {
      return label
    }
    if (isTextElement(label)) {
      return <View className={prefixClassname("ellipsis")}>{label}</View>
    }
  }, [childrenProp, label])

  return (
    <View
      className={classNames(
        prefixClassname("picker-option"),
        {
          [prefixClassname("picker-option--disabled")]: disabled,
        },
        className,
      )}
      style={{
        ...style,
        height: `${optionHeight}px`,
      }}
      children={children}
      {...restProps}
    />
  )
}
