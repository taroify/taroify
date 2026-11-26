import { addNumber } from "../utils/format/number"

export type SliderThemeVars = {
  sliderBorderRadius?: string
  sliderActiveBackgroundColor?: string
  sliderInactiveBackgroundColor?: string
  sliderDisabledOpacity?: string
  sliderTrackHeight?: string
  sliderTrackTransitionDuration?: string
  sliderThumbWidth?: string
  sliderThumbHeight?: string
  sliderThumbBorderRadius?: string
  sliderThumbBackgroundColor?: string
  sliderThumbBoxShadow?: string
}

export type SliderValue = number | [number, number]
export type SliderThumbIndex = 0 | 1
export type SliderOrientation = "horizontal" | "vertical"

interface SliderLimits {
  min: number
  max: number
  step: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function formatSliderValue(value: number, { min, max, step }: SliderLimits) {
  const bounded = clamp(value, min, max)
  const snapped = clamp(addNumber(min, Math.round((bounded - min) / step) * step), min, max)
  return max - bounded < Math.abs(snapped - bounded) ? max : snapped
}

function normalizeSliderNumber(value: unknown, fallback: number, limits: SliderLimits) {
  const number = Number(value ?? fallback)
  return formatSliderValue(Number.isFinite(number) ? number : fallback, limits)
}

export function getSliderValue(value: unknown, limits: SliderLimits, range: boolean): SliderValue {
  if (!range) {
    return normalizeSliderNumber(value, limits.min, limits)
  }

  const [start, end] = Array.isArray(value) ? value : []
  const a = normalizeSliderNumber(start, limits.min, limits)
  const b = normalizeSliderNumber(end, limits.max, limits)
  return [Math.min(a, b), Math.max(a, b)]
}

export function getSliderBounds(
  value: SliderValue,
  index: SliderThumbIndex,
  min: number,
  max: number,
) {
  if (Array.isArray(value)) {
    return index === 0
      ? { value: value[0], min, max: value[1] }
      : { value: value[1], min: value[0], max }
  }
  return { value, min, max }
}

export function getSliderKeyValue(
  key: string,
  value: number,
  lower: number,
  upper: number,
  min: number,
  step: number,
) {
  switch (key) {
    case "Home":
      return lower
    case "End":
      return upper
    case "ArrowRight":
    case "ArrowUp":
      return clamp(
        addNumber(min, (Math.floor(addNumber((value - min) / step, 0)) + 1) * step),
        lower,
        upper,
      )
    case "ArrowLeft":
    case "ArrowDown":
      return clamp(
        addNumber(min, (Math.ceil(addNumber((value - min) / step, 0)) - 1) * step),
        lower,
        upper,
      )
  }
}
