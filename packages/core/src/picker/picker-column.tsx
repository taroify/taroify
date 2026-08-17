import { View } from "@tarojs/components"
import type { ITouchEvent } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as React from "react"
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { prefixClassname } from "../styles"
import { preventDefault } from "../utils/dom/event"
import { addUnitPx } from "../utils/format/unit"
import { useTouch } from "../utils/touch"
import PickerOption from "./picker-option"
import {
  DEFAULT_OPTION_HEIGHT,
  DEFAULT_SIBLING_COUNT,
  DEFAULT_SWIPE_DURATION,
  getPickerOptionKey,
  type PickerColumnInstance,
  type PickerOptionObject,
  type PickerValue,
} from "./picker.shared"

const MOMENTUM_LIMIT_TIME = 300
const MOMENTUM_LIMIT_DISTANCE = 15
const DEFAULT_DURATION = 200

export function findEnabledIndex(options: PickerOptionObject[], index: number) {
  if (!options.length) return -1
  const startIndex = Math.min(Math.max(index, 0), options.length - 1)
  for (let i = startIndex; i < options.length; i++) {
    if (!options[i].disabled) return i
  }
  for (let i = startIndex - 1; i >= 0; i--) {
    if (!options[i].disabled) return i
  }
  return -1
}

export function getElementTranslateY(element?: HTMLElement | null) {
  if (!element) return undefined
  /* istanbul ignore next -- window is unavailable only during SSR or in a mini-program runtime */
  if (typeof window === "undefined") return undefined
  const transform = window.getComputedStyle(element).transform
  if (!transform || transform === "none") return undefined
  const values = transform
    .slice(transform.indexOf("(") + 1, transform.lastIndexOf(")"))
    .split(",")
    .map(Number)
  if (values.some(Number.isNaN)) return undefined
  if (transform.startsWith("matrix3d")) return values[13]
  if (transform.startsWith("matrix")) return values[5]
  return values[1] ?? values[0]
}

export interface PickerColumnProps extends Omit<ViewProps, "children"> {
  index?: number
  value?: PickerValue
  label?: ReactNode
  className?: string
  readonly?: boolean
  visibleCount?: number
  optionHeight?: number
  swipeDuration?: number
  children?: PickerOptionObject[]

  onChange?(option: PickerOptionObject | undefined, emitChange?: boolean): void

  onClickOption?(option: PickerOptionObject): void

  onScrollInto?(option: PickerOptionObject): void
}

