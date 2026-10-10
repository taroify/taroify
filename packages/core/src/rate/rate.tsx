import { useUncontrolled } from "@taroify/hooks"
import { Star, StarOutlined } from "@taroify/icons"
import { View, type ITouchEvent } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
// biome-ignore lint/correctness/noUnusedImports: the classic JSX runtime requires React in scope
import * as React from "react"
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react"
import { useMemoizedFn } from "../hooks"
import { prefixClassname } from "../styles"
import { getClientCoordinates, preventDefault } from "../utils/dom/event"
import { getRects, type Rect } from "../utils/dom/rect"
import { useTouch } from "../utils/touch"
import RateItem from "./rate-item"
import RateContext from "./rate.context"
import {
  getRateScore,
  getRateStatus,
  normalizeRateCount,
  normalizeRateDimension,
  normalizeRateValue,
  type RatePoint,
} from "./rate.shared"

export interface RateProps extends ViewProps {
  className?: string
  style?: CSSProperties
  defaultValue?: number
  value?: number
  count?: number | string
  size?: number | string
  gutter?: number | string
  allowHalf?: boolean
  clearable?: boolean
  readonly?: boolean
  disabled?: boolean
  touchable?: boolean
  wrap?: boolean
  color?: string
  emptyColor?: string
  disabledColor?: string
  icon?: ReactNode
  emptyIcon?: ReactNode

  onChange?(value: number): void
}

interface RateGesture {
  measurement?: Promise<Rect[]>
}

function Rate(props: RateProps) {
  const {
    className,
    style,
    defaultValue,
    value: valueProp,
    count: countProp = 5,
    size: sizeProp,
    gutter: gutterProp,
    allowHalf = false,
    clearable = false,
    readonly = false,
    disabled = false,
    touchable = true,
    wrap = false,
    color,
    emptyColor,
    disabledColor,
    icon = <Star />,
    emptyIcon = <StarOutlined />,
    onClick,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    onChange,
    ...restProps
  } = props
  const count = normalizeRateCount(countProp)
  const size = normalizeRateDimension(sizeProp)
  const gutter = normalizeRateDimension(gutterProp)
  const {
    value = 0,
    getValue,
    setValue,
  } = useUncontrolled({
    value: valueProp,
    defaultValue,
    onChange,
  })
  const displayValue = normalizeRateValue(value, count)
  const rootRef = useRef<HTMLElement>()
  const requestId = useRef(0)
  const gestureRef = useRef<RateGesture>()
  const suppressClickUntil = useRef(0)
  const touch = useTouch()
  const unselectable = readonly || disabled || count === 0

  // Cancel obsolete async reads on unmount or when interaction/layout settings change.
  // biome-ignore lint/correctness/useExhaustiveDependencies: these settings invalidate measured geometry and pending selections
  useEffect(
    () => () => {
      requestId.current++
      gestureRef.current = undefined
      suppressClickUntil.current = 0
    },
    [
      allowHalf,
      clearable,
      count,
      disabled,
      readonly,
      touchable,
      size,
      gutter,
      wrap,
      className,
      style?.width,
      style?.maxWidth,
    ],
  )

  const measure = () =>
    getRects(rootRef, ` .${prefixClassname("rate__item-content")}`).catch(() => [])

  const select = useMemoizedFn((score: number, isClick: boolean) => {
    const current = normalizeRateValue(getValue(), count)
    setValue(clearable && isClick && score === current ? 0 : score)
  })

  const selectAt = (point: RatePoint, measurement: Promise<Rect[]>, isClick: boolean) => {
    const id = ++requestId.current
    measurement.then((rects) => {
      if (id !== requestId.current) return
      const score = getRateScore(rects, point, allowHalf)
      if (score !== undefined) select(score, isClick)
    })
  }

  const handleClick = (event: ITouchEvent) => {
    if (Date.now() < suppressClickUntil.current) return
    onClick?.(event)
    if (unselectable) return
    selectAt(getClientCoordinates(event), measure(), true)
  }

  const handleTouchStart: NonNullable<ViewProps["onTouchStart"]> = (event) => {
    const touchEvent = event as ITouchEvent
    requestId.current++
    gestureRef.current = undefined
    suppressClickUntil.current = 0
    if (!unselectable && touchEvent.touches.length === 1) {
      touch.start(touchEvent)
      gestureRef.current = { measurement: touchable ? measure() : undefined }
    }
    onTouchStart?.(event)
  }

  const handleTouchMove: NonNullable<ViewProps["onTouchMove"]> = (event) => {
    const touchEvent = event as ITouchEvent
    const gesture = gestureRef.current
    if (gesture && touchEvent.touches.length === 1) {
      touch.move(touchEvent)
      if (!touch.isTap) suppressClickUntil.current = Number.POSITIVE_INFINITY
      if (gesture.measurement && touch.isHorizontal()) {
        preventDefault(event)
        selectAt(getClientCoordinates(touchEvent), gesture.measurement, false)
      }
    }
    onTouchMove?.(event)
  }

  const handleTouchEnd: NonNullable<ViewProps["onTouchEnd"]> = (event) => {
    if (gestureRef.current) {
      // A new touchstart resets this immediately; mouse clicks become available after the
      // compatibility-click window even on platforms that do not synthesize a click.
      suppressClickUntil.current = touch.isTap ? 0 : Date.now() + 400
      gestureRef.current = undefined
    }
    onTouchEnd?.(event)
  }

  const handleTouchCancel: NonNullable<ViewProps["onTouchCancel"]> = (event) => {
    requestId.current++
    gestureRef.current = undefined
    suppressClickUntil.current = Date.now() + 400
    onTouchCancel?.(event)
  }

  return (
    <View
      ref={rootRef}
      className={classNames(
        prefixClassname("rate"),
        {
          [prefixClassname("rate--disabled")]: disabled,
          [prefixClassname("rate--readonly")]: readonly,
          [prefixClassname("rate--wrap")]: wrap,
        },
        className,
      )}
      style={
        {
          "--rate-icon-full-color": color,
          "--rate-icon-empty-color": emptyColor,
          "--rate-icon-disabled-color": disabledColor,
          ...style,
        } as CSSProperties
      }
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      {...restProps}
    >
      <RateContext.Provider value={{ gutter, count, icon, emptyIcon }}>
        {Array.from({ length: count }, (_, index) => {
          const item = getRateStatus(displayValue, index + 1, allowHalf, readonly)
          return (
            <RateItem
              key={index}
              score={index + 1}
              disabled={disabled}
              size={size}
              half={allowHalf && item.value > 0 && item.value < 1}
              value={item.value}
              status={item.status}
            />
          )
        })}
      </RateContext.Provider>
    </View>
  )
}

export default Rate
