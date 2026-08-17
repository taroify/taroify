import { View } from "@tarojs/components"
import * as React from "react"
import type { ReactNode } from "react"
import { prefixClassname } from "../styles"

export interface PickerTitleProps {
  className?: string
  children?: ReactNode
}

export default function PickerTitle(props: PickerTitleProps) {
  const { children } = props
  return <View className={prefixClassname("picker__title")} children={children} />
}
