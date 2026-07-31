import type { ITouchEvent } from "@tarojs/components"
import { type ReactNode, createContext } from "react"

export interface CascaderContextValue {
  title?: ReactNode
  closeable?: boolean
  closeIcon?: ReactNode

  onClose?(event: ITouchEvent): void
}

const CascaderContext = createContext<CascaderContextValue>({})

export default CascaderContext
