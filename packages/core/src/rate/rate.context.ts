import { createContext, type ReactNode } from "react"

interface RateContextValue {
  gutter?: number | string
  count?: number
  icon?: ReactNode
  emptyIcon?: ReactNode
}

const RateContext = createContext<RateContextValue>({})

export default RateContext
