import { useUncontrolled } from "@taroify/hooks"
import { type ITouchEvent, View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as React from "react"
import {
  Children,
  cloneElement,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"
import { useMemoizedFn } from "../hooks"
import { prefixClassname } from "../styles"
import { getClientCoordinates, preventDefault, stopPropagation } from "../utils/dom/event"
import { getRect } from "../utils/dom/rect"
import { addUnitPx } from "../utils/format/unit"
import { useTouch } from "../utils/touch"
import SliderThumb, { type InternalSliderThumbProps } from "./slider-thumb"
import SliderContext from "./slider.context"
import {
  formatSliderValue,
  getSliderBounds,
  getSliderKeyValue,
  getSliderValue,
  type SliderOrientation,
  type SliderThumbIndex,
  type SliderValue,
} from "./slider.shared"

interface SliderDrag {
  index: SliderThumbIndex
  startValue: SliderValue
  lastValue: SliderValue
  delta: number
  length?: number
  measurement?: Promise<void>
  ended?: boolean
}

export interface SliderProps extends ViewProps {
  style?: CSSProperties
  step?: number
  min?: number
  max?: number
  defaultValue?: any
  value?: any
  range?: boolean
  size?: number
  orientation?: SliderOrientation
  reverse?: boolean
  disabled?: boolean
  readonly?: boolean
  children?: ReactNode

  onChange?(value: any): void
  onDragStart?(event: ITouchEvent): void
  onDragEnd?(event: ITouchEvent): void
}

function Slider(props: SliderProps) {
  const {
    className,
    style,
    defaultValue,
    value: valueProp,
    min: minProp = 0,
    max: maxProp = 100,
    step: stepProp = 1,
    range = false,
    size,
    orientation = "horizontal",
    reverse = false,
    disabled = false,
    readonly = false,
    children,
    onClick,
    onChange,
    onDragStart,
    onDragEnd,
    ...restProps
  } = props

  const min = Number.isFinite(Number(minProp)) ? Number(minProp) : 0
  const max = Number.isFinite(Number(maxProp)) ? Math.max(min, Number(maxProp)) : Math.max(min, 100)
  const step = Number.isFinite(Number(stepProp)) && Number(stepProp) > 0 ? Number(stepProp) : 1
  const vertical = orientation === "vertical"
  const blocked = disabled || readonly
  const direction = reverse ? -1 : 1
  const scope = max - min
  const normalize = (value: unknown) => getSliderValue(value, { min, max, step }, range)
  const format = (value: number) => formatSliderValue(value, { min, max, step })

  const {
    value: state,
    getValue,
    setValue,
  } = useUncontrolled<SliderValue>({
    defaultValue,
    value: valueProp,
    onChange,
  })
  const value = normalize(state)
  const [from, to] = Array.isArray(value) ? value : [min, value]
  const percent = (distance: number) => `${scope ? (distance / scope) * 100 : 0}%`

  const rootRef = useRef<HTMLElement>()
  const clickId = useRef(0)
  const dragRef = useRef<SliderDrag>()
  const [activeThumb, setActiveThumb] = useState<SliderThumbIndex>()
  const touch = useTouch()

  // biome-ignore lint/correctness/useExhaustiveDependencies: these props invalidate pending input
  useEffect(() => {
    setActiveThumb(undefined)
    return () => {
      clickId.current++
      dragRef.current = undefined
    }
  }, [blocked, min, max, step, range, reverse, orientation])

  const select = useMemoizedFn((next: SliderValue) => {
    if (String(next) !== String(normalize(getValue()))) {
      setValue(next)
    }
  })
  const notifyDragEnd = useMemoizedFn((event: ITouchEvent) => onDragEnd?.(event))
  const measure = () => getRect(rootRef).catch(() => undefined)

  const handleClick = (event: ITouchEvent) => {
    onClick?.(event)
    stopPropagation(event)
    if (blocked) return

    const id = ++clickId.current
    const { clientX, clientY } = getClientCoordinates(event)
    void measure().then((rect) => {
      if (id !== clickId.current || !rect) return
      const length = vertical ? rect.height : rect.width
      if (!(length > 0)) return

      const offset = vertical ? clientY - rect.top : clientX - rect.left
      const progress = offset / length
      const next = min + (reverse ? 1 - progress : progress) * scope
      if (!Number.isFinite(next)) return

      const current = normalize(getValue())
      if (Array.isArray(current)) {
        const [lower, upper] = current
        const middle = lower + (upper - lower) / 2
        select(next <= middle ? [format(next), upper] : [lower, format(next)])
      } else {
        select(format(next))
      }
    })
  }

  const updateDrag = (drag: SliderDrag) => {
    const { startValue, index, length } = drag
    if (!length) return

    const offset = (drag.delta / length) * scope * direction
    let next: SliderValue
    if (Array.isArray(startValue)) {
      const moved = format(startValue[index] + offset)
      const fixed = startValue[index === 0 ? 1 : 0]
      next = [Math.min(moved, fixed), Math.max(moved, fixed)]
      if (!drag.ended) {
        setActiveThumb(moved === fixed ? index : moved < fixed ? 0 : 1)
      }
    } else {
      next = format(startValue + offset)
    }

    if (String(next) !== String(drag.lastValue)) {
      drag.lastValue = next
      select(next)
    }
  }

  const handleTouchStart = (event: ITouchEvent, index: SliderThumbIndex) => {
    if (blocked || event.touches.length !== 1) return

    clickId.current++
    touch.start(event)
    const startValue = normalize(getValue())
    dragRef.current = { index, startValue, lastValue: startValue, delta: 0 }
    setActiveThumb(undefined)
  }

  const handleTouchMove = (event: ITouchEvent) => {
    const drag = dragRef.current
    if (!drag || drag.ended || event.touches.length !== 1) return

    preventDefault(event, true)
    touch.move(event)
    drag.delta = vertical ? touch.deltaY : touch.deltaX

    if (drag.measurement) {
      updateDrag(drag)
      return
    }

    setActiveThumb(drag.index)
    drag.measurement = measure().then((rect) => {
      if (dragRef.current !== drag) return
      drag.length = rect ? (vertical ? rect.height : rect.width) : 0
      updateDrag(drag)
    })
    onDragStart?.(event)
  }

  const handleTouchEnd = (event: ITouchEvent) => {
    const drag = dragRef.current
    if (!drag || drag.ended) return

    drag.ended = true
    setActiveThumb(undefined)
    if (!drag.measurement) {
      dragRef.current = undefined
      return
    }

    const finish = () => {
      if (dragRef.current !== drag) return
      dragRef.current = undefined
      notifyDragEnd(event)
    }
    if (drag.length === undefined) {
      void drag.measurement.then(finish)
    } else {
      finish()
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, index: SliderThumbIndex) => {
    if (blocked) return

    const current = normalize(getValue())
    const bounds = getSliderBounds(current, index, min, max)
    const next = getSliderKeyValue(event.key, bounds.value, bounds.min, bounds.max, min, step)
    if (next === undefined) return

    event.preventDefault()
    event.stopPropagation()
    if (Array.isArray(current)) {
      select(index === 0 ? [next, current[1]] : [current[0], next])
    } else {
      select(next)
    }
  }

  const thumbs = Children.toArray(children).filter(
    React.isValidElement<Pick<InternalSliderThumbProps, "index">>,
  )
  const firstThumb = thumbs[0] ?? <SliderThumb />
  const offsetProperty = vertical ? (reverse ? "bottom" : "top") : reverse ? "right" : "left"

  return (
    <View
      ref={rootRef}
      className={classNames(
        prefixClassname("slider"),
        {
          [prefixClassname("slider--vertical")]: vertical,
          [prefixClassname("slider--disabled")]: disabled,
          [prefixClassname("slider--readonly")]: readonly,
          [prefixClassname("slider--dragging")]: activeThumb !== undefined,
        },
        className,
      )}
      style={{ ...style, [vertical ? "width" : "height"]: addUnitPx(size) }}
      onClick={handleClick}
      {...restProps}
    >
      <SliderContext.Provider
        value={{
          value,
          min,
          max,
          orientation,
          reverse,
          disabled,
          readonly,
          activeThumb,
          ariaLabel: restProps.ariaLabel,
          onTouchStart: handleTouchStart,
          onTouchMove: handleTouchMove,
          onTouchEnd: handleTouchEnd,
          onKeyDown: handleKeyDown,
        }}
      >
        <View
          className={prefixClassname("slider__track")}
          style={{
            [vertical ? "height" : "width"]: percent(to - from),
            [offsetProperty]: percent(from - min),
          }}
        >
          {range
            ? [
                cloneElement(firstThumb, { index: 0, key: 0 }),
                cloneElement(thumbs[1] ?? <SliderThumb />, { index: 1, key: 1 }),
              ]
            : cloneElement(firstThumb, { index: undefined })}
        </View>
      </SliderContext.Provider>
    </View>
  )
}

export default Slider
