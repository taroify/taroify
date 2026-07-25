import type { ForwardRefExoticComponent } from "react"
import FlexComponent, { type FlexProps } from "./flex"
import FlexItem from "./flex-item"

export type { FlexProps } from "./flex"
export type {
  FlexAlign,
  FlexDirection,
  FlexGutter,
  FlexGutterValue,
  FlexJustify,
  FlexWrap,
} from "./flex.shared"
export type { FlexItemProps } from "./flex-item"

interface FlexInterface extends ForwardRefExoticComponent<FlexProps> {
  Item: typeof FlexItem
}

const Flex = FlexComponent as FlexInterface

Flex.Item = FlexItem

export default Flex
