import { Photo, PhotoFail } from "@taroify/icons"
import { View } from "@tarojs/components"
import classNames from "classnames"
import * as _ from "lodash"
import * as React from "react"
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react"
import { prefixClassname } from "../styles"

interface ImagePlaceholderProps {
  prefix: string
  children?: ReactNode
}

export default function ImagePlaceholder(props: ImagePlaceholderProps): JSX.Element {
  const { prefix = "placeholder", children } = props
  const content = children === true ? prefix === "fallback" ? <PhotoFail /> : <Photo /> : children

  // Icon Element
  if (isValidElement(content)) {
    const element = content as ReactElement<{ className?: string }>
    return cloneElement(element, {
      className: classNames(
        prefixClassname(`image__${prefix}`),
        prefixClassname(`image__${prefix}-icon`),
        element.props.className,
      ),
    })
  }
  // Text String
  if (_.isString(content) || _.isNumber(content)) {
    return <View className={prefixClassname(`image__${prefix}`)} children={content} />
  }
  return <></>
}
