import { Navigator } from "@tarojs/components"
import type { NavigatorProps } from "@tarojs/components/types/Navigator"
import type { ViewProps } from "@tarojs/components/types/View"
import * as React from "react"
import { CellRoot, type CellProps } from "./cell"

export type CellLinkProps = Omit<CellProps, keyof ViewProps> &
  NavigatorProps & {
    role?: string
    ariaRole?: string
  }

function CellLink(props: CellLinkProps) {
  const { clickable = true, isLink = true, role = "link", ariaRole = "link", ...restProps } = props

  return (
    <CellRoot
      {...(restProps as unknown as CellProps)}
      component={Navigator}
      clickable={clickable}
      isLink={isLink}
      role={role}
      ariaRole={ariaRole}
    />
  )
}

export default CellLink
