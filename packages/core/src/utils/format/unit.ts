import { getWindowInfo } from "@tarojs/taro"
import * as _ from "lodash"
import type { CSSProperties } from "react"

export function addUnit(value?: string | number): string {
  if (value === undefined) {
    return ""
  }

  return typeof value === "number" || /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value
}

export function addUnitPx(value?: string | number): string {
  return value === undefined ? "" : `${unitToPx(value)}px`
}

export function getSizeStyle(originSize?: string | number): CSSProperties | undefined {
  if (_.isNumber(originSize) || _.isString(originSize)) {
    const size = addUnitPx(originSize)
    return {
      width: size,
      height: size,
    }
  }
  return {}
}

export function getZIndexStyle(zIndex?: string | number) {
  const style: CSSProperties = {}
  if (zIndex !== undefined) {
    style.zIndex = +zIndex
  }
  return style
}

// cache
let rootFontSize: number

function getRootFontSize() {
  if (!rootFontSize) {
    const doc = document.documentElement
    const fontSize = doc.style.fontSize || window.getComputedStyle(doc).fontSize

    rootFontSize = Number.parseFloat(fontSize)
  }

  return rootFontSize
}

function convertRpx(value: string) {
  let valueCache = value
  valueCache = valueCache.replace(/rpx/g, "")
  const { windowWidth } = getWindowInfo()
  const pixelRatio = 750 / windowWidth
  return +valueCache / pixelRatio
}

function convertPx(value: string) {
  let valueCache = value
  valueCache = valueCache.replace(/px/g, "")
  return +valueCache
}

function convertRem(value: string) {
  let valueCache = value
  valueCache = valueCache.replace(/rem/g, "")
  return +valueCache * getRootFontSize()
}

function convertVw(value: string) {
  let valueCache = value
  valueCache = valueCache.replace(/vw/g, "")
  return (+valueCache * window.innerWidth) / 100
}

function convertVh(value: string) {
  let valueCache = value
  valueCache = valueCache.replace(/vh/g, "")
  return (+valueCache * window.innerHeight) / 100
}

export function unitToPx(value: string | number): number {
  if (typeof value === "number") {
    return value
  }

  if (value.includes("rpx")) {
    return convertRpx(value)
  }
  if (value.includes("px")) {
    return convertPx(value)
  }
  if (value.includes("rem")) {
    return convertRem(value)
  }
  if (value.includes("vw")) {
    return convertVw(value)
  }
  if (value.includes("vh")) {
    return convertVh(value)
  }

  return Number.parseFloat(value)
}
