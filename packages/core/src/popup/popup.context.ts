import { createContext } from "react"
import type { PopupCloseAction, PopupPlacement } from "./popup.shared"

interface PopupContextProps {
  open?: boolean
  duration?: number
  placement?: PopupPlacement

  onRequestClose?(action: PopupCloseAction): Promise<void>
}

const PopupContext = createContext<PopupContextProps>({})
export default PopupContext
