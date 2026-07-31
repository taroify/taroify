import { type ITouchEvent, View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as React from "react"
import { type ReactElement, type ReactNode, useContext } from "react"
import { prefixClassname } from "../styles"
import CascaderContext from "./cascader.context"

interface CascaderHeaderProps extends ViewProps {
  children?: ReactNode
}

function CascaderHeader(props: CascaderHeaderProps) {
  const { className, children, ...restProps } = props
  const { closeable, closeIcon, onClose } = useContext(CascaderContext)
  let closeNode: ReactNode

  if (closeable && React.isValidElement(closeIcon)) {
    const icon = closeIcon as ReactElement<{
      className?: string
      onClick?(event: ITouchEvent): void
    }>
    closeNode = React.cloneElement(icon, {
      className: classNames(icon.props.className, prefixClassname("cascader__close-icon")),
      onClick: (event: ITouchEvent) => {
        icon.props.onClick?.(event)
        onClose?.(event)
      },
    })
  } else if (closeable) {
    closeNode = (
      <View className={prefixClassname("cascader__close-icon")} onClick={onClose}>
        {closeIcon}
      </View>
    )
  }

  return (
    <View className={classNames(prefixClassname("cascader__header"), className)} {...restProps}>
      {children}
      {closeNode}
    </View>
  )
}

export default CascaderHeader
