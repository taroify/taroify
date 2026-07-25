import type { ForwardRefExoticComponent } from "react"
import PopupComponent, { type PopupProps } from "./popup"
import PopupBackdrop from "./popup-backdrop"
import PopupClose from "./popup-close"

export type { PopupProps } from "./popup"
export type {
  PopupCloseAction,
  PopupPlacement,
  PopupThemeVars,
  PopupTransitionTimeout,
} from "./popup.shared"
export type { PopupBackdropProps } from "./popup-backdrop"
export { usePopupBackdrop } from "./popup-backdrop"
export type { PopupClosePlacement, PopupCloseProps } from "./popup-close"

interface PopupInterface extends ForwardRefExoticComponent<PopupProps> {
  (props: PopupProps): JSX.Element

  Backdrop: typeof PopupBackdrop
  Close: typeof PopupClose
}

const Popup = PopupComponent as PopupInterface
Popup.Backdrop = PopupBackdrop
Popup.Close = PopupClose

export default Popup
