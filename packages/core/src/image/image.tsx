import { Image as TaroImage, View } from "@tarojs/components"
import type { ImageProps as TaroImageProps } from "@tarojs/components/types/Image"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as _ from "lodash"
import * as React from "react"
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { pxTransform } from "@tarojs/taro"
import { prefixClassname } from "../styles"
import { getLogger } from "../utils/logger"
import { useMemoizedFn } from "../hooks"
import mergeStyle from "../utils/merge-style"
import ImagePlaceholder from "./image-placeholder"
import type { ImageMode, ImageShape } from "./image.shared"

const { warn } = getLogger("Image")

function useImageMode(mode: ImageMode): TaroImageProps["mode"] {
  return useMemo(() => {
    if (mode === "topLeft") {
      return "top left"
    }
    if (mode === "topRight") {
      return "top right"
    }
    if (mode === "bottomLeft") {
      return "bottom left"
    }
    if (mode === "bottomRight") {
      return "bottom right"
    }
    return mode
  }, [mode])
}

function useImageShape(shape?: ImageShape, round?: boolean) {
  let shapeResult = shape
  if (_.isBoolean(round) && round) {
    shapeResult = "circle"
    warn(`Use the shape="${shapeResult}" prop instead of the round prop`)
    if (round) {
      return shapeResult
    }
  }
  return shapeResult
}

type NativeImageProps = Omit<
  TaroImageProps,
  keyof ViewProps | "src" | "mode" | "onLoad" | "onError"
>

export type ImageLoadEvent = Parameters<NonNullable<TaroImageProps["onLoad"]>>[0]
export type ImageErrorEvent = Parameters<NonNullable<TaroImageProps["onError"]>>[0]

export interface ImageProps extends ViewProps, NativeImageProps {
  wrapperClassName?: string
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
  mode?: ImageMode
  /** @deprecated */
  round?: boolean
  shape?: ImageShape
  radius?: string | number
  lazyLoad?: boolean
  placeholder?: boolean | ReactNode
  fallback?: boolean | ReactNode

  onLoad?(event: ImageLoadEvent): void

  onError?(event: ImageErrorEvent): void
}

export default function Image(props: ImageProps) {
  const {
    className,
    wrapperClassName,
    src,
    alt,
    width: widthProp,
    height: heightProp,
    mode = "scaleToFill",
    round,
    shape: shapeProp,
    radius,
    lazyLoad = false,
    placeholder = false,
    fallback = false,
    onLoad,
    onError,
    imgProps,
    style: styleProp,
    ...restProps
  } = props
  const taroMode = useImageMode(mode)
  const shape = useImageShape(shapeProp, round)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const isLoadedRef = useRef(false)

  const [viewStyle, imgStyle] = useMemo(() => {
    const width = typeof widthProp === "number" ? pxTransform(widthProp) : widthProp
    const height = typeof heightProp === "number" ? pxTransform(heightProp) : heightProp
    const imgStyle = mergeStyle(styleProp, {})
    imgStyle.width = width ?? imgStyle.width
    imgStyle.height = height ?? imgStyle.height

    if (radius !== undefined) {
      imgStyle.borderRadius = typeof radius === "number" ? pxTransform(radius) : radius
    } else if (shape === "circle") {
      imgStyle.borderRadius = "50%"
    } else if (shape === "rounded") {
      imgStyle.borderRadius = "var(--border-radius-md)"
    } else if (shape === "square") {
      imgStyle.borderRadius = 0
    }

    const hasRadius = imgStyle.borderRadius !== undefined

    return [
      {
        width: imgStyle.width ?? "100%",
        height: imgStyle.height ?? "100%",
        position: "relative",
        borderRadius: imgStyle.borderRadius,
        overflow: hasRadius ? "hidden" : undefined,
      },
      imgStyle,
    ] as const
  }, [styleProp, widthProp, heightProp, radius, shape])

  const handleLoad = useMemoizedFn((event: ImageLoadEvent) => {
    if (!isLoadedRef.current) {
      isLoadedRef.current = true
      onLoad?.(event)
      setLoading(false)
      setFailed(false)
    }
  })
  const handleError = useMemoizedFn((event: ImageErrorEvent) => {
    onError?.(event)
    setLoading(false)
    setFailed(true)
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: src changes must reset async image state
  useEffect(() => {
    isLoadedRef.current = false
    setFailed(false)
    setLoading(true)
  }, [src])

  return (
    <View style={viewStyle} className={wrapperClassName}>
      {!failed && src && (
        <TaroImage
          src={src}
          mode={taroMode}
          lazyLoad={lazyLoad}
          className={classNames(
            prefixClassname("image"),
            {
              [prefixClassname("image--square")]: shape === "square",
              [prefixClassname("image--rounded")]: shape === "rounded",
              [prefixClassname("image--circle")]: shape === "circle",
              [prefixClassname("image--loading")]: loading,
            },
            className,
          )}
          style={imgStyle}
          imgProps={{ ...imgProps, alt: alt ?? imgProps?.alt }}
          onLoad={handleLoad}
          onError={handleError}
          {...restProps}
        />
      )}
      {loading && placeholder && <ImagePlaceholder prefix="placeholder" children={placeholder} />}
      {failed && fallback && <ImagePlaceholder prefix="fallback" children={fallback} />}
    </View>
  )
}
