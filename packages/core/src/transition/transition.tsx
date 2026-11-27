import * as React from "react"
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from "react"
import { CSSTransition } from "react-transition-group"
import type { EnterHandler, ExitHandler } from "react-transition-group/Transition"
import { prefixClassname } from "../styles"
import { inWechat } from "../utils/base"

export enum TransitionName {
  Fade = "fade",
  SlideUp = "slide-up",
  SlideDown = "slide-down",
  SlideLeft = "slide-left",
  SlideRight = "slide-right",
}

const TRANSITION_PRESETS: string[] = [
  TransitionName.Fade,
  TransitionName.SlideUp,
  TransitionName.SlideDown,
  TransitionName.SlideLeft,
  TransitionName.SlideRight,
]

function isTransitionPreset(name?: string) {
  return name && TRANSITION_PRESETS.includes(name)
}

function useElementStyle(children?: ReactNode) {
  return useMemo(() => {
    if (!isValidElement(children)) {
      return {}
    }
    const element = children as ReactElement
    const { style } = element.props
    return style ?? {}
  }, [children])
}

interface TransitionProps {
  name?: TransitionName | string
  in?: boolean
  appear?: boolean
  mountOnEnter?: boolean
  unmountOnExit?: boolean
  timeout?: number | { appear?: number; enter?: number; exit?: number }
  children?: ReactNode
  onEnter?: EnterHandler<HTMLElement>
  onEntering?: EnterHandler<HTMLElement>
  onEntered?: EnterHandler<HTMLElement>
  onExit?: ExitHandler<HTMLElement>
  onExiting?: ExitHandler<HTMLElement>
  onExited?: ExitHandler<HTMLElement>
}

export default function Transition(props: TransitionProps) {
  const {
    name,
    in: inProp = false,
    appear = false,
    mountOnEnter = false,
    unmountOnExit,
    timeout = 300,
    children: childrenProp,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
  } = props
  const children = useMemo(() => childrenProp, [childrenProp])
  const childrenStyle = useElementStyle(children)
  const transactionName = isTransitionPreset(name) ? prefixClassname(`transition-${name}`) : name
  const [enter, setEnter] = useState(false)
  const [exited, setExited] = useState(false)
  const ref = useRef(null)
  // React 18's prop-type check expects nodeRef to contain a DOM Element.
  const useNodeRef = !inWechat || Number.parseInt(React.version, 10) >= 19

  const setRef = (value) => {
    ref.current = value
  }

  return (
    <CSSTransition
      in={inProp}
      nodeRef={useNodeRef ? ref : undefined}
      mountOnEnter={mountOnEnter}
      unmountOnExit={unmountOnExit}
      timeout={timeout}
      appear={appear}
      classNames={transactionName}
      style={{
        ...childrenStyle,
        display: enter && !exited ? "" : "none",
      }}
      onEnter={(node, isAppearing) => {
        setEnter(true)
        setExited(false)
        // @ts-ignore
        onEnter?.(node, isAppearing)
      }}
      onEntering={onEntering}
      onEntered={onEntered}
      onExit={onExit}
      onExiting={onExiting}
      onExited={(node) => {
        setEnter(false)
        setExited(true)
        // @ts-ignore
        onExited?.(node)
      }}
    >
      {cloneElement(children as ReactElement, { ref: setRef })}
    </CSSTransition>
  )
}
