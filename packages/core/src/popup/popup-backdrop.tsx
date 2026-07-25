import type { ViewProps } from "@tarojs/components/types/View"
import type { ITouchEvent } from "@tarojs/components/types/common"
import * as _ from "lodash"
import * as React from "react"
import {
  cloneElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useContext,
  useMemo,
} from "react"
import { default as SharedBackdrop } from "../backdrop"
import PopupContext from "./popup.context"

export interface PopupBackdropProps extends ViewProps {
  style?: CSSProperties
  open?: boolean
  lock?: boolean
  duration?: number
  closeable?: boolean
}

export default function PopupBackdrop(props: PopupBackdropProps) {
  const { open: openProp = true, duration, closeable = true, lock, onClick, ...restProps } = props
  const { open, duration: ctxDuration, onRequestClose } = useContext(PopupContext)

  function handleClick(event: ITouchEvent) {
    onClick?.(event)
    if (closeable) {
      void onRequestClose?.("backdrop")
    }
  }

  return (
    <SharedBackdrop
      open={openProp && open}
      lock={lock}
      duration={duration ?? ctxDuration}
      closeable={false}
      onClick={handleClick}
      {...restProps}
    />
  )
}

PopupBackdrop.displayName = "PopupBackdrop"

export function usePopupBackdrop(
  backdrop: ReactNode = <PopupBackdrop />,
  options?: boolean | Omit<PopupBackdropProps, "open">,
) {
  return useMemo(() => {
    if (_.isUndefined(options) || _.isNull(options)) {
      return backdrop
    }
    if (_.isBoolean(options) && options) {
      return cloneElement(backdrop as ReactElement, { open: true })
    }
    if (_.isBoolean(options) && !options) {
      return cloneElement(backdrop as ReactElement, { open: false })
    }
    // @ts-ignore
    return cloneElement(backdrop as ReactElement, { ...options, open: true })
  }, [backdrop, options])
}
