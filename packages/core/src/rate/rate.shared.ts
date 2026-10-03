import type { Rect } from "../utils/dom/rect"
import { unitToPx } from "../utils/format/unit"

export enum RateStatus {
  Full = "full",
  Half = "half",
  Void = "void",
}

export function normalizeRateCount(count: number | string): number {
  const number = Number(count)
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0
}

export function normalizeRateValue(value: number, count: number): number {
  return Number.isFinite(value) ? Math.min(count, Math.max(0, value)) : 0
}

export function normalizeRateDimension(value?: string | number): number | undefined {
  if (value === undefined) return undefined
  const pixels = unitToPx(value)
  return Number.isFinite(pixels) && pixels >= 0 ? pixels : undefined
}

export function getRateStatus(value: number, index: number, allowHalf: boolean, readonly: boolean) {
  if (value >= index) return { status: RateStatus.Full, value: 1 }
  if (allowHalf && value > index - 1) {
    const fraction = readonly ? Math.round((value - index + 1) * 1e10) / 1e10 : 0.5
    if (readonly || value >= index - 0.5) return { status: RateStatus.Half, value: fraction }
  }
  return { status: RateStatus.Void, value: 0 }
}

export interface RatePoint {
  clientX: number
  clientY: number
}

// Measure icon content, excluding the gutter, so a large gap cannot shift the half-star boundary.
// Select the nearest row vertically, then the closest score horizontally within that row.
export function getRateScore(rects: Rect[], point: RatePoint, allowHalf: boolean) {
  const { clientX: x, clientY: y } = point
  if (!Number.isFinite(x) || !Number.isFinite(y)) return undefined
  const items = rects
    .map(({ left, top, width, height }, index) => ({ left, top, width, height, score: index + 1 }))
    .filter((rect) => rect.width > 0 && rect.height > 0)
  if (!items.length) return undefined

  const distance = (rect: Pick<Rect, "top" | "height">) =>
    Math.max(rect.top - y, y - rect.top - rect.height, 0)
  const nearest = items.reduce((best, item) => (distance(item) < distance(best) ? item : best))
  const row = items.filter(
    (item) => item.top < nearest.top + nearest.height && item.top + item.height > nearest.top,
  )
  let target = row[0]
  for (const item of row) {
    if (x >= item.left) target = item
  }
  return target.score - (allowHalf && x < target.left + target.width / 2 ? 0.5 : 0)
}

export type RateThemeVars = {
  rateIconSize?: string
  rateIconGutter?: string
  rateIconEmptyColor?: string
  rateIconFullColor?: string
  rateIconDisabledColor?: string
}
