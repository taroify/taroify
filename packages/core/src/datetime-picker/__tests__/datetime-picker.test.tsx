import { act, fireEvent, render, renderHook } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import DatetimePicker, { type DatetimePickerInstance } from "../index"
import {
  clampDate,
  getDatetime,
  getEndDayOfMonth,
  MAX_DATE,
  MIN_DATE,
  useDatetimeRanges,
  type DatetimePickerColumnType,
  type DatetimePickerType,
} from "../datetime-picker.shared"
import { useDatetimePicker } from "../use-datetime-picker"

const min = new Date(2020, 0, 1, 0, 0, 0)
const max = new Date(2025, 11, 31, 23, 59, 59)

function getColumnTypes(columns: { type: DatetimePickerColumnType }[]) {
  return columns.map(({ type }) => type)
}

function expectDate(value: Date | undefined, expected: Date) {
  expect(value).toBeInstanceOf(Date)
  expect(value?.getTime()).toBe(expected.getTime())
}

describe("datetime helpers", () => {
  it("uses the last second of the default maximum date", () => {
    expect(MAX_DATE.getFullYear()).toBe(new Date().getFullYear() + 10)
    expect(getDatetime(MAX_DATE).slice(1)).toEqual([12, 31, 23, 59, 59])
    expect(MIN_DATE.getFullYear()).toBe(new Date().getFullYear() - 10)
  })

  it("returns month lengths for regular and leap years", () => {
    expect(getEndDayOfMonth(2023, 2)).toBe(28)
    expect(getEndDayOfMonth(2024, 2)).toBe(29)
  })

  it("clamps dates without mutating the input", () => {
    const value = new Date(2024, 5, 15, 12, 30, 20)

    expectDate(clampDate(undefined, min, max), min)
    expectDate(clampDate(new Date(2019, 11, 31), min, max), min)
    expectDate(clampDate(new Date(2026, 0, 1), min, max), max)
    expectDate(clampDate(value, min, max), value)
    expect(clampDate(value, min, max)).not.toBe(value)
  })
})

describe("useDatetimeRanges", () => {
  it.each<[DatetimePickerType, DatetimePickerColumnType[]]>([
    ["date", ["year", "month", "day"]],
    ["time", ["hour", "minute", "second"]],
    ["year-month", ["year", "month"]],
    ["month-day", ["month", "day"]],
    ["date-hour", ["year", "month", "day", "hour"]],
    ["date-minute", ["year", "month", "day", "hour", "minute"]],
    ["hour-minute", ["hour", "minute"]],
    ["datetime", ["year", "month", "day", "hour", "minute", "second"]],
  ])("returns the expected columns for %s", (type, expected) => {
    const { result } = renderHook(() =>
      useDatetimeRanges(new Date(2024, 5, 15, 12, 30, 20), min, max, type, []),
    )

    expect(getColumnTypes(result.current)).toEqual(expected)
  })

  it("restores the default order after fields is removed", () => {
    const { result, rerender } = renderHook(
      ({ fields }) => useDatetimeRanges(new Date(2024, 5, 15), min, max, "date", fields),
      { initialProps: { fields: ["day", "month", "year"] as DatetimePickerColumnType[] } },
    )

    expect(getColumnTypes(result.current)).toEqual(["day", "month", "year"])

    rerender({ fields: [] })

    expect(getColumnTypes(result.current)).toEqual(["year", "month", "day"])
  })

  it("lets columnsType select and order columns with higher priority", () => {
    const { result } = renderHook(() =>
      useDatetimeRanges(
        new Date(2024, 5, 15),
        min,
        max,
        "time",
        ["second", "minute", "hour"],
        ["month", "year", "month"],
      ),
    )

    expect(getColumnTypes(result.current)).toEqual(["month", "year"])
  })

  it("narrows every range against the active boundary", () => {
    const boundaryMin = new Date(2024, 1, 10, 8, 9, 10)
    const boundaryMax = new Date(2025, 9, 20, 18, 19, 20)
    const { result } = renderHook(() =>
      useDatetimeRanges(boundaryMin, boundaryMin, boundaryMax, "datetime", []),
    )

    expect(result.current).toEqual([
      { type: "year", range: [2024, 2025] },
      { type: "month", range: [2, 12] },
      { type: "day", range: [10, 29] },
      { type: "hour", range: [8, 23] },
      { type: "minute", range: [9, 59] },
      { type: "second", range: [10, 59] },
    ])
  })

  it("falls back through partial boundary matches and an omitted date", () => {
    const boundaryMin = new Date(2024, 1, 10, 8, 9, 10)
    const boundaryMax = new Date(2025, 9, 20, 18, 19, 20)
    const { result, rerender } = renderHook(
      ({ date }) => useDatetimeRanges(date, boundaryMin, boundaryMax, "datetime", []),
      { initialProps: { date: new Date(2024, 1, 11, 8, 9, 10) as Date | undefined } },
    )

    expect(result.current[3]).toEqual({ type: "hour", range: [0, 23] })

    rerender({ date: new Date(2024, 1, 10, 8, 10, 10) })
    expect(result.current[5]).toEqual({ type: "second", range: [0, 59] })

    rerender({ date: undefined })
    expect(result.current[0]).toEqual({ type: "year", range: [2024, 2025] })
  })
})

