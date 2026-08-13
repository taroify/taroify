import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import { Children, isValidElement, type ReactElement, type ReactNode, useMemo } from "react"
import FixedView from "../fixed-view"
import type { SafeAreaPosition } from "../safe-area"
import { prefixClassname } from "../styles"
import { HAIRLINE_BORDER_BOTTOM } from "../styles/hairline"
import NavBarLeft from "./navbar-left"
import NavBarRight from "./navbar-right"
import NavBarTitle from "./navbar-title"

interface NavbarChildren {
  left?: ReactNode
  right?: ReactNode
  title?: ReactNode
}

function useNavbarChildren(children?: ReactNode): NavbarChildren {
  return useMemo(() => {
    const __children__: NavbarChildren = {
      left: undefined,
      right: undefined,
      title: undefined,
    }

    Children.forEach(children, (child: ReactNode) => {
      if (isValidElement(child)) {
        const element = child as ReactElement

        const { type } = element
        if (type === NavBarLeft) {
          __children__.left = element
        } else if (type === NavBarRight) {
          __children__.right = element
        } else if (type === NavBarTitle) {
          __children__.title = element
        }
      }
    })
    return __children__
  }, [children])
}

export interface NavbarProps extends ViewProps {
  bordered?: boolean
  fixed?: boolean
  nativeSafeTop?: boolean
  placeholder?: boolean
  safeArea?: SafeAreaPosition
  title?: ReactNode
  children?: ReactNode
}

function Navbar(props: NavbarProps) {
  const {
    className,
    bordered,
    fixed,
    placeholder,
    safeArea,
    nativeSafeTop,
    title: titleProp,
    children: childrenProp,
    ...restProps
  } = props
  const { left, title, right } = useNavbarChildren(childrenProp)

  return (
    <FixedView
      position={fixed ? "top" : false}
      safeArea={safeArea}
      nativeSafeTop={nativeSafeTop}
      placeholder={fixed && placeholder && prefixClassname("navbar__placeholder")}
    >
      <View
        className={classNames(
          prefixClassname("navbar"),
          {
            [HAIRLINE_BORDER_BOTTOM]: bordered,
          },
          className,
        )}
        {...restProps}
      >
        <View className={classNames(prefixClassname("navbar__content"))}>
          {left}
          {title ?? (
            <View className={classNames(prefixClassname("navbar__title"))} children={titleProp} />
          )}
          {right}
        </View>
      </View>
    </FixedView>
  )
}

export default Navbar
