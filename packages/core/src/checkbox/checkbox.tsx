import { useUncontrolled } from "@taroify/hooks"
import { Minus, Success } from "@taroify/icons"
import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as _ from "lodash"
// biome-ignore lint/correctness/noUnusedImports: The classic JSX transform requires React in scope.
import * as React from "react"
import {
  type CSSProperties,
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
import type { CheckboxLabelPosition, CheckboxShape } from "./checkbox.shared"

export interface CheckboxInstance {
  toggle(checked?: boolean): void
}

export interface CheckboxProps extends ViewProps {
  name?: any
  defaultChecked?: boolean
  checked?: boolean
  disabled?: boolean
  shape?: CheckboxShape
  labelPosition?: CheckboxLabelPosition
  labelDisabled?: boolean
  icon?: ReactNode
  size?: number | string
  checkedColor?: string
  bindGroup?: boolean
  indeterminate?: boolean
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
    shape: shapeProp,
    labelPosition = "right",
    labelDisabled = false,
    icon,
    size,
    checkedColor: checkedColorProp,
    bindGroup = true,
    indeterminate = false,
    children,
    onChange: onChangeProp,
    ...restProps
  } = props

  const {
    value: names,
    max: namesMax = 0,
    direction: directionGroup,
    onChange: onNamesChange,
    disabled: disabledGroup,
    shape: shapeGroup,
    checkedColor: checkedColorGroup,
    register,
  } = useContext(CheckboxGroupContext)

  const grouped = bindGroup && register !== undefined
  const direction = grouped ? directionGroup : undefined
  const shape = shapeProp ?? (grouped ? shapeGroup : undefined) ?? "round"
  const checkedColor = checkedColorProp ?? (grouped ? checkedColorGroup : undefined)

  const {
    value: checked,
    getValue,
    setValue,
  } = useUncontrolled({
    value: checkedProp ?? (grouped ? names?.includes(name) : undefined),
    defaultValue: defaultChecked,
    onChange: onChangeProp,
  })

  const disabled = disabledProp ?? (grouped ? disabledGroup : undefined)

  const groupItemRef = useRef<CheckboxGroupItem>({ name, disabled })
  groupItemRef.current.name = name
  groupItemRef.current.disabled = disabled

  useEffect(() => {
    if (grouped) {
      return register?.(groupItemRef.current)
    }
  }, [grouped, register])

  const toggle = useCallback(
    (newChecked = !getValue()) => {
      setValue(newChecked)

      if (grouped && name) {
        if (newChecked && !names?.includes(name)) {
          if (namesMax === 0 || _.size(names) < namesMax) {
            onNamesChange?.([..._.toArray(names), name])
          }
        } else if (!newChecked && names?.includes(name)) {
          onNamesChange?.(names.filter((aName) => aName !== name))
        }
      }
    },
    [getValue, grouped, name, names, namesMax, onNamesChange, setValue],
  )

  useImperativeHandle(ref, () => ({ toggle }), [toggle])

  function onClick() {
    if (disabled || labelDisabled) {
      return
    }

    toggle()
  }

  function onIconClick() {
    if (disabled) {
      return
    }

    toggle()
  }

  const iconStyle = {
    fontSize: size ? addUnitPx(size) : "",
    ...(checkedColor
      ? {
          "--checkbox-checked-icon-border-color": checkedColor,
          "--checkbox-checked-icon-background-color": checkedColor,
        }
      : {}),
  } as CSSProperties

  const iconNode = (
    <View
      className={classNames(
        prefixClassname("checkbox__icon"),
        prefixClassname(`checkbox__icon--${shape}`),
        {
          [prefixClassname("checkbox__icon--disabled")]: disabled,
          [prefixClassname("checkbox__icon--checked")]: checked,
          [prefixClassname("checkbox__icon--indeterminate")]: indeterminate,
        },
      )}
      style={iconStyle}
      onClick={labelDisabled ? onIconClick : undefined}
      children={icon === undefined ? indeterminate ? <Minus /> : <Success /> : icon}
    />
  )

  const labelNode = children && (
    <View
      className={classNames(prefixClassname("checkbox__label"), {
        [prefixClassname("checkbox__label--left")]: labelPosition === "left",
        [prefixClassname("checkbox__label--disabled")]: disabled,
      })}
      children={children}
    />
  )

  return (
    <View
      className={classNames(
        prefixClassname("checkbox"),
        {
          [prefixClassname("checkbox--disabled")]: disabled,
          [prefixClassname("checkbox--label-disabled")]: labelDisabled,
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
          {labelPosition === "left" && labelNode}
          {iconNode}
          {labelPosition === "right" && labelNode}
        </>
      )}
    </View>
  )
})

export default Checkbox
