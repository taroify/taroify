import type { ReactNode } from "react"

export { getEndDayOfMonth } from "../datetime-picker/datetime-picker.shared"

export type CalendarType = "single" | "multiple" | "range"

export type CalendarSwitchMode = "none" | "month" | "year-month"

export type CalendarValueType = Date | Date[] | null

export type CalendarSubtitle = ReactNode | ((date: Date) => ReactNode)

export type CalendarMonthTitle = ReactNode | ((date: Date, title: string) => ReactNode)

export interface CalendarMonthShowEvent {
  date: Date
  title: string
}

export interface CalendarPanelChangeEvent {
  date: Date
}

export interface CalendarInstance {
  reset(date?: CalendarValueType): void

  scrollToDate(date: Date): void

  getSelectedDate(): CalendarValueType
}

export type CalendarDayType =
  | ""
  | "start"
  | "start-end"
  | "middle"
  | "end"
  | "selected"
  | "active"
  | "disabled"
  | "placeholder"

export interface CalendarDayObject {
  className?: string
  type: CalendarDayType
  value: Date
  children: ReactNode
  top?: ReactNode
  bottom?: ReactNode
}

export type CalendarThemeVars = {
  calendarActiveColor?: string
  calendarBackgroundColor?: string
  calendarHeaderBoxShadow?: string
  calendarHeaderTitleHeight?: string
  calendarHeaderTitleFontSize?: string
  calendarHeaderSubtitleFontSize?: string
  calendarHeaderActionWidth?: string
  calendarHeaderActionColor?: string
  calendarHeaderActionDisabledColor?: string
  calendarWeekdaysHeight?: string
  calendarWeekdaysFontSize?: string
  calendarMonthTitleFontSize?: string
  calendarMonthWatermarkColor?: string
  calendarMonthWatermarkFontSize?: string
  calendarRangeEdgeColor?: string
  calendarRangeEdgeBackgroundColor?: string
  calendarRangeMiddleColor?: string
  calendarRangeMiddleBackgroundOpacity?: string
  calendarDayHeight?: string
  calendarDayFontSize?: string
  calendarDayDisabledColor?: string
  calendarActiveDaySize?: string
  calendarActiveDayColor?: string
  calendarActiveDayBackgroundColor?: string
  calendarActiveDayBorderRadius?: string
  calendarDayInfoFontSize?: string
  calendarDayInfoLineHeight?: string
  calendarConfirmButtonHeight?: string
  calendarConfirmButtonMargin?: string
  calendarConfirmButtonColor?: string
  calendarFooterPadding?: string
}

export function compareYearMonth(date1: Date, date2: Date) {
  const year1 = date1?.getFullYear()
  const year2 = date2?.getFullYear()

  if (year1 === year2) {
    const month1 = date1?.getMonth()
    const month2 = date2?.getMonth()
    return month1 === month2 ? 0 : month1 > month2 ? 1 : -1
  }

  return year1 > year2 ? 1 : -1
}

export function compareDate(day1: Date, day2: Date) {
  const compareMonthResult = compareYearMonth(day1, day2)

  if (compareMonthResult === 0) {
    const date1 = day1?.getDate()
    const date2 = day2?.getDate()
    return date1 === date2 ? 0 : date1 > date2 ? 1 : -1
  }

  return compareMonthResult
}

export const cloneDate = (date: Date) => new Date(date)

export function createDayByOffset(date: Date, offset: number) {
  const cloned = cloneDate(date)
  cloned.setDate(cloned.getDate() + offset)
  return cloned
}

export function createMonthByOffset(date: Date, offset: number) {
  const cloned = cloneDate(date)
  cloned.setMonth(cloned.getMonth() + offset)
  if (cloned.getDate() !== date.getDate()) {
    cloned.setDate(0)
  }
  return cloned
}

export function createYearByOffset(date: Date, offset: number) {
  const cloned = cloneDate(date)
  cloned.setFullYear(cloned.getFullYear() + offset)
  if (cloned.getDate() !== date.getDate()) {
    cloned.setDate(0)
  }
  return cloned
}

export function getDateCount([start, end]: [Date, Date]) {
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1
}

export const createPreviousDay = (date: Date) => createDayByOffset(date, -1)

export const createNextDay = (date: Date) => createDayByOffset(date, 1)

export function createToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export const MIN_DATE = createToday()

export const MAX_DATE = new Date(MIN_DATE.getFullYear(), MIN_DATE.getMonth() + 6, 14)

export const genMonthId = (date: Date) =>
  `taroify-calendar-${date.getFullYear()}-${date.getMonth()}`
