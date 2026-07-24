import { View } from "@tarojs/components"
import classNames from "classnames"
import * as React from "react"
import { type ComponentType, useContext, useMemo } from "react"
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp } from "@taroify/icons"
import { prefixClassname } from "../styles"
import CellGroupContext from "./cell-group.context"
import type { CellBaseProps, ArrowDirection } from "./cell.shared"

export const iconMap: Record<ArrowDirection, any> = {
  right: ArrowRight,
  left: ArrowLeft,
  up: ArrowUp,
  down: ArrowDown,
}

type CellBaseComponentProps = CellBaseProps & {
  component?: ComponentType<any>
}

function CellBase(props: CellBaseComponentProps) {
  const {
    component,
    className,
    size = "normal",
    align,
    clickable: clickableProp,
    required = false,
    bordered = true,
    isLink = false,
    icon,
    arrowDirection = "right",
    rightIcon: rightIconProps,
    extra,
    role,
    ariaRole,
    hoverClass,
    children,
    ...restProps
  } = props

  const Component = (component ?? View) as ComponentType<any>
  const { clickable } = useContext(CellGroupContext)
  const cellClickable = clickableProp ?? (isLink || clickable)

  const leftIcon = useMemo(() => {
    if (icon) {
      return <View className={prefixClassname("cell__icon")}>{icon}</View>
    }
    return null
  }, [icon])

  const rightIcon = useMemo(() => {
    if (rightIconProps) {
      return <View className={prefixClassname("cell__right-icon")}>{rightIconProps}</View>
    }
    if (isLink && iconMap[arrowDirection]) {
      const Icon = iconMap[arrowDirection]
      return (
        <View className={prefixClassname("cell__right-icon")}>
          <Icon />
        </View>
      )
    }
    return null
  }, [rightIconProps, isLink, arrowDirection])

  const hasExtra = React.Children.toArray(extra).length > 0

  return (
    <Component
      className={classNames(
        prefixClassname("cell"),
        {
          [prefixClassname("cell--start")]: align === "start",
          [prefixClassname("cell--center")]: align === "center",
          [prefixClassname("cell--end")]: align === "end",
          [prefixClassname("cell--large")]: size === "large",
          [prefixClassname("cell--clickable")]: cellClickable,
          [prefixClassname("cell--required")]: required,
          [prefixClassname("cell--borderless")]: !bordered,
        },
        className,
      )}
      {...restProps}
      role={role ?? (cellClickable ? "button" : undefined)}
      ariaRole={ariaRole ?? (cellClickable ? "button" : undefined)}
      hoverClass={hoverClass ?? (cellClickable ? prefixClassname("cell--active") : "none")}
    >
      {leftIcon}
      {children}
      {rightIcon}
      {hasExtra && <View className={prefixClassname("cell__extra")}>{extra}</View>}
    </Component>
  )
}

export default CellBase
