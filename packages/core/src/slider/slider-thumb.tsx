import { type ITouchEvent, View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as React from "react"
import type { KeyboardEvent, ReactNode } from "react"
import { prefixClassname } from "../styles"
import { inBrowser } from "../utils/base"
import { stopPropagation } from "../utils/dom/event"
import { getSizeStyle } from "../utils/format/unit"
import SliderContext from "./slider.context"
import { getSliderBounds, type SliderThumbIndex } from "./slider.shared"

const isH5 = inBrowser || process.env.TARO_ENV === "h5"

export interface SliderThumbRenderProps {
  value: number
  dragging: boolean
  index?: SliderThumbIndex
}

export interface SliderThumbProps extends Omit<ViewProps, "children"> {
  size?: number
  children?: ReactNode | ((props: SliderThumbRenderProps) => ReactNode)
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-valuetext"?: string
}

export interface InternalSliderThumbProps extends SliderThumbProps {
  index?: SliderThumbIndex
}

function SliderThumb(props: SliderThumbProps) {
  const {
    className,
    size,
    index,
    children,
    ariaLabel,
    "aria-label": ariaLabelProp,
    "aria-labelledby": ariaLabelledBy,
    "aria-valuetext": ariaValueText,
    ...restProps
  } = props as InternalSliderThumbProps
  const slider = React.useContext(SliderContext)
  const thumbIndex = index ?? 0
  const blocked = slider.disabled || slider.readonly
  const bounds = getSliderBounds(slider.value, thumbIndex, slider.min, slider.max)
  const position = slider.reverse ? (index === 0 ? 1 : 0) : index
  const content =
    typeof children === "function"
      ? children({ value: bounds.value, dragging: slider.activeThumb === thumbIndex, index })
      : (children ?? (
          <View
            className={classNames(prefixClassname("slider__thumb"), className)}
            {...restProps}
          />
        ))

  const accessibility = isH5
    ? {
        role: "slider",
        tabIndex: slider.disabled ? -1 : 0,
        "aria-label":
          ariaLabelProp ??
          ariaLabel ??
          (index === undefined ? (slider.ariaLabel ?? "滑块") : index === 0 ? "最小值" : "最大值"),
        "aria-labelledby": ariaLabelledBy,
        "aria-valuetext": ariaValueText,
        "aria-valuenow": bounds.value,
        "aria-valuemin": bounds.min,
        "aria-valuemax": bounds.max,
        "aria-orientation": slider.orientation,
        "aria-disabled": slider.disabled || undefined,
        "aria-readonly": slider.readonly || undefined,
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => slider.onKeyDown?.(event, thumbIndex),
      }
    : {}

  return (
    <View
      className={classNames({
        [prefixClassname("slider__thumb-wrapper")]: position === undefined,
        [prefixClassname("slider__thumb-wrapper-left")]: position === 0,
        [prefixClassname("slider__thumb-wrapper-right")]: position === 1,
      })}
      style={getSizeStyle(size)}
      catchMove={!blocked}
      onTouchStart={(event) => slider.onTouchStart?.(event as ITouchEvent, thumbIndex)}
      onTouchMove={(event) => slider.onTouchMove?.(event as ITouchEvent)}
      onTouchEnd={(event) => slider.onTouchEnd?.(event as ITouchEvent)}
      onTouchCancel={(event) => slider.onTouchEnd?.(event as ITouchEvent)}
      onClick={stopPropagation}
      {...accessibility}
    >
      {content}
    </View>
  )
}

export default SliderThumb