const PickerColumn = forwardRef<PickerColumnInstance, PickerColumnProps>(
  (props: PickerColumnProps, ref) => {
    const {
      value,
      index: _index,
      label: _label,
      className,
      readonly,
      visibleCount = DEFAULT_SIBLING_COUNT * 2,
      optionHeight = DEFAULT_OPTION_HEIGHT,
      swipeDuration = DEFAULT_SWIPE_DURATION,
      children: options = [],
      onChange,
      onClickOption,
      onScrollInto,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
      ...restProps
    } = props

    const optionsRef = useRef(options)
    optionsRef.current = options
    const wrapperRef = useRef<HTMLElement | null>(null)
    const movingRef = useRef(false)
    const startOffsetRef = useRef(0)
    const momentumOffsetRef = useRef(0)
    const touchStartTimeRef = useRef(0)
    const transitionEndTriggerRef = useRef<() => void>()
    const activeIndexRef = useRef(-1)
    const activeValueRef = useRef<PickerValue>()
    const activeOffsetRef = useRef(0)
    const [activeOffset, setActiveOffsetState] = useState(0)
    const [currentDuration, setCurrentDurationState] = useState(0)
    const touch = useTouch()

    const baseOffset = useMemo(
      () => (optionHeight * (+visibleCount - 1)) / 2,
      [visibleCount, optionHeight],
    )

    const setActiveOffset = useCallback((offset: number) => {
      activeOffsetRef.current = offset
      setActiveOffsetState((current) => (current === offset ? current : offset))
    }, [])

    const setCurrentDuration = useCallback((duration: number) => {
      setCurrentDurationState((current) => (current === duration ? current : duration))
    }, [])

    const getIndexByOffset = useCallback(
      (offset: number) => {
        return Math.min(
          Math.max(Math.round(-offset / optionHeight), 0),
          optionsRef.current.length - 1,
        )
      },
      [optionHeight],
    )

    const setIndex = useCallback(
      (index: number, emitChange = false) => {
        const enabledIndex = findEnabledIndex(optionsRef.current, index)
        const option = enabledIndex >= 0 ? optionsRef.current[enabledIndex] : undefined
        const offset = enabledIndex >= 0 ? -enabledIndex * optionHeight : 0
        const trigger = () => {
          const changed =
            enabledIndex !== activeIndexRef.current || option?.value !== activeValueRef.current
          activeIndexRef.current = enabledIndex
          activeValueRef.current = option?.value
          onChange?.(option, emitChange && changed)
        }

        if (movingRef.current && offset !== activeOffsetRef.current) {
          transitionEndTriggerRef.current = trigger
        } else {
          trigger()
        }
        setActiveOffset(offset)
      },
      [onChange, optionHeight, setActiveOffset],
    )

    const stopMomentum = useCallback(() => {
      movingRef.current = false
      setCurrentDuration(0)
      transitionEndTriggerRef.current?.()
      transitionEndTriggerRef.current = undefined
    }, [setCurrentDuration])

    useEffect(() => {
      movingRef.current = false
      transitionEndTriggerRef.current = undefined
      setCurrentDuration(0)
      const valueIndex = optionsRef.current.findIndex((option) => option.value === value)
      setIndex(valueIndex)
    }, [options, optionHeight, setCurrentDuration, setIndex, value])

    const momentum = useCallback(
      (distance: number, duration: number) => {
        const speed = Math.abs(distance / Math.max(duration, 1))
        const targetOffset = activeOffsetRef.current + (speed / 0.003) * (distance < 0 ? -1 : 1)
        setCurrentDuration(swipeDuration)
        setIndex(getIndexByOffset(targetOffset), true)
      },
      [getIndexByOffset, setCurrentDuration, setIndex, swipeDuration],
    )

    const onItemClick = useCallback(
      (index: number) => {
        const option = optionsRef.current[index]
        if (movingRef.current || readonly || !option || option.disabled) return
        transitionEndTriggerRef.current = undefined
        setCurrentDuration(DEFAULT_DURATION)
        setIndex(index, true)
        onClickOption?.(option)
        onScrollInto?.(option)
      },
      [onClickOption, onScrollInto, readonly, setCurrentDuration, setIndex],
    )

    const handleTouchStart = useCallback(
      (event: ITouchEvent) => {
        if (readonly || findEnabledIndex(optionsRef.current, 0) < 0) return
        touch.start(event)
        let offset = activeOffsetRef.current
        if (movingRef.current) {
          const translateY = getElementTranslateY(wrapperRef.current)
          if (translateY !== undefined) {
            offset = Math.min(0, translateY - baseOffset)
          }
        }
        movingRef.current = false
        transitionEndTriggerRef.current = undefined
        setCurrentDuration(0)
        setActiveOffset(offset)
        startOffsetRef.current = offset
        touchStartTimeRef.current = Date.now()
        momentumOffsetRef.current = offset
      },
      [baseOffset, readonly, setActiveOffset, setCurrentDuration, touch],
    )

    const handleTouchMove = useCallback(
      (event: ITouchEvent) => {
        if (readonly || findEnabledIndex(optionsRef.current, 0) < 0) return
        touch.move(event)
        if (!touch.isVertical()) return
        movingRef.current = true
        preventDefault(event, true)
        const previousIndex = getIndexByOffset(activeOffsetRef.current)
        const newOffset = Math.min(
          Math.max(
            startOffsetRef.current + touch.deltaY,
            -(optionsRef.current.length * optionHeight),
          ),
          optionHeight,
        )
        const newIndex = getIndexByOffset(newOffset)
        if (newIndex !== previousIndex && optionsRef.current[newIndex]) {
          onScrollInto?.(optionsRef.current[newIndex])
        }
        setActiveOffset(newOffset)
        const now = Date.now()
        if (now - touchStartTimeRef.current > MOMENTUM_LIMIT_TIME) {
          touchStartTimeRef.current = now
          momentumOffsetRef.current = newOffset
        }
      },
      [getIndexByOffset, onScrollInto, optionHeight, readonly, setActiveOffset, touch],
    )

    const handleTouchEnd = useCallback(() => {
      if (readonly || findEnabledIndex(optionsRef.current, 0) < 0) return
      const distance = activeOffsetRef.current - momentumOffsetRef.current
      const duration = Date.now() - touchStartTimeRef.current
      if (
        movingRef.current &&
        duration < MOMENTUM_LIMIT_TIME &&
        Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE
      ) {
        momentum(distance, duration)
        return
      }
      setCurrentDuration(DEFAULT_DURATION)
      setIndex(getIndexByOffset(activeOffsetRef.current), true)
      setTimeout(() => {
        movingRef.current = false
      }, 0)
    }, [getIndexByOffset, momentum, readonly, setCurrentDuration, setIndex])

    useImperativeHandle(ref, () => ({ stopMomentum }), [stopMomentum])

    const wrapperStyle = useMemo(
      () => ({
        transform: `translate3d(0, ${addUnitPx(activeOffset + baseOffset)}, 0)`,
        transitionDuration: `${currentDuration}ms`,
        transitionProperty: currentDuration ? "all" : "none",
      }),
      [activeOffset, baseOffset, currentDuration],
    )

    const renderedOptions = useMemo(
      () =>
        options.map((option, index) => (
          <PickerOption
            key={getPickerOptionKey(option) ?? index}
            {...option}
            onClick={() => onItemClick(index)}
          />
        )),
      [onItemClick, options],
    )

    return (
      <View
        className={classNames(prefixClassname("picker-column"), className)}
        catchMove
        onTouchStart={(event) => {
          handleTouchStart(event as ITouchEvent)
          onTouchStart?.(event)
        }}
        onTouchMove={(event) => {
          handleTouchMove(event as ITouchEvent)
          onTouchMove?.(event)
        }}
        onTouchEnd={(event) => {
          handleTouchEnd()
          onTouchEnd?.(event)
        }}
        onTouchCancel={(event) => {
          handleTouchEnd()
          onTouchCancel?.(event)
        }}
        {...restProps}
      >
        <View
          ref={wrapperRef}
          style={wrapperStyle}
          className={prefixClassname("picker-column__wrapper")}
          onTransitionEnd={stopMomentum}
        >
          {renderedOptions}
        </View>
      </View>
    )
  },
)

export default PickerColumn
