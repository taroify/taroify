import { useUncontrolled } from "@taroify/hooks"
import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as _ from "lodash"
import * as React from "react"
import {
  Children,
  type CSSProperties,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react"
import type { EnterHandler, ExitHandler } from "react-transition-group/Transition"
import Backdrop from "../backdrop"
import { prefixClassname } from "../styles"
import Transition, { TransitionName } from "../transition"
import { isElementOf } from "../utils/validate"
import { useLockScrollTaro } from "../utils/dom/use-lock-scroll-taro"
import PopupBackdrop, { usePopupBackdrop, type PopupBackdropProps } from "./popup-backdrop"
import PopupClose, { type PopupClosePlacement } from "./popup-close"
import PopupContext from "./popup.context"
import type { PopupCloseAction, PopupPlacement, PopupTransitionTimeout } from "./popup.shared"

function toTransitionName(placement?: PopupPlacement) {
  if (placement === "top") {
    return TransitionName.SlideDown
  }

  if (placement === "bottom") {
    return TransitionName.SlideUp
  }

  if (placement === "right") {
    return TransitionName.SlideRight
  }

  if (placement === "left") {
    return TransitionName.SlideLeft
  }

  return TransitionName.Fade
}

interface PopupChildren {
  backdrop?: ReactNode
  close?: ReactNode
  content: ReactNode[]
}

function usePopupChildren(children?: ReactNode): PopupChildren {
  return useMemo(() => {
    const __children__: PopupChildren = {
      backdrop: undefined,
      close: undefined,
      content: [],
    }

    Children.forEach(children, (child: ReactNode) => {
      if (isValidElement(child)) {
        const element = child as ReactElement
        if (isElementOf(element, Backdrop)) {
          __children__.backdrop = element
        } else if (element.type === PopupClose) {
          __children__.close = element
        } else {
          __children__.content.push(child)
        }
      } else {
        __children__.content.push(child)
      }
    })
    return __children__
  }, [children])
}

export interface PopupProps extends ViewProps {
  style?: CSSProperties
  defaultOpen?: boolean
  open?: boolean
  placement?: PopupPlacement
  rounded?: boolean
  children?: ReactNode
  lock?: boolean
  backdrop?: boolean | Omit<PopupBackdropProps, "open">
  closeOnClickBackdrop?: boolean
  closeable?: boolean
  closeIcon?: ReactNode
  closeIconPlacement?: PopupClosePlacement
  beforeClose?(action: PopupCloseAction): boolean | Promise<boolean>
  destroyOnClose?: boolean

  duration?: number
  mountOnEnter?: boolean
  transition?: string
  transitionTimeout?: PopupTransitionTimeout

  /** @deprecated 请使用 transition。 */
  transaction?: string

  /** @deprecated 请使用 transitionTimeout。 */
  transactionTimeout?: PopupTransitionTimeout
  transitionAppear?: boolean

  onOpen?(): void
  onOpened?(): void
  onClose?(opened: boolean): void
  onClosed?(): void

  onTransitionEnter?: EnterHandler<HTMLElement>
  onTransitionEntered?: EnterHandler<HTMLElement>
  onTransitionExit?: ExitHandler<HTMLElement>
  onTransitionExited?: ExitHandler<HTMLElement>
}

const Popup = forwardRef<any, PopupProps>((props, ref) => {
  const {
    className,
    style: styleProp,
    defaultOpen,
    open: openProp,
    placement,
    rounded = false,
    lock = true,
    children,
    backdrop: backdropProp,
    closeOnClickBackdrop = true,
    closeable = false,
    closeIcon,
    closeIconPlacement,
    beforeClose,
    destroyOnClose = false,
    duration,
    transition,
    transitionTimeout,
    transaction,
    transactionTimeout,
    transitionAppear = true,
    mountOnEnter = true,
    onOpen,
    onOpened,
    onClose,
    onClosed,
    onTransitionEnter,
    onTransitionEntered,
    onTransitionExit,
    onTransitionExited,
    ...restProps
  } = props

  const { value: open = false, setValue: setOpen } = useUncontrolled<boolean>({
    defaultValue: defaultOpen,
    value: openProp,
  })
  const closingRef = useRef(false)
  useLockScrollTaro(!!open && lock)

  const requestClose = useCallback(
    async (action: PopupCloseAction) => {
      if (closingRef.current) {
        return
      }
      closingRef.current = true
      try {
        if (beforeClose && (await beforeClose(action)) !== true) {
          return
        }
        setOpen(false, onClose)
      } catch {
        return
      } finally {
        closingRef.current = false
      }
    },
    [beforeClose, onClose, setOpen],
  )

  const transitionName = transition ?? transaction ?? toTransitionName(placement)
  const timeout = transitionTimeout ?? transactionTimeout ?? duration
  const { backdrop: backdropChild, close, content } = usePopupChildren(children)
  const backdrop = usePopupBackdrop(
    backdropChild ?? <PopupBackdrop lock={lock} closeable={closeOnClickBackdrop} />,
    backdropProp,
  )
  const closeElement =
    close ??
    (closeable ? <PopupClose placement={closeIconPlacement}>{closeIcon}</PopupClose> : undefined)

  const durationStyle = useMemo(
    () => (_.isNumber(duration) ? { "--animation-duration-base": `${duration as number}ms` } : {}),
    [duration],
  )

  return (
    <PopupContext.Provider
      value={{
        open,
        duration,
        placement,
        onRequestClose: requestClose,
      }}
    >
      <Transition
        in={open}
        name={transitionName}
        appear={transitionAppear}
        timeout={timeout}
        mountOnEnter={mountOnEnter}
        unmountOnExit={destroyOnClose}
        onEnter={(isAppearing) => {
          onOpen?.()
          onTransitionEnter?.(isAppearing)
        }}
        onEntered={(isAppearing) => {
          onOpened?.()
          onTransitionEntered?.(isAppearing)
        }}
        onExit={onTransitionExit}
        onExited={() => {
          onClosed?.()
          onTransitionExited?.()
        }}
      >
        <View
          ref={ref}
          className={classNames(
            prefixClassname("popup"),
            {
              [prefixClassname("popup--rounded")]: rounded,
              [prefixClassname("popup--center")]:
                placement === "center" || _.isUndefined(placement),
              [prefixClassname("popup--top")]: placement === "top",
              [prefixClassname("popup--right")]: placement === "right",
              [prefixClassname("popup--bottom")]: placement === "bottom",
              [prefixClassname("popup--left")]: placement === "left",
            },
            className,
          )}
          style={{
            ...durationStyle,
            ...styleProp,
          }}
          catchMove={lock}
          {...restProps}
        >
          {closeElement}
          {content}
        </View>
      </Transition>
      {backdrop}
    </PopupContext.Provider>
  )
})

export default Popup
