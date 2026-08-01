import { View } from "@tarojs/components"
import * as _ from "lodash"
// biome-ignore lint/correctness/noUnusedImports: the package Babel preset uses the classic JSX runtime
import * as React from "react"
import { useContext } from "react"
import { prefixClassname } from "../styles"
import CalendarContext from "./calendar.context"

function CalendarWeekdays() {
  const { firstDayOfWeek } = useContext(CalendarContext)
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"]

  const renderWeekdays = [
    ...weekdays.slice(firstDayOfWeek, 7),
    ...weekdays.slice(0, firstDayOfWeek),
  ]
  return (
    <View className={prefixClassname("calendar__weekdays")}>
      {
        //
        _.map(renderWeekdays, (day) => (
          <View className={prefixClassname("calendar__weekday")} key={day} children={day} />
        ))
      }
    </View>
  )
}

export default CalendarWeekdays
