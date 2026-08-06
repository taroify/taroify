import * as _ from "lodash"
import { useMemo } from "react"

export type DatetimePickerType =
  | "date"
  | "time"
  | "datetime"
  | "date-hour"
  | "date-minute"
  | "year-month"
  | "month-day"
  | "hour-minute"

export type DatetimePickerColumnType = "year" | "month" | "day" | "hour" | "minute" | "second"

type Datetime = [number, number, number, number, number, number]

const CURRENT_YEAR = new Date().getFullYear()

export const MIN_DATE = new Date(CURRENT_YEAR - 10, 0, 1, 0, 0, 0)

export const MAX_DATE = new Date(CURRENT_YEAR + 10, 11, 31, 23, 59, 59)

export function getEndDayOfMonth(year: number, month: number): number {
  return 32 - new Date(year, month - 1, 32).getDate()
}

export function clampDate(value: Date | undefined, minDate: Date, maxDate: Date) {
  if (_.isUndefined(value)) {
    return minDate
  }
  const timestamp = _.clamp(value.getTime(), minDate.getTime(), maxDate.getTime())
  return new Date(timestamp)
}

export function getDatetime(date: Date): Datetime {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ]
}

function getBoundaryDatetime(type: "max" | "min", boundary: Date, current: Date): Datetime {
  const year = boundary.getFullYear()
  let month = 1
  let day = 1
  let hour = 0
  let minute = 0
  let second = 0

  if (type === "max") {
    month = 12
    day = getEndDayOfMonth(current.getFullYear(), current.getMonth() + 1)
    hour = 23
    minute = 59
    second = 59
  }
  if (current.getFullYear() === year) {
    month = boundary.getMonth() + 1
    if (current.getMonth() + 1 === month) {
      day = boundary.getDate()
      if (current.getDate() === day) {
        hour = boundary.getHours()
        if (current.getHours() === hour) {
          minute = boundary.getMinutes()
          if (current.getMinutes() === minute) {
            second = boundary.getSeconds()
          }
        }
      }
    }
  }

  return [year, month, day, hour, minute, second]
}

function getMinDatetime(boundary: Date, current: Date): Datetime {
  return getBoundaryDatetime("min", boundary, current)
}

function getMaxDatetime(boundary: Date, current: Date): Datetime {
  return getBoundaryDatetime("max", boundary, current)
}

interface DatetimeRange {
  type: DatetimePickerColumnType
  range: [number, number]
}

function useAllDatetimeRanges(
  date: Date | undefined,
  minDate: Date,
  maxDate: Date,
): DatetimeRange[] {
  const [minYear, minMonth, minDay, minHour, minMinute, minSecond] = getMinDatetime(
    minDate,
    date ?? minDate,
  )
  const [maxYear, maxMonth, maxDay, maxHour, maxMinute, maxSecond] = getMaxDatetime(
    maxDate,
    date ?? minDate,
  )

  return useMemo(
    () => [
      {
        type: "year",
        range: [minYear, maxYear],
      },
      {
        type: "month",
        range: [minMonth, maxMonth],
      },
      {
        type: "day",
        range: [minDay, maxDay],
      },
      {
        type: "hour",
        range: [minHour, maxHour],
      },
      {
        type: "minute",
        range: [minMinute, maxMinute],
      },
      {
        type: "second",
        range: [minSecond, maxSecond],
      },
    ],
    [
      maxDay,
      maxHour,
      maxMinute,
      maxMonth,
      maxSecond,
      maxYear,
      minDay,
      minHour,
      minMinute,
      minMonth,
      minSecond,
      minYear,
    ],
  )
}

function useSpecifiedDatetimeRanges(
  ranges: DatetimeRange[],
  type: DatetimePickerType,
  columnsType: DatetimePickerColumnType[],
) {
  return useMemo(() => {
    if (!_.isEmpty(columnsType)) {
      return _.compact(
        _.map(_.uniq(columnsType), (columnType) =>
          _.find(ranges, ({ type }) => type === columnType),
        ),
      )
    }

    switch (type) {
      case "date":
        return _.slice(ranges, 0, 3)
      case "time":
        return _.slice(ranges, 3, 6)
      case "year-month":
        return _.slice(ranges, 0, 2)
      case "month-day":
        return _.slice(ranges, 1, 3)
      case "date-hour":
        return _.slice(ranges, 0, 4)
      case "date-minute":
        return _.slice(ranges, 0, 5)
      case "hour-minute":
        return _.slice(ranges, 3, 5)
    }
    return ranges
  }, [columnsType, ranges, type])
}

function useOrderedDatetimeRanges(ranges: DatetimeRange[], fields: DatetimePickerColumnType[]) {
  return useMemo(() => {
    if (_.isEmpty(fields)) {
      return ranges
    }

    const fieldsOrder = _.concat(
      fields,
      _.map(ranges, ({ type }) => type),
    )

    return _.sortBy(ranges, ({ type }) => fieldsOrder.indexOf(type))
  }, [fields, ranges])
}

export function useDatetimeRanges(
  date: Date | undefined,
  minDate: Date,
  maxDate: Date,
  type: DatetimePickerType,
  fields: DatetimePickerColumnType[],
  columnsType: DatetimePickerColumnType[] = [],
) {
  const allRanges = useAllDatetimeRanges(date, minDate, maxDate)
  const specifiedRanges = useSpecifiedDatetimeRanges(allRanges, type, columnsType)
  return useOrderedDatetimeRanges(specifiedRanges, _.isEmpty(columnsType) ? fields : [])
}
