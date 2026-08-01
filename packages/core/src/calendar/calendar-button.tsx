import type { ITouchEvent } from "@tarojs/components"
import classNames from "classnames"
// biome-ignore lint/correctness/noUnusedImports: the package Babel preset uses the classic JSX runtime
import * as React from "react"
import { useContext, useMemo, type ReactNode } from "react"
import Button, { type ButtonProps } from "../button"
import { prefixClassname } from "../styles"
import CalendarContext from "./calendar.context"

export interface CalendarButtonProps extends ButtonProps {
  type?: "confirm"
  confirmText?: ReactNode
  confirmDisabledText?: ReactNode
}

function CalendarButton(props: CalendarButtonProps) {
  const {
    className,
    confirmText,
    confirmDisabledText,
    type = "confirm",
    children = "确定",
    onClick,
    ...restProps
  } = props
  const confirm = type === "confirm"
  const { value: currentValue, type: ctxType, onConfirm } = useContext(CalendarContext)

  const disabled = useMemo(() => {
    if (currentValue) {
      if (ctxType === "range") {
        return !(currentValue as Date[])[0] || !(currentValue as Date[])[1]
      }
      if (ctxType === "multiple") {
        return !(currentValue as Date[]).length
      }
    }
    return Array.isArray(currentValue) ? currentValue.length === 0 : !currentValue
  }, [ctxType, currentValue])

  const defaultContent = props.children === undefined ? children : undefined
  const content = props.children
    ? children
    : disabled
      ? (confirmDisabledText ?? defaultContent)
      : (confirmText ?? defaultContent)

  return (
    <Button
      className={classNames(
        {
          [prefixClassname("calendar__confirm")]: confirm,
        },
        className,
      )}
      shape="round"
      block
      disabled={confirm && disabled}
      color="primary"
      onClick={(event: ITouchEvent) => {
        onClick?.(event)
        if (confirm && !disabled) {
          onConfirm?.()
        }
      }}
      {...restProps}
    >
      {content}
    </Button>
  )
}

export default CalendarButton
