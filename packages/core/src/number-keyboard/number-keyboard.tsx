import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as _ from "lodash"
// biome-ignore lint/correctness/noUnusedImports: Babel uses the classic JSX transform in tests.
import * as React from "react"
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useMemo,
} from "react"
import { prefixClassname } from "../styles"
import Transition from "../transition"
import NumberKeyboardHeader from "./number-keyboard-header"
import NumberKeyboardKey, { type NumberKeyboardKeyProps } from "./number-keyboard-key"
import {
  isNumberKeyboardKeyElement,
  type NumberKeyboardChangeHandler,
  type NumberKeyboardEventHandler,
  type NumberKeyboardKeyCode,
  type NumberKeyboardKeyOnPress,
} from "./number-keyboard-key.shared"
import NumberKeyboardKeys from "./number-keyboard-keys"
import NumberKeyboardSidebar from "./number-keyboard-sidebar"
import NumberKeyboardContext from "./number-keyboard.context"

export function shuffleNumberKeyboardKeys<T>(keys: T[]): T[] {
  for (let index = keys.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const key = keys[index]
    keys[index] = keys[randomIndex]
    keys[randomIndex] = key
  }
  return keys
}

function createBasicKeys(random: boolean): ReactNode[] {
  const keys = Array(9)
    .fill("")
    .map((_, i) => <NumberKeyboardKey key={i + 1} children={i + 1} />)

  if (random) {
    shuffleNumberKeyboardKeys(keys)
  }

  return keys
}

export function createExtraNumberKeyboardKey(extraKey: ReactNode): ReactNode {
  if (_.isString(extraKey) || _.isNumber(extraKey)) {
    return <NumberKeyboardKey key={extraKey} children={extraKey} />
  }
  if (isNumberKeyboardKeyElement(extraKey)) {
    const element = extraKey as ReactElement
    const elementProps = element.props as NumberKeyboardKeyProps
    return cloneElement(extraKey as ReactElement, {
      key: element.key ?? elementProps.children ?? elementProps.code,
    })
  }
  return undefined
}

function createCustomKeys(extraKey?: ReactNode | [ReactNode, ReactNode]): ReactNode[] {
  if (extraKey === undefined) {
    return [
      <NumberKeyboardKey key="keyboard-hide" code="keyboard-hide" />,
      <NumberKeyboardKey key={0} children={0} />,
      <NumberKeyboardKey key="backspace" code="backspace" />,
    ]
  }

  if (_.isString(extraKey) || _.isNumber(extraKey) || isNumberKeyboardKeyElement(extraKey)) {
    return [
      createExtraNumberKeyboardKey(extraKey),
      <NumberKeyboardKey key={0} children={0} />,
      <NumberKeyboardKey key="backspace" code="backspace" />,
    ]
  }

  if (_.isArray(extraKey) && _.size(extraKey) === 1) {
    return [
      createExtraNumberKeyboardKey(extraKey[0]),
      <NumberKeyboardKey key={0} wider children={0} />,
    ]
  }

  if (_.isArray(extraKey) && _.size(extraKey) === 2) {
    const wider = extraKey.filter((key) => key !== undefined).length === 1
    return [
      createExtraNumberKeyboardKey(extraKey[0]),
      <NumberKeyboardKey key={0} wider={wider} children={0} />,
      createExtraNumberKeyboardKey(extraKey[1]),
    ]
  }

  return []
}

interface NumberKeyboardChildren {
  header?: ReactNode
  sidebar?: ReactNode
}

function useNumberKeyboardChildren(
  children?: ReactNode,
  title?: ReactNode,
): NumberKeyboardChildren {
  return useMemo(() => {
    const __children__: NumberKeyboardChildren = {
      sidebar: undefined,
    }

    Children.forEach(children, (child: ReactNode) => {
      if (isValidElement(child)) {
        const element = child as ReactElement

        const elementType = element.type
        if (elementType === NumberKeyboardHeader) {
          __children__.header = element
        }

        if (elementType === NumberKeyboardSidebar) {
          __children__.sidebar = element
        }
      }
    })

    if (title && !__children__.header) {
      __children__.header = <NumberKeyboardHeader />
    }

    return __children__
  }, [children, title])
}

export interface NumberKeyboardProps extends Omit<ViewProps, "onBlur"> {
  className?: string
  open?: boolean
  value?: string
  title?: ReactNode
  maxlength?: number | string
  transition?: boolean
  extraKey?: ReactNode | [ReactNode, ReactNode]
  random?: boolean
  hideOnClickOutside?: boolean
  safeAreaInsetBottom?: boolean
  children?: ReactNode

  onKeyPress?: NumberKeyboardKeyOnPress

  onChange?: NumberKeyboardChangeHandler

  onBackspace?: NumberKeyboardEventHandler

  onClose?: NumberKeyboardEventHandler

  onBlur?: NumberKeyboardEventHandler

  onShow?: NumberKeyboardEventHandler

  /** @deprecated 请使用 onClose。 */
  onHide?: NumberKeyboardEventHandler
}

function NumberKeyboard(props: NumberKeyboardProps) {
  const {
    className,
    open,
    value = "",
    title,
    maxlength = Number.POSITIVE_INFINITY,
    transition = true,
    extraKey,
    random = false,
    hideOnClickOutside = false,
    safeAreaInsetBottom = true,
    children: childrenProp,
    onKeyPress,
    onChange,
    onBackspace,
    onClose,
    onBlur,
    onShow,
    onHide,
    ...restProps
  } = props
  const { header, sidebar } = useNumberKeyboardChildren(childrenProp, title)

  const basicKeys = useMemo(() => createBasicKeys(random), [random])
  const keys = useMemo(() => [...basicKeys, ...createCustomKeys(extraKey)], [basicKeys, extraKey])

  const handleKeyPress = (keyValue: string | number, code: NumberKeyboardKeyCode) => {
    onKeyPress?.(keyValue, code)
    if (code === "backspace") {
      onBackspace?.()
      onChange?.(value.slice(0, -1))
    } else if (code === "keyboard-hide") {
      onClose?.()
      onBlur?.()
      onHide?.()
    } else if (value.length < Number(maxlength)) {
      onChange?.(`${value}${keyValue}`)
    }
  }
  return (
    <NumberKeyboardContext.Provider
      value={{
        title,
        onKeyPress: handleKeyPress,
      }}
    >
      <Transition
        in={open}
        appear
        name={transition ? "slide-up" : undefined}
        timeout={transition ? undefined : 0}
        onEntered={onShow}
      >
        <View
          className={classNames(
            prefixClassname("number-keyboard"),
            {
              [prefixClassname("number-keyboard--with-title")]: header,
              [prefixClassname("number-keyboard--unfit")]: !safeAreaInsetBottom,
            },
            className,
          )}
          {...restProps}
        >
          {open && hideOnClickOutside && (
            <View
              className={prefixClassname("number-keyboard__click-away")}
              onTouchStart={onBlur}
            />
          )}
          {header}
          <View className={prefixClassname("number-keyboard__body")}>
            <NumberKeyboardKeys children={keys} />
            {sidebar}
          </View>
        </View>
      </Transition>
    </NumberKeyboardContext.Provider>
  )
}

export default NumberKeyboard
