import { createContext } from "react"

interface FlexContextValue {
  gutter: [number | undefined, number | undefined]
  verticalGutterIndexes: number[]
}

const FlexContext = createContext<FlexContextValue>({
  gutter: [undefined, undefined],
  verticalGutterIndexes: [],
})

export default FlexContext
