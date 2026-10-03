import { cloneIconElement } from "@taroify/icons/utils"
import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
// biome-ignore lint/correctness/noUnusedImports: the classic JSX runtime requires React in scope
import * as React from "react"
import { type CSSProperties, useContext } from "react"
import { prefixClassname } from "../styles"
import { addUnitPx } from "../utils/format/unit"
import RateContext from "./rate.context"
import { RateStatus } from "./rate.shared"

interface RateItemProps extends ViewProps {
  style?: CSSProperties
  score: number
  value: number
  half?: boolean
  disabled?: boolean
  size?: number | string
  status: RateStatus
}

function RateItem(props: RateItemProps) {
  const { className, style, score, value, half, disabled, size, status, ...restProps } = props
  const { gutter, count, emptyIcon, icon } = useContext(RateContext)

  const empty = status === RateStatus.Void
  const full = status === RateStatus.Full
  return (
    <View
      className={classNames(prefixClassname("rate__item"), className)}
      style={{
        paddingRight: score !== count ? addUnitPx(gutter) : "",
        ...style,
      }}
      {...restProps}
    >
      <View className={prefixClassname("rate__item-content")}>
        {
          //
          cloneIconElement(full ? icon : emptyIcon, {
            size,
            className: classNames(prefixClassname("rate__icon"), {
              [prefixClassname("rate__icon--disabled")]: disabled,
              [prefixClassname("rate__icon--full")]: full,
            }),
          })
        }
        {
          //
          half &&
            cloneIconElement(icon, {
              style: { width: `${value}em` },
              size,
              className: classNames(
                prefixClassname("rate__icon"),
                prefixClassname("rate__icon--half"),
                {
                  [prefixClassname("rate__icon--disabled")]: disabled,
                  [prefixClassname("rate__icon--full")]: !empty,
                },
              ),
            })
        }
      </View>
    </View>
  )
}

export default RateItem
