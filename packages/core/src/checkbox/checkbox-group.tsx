import { useUncontrolled } from "@taroify/hooks"
import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
// biome-ignore lint/correctness/noUnusedImports: The classic JSX transform requires React in scope.
import * as React from "react"
import {
  forwardRef,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react"
import { prefixClassname } from "../styles"
import CheckboxGroupContext, { type CheckboxGroupItem } from "./checkbox-group.context"
import type { CheckboxGroupDirection } from "./checkbox-group.shared"
import type { CheckboxShape } from "./checkbox.shared"

export interface CheckboxGroupToggleAllOptions {
  checked?: boolean
  skipDisabled?: boolean
}

export type CheckboxGroupToggleAll = boolean | CheckboxGroupToggleAllOptions

export interface CheckboxGroupInstance {
  toggleAll(options?: CheckboxGroupToggleAll): void
}

export interface CheckboxGroupProps<T = any> extends ViewProps {
  defaultValue?: T[]
  value?: T[]
  disabled?: boolean
  max?: number
  direction?: CheckboxGroupDirection
  shape?: CheckboxShape
  checkedColor?: string
  children?: ReactNode

  onChange?(value: T[]): void
}

type CheckboxGroupComponent = <T = any>(
  props: CheckboxGroupProps<T> & RefAttributes<CheckboxGroupInstance>,
) => ReactElement | null

const CheckboxGroup = forwardRef<CheckboxGroupInstance, CheckboxGroupProps<any>>((props, ref) => {
  const {
    defaultValue,
    value: valueProp,
    disabled,
    max,
    direction = "vertical",
    shape,
    checkedColor,
    children,
    onChange: onChangeProp,
    ...restProps
  } = props

  const { value, getValue, setValue } = useUncontrolled({
    value: valueProp,
    defaultValue,
    onChange: onChangeProp,
  })

  const itemsRef = useRef(new Set<CheckboxGroupItem>())

  const register = useCallback((item: CheckboxGroupItem) => {
    itemsRef.current.add(item)
    return () => {
      itemsRef.current.delete(item)
    }
  }, [])

  const toggleAll = useCallback(
    (options: CheckboxGroupToggleAll = {}) => {
      const { checked, skipDisabled } =
        typeof options === "boolean" ? { checked: options } : options
      const currentValue = getValue() ?? []
      const newValue = Array.from(itemsRef.current)
        .filter((item) => {
          if (item.disabled && skipDisabled) {
            return currentValue.includes(item.name)
          }
          return checked ?? !currentValue.includes(item.name)
        })
        .map((item) => item.name)

      setValue(newValue)
    },
    [getValue, setValue],
  )

  useImperativeHandle(ref, () => ({ toggleAll }), [toggleAll])

  return (
    <CheckboxGroupContext.Provider
      value={{
        value,
        max,
        disabled,
        direction,
        shape,
        checkedColor,
        onChange: setValue,
        register,
      }}
    >
      <View
        className={classNames(prefixClassname("checkbox-group"), {
          [prefixClassname("checkbox-group--horizontal")]: direction === "horizontal",
          [prefixClassname("checkbox-group--vertical")]: direction === "vertical",
        })}
        children={children}
        {...restProps}
      />
    </CheckboxGroupContext.Provider>
  )
}) as CheckboxGroupComponent

export default CheckboxGroup
