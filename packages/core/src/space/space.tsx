import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import { useMemo } from "react"
// biome-ignore lint/correctness/noUnusedImports: JSX is compiled with the classic React runtime.
import * as React from "react"
import { pxTransform } from "@tarojs/taro"
import { Children, type CSSProperties, type ReactNode } from "react"
import Flex from "../flex"
import { prefixClassname } from "../styles"
import type {
  SpaceAlign,
  SpaceDirection,
  SpaceJustify,
  SpaceSize,
  SpaceSizePreset,
  SpaceSizeValue,
  SpaceWrap,
} from "./space.shared"

export interface SpaceProps extends ViewProps {
  style?: CSSProperties
  direction?: SpaceDirection
  size?: SpaceSize
  align?: SpaceAlign
  justify?: SpaceJustify
  wrap?: SpaceWrap
  children?: ReactNode
  fill?: boolean
  separator?: ReactNode
}

const SPACE_SIZE_PRESETS: SpaceSizePreset[] = ["mini", "small", "medium", "large"]

function normalizeSizeValue(size?: SpaceSizeValue) {
  return typeof size === "number" ? pxTransform(size) : size
}

function normalizeSize(size: SpaceSize): [SpaceSizePreset] | ["", string?, string?] {
  if (Array.isArray(size)) {
    return ["", normalizeSizeValue(size[0]), normalizeSizeValue(size[1])]
  }
  if (typeof size === "number") {
    return ["", pxTransform(size), pxTransform(size)]
  }
  if (SPACE_SIZE_PRESETS.includes(size as SpaceSizePreset)) {
    return [size as SpaceSizePreset]
  }
  return ["", size, size]
}

export default function Space(props: SpaceProps) {
  const {
    className,
    size: _size = "small",
    justify,
    align,
    direction = "horizontal",
    wrap = "wrap",
    fill,
    children,
    separator,
    ...restProps
  } = props

  const [size, gapX, gapY] = useMemo(() => normalizeSize(_size), [_size])
  const childCount = Children.count(children)
  const itemStyle: CSSProperties = {
    marginRight: gapX,
    marginBottom: gapY,
  }
  const separatorStyle: CSSProperties = {
    ...itemStyle,
    alignSelf: direction === "horizontal" ? "center" : undefined,
  }
  const itemClassName = classNames(prefixClassname("space__item"), {
    [prefixClassname("space__item--mini")]: size === "mini",
    [prefixClassname("space__item--small")]: size === "small",
    [prefixClassname("space__item--medium")]: size === "medium",
    [prefixClassname("space__item--large")]: size === "large",
  })

  return (
    <Flex
      className={classNames(
        prefixClassname("space"),
        {
          [prefixClassname("space--horizontal")]: direction === "horizontal",
          [prefixClassname("space--vertical")]: direction === "vertical",

          [prefixClassname("space--mini")]: size === "mini",
          [prefixClassname("space--small")]: size === "small",
          [prefixClassname("space--medium")]: size === "medium",
          [prefixClassname("space--large")]: size === "large",
        },
        className,
      )}
      direction={
        direction === "horizontal" ? "row" : direction === "vertical" ? "column" : undefined
      }
      justify={justify}
      align={align}
      wrap={wrap}
      {...restProps}
    >
      {
        //
        Children.map(children, (item, index) => {
          return [
            <Flex.Item
              key={`item-${index}`}
              style={itemStyle}
              className={classNames(itemClassName, {
                [prefixClassname("space__item--fill")]: fill,
              })}
              children={item}
            />,
            separator != null && index < childCount - 1 ? (
              <Flex.Item
                key={`separator-${index}`}
                style={separatorStyle}
                className={classNames(itemClassName, prefixClassname("space__separator"))}
                children={separator}
              />
            ) : null,
          ]
        })
      }
    </Flex>
  )
}
