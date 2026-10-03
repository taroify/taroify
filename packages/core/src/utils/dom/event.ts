import type { CommonEvent, ITouchEvent } from "@tarojs/components"
import { inBrowser } from "../base"

export function stopPropagation(event: CommonEvent) {
  event.stopPropagation()
}

export function preventDefault(event: CommonEvent, isStopPropagation?: boolean) {
  if (inBrowser) {
    // @ts-ignore
    if (typeof event.cancelable !== "boolean" || event.cancelable) {
      event.preventDefault()
    }
  } else {
    event.preventDefault()
  }

  if (isStopPropagation) {
    stopPropagation(event)
  }
}

interface ClientCoordinates {
  clientX: number
  clientY: number
}

export function getClientCoordinates(event: ITouchEvent | MouseEvent): ClientCoordinates {
  // @ts-ignore
  const { clientX, clientY, detail = {}, touches = [] } = event

  if (clientX !== undefined && clientY !== undefined) {
    return {
      clientX,
      clientY,
    }
  }
  return touches[0] || { clientX: detail.x ?? detail.clientX, clientY: detail.y ?? detail.clientY }
}