describe("useDatetimePicker", () => {
  it("supports all default options and incomplete picker values", () => {
    const { result } = renderHook(() => useDatetimePicker())

    expect(getColumnTypes(result.current.columns)).toEqual([
      "year",
      "month",
      "day",
      "hour",
      "minute",
      "second",
    ])
    expectDate(result.current.toDate([]), MIN_DATE)
  })

  it("filters and formats column options", () => {
    const filter = jest.fn((type: DatetimePickerColumnType, values: string[]) =>
      type === "minute" ? values.filter((value) => Number(value) % 15 === 0) : values,
    )
    const formatter = jest.fn((type: DatetimePickerColumnType, value: string) =>
      type === "minute" ? `${value}分` : value,
    )
    const { result } = renderHook(() =>
      useDatetimePicker({
        type: "hour-minute",
        min: new Date(2024, 0, 1, 10, 0),
        max: new Date(2024, 0, 1, 12, 59),
        defaultValue: new Date(2024, 0, 1, 11, 30),
        filter,
        formatter,
      }),
    )

    expect(result.current.defaultValue).toEqual(["11", "30"])
    expect(result.current.value).toBeUndefined()
    expect(result.current.columns[1].children).toEqual([
      { value: "00", children: "00分" },
      { value: "15", children: "15分" },
      { value: "30", children: "30分" },
      { value: "45", children: "45分" },
    ])
    expect(filter).toHaveBeenCalledWith("minute", expect.any(Array))
    expect(formatter).toHaveBeenCalledWith("minute", "30")
  })

  it("converts an arbitrary column order into a valid date", () => {
    const { result } = renderHook(() =>
      useDatetimePicker({
        min,
        max,
        columnsType: ["day", "month", "year", "minute", "hour", "second"],
      }),
    )

    expectDate(
      result.current.toDate(["31", "02", "2024", "45", "12", "30"]),
      new Date(2024, 1, 29, 12, 45, 30),
    )
  })

  it("uses the first day when a month column has no day column", () => {
    const { result } = renderHook(() =>
      useDatetimePicker({
        min: new Date(2020, 5, 20, 8, 9, 10),
        max,
        columnsType: ["year", "month"],
      }),
    )

    expectDate(result.current.toDate(["2024", "02"]), new Date(2024, 1, 1, 8, 9, 10))
  })

  it("uses minimum date parts for omitted columns", () => {
    const boundaryMin = new Date(2020, 5, 20, 8, 9, 10)
    const { result } = renderHook(() =>
      useDatetimePicker({
        min: boundaryMin,
        max,
        value: new Date(2024, 0, 1),
        columnsType: ["month"],
      }),
    )

    expect(result.current.columns[0].children[0].value).toBe("06")
    expectDate(result.current.toDate(["07"]), new Date(2020, 6, 1, 8, 9, 10))
  })
})

describe("<DatetimePicker />", () => {
  it("forwards supported Picker and View props", () => {
    const { container, getByText } = render(
      <DatetimePicker
        min={min}
        max={max}
        defaultValue={new Date(2024, 5, 15)}
        columnsType={["year"]}
        id="datetime-picker"
        readonly
      >
        <DatetimePicker.Toolbar>
          <DatetimePicker.Button>返回</DatetimePicker.Button>
          <DatetimePicker.Title>选择年份</DatetimePicker.Title>
          <DatetimePicker.Button>完成</DatetimePicker.Button>
        </DatetimePicker.Toolbar>
      </DatetimePicker>,
    )

    expect(getByText("选择年份")).toBeInTheDocument()
    expect(getByText("返回")).toBeInTheDocument()
    expect(getByText("完成")).toBeInTheDocument()
    expect(container.querySelector(`.${prefixClassname("picker")}`)).toHaveAttribute(
      "id",
      "datetime-picker",
    )
    expect(container.querySelector(`.${prefixClassname("picker-option")}`)).toHaveStyle({
      height: "44px",
    })
  })

  it("exposes the selected date and confirms it from the instance", () => {
    const ref = React.createRef<DatetimePickerInstance>()
    const onConfirm = jest.fn()
    const selected = new Date(2024, 5, 15, 12, 30, 20)
    const { rerender } = render(
      <DatetimePicker ref={ref} min={min} max={max} value={selected} onConfirm={onConfirm} />,
    )

    expectDate(ref.current?.getSelectedDate(), selected)
    expect(ref.current?.getSelectedDate()).not.toBe(selected)

    act(() => ref.current?.confirm())
    expectDate(onConfirm.mock.calls[0][0], selected)

    const next = new Date(2025, 0, 2, 3, 4, 5)
    rerender(<DatetimePicker ref={ref} min={min} max={max} value={next} onConfirm={onConfirm} />)
    expectDate(ref.current?.getSelectedDate(), next)
  })

  it("falls back to the clamped value when no selectable options exist", () => {
    const ref = React.createRef<DatetimePickerInstance>()
    const selected = new Date(2024, 5, 15, 12, 30, 20)
    render(<DatetimePicker ref={ref} min={min} max={max} value={selected} filter={() => []} />)

    expectDate(ref.current?.getSelectedDate(), selected)
  })

  it("emits Date values for change, confirm, and cancel", () => {
    const onChange = jest.fn()
    const onConfirm = jest.fn()
    const onCancel = jest.fn()
    const { getByText } = render(
      <DatetimePicker
        min={new Date(2024, 0, 1)}
        max={new Date(2025, 11, 31, 23, 59, 59)}
        defaultValue={new Date(2024, 5, 15)}
        columnsType={["year"]}
        onChange={onChange}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )

    fireEvent.click(getByText("2025"))
    expectDate(onChange.mock.calls[0][0], new Date(2025, 0, 1))

    fireEvent.click(getByText("确认"))
    fireEvent.click(getByText("取消"))
    expectDate(onConfirm.mock.calls[0][0], new Date(2025, 0, 1))
    expectDate(onCancel.mock.calls[0][0], new Date(2025, 0, 1))
  })
})
