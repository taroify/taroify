import { View } from "@tarojs/components"
import * as _ from "lodash"
// biome-ignore lint/correctness/noUnusedImports: the package Babel preset uses the classic JSX runtime
import * as React from "react"
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { prefixClassname } from "../styles"
import { getRect } from "../utils/dom/rect"
import { useHeight } from "../hooks"
import CalendarDay from "./calendar-day"
import CalendarContext from "./calendar.context"
import {
  type CalendarDayObject,
  type CalendarDayType,
  type CalendarMonthTitle,
  type CalendarType,
  compareDate,
  createNextDay,
  createPreviousDay,
  genMonthId,
  getEndDayOfMonth,
} from "./calendar.shared"

interface CalendarMonthWatermarkProps {
  children?: ReactNode
}

function CalendarMonthWatermark(props: CalendarMonthWatermarkProps) {
  const { children } = props
  return <View className={prefixClassname("calendar__month-watermark")} children={children} />
}

export interface CalendarMonthInstance {
  getValue(): Date

  getTitle(): string

  getHeight(): number

  getRectTop(): Promise<number>

  getDisabledDays(): CalendarDayObject[]

  setVisible(visible: boolean): void
}

function getBottom(type: CalendarType, dayType: CalendarDayType) {
  if (type === "range") {
    if (dayType === "start") {
      return "开始"
    }
    if (dayType === "end") {
      return "结束"
    }
    if (dayType === "active") {
      return "开始/结束"
    }
  }
}

interface CalendarMonthProps {
  value?: Date
  showMonthTitle?: boolean
  readonly?: boolean
  watermark?: boolean
  lazyRender?: boolean
  monthTitle?: CalendarMonthTitle
  children?: ReactNode
}

const CalendarMonth = forwardRef<CalendarMonthInstance, CalendarMonthProps>(
  (props: CalendarMonthProps, ref) => {
    const {
      value: monthValue = new Date(),
      watermark,
      showMonthTitle,
      lazyRender,
      monthTitle,
    } = props
    const {
      type,
      firstDayOfWeek,
      min,
      max,
      value: currentValue,
      formatter,
    } = useContext(CalendarContext)

    const monthRef = useRef()
    const [visible, setVisible] = useState(false)
    const shouldRender = visible || !lazyRender

    const height = useHeight(monthRef, [shouldRender])

    const month = useMemo(() => monthValue.getMonth() + 1, [monthValue])
    const id = useMemo(() => genMonthId(monthValue), [monthValue])

    const title = useMemo(
      () => `${monthValue.getFullYear()}年${monthValue.getMonth() + 1}月`,
      [monthValue],
    )

    const offset = useMemo(() => {
      const realDay = monthValue.getDay()
      if (firstDayOfWeek) {
        return (realDay + 7 - firstDayOfWeek) % 7
      }
      return realDay
    }, [firstDayOfWeek, monthValue])

    const totalDay = useMemo(
      () => getEndDayOfMonth(monthValue.getFullYear(), monthValue.getMonth() + 1),
      [monthValue],
    )

    const getMultipleDayType = useCallback(
      (day: Date) => {
        const isActive = (date: Date) =>
          _.some(currentValue as Date[], (item) => compareDate(item, date) === 0)

        if (isActive(day)) {
          const prevDay = createPreviousDay(day)
          const nextDay = createNextDay(day)
          const prevActive = isActive(prevDay)
          const nextActive = isActive(nextDay)

          if (prevActive && nextActive) {
            return "middle"
          }
          if (prevActive) {
            return "end"
          }
          if (nextActive) {
            return "start"
          }
          return "active"
        }

        return ""
      },
      [currentValue],
    )

    const getRangeDayType = useCallback(
      (day: Date) => {
        const [startDay, endDay] = currentValue as Date[]

        if (!startDay) {
          return ""
        }

        const compareToStart = compareDate(day, startDay)

        if (!endDay) {
          return compareToStart === 0 ? "start" : ""
        }

        const compareToEnd = compareDate(day, endDay)

        if (compareToStart === 0 && compareToEnd === 0) {
          return "active"
        }
        if (compareToStart === 0) {
          return "start"
        }
        if (compareToEnd === 0) {
          return "end"
        }
        if (compareToStart > 0 && compareToEnd < 0) {
          return "middle"
        }

        return ""
      },
      [currentValue],
    )

    const getDayType = useCallback(
      (dayValue: Date): CalendarDayType => {
        if (compareDate(dayValue, min) < 0 || compareDate(dayValue, max) > 0) {
          return "disabled"
        }

        if (Array.isArray(currentValue)) {
          if (type === "multiple") {
            return getMultipleDayType(dayValue)
          }
          if (type === "range") {
            return getRangeDayType(dayValue)
          }
        } else if (type === "single") {
          return compareDate(dayValue, currentValue as Date) === 0 ? "active" : ""
        }

        return ""
      },
      [currentValue, getMultipleDayType, getRangeDayType, max, min, type],
    )

    const buildDays = useCallback(() => {
      const days: CalendarDayObject[] = []
      const year = monthValue?.getFullYear()
      const month = monthValue?.getMonth()

      for (let dayValue = 1; dayValue <= totalDay; dayValue++) {
        const dateValue = new Date(year, month, dayValue)
        const dayType = getDayType(dateValue)
        const oldDay: CalendarDayObject = {
          value: dateValue,
          type: dayType,
          bottom: getBottom(type, dayType),
          children: dayValue,
        }
        const newDay = formatter ? formatter(oldDay) : oldDay
        days.push(newDay)
      }
      return days
    }, [monthValue, totalDay, getDayType, type, formatter])

    const days = useMemo<CalendarDayObject[]>(
      () => (shouldRender ? buildDays() : []),
      [buildDays, shouldRender],
    )

    const getDisabledDays = useCallback(
      () => (days.length ? days : buildDays()).filter((day) => day.type === "disabled"),
      [buildDays, days],
    )

    const getRectTop = useCallback(() => {
      return getRect(monthRef).then(({ top }) => top)
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        getRectTop,
        getDisabledDays,
        getHeight: () => height,
        getValue: () => monthValue,
        getTitle: () => title,
        setVisible,
      }),
      [getDisabledDays, getRectTop, monthValue, height, title],
    )

    const content = useMemo(() => {
      if (!shouldRender) {
        const rowCount = Math.ceil((totalDay + offset) / 7)
        return _.map(new Array(rowCount), (_, index) => (
          <CalendarDay key={`placeholder-${index}`} value={monthValue} type="placeholder" />
        ))
      }
      return _.map(days, (day, index) => (
        <CalendarDay
          key={`${day.value}-${index}`}
          className={day.className}
          style={{ marginLeft: index === 0 ? `${(100 * offset) / 7}%` : "" }}
          value={day.value}
          type={day.type}
          top={day.top}
          bottom={day.bottom}
          children={day.children}
        />
      ))
    }, [days, monthValue, offset, shouldRender, totalDay])

    return (
      <View id={id} ref={monthRef} className={prefixClassname("calendar__month")}>
        {showMonthTitle && (
          <View
            className={prefixClassname("calendar__month-title")}
            children={
              typeof monthTitle === "function"
                ? monthTitle(monthValue, title)
                : (monthTitle ?? title)
            }
          />
        )}
        <View className={prefixClassname("calendar__days")}>
          {watermark && shouldRender && <CalendarMonthWatermark children={month} />}
          {content}
        </View>
      </View>
    )
  },
)

export default CalendarMonth
