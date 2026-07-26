import { View } from "@tarojs/components"
import * as React from "react"
import type { ReactNode } from "react"
import { isFunction } from "lodash"
import { prefixClassname } from "../styles"
import CalendarWeekdays from "./calendar-weekdays"
import type { CalendarSubtitle } from "./calendar.shared"

interface CalendarHeaderProps {
  showTitle?: boolean
  title?: ReactNode
  subtitle?: CalendarSubtitle
  showSubtitle?: boolean
  date?: Date
}

function CalendarHeader(props: CalendarHeaderProps) {
  const { showTitle, title, subtitle, showSubtitle, date } = props
  return (
    <View className={prefixClassname("calendar__header")}>
      {showTitle && <View className={prefixClassname("calendar__header-title")}>{title}</View>}
      {showSubtitle && (
        <View className={prefixClassname("calendar__header-subtitle")}>
          {isFunction(subtitle) ? (date ? subtitle(date) : "") : subtitle}
        </View>
      )}
      <CalendarWeekdays />
    </View>
  )
}

export default CalendarHeader
