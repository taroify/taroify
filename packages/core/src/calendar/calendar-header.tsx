import { View } from "@tarojs/components"
import type { ITouchEvent } from "@tarojs/components"
import { ArrowDoubleLeft, ArrowDoubleRight, ArrowLeft, ArrowRight } from "@taroify/icons"
import classNames from "classnames"
// biome-ignore lint/correctness/noUnusedImports: the package Babel preset uses the classic JSX runtime
import * as React from "react"
import type { ReactNode } from "react"
import { isFunction } from "lodash"
import { prefixClassname } from "../styles"
import CalendarWeekdays from "./calendar-weekdays"
import {
  type CalendarSubtitle,
  type CalendarSwitchMode,
  compareYearMonth,
  createMonthByOffset,
  createYearByOffset,
} from "./calendar.shared"

interface CalendarHeaderProps {
  showTitle?: boolean
  title?: ReactNode
  subtitle?: CalendarSubtitle
  showSubtitle?: boolean
  switchMode: CalendarSwitchMode
  date?: Date
  min?: Date
  max?: Date

  onClickSubtitle?(event: ITouchEvent): void

  onPanelChange?(date: Date): void
}

function CalendarHeader(props: CalendarHeaderProps) {
  const {
    showTitle,
    title,
    subtitle,
    showSubtitle,
    switchMode,
    date,
    min,
    max,
    onClickSubtitle,
    onPanelChange,
  } = props
  const canSwitch = switchMode !== "none"
  const subtitleContent = isFunction(subtitle) ? (date ? subtitle(date) : "") : subtitle

  const renderAction = (direction: "previous" | "next") => {
    const isNext = direction === "next"
    const monthDate = createMonthByOffset(date!, isNext ? 1 : -1)
    const yearDate = createYearByOffset(date!, isNext ? 1 : -1)
    const monthDisabled = isNext
      ? !!max && compareYearMonth(monthDate, max) > 0
      : !!min && compareYearMonth(monthDate, min) < 0
    const yearDisabled = isNext
      ? !!max && compareYearMonth(yearDate, max) > 0
      : !!min && compareYearMonth(yearDate, min) < 0

    const renderButton = (
      kind: "month" | "year",
      disabled: boolean,
      targetDate: Date,
      icon: ReactNode,
    ) => (
      <View
        key={`${direction}-${kind}`}
        className={classNames(prefixClassname("calendar__header-action"), {
          [prefixClassname("calendar__header-action--disabled")]: disabled,
        })}
        onClick={(event) => {
          event.stopPropagation()
          if (!disabled) {
            onPanelChange?.(targetDate)
          }
        }}
        data-calendar-action={`${direction}-${kind}`}
      >
        {icon}
      </View>
    )

    const monthAction = renderButton(
      "month",
      monthDisabled,
      monthDate,
      isNext ? <ArrowRight /> : <ArrowLeft />,
    )
    const yearAction =
      switchMode === "year-month"
        ? renderButton(
            "year",
            yearDisabled,
            yearDate,
            isNext ? <ArrowDoubleRight /> : <ArrowDoubleLeft />,
          )
        : null

    return isNext ? [monthAction, yearAction] : [yearAction, monthAction]
  }

  return (
    <View className={prefixClassname("calendar__header")}>
      {showTitle && <View className={prefixClassname("calendar__header-title")}>{title}</View>}
      {showSubtitle && (
        <View
          className={classNames(prefixClassname("calendar__header-subtitle"), {
            [prefixClassname("calendar__header-subtitle--with-switch")]: canSwitch,
          })}
          onClick={onClickSubtitle}
        >
          {canSwitch ? (
            <>
              {date && renderAction("previous")}
              <View
                className={prefixClassname("calendar__header-subtitle-text")}
                children={subtitleContent}
              />
              {date && renderAction("next")}
            </>
          ) : (
            subtitleContent
          )}
        </View>
      )}
      <CalendarWeekdays />
    </View>
  )
}

export default CalendarHeader
