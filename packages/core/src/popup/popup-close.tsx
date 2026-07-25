import { Cross } from "@taroify/icons"
import type { ITouchEvent } from "@tarojs/components/types/common"
import classNames from "classnames"
import * as React from "react"
import { type ReactElement, type ReactNode, useContext } from "react"
import { prefixClassname } from "../styles"
import PopupContext from "./popup.context"

export type PopupClosePlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left"

export interface PopupCloseProps {
  placement?: PopupClosePlacement
  children?: ReactNode
  onClick?(event: ITouchEvent): void
}

function usePopupClosePlacement(placement?: PopupClosePlacement) {
  const { placement: ctxPlacement } = useContext(PopupContext)
  if (placement) {
    return placement
  }
  if (ctxPlacement === "right") {
    return "top-left"
  }
  return "top-right"
}

export default function PopupClose(props: PopupCloseProps) {
  const { children = <Cross />, onClick } = props
  const { onRequestClose } = useContext(PopupContext)
  const placement = usePopupClosePlacement(props.placement)

  if (React.isValidElement(children)) {
    const iconElement = children as ReactElement<{
      className?: string
      onClick?(event: ITouchEvent): void
    }>
    return React.cloneElement(iconElement, {
      className: classNames(iconElement.props.className, prefixClassname("popup__close-icon"), {
        [prefixClassname("popup__close-icon--top-left")]: placement === "top-left",
        [prefixClassname("popup__close-icon--top-right")]: placement === "top-right",
        [prefixClassname("popup__close-icon--bottom-left")]: placement === "bottom-left",
        [prefixClassname("popup__close-icon--bottom-right")]: placement === "bottom-right",
      }),
      onClick: (event: ITouchEvent) => {
        iconElement.props.onClick?.(event)
        onClick?.(event)
        void onRequestClose?.("close")
      },
    })
  }
  return <>{children}</>
}
