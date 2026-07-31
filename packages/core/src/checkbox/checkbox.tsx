import { useUncontrolled } from "@taroify/hooks"
import { Success } from "@taroify/icons"
import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as _ from "lodash"
// biome-ignore lint/correctness/noUnusedImports: The classic JSX transform requires React in scope.
import * as React from "react"
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"
import { prefixClassname } from "../styles"
import { addUnitPx } from "../utils/format/unit"
import CheckboxGroupContext, { type CheckboxGroupItem } from "./checkbox-group.context"
import type { CheckboxShape } from "./checkbox.shared"

export interface CheckboxInstance {
  toggle(checked?: boolean): void
}

export interface CheckboxProps extends ViewProps {
  name?: any
  defaultChecked?: boolean
  checked?: boolean
  disabled?: boolean
  shape?: CheckboxShape
  icon?: ReactNode
  size?: number
  children?: ReactNode

  onChange?(checked: boolean): void
}

const Checkbox = forwardRef<CheckboxInstance, CheckboxProps>((props, ref) => {
  const {
    className,
    name,
    defaultChecked,
    checked: checkedProp,
    disabled: disabledProp,
    shape = "round",
    icon = <Success />,
    size,
    children,
    onChange: onChangeProp,
    ...restProps
  } = props

  const {
    value: names,
    max: namesMax = 0,
    direction,
    onChange: onNamesChange,
    disabled: disabledGroup,
    register,
  } = useContext(CheckboxGroupContext)

  const {
    value: checked,
    getValue,
    setValue,
  } = useUncontrolled({
    value: checkedProp ?? names?.includes(name),
    defaultValue: defaultChecked,
    onChange: onChangeProp,
  })

  const disabled = disabledProp ?? disabledGroup

  const groupItemRef = useRef<CheckboxGroupItem>({ name, disabled })
  groupItemRef.current.name = name
  groupItemRef.current.disabled = disabled

  useEffect(() => register?.(groupItemRef.current), [register])

  const toggle = useCallback(
    (newChecked = !getValue()) => {
      setValue(newChecked)

      if (name) {
        if (newChecked && !names?.includes(name)) {
          if (namesMax === 0 || _.size(names) < namesMax) {
            onNamesChange?.([..._.toArray(names), name])
          }
        } else if (!newChecked && names?.includes(name)) {
          onNamesChange?.(names.filter((aName) => aName !== name))
        }
      }
    },
    [getValue, name, names, namesMax, onNamesChange, setValue],
  )

  useImperativeHandle(ref, () => ({ toggle }), [toggle])

  function onClick() {
    if (disabled) {
      return
    }

    toggle()
  }

  return (
    <View
      className={classNames(
        prefixClassname("checkbox"),
        {
          [prefixClassname("checkbox--disabled")]: disabled,
          [prefixClassname("checkbox--horizontal")]: direction === "horizontal",
          [prefixClassname("checkbox--vertical")]: direction === "vertical",
        },
        className,
      )}
      onClick={onClick}
      {...restProps}
    >
      {shape === "button" ? (
        <View
          className={classNames(prefixClassname("checkbox__button"), {
            [prefixClassname("checkbox__button--checked")]: checked,
            [prefixClassname("checkbox__button--disabled")]: disabled,
          })}
          children={children}
        />
      ) : (
        <>
          <View
            className={classNames(
              prefixClassname("checkbox__icon"),
              prefixClassname(`checkbox__icon--${shape}`),
              {
                [prefixClassname("checkbox__icon--disabled")]: disabled,
                [prefixClassname("checkbox__icon--checked")]: checked,
              },
            )}
            style={{ fontSize: size ? addUnitPx(size) : "" }}
            children={icon}
          />
          {children && (
            <View
              className={classNames(prefixClassname("checkbox__label"), {
                [prefixClassname("checkbox__label--disabled")]: disabled,
              })}
              children={children}
            />
          )}
        </>
      )}
    </View>
  )
})

export default Checkbox
