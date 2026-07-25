import { Image, View } from "@tarojs/components"
import classNames from "classnames"
import * as React from "react"
import {
  ICON_PRESET_COLORS,
  ICON_PRESET_SIZES,
  ICON_TYPE,
  type IconColor,
  type IconProps,
  type IconSize,
} from "../shared"
import { addUnitPx } from "../utils/unit"

interface VanIconProps extends IconProps {
  name?: string
  classPrefix?: string
}

export default function VanIcon({
  className,
  style,
  name,
  src,
  size = "inherit",
  classPrefix = "van-icon",
  color = "inherit",
  children,
  ...restProps
}: VanIconProps) {
  const image = Boolean(src)
  const presetColor = ICON_PRESET_COLORS.includes(color as IconColor)
  const presetSize = ICON_PRESET_SIZES.includes(size as IconSize)
  const colorClass = presetColor && color !== "inherit" ? `taroify-icon--${color}` : undefined
  const sizeClass = presetSize && size !== "inherit" ? `taroify-icon--${size}` : undefined

  return (
    <View
      className={classNames(
        classPrefix,
        !image && name && `${classPrefix}-${name}`,
        "taroify-icon",
        colorClass,
        sizeClass,
        className,
      )}
      style={{
        color: presetColor ? "" : color,
        fontSize: presetSize ? "" : addUnitPx(size),
        ...style,
      }}
      {...restProps}
    >
      {children}
      {src && <Image className="taroify-icon__image" src={src} mode="aspectFit" />}
    </View>
  )
}

export function createVanIconComponent(name: string) {
  function VanIconWrapper(props: IconProps) {
    return <VanIcon name={name} {...props} />
  }

  // @ts-ignore
  VanIconWrapper[ICON_TYPE] = ICON_TYPE
  return VanIconWrapper
}
