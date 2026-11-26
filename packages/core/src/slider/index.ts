import SliderComponent, { type SliderProps } from "./slider"
import SliderThumb from "./slider-thumb"

export type { SliderProps } from "./slider"
export type { SliderThumbProps, SliderThumbRenderProps } from "./slider-thumb"

export type { SliderThemeVars } from "./slider.shared"

interface SliderInterface {
  (props: SliderProps): JSX.Element

  Thumb: typeof SliderThumb
}

const Slider = SliderComponent as SliderInterface

Slider.Thumb = SliderThumb

export default Slider
