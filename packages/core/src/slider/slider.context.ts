import type { ITouchEvent } from "@tarojs/components"
import { createContext, type KeyboardEvent } from "react"
import type { SliderOrientation, SliderThumbIndex, SliderValue } from "./slider.shared"

interface SliderContextValue {
  value: SliderValue
  min: number
  max: number
  orientation: SliderOrientation
  reverse?: boolean
  disabled?: boolean
  readonly?: boolean
  activeThumb?: SliderThumbIndex
  ariaLabel?: string
  onTouchStart?(event: ITouchEvent, index: SliderThumbIndex): void
  onTouchMove?(event: ITouchEvent): void
  onTouchEnd?(event: ITouchEvent): void
  onKeyDown?(event: KeyboardEvent<HTMLElement>, index: SliderThumbIndex): void
}

const SliderContext = createContext<SliderContextValue>({
  value: 0,
  min: 0,
  max: 100,
  orientation: "horizontal",
})

export default SliderContext
