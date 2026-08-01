import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from "react"
import CalendarComponent, { type CalendarProps } from "./calendar"
import CalendarButton from "./calendar-button"
import CalendarFooter from "./calendar-footer"
import type { CalendarDayObject, CalendarInstance } from "./calendar.shared"

export type { CalendarProps } from "./calendar"
export type {
  CalendarDayType,
  CalendarInstance,
  CalendarMonthTitle,
  CalendarMonthShowEvent,
  CalendarPanelChangeEvent,
  CalendarSubtitle,
  CalendarSwitchMode,
  CalendarThemeVars,
  CalendarType,
  CalendarValueType,
} from "./calendar.shared"

interface CalendarInterface
  extends ForwardRefExoticComponent<
    PropsWithoutRef<CalendarProps> & RefAttributes<CalendarInstance>
  > {
  Footer: typeof CalendarFooter
  Button: typeof CalendarButton
}

const Calendar = CalendarComponent as CalendarInterface

Calendar.Footer = CalendarFooter
Calendar.Button = CalendarButton

namespace Calendar {
  export type DayObject = CalendarDayObject
}

export default Calendar
