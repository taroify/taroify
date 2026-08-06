import { DatetimePicker } from "@taroify/core"
// biome-ignore lint/correctness/noUnusedImports: the classic JSX runtime requires React in scope
import * as React from "react"
import { useState } from "react"
import Block from "../../../components/block"
import CustomWrapper from "../../../components/custom-wrapper"
import Page from "../../../components/page"
import "./index.scss"

function DatePicker() {
  const [minDate] = useState(new Date(2019, 0, 1))
  const [maxDate] = useState(new Date(2023, 11, 12))
  const [defaultValue] = useState(new Date(2021, 12, 14))
  const [value, setValue] = useState(new Date(2022, 10, 14))
  return (
    <DatetimePicker
      type="date"
      min={minDate}
      max={maxDate}
      defaultValue={defaultValue}
      value={value}
      onChange={setValue}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年月日</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}

function YearMonthPicker() {
  const [minDate] = useState(new Date(2020, 0, 1))
  const [maxDate] = useState(new Date(2025, 10, 1))
  const [defaultValue] = useState(new Date(2021, 0, 17))

  return (
    <DatetimePicker
      type="year-month"
      min={minDate}
      max={maxDate}
      defaultValue={defaultValue}
      formatter={(type, val) => {
        if (type === "year") {
          return `${val}年`
        }
        if (type === "month") {
          return `${val}月`
        }
        return val
      }}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年月</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}

function MonthDayPicker() {
  const [minDate] = useState(new Date(2020, 0, 1))
  const [maxDate] = useState(new Date(2025, 10, 1))
  const [defaultValue] = useState(new Date(2021, 0, 17))

  return (
    <DatetimePicker
      type="month-day"
      min={minDate}
      max={maxDate}
      defaultValue={defaultValue}
      formatter={(type, val) => {
        if (type === "month") {
          return `${val}月`
        }
        if (type === "day") {
          return `${val}日`
        }
        return val
      }}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年月</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}

function TimePicker() {
  const [minDate] = useState(new Date(2020, 0, 1, 10, 0, 0))
  const [maxDate] = useState(new Date(2020, 0, 1, 20, 59, 59))
  const [defaultValue] = useState(new Date(2020, 0, 1, 12, 0, 0))

  return (
    <DatetimePicker type="time" min={minDate} max={maxDate} defaultValue={defaultValue}>
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择时间</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}

function DateTimePicker() {
  const [minDate] = useState(new Date(2020, 0, 1, 10, 0, 0))
  const [maxDate] = useState(new Date(2025, 10, 1, 20, 59, 59))
  const [defaultValue] = useState(new Date(2021, 2, 3, 12, 12, 12))

  return (
    <DatetimePicker type="datetime" min={minDate} max={maxDate} defaultValue={defaultValue}>
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择完整时间</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}

function DateHourPicker() {
  const [minDate] = useState(new Date(2020, 0, 1, 0))
  const [maxDate] = useState(new Date(2025, 10, 1, 23))
  const [defaultValue] = useState(new Date())

  return (
    <DatetimePicker type="date-hour" min={minDate} max={maxDate} defaultValue={defaultValue}>
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年月日小时</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}

function DateMinutePicker() {
  const [minDate] = useState(new Date(2020, 0, 1, 0, 0))
  const [maxDate] = useState(new Date(2025, 10, 1, 23, 59))
  const [defaultValue] = useState(new Date())

  return (
    <DatetimePicker type="date-minute" min={minDate} max={maxDate} defaultValue={defaultValue}>
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年月日时分</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}

function TimePickerWithFilter() {
  const [minDate] = useState(new Date(2020, 0, 1, 0, 0, 0))
  const [maxDate] = useState(new Date(2020, 0, 1, 23, 59, 59))
  const [defaultValue] = useState(new Date(2020, 0, 1, 12, 0, 0))

  return (
    <DatetimePicker
      type="time"
      min={minDate}
      max={maxDate}
      defaultValue={defaultValue}
      filter={(type, options) => {
        if (type === "minute") {
          return options.filter((option) => Number(option) % 5 === 0)
        }
        return options
      }}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选项过滤器</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}

function DatePickerWithFields() {
  const [minDate] = useState(new Date(2020, 0, 1))
  const [maxDate] = useState(new Date(2025, 10, 1))
  const [defaultValue] = useState(new Date(2021, 0, 17))
  return (
    <DatetimePicker
      type="date"
      fields={["month", "day", "year"]}
      defaultValue={defaultValue}
      min={minDate}
      max={maxDate}
      formatter={(type, val) => {
        if (type === "year") {
          return val + "年"
        }
        if (type === "month") {
          return val + "月"
        }
        if (type === "day") {
          return val + "日"
        }
        return val
      }}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>自定义列排序</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}

function DatePickerWithColumnsType() {
  const [minDate] = useState(new Date(2020, 0, 1))
  const [maxDate] = useState(new Date(2025, 11, 31))
  const [defaultValue] = useState(new Date(2024, 0, 1))

  return (
    <DatetimePicker
      columnsType={["year"]}
      defaultValue={defaultValue}
      min={minDate}
      max={maxDate}
      formatter={(type, val) => (type === "year" ? `${val}年` : val)}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年份</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}

export default function PickerDemo() {
  return (
    <Page title="DatetimePicker 时间选择" className="datetime-picker-demo">
      <Block variant="card" title="选择年月日">
        <CustomWrapper>
          <DatePicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="选择年月">
        <CustomWrapper>
          <YearMonthPicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="选择月日">
        <CustomWrapper>
          <MonthDayPicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="选择时间">
        <CustomWrapper>
          <TimePicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="选择完整时间">
        <CustomWrapper>
          <DateTimePicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="选择年月日小时">
        <CustomWrapper>
          <DateHourPicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="选择年月日时分">
        <CustomWrapper>
          <DateMinutePicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="选项过滤器">
        <CustomWrapper>
          <TimePickerWithFilter />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="自定义列排序">
        <CustomWrapper>
          <DatePickerWithFields />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="选项类型">
        <CustomWrapper>
          <DatePickerWithColumnsType />
        </CustomWrapper>
      </Block>
    </Page>
  )
}
