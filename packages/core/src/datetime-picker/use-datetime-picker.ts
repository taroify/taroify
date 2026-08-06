import * as _ from "lodash"
import { useMemo } from "react"
import {
  clampDate,
  type DatetimePickerColumnType,
  type DatetimePickerType,
  getDatetime,
  getEndDayOfMonth,
  MAX_DATE,
  MIN_DATE,
  useDatetimeRanges,
} from "./datetime-picker.shared"

interface UseDatetimePicker {
  type?: DatetimePickerType
  defaultValue?: Date
  value?: Date
  min?: Date
  max?: Date
  fields?: DatetimePickerColumnType[]
  columnsType?: DatetimePickerColumnType[]

  filter?(type: DatetimePickerColumnType, values: string[]): string[]

  formatter?(type: DatetimePickerColumnType, value: string): string
}

const defaultFormatter = (_type: DatetimePickerColumnType, value: string) => value

const DATETIME_COLUMN_TYPES: DatetimePickerColumnType[] = [
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
]

function createDate(
  selected: Map<DatetimePickerColumnType, number>,
  columnsType: DatetimePickerColumnType[],
  minDate: Date,
  maxDate: Date,
) {
  const [minYear, minMonth, minDay, minHour, minMinute, minSecond] = getDatetime(minDate)
  const year = selected.get("year") ?? minYear
  const month = selected.get("month") ?? minMonth
  const day = Math.min(
    selected.get("day") ?? (columnsType.includes("month") ? 1 : minDay),
    getEndDayOfMonth(year, month),
  )
  const date = new Date(minDate.getTime())
  date.setFullYear(year, month - 1, day)
  date.setHours(
    selected.get("hour") ?? minHour,
    selected.get("minute") ?? minMinute,
    selected.get("second") ?? minSecond,
  )
  return clampDate(date, minDate, maxDate)
}

export function useDatetimePicker(options: UseDatetimePicker = {}) {
  const {
    defaultValue = undefined,
    value = undefined,
    min: minDate = MIN_DATE,
    max: maxDate = MAX_DATE,
    type = "datetime",
    fields = [],
    columnsType = [],
    filter,
    formatter = defaultFormatter,
  } = options
  const clampDefaultValue = clampDate(defaultValue, minDate, maxDate)
  // When the defaultValue has value and the value is undefined,
  // set the value to defaultValue
  // The clampValue is value or defaultValue
  const clampValue = clampDate(value ?? defaultValue, minDate, maxDate)
  const rangeValue = useMemo(() => {
    if (_.isEmpty(columnsType)) {
      return clampValue
    }
    const currentDatetime = getDatetime(clampValue)
    const selected = new Map<DatetimePickerColumnType, number>()
    _.forEach(DATETIME_COLUMN_TYPES, (columnType, index) => {
      if (columnsType.includes(columnType)) {
        selected.set(columnType, currentDatetime[index])
      }
    })
    return createDate(selected, columnsType, minDate, maxDate)
  }, [clampValue, columnsType, maxDate, minDate])
  const ranges = useDatetimeRanges(rangeValue, minDate, maxDate, type, fields, columnsType)

  const columns = useMemo(
    () =>
      _.map(ranges, ({ type, range }) => {
        let values = _.times(range[1] - range[0] + 1, (index) =>
          _.padStart(`${range[0] + index}`, 2, "0"),
        )
        if (filter) {
          values = filter(type, values)
        }

        const children = _.map(values, (value) => ({
          value,
          children: formatter(type, value),
        }))

        return {
          type,
          value: type,
          children,
        }
      }),
    [filter, formatter, ranges],
  )

  function toDate(datetimeValue: string[]): Date {
    const selected = new Map<DatetimePickerColumnType, number>()

    _.forEach(columns, ({ type }, index) => {
      if (_.size(datetimeValue) > index) {
        selected.set(type, _.toNumber(datetimeValue[index]))
      }
    })

    return createDate(
      selected,
      _.map(columns, ({ type }) => type),
      minDate,
      maxDate,
    )
  }

  function toValue(date: Date | undefined) {
    if (_.isUndefined(date)) {
      return date
    }
    const [year, month, day, hour, minute, second] = getDatetime(date)
    return _.map(columns, (column) => {
      switch (column.type) {
        case "year":
          return _.toString(year)
        case "month":
          return _.padStart(_.toString(month), 2, "0")
        case "day":
          return _.padStart(_.toString(day), 2, "0")
        case "hour":
          return _.padStart(_.toString(hour), 2, "0")
        case "minute":
          return _.padStart(_.toString(minute), 2, "0")
        case "second":
          return _.padStart(_.toString(second), 2, "0")
      }
    })
  }

  return {
    toDate,
    defaultValue: toValue(_.isUndefined(defaultValue) ? defaultValue : clampDefaultValue),
    value: toValue(_.isUndefined(value) ? value : clampValue),
    selectedDate: clampValue,
    columns,
  }
}

export default useDatetimePicker
