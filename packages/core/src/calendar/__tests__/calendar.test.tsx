import { act, fireEvent, render } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import Toast from "../../toast"
import Calendar from ".."
import CalendarContext from "../calendar.context"
import CalendarDay from "../calendar-day"
import CalendarMonth, { type CalendarMonthInstance } from "../calendar-month"
import {
  type CalendarInstance,
  cloneDate,
  compareDate,
  compareYearMonth,
  createDayByOffset,
  createMonthByOffset,
  createNextDay,
  createPreviousDay,
  createToday,
  createYearByOffset,
  genMonthId,
  getDateCount,
  getEndDayOfMonth,
} from "../calendar.shared"

jest.mock("../../toast", () => ({
  __esModule: true,
  default: { open: jest.fn() },
}))

const openToast = Toast.open as jest.Mock

const january = (day: number) => new Date(2024, 0, day)
const min = january(1)
const max = january(31)

function getCalendar(container: HTMLElement) {
  return container.querySelector(`.${prefixClassname("calendar")}`) as HTMLElement
}

function getDays(container: HTMLElement) {
  return Array.from(container.querySelectorAll(`.${prefixClassname("calendar__day")}`))
}

function getDay(container: HTMLElement, day: number) {
  return getDays(container)[day - 1] as HTMLElement
}

function expectDate(value: unknown, expected: Date) {
  expect(value).toBeInstanceOf(Date)
  expect((value as Date).getTime()).toBe(expected.getTime())
}

describe("calendar date helpers", () => {
  it("compares years, months, and days", () => {
    expect(compareYearMonth(january(1), january(31))).toBe(0)
    expect(compareYearMonth(new Date(2024, 1, 1), january(1))).toBe(1)
    expect(compareYearMonth(new Date(2023, 11, 1), january(1))).toBe(-1)
    expect(compareDate(january(10), january(10))).toBe(0)
    expect(compareDate(january(11), january(10))).toBe(1)
    expect(compareDate(january(9), january(10))).toBe(-1)
  })

  it("clones dates and creates dates by an offset without mutating the input", () => {
    const original = january(31)

    expect(cloneDate(original)).not.toBe(original)
    expectDate(createDayByOffset(original, 2), new Date(2024, 1, 2))
    expectDate(createPreviousDay(january(1)), new Date(2023, 11, 31))
    expectDate(createNextDay(january(31)), new Date(2024, 1, 1))
    expectDate(original, january(31))
  })

  it("creates today at midnight", () => {
    const today = createToday()

    expect(today.getHours()).toBe(0)
    expect(today.getMinutes()).toBe(0)
    expect(today.getSeconds()).toBe(0)
    expect(today.getMilliseconds()).toBe(0)
  })

  it("returns month lengths and stable month ids", () => {
    expect(getEndDayOfMonth(2024, 2)).toBe(29)
    expect(getEndDayOfMonth(2023, 2)).toBe(28)
    expect(genMonthId(january(1))).toBe("taroify-calendar-2024-0")
  })

  it("creates month and year offsets without overflowing month ends", () => {
    expectDate(createMonthByOffset(january(31), 1), new Date(2024, 1, 29))
    expectDate(createYearByOffset(new Date(2024, 1, 29), 1), new Date(2025, 1, 28))
    expect(getDateCount([january(10), january(12)])).toBe(3)
  })
})

describe("<CalendarDay />", () => {
  it("renders active single-day content and passes view props", () => {
    const { container } = render(
      <CalendarContext.Provider value={{ type: "single", firstDayOfWeek: 0, min, max }}>
        <CalendarDay
          type="active"
          value={january(10)}
          top="Today"
          bottom="Selected"
          className="custom-day"
          id="selected-day"
          style={{ color: "red" }}
        >
          10
        </CalendarDay>
      </CalendarContext.Provider>,
    )
    const day = getDay(container, 1)

    expect(day).toHaveClass("custom-day", prefixClassname("calendar__day--active"))
    expect(day).toHaveAttribute("id", "selected-day")
    expect(day).toHaveStyle({ color: "rgb(255, 0, 0)" })
    expect(day.querySelector(`.${prefixClassname("calendar__day__top")}`)).toHaveTextContent(
      "Today",
    )
    expect(day.querySelector(`.${prefixClassname("calendar__active-day")}`)).toHaveTextContent("10")
    expect(day.querySelector(`.${prefixClassname("calendar__day__bottom")}`)).toHaveTextContent(
      "Selected",
    )
  })

  it("emits its day object when enabled", () => {
    const onDayClick = jest.fn()
    const value = january(10)
    const { container } = render(
      <CalendarContext.Provider value={{ type: "range", firstDayOfWeek: 0, min, max, onDayClick }}>
        <CalendarDay type="start" value={value}>
          Start
        </CalendarDay>
      </CalendarContext.Provider>,
    )

    fireEvent.click(getDay(container, 1))

    expect(onDayClick).toHaveBeenCalledWith({ type: "start", value, children: "Start" })
  })

  it("does not emit clicks while disabled", () => {
    const onDayClick = jest.fn()
    const onClickDisabledDate = jest.fn()
    const { container } = render(
      <CalendarContext.Provider
        value={{ type: "single", firstDayOfWeek: 0, min, max, onDayClick, onClickDisabledDate }}
      >
        <CalendarDay type="disabled" value={january(10)}>
          10
        </CalendarDay>
      </CalendarContext.Provider>,
    )

    fireEvent.click(getDay(container, 1))

    expect(onDayClick).not.toHaveBeenCalled()
    expect(onClickDisabledDate).toHaveBeenCalledWith({
      type: "disabled",
      value: january(10),
      children: "10",
    })
  })

  it("does not emit placeholder clicks", () => {
    const onDayClick = jest.fn()
    const onClickDisabledDate = jest.fn()
    const { container } = render(
      <CalendarContext.Provider
        value={{ type: "single", firstDayOfWeek: 0, min, max, onDayClick, onClickDisabledDate }}
      >
        <CalendarDay type="placeholder" value={january(1)} />
      </CalendarContext.Provider>,
    )

    fireEvent.click(getDay(container, 1))

    expect(onDayClick).not.toHaveBeenCalled()
    expect(onClickDisabledDate).not.toHaveBeenCalled()
  })
})

describe("<CalendarMonth />", () => {
  it("uses placeholders until a lazy month becomes visible", async () => {
    const formatter = jest.fn((day) =>
      day.value.getDate() === 15 ? { ...day, type: "disabled" as const } : day,
    )
    const monthRef = React.createRef<CalendarMonthInstance>()
    const { container } = render(
      <CalendarContext.Provider value={{ type: "single", firstDayOfWeek: 0, min, max, formatter }}>
        <CalendarMonth ref={monthRef} value={min} lazyRender watermark />
      </CalendarContext.Provider>,
    )

    expect(
      container.querySelectorAll(`.${prefixClassname("calendar__day--placeholder")}`),
    ).toHaveLength(5)
    expect(formatter).not.toHaveBeenCalled()
    expect(monthRef.current?.getDisabledDays()).toHaveLength(1)
    expect(formatter).toHaveBeenCalledTimes(31)
    expect(monthRef.current?.getValue()).toEqual(min)
    expect(monthRef.current?.getTitle()).toBe("2024年1月")
    expect(monthRef.current?.getHeight()).toBeGreaterThanOrEqual(0)
    await expect(monthRef.current?.getRectTop()).resolves.toEqual(expect.any(Number))

    act(() => monthRef.current?.setVisible(true))

    expect(getDays(container)).toHaveLength(31)
    expect(
      container.querySelector(`.${prefixClassname("calendar__month-watermark")}`),
    ).toHaveTextContent("1")
  })

  it("supports custom month titles", () => {
    const { container } = render(
      <CalendarContext.Provider value={{ type: "single", firstDayOfWeek: 0, min, max }}>
        <CalendarMonth
          value={min}
          showMonthTitle
          monthTitle={(date, title) => `${title} (${date.getMonth() + 1})`}
        />
      </CalendarContext.Provider>,
    )

    expect(
      container.querySelector(`.${prefixClassname("calendar__month-title")}`),
    ).toHaveTextContent("2024年1月 (1)")
  })

  it("supports an omitted month value and empty range selection", () => {
    const { container } = render(
      <CalendarContext.Provider value={{ type: "range", firstDayOfWeek: 0, min, max, value: [] }}>
        <CalendarMonth />
      </CalendarContext.Provider>,
    )

    expect(container.querySelector(`.${prefixClassname("calendar__month")}`)).toBeInTheDocument()
  })

  it("ignores array values that do not match the selection type", () => {
    const { container } = render(
      <CalendarContext.Provider
        value={{ type: "single", firstDayOfWeek: 0, min, max, value: [january(10)] }}
      >
        <CalendarMonth value={min} />
      </CalendarContext.Provider>,
    )

    expect(getDay(container, 10)).not.toHaveClass(prefixClassname("calendar__day--active"))
  })
})

describe("<Calendar />", () => {
  it("renders the default structure, selected day, and month watermark", () => {
    const { container } = render(<Calendar min={min} max={max} defaultValue={january(10)} />)
    const calendar = getCalendar(container)

    expect(calendar).toHaveClass(prefixClassname("calendar--single"))
    expect(
      container.querySelector(`.${prefixClassname("calendar--popup")}`),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector(`.${prefixClassname("calendar__header-title")}`),
    ).toHaveTextContent("日期选择")
    expect(getDays(container)).toHaveLength(31)
    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--active"))
    expect(
      container.querySelector(`.${prefixClassname("calendar__month-watermark")}`),
    ).toHaveTextContent("1")
    expect(container.querySelector(`.${prefixClassname("calendar__footer")}`)).toBeInTheDocument()
  })

  it("supports the historical default date bounds", () => {
    const { container } = render(<Calendar showConfirm={false} />)

    expect(getCalendar(container)).toBeInTheDocument()
    expect(getDays(container).length).toBeGreaterThan(0)
  })

  it("supports custom root, header, and static subtitle content", () => {
    const { container } = render(
      <Calendar
        min={min}
        max={max}
        defaultValue={january(10)}
        className="custom-calendar"
        style={{ color: "blue" }}
        title={<span>Choose date</span>}
        subtitle="January 2024"
      />,
    )
    const calendar = getCalendar(container)

    expect(calendar).toHaveClass("custom-calendar")
    expect(calendar).toHaveStyle({ color: "rgb(0, 0, 255)" })
    expect(
      container.querySelector(`.${prefixClassname("calendar__header-title")}`),
    ).toHaveTextContent("Choose date")
    expect(
      container.querySelector(`.${prefixClassname("calendar__header-subtitle")}`),
    ).toHaveTextContent("January 2024")
  })

  it("can hide title, subtitle, watermark, and confirm footer", () => {
    const { container } = render(
      <Calendar
        min={min}
        max={max}
        defaultValue={january(10)}
        showTitle={false}
        showSubtitle={false}
        watermark={false}
        showConfirm={false}
      />,
    )

    expect(
      container.querySelector(`.${prefixClassname("calendar__header-title")}`),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector(`.${prefixClassname("calendar__header-subtitle")}`),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector(`.${prefixClassname("calendar__month-watermark")}`),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector(`.${prefixClassname("calendar__footer")}`),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector(`.${prefixClassname("calendar__month-title")}`),
    ).toHaveTextContent("2024年1月")
  })

  it("rotates weekdays and offsets the first day", () => {
    const { container } = render(
      <Calendar min={min} max={max} defaultValue={january(10)} firstDayOfWeek={9} />,
    )
    const weekdays = Array.from(
      container.querySelectorAll(`.${prefixClassname("calendar__weekday")}`),
    ).map((weekday) => weekday.textContent)

    expect(weekdays).toEqual(["二", "三", "四", "五", "六", "日", "一"])
    expect(getDay(container, 1)).toHaveStyle({ marginLeft: "85.71428571428571%" })
  })

  it("limits an out-of-range initial single value", () => {
    const { container } = render(
      <Calendar min={january(10)} max={january(20)} defaultValue={new Date(2023, 11, 1)} />,
    )

    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--active"))
    expect(getDay(container, 9)).toHaveClass(prefixClassname("calendar__day--disabled"))
    expect(getDay(container, 21)).toHaveClass(prefixClassname("calendar__day--disabled"))
  })

  it("preserves the existing initialization for a one-day default range", () => {
    const { container } = render(
      <Calendar type="range" min={min} max={max} defaultValue={[january(10)]} />,
    )

    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--start"))
    expect(getDay(container, 31)).toHaveClass(prefixClassname("calendar__day--end"))
    expect(container.querySelector(`.${prefixClassname("calendar__confirm")}`)).not.toHaveClass(
      prefixClassname("button--disabled"),
    )
  })

  it("does not normalize an out-of-range controlled value on the initial render", () => {
    const onConfirm = jest.fn()
    const { container } = render(
      <Calendar min={january(15)} max={january(20)} value={january(10)} onConfirm={onConfirm} />,
    )

    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--disabled"))
    expect(getDay(container, 15)).not.toHaveClass(prefixClassname("calendar__day--active"))

    fireEvent.click(
      container.querySelector(`.${prefixClassname("calendar__confirm")}`) as HTMLElement,
    )

    expectDate(onConfirm.mock.calls[0][0], january(10))
  })

  it("normalizes the current value when switching from single to range", () => {
    const onChange = jest.fn()
    const onConfirm = jest.fn()
    const { container, rerender } = render(
      <Calendar type="single" min={min} max={max} value={january(10)} showConfirm={false} />,
    )

    rerender(
      <Calendar
        type="range"
        min={min}
        max={max}
        value={january(10)}
        showConfirm={false}
        onChange={onChange}
        onConfirm={onConfirm}
      />,
    )
    rerender(
      <Calendar
        type="range"
        min={min}
        max={max}
        value={january(10)}
        showConfirm={false}
        onChange={onChange}
        onConfirm={onConfirm}
      />,
    )
    fireEvent.click(getDay(container, 12))

    expect(onChange.mock.calls[0][0]).toHaveLength(2)
    expectDate(onChange.mock.calls[0][0][0], january(10))
    expectDate(onChange.mock.calls[0][0][1], january(12))
    expectDate(onConfirm.mock.calls[0][0][0], january(10))
    expectDate(onConfirm.mock.calls[0][0][1], january(12))
  })

  it("normalizes the current value when min and max change", () => {
    const onConfirm = jest.fn()
    const { container, rerender } = render(
      <Calendar min={min} max={max} value={january(10)} onConfirm={onConfirm} />,
    )

    rerender(
      <Calendar min={january(15)} max={january(20)} value={january(10)} onConfirm={onConfirm} />,
    )

    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--disabled"))
    expect(getDay(container, 15)).toHaveClass(prefixClassname("calendar__day--active"))

    fireEvent.click(
      container.querySelector(`.${prefixClassname("calendar__confirm")}`) as HTMLElement,
    )

    expectDate(onConfirm.mock.calls[0][0], january(15))
  })

  it("normalizes values above max and across every selection type", () => {
    const { container, rerender } = render(
      <Calendar min={min} max={max} value={new Date(2024, 1, 10)} />,
    )

    rerender(<Calendar min={january(5)} max={january(20)} value={new Date(2024, 1, 10)} />)
    expect(getDay(container, 20)).toHaveClass(prefixClassname("calendar__day--active"))

    rerender(<Calendar type="range" min={min} max={max} value={[]} />)
    rerender(<Calendar type="range" min={january(2)} max={max} value={[]} />)
    expect(container.querySelector(`.${prefixClassname("calendar__confirm")}`)).toHaveClass(
      prefixClassname("button--disabled"),
    )

    rerender(
      <Calendar
        type="multiple"
        min={min}
        max={max}
        value={[new Date(2023, 11, 1), new Date(2024, 1, 1)]}
      />,
    )
    rerender(
      <Calendar
        type="multiple"
        min={january(5)}
        max={january(20)}
        value={[new Date(2023, 11, 1), new Date(2024, 1, 1)]}
      />,
    )
    expect(getDay(container, 5)).toHaveClass(prefixClassname("calendar__day--active"))
    expect(getDay(container, 20)).toHaveClass(prefixClassname("calendar__day--active"))

    rerender(<Calendar min={min} max={max} value={null} />)
    rerender(<Calendar min={january(2)} max={max} value={null} />)
    expect(container.querySelector(`.${prefixClassname("calendar__confirm")}`)).toHaveClass(
      prefixClassname("button--disabled"),
    )
  })

  it("normalizes a controlled undefined value after options change", () => {
    const { rerender } = render(<Calendar min={min} max={max} defaultValue={null} />)

    rerender(<Calendar min={january(2)} max={max} defaultValue={null} />)

    expect(true).toBe(true)
  })

  it("normalizes complete ranges and empty single arrays", () => {
    const { container, rerender } = render(
      <Calendar
        type="range"
        min={min}
        max={max}
        value={[new Date(2023, 11, 1), new Date(2024, 1, 1)]}
      />,
    )

    rerender(
      <Calendar
        type="range"
        min={january(5)}
        max={january(20)}
        value={[new Date(2023, 11, 1), new Date(2024, 1, 1)]}
      />,
    )
    expect(getDay(container, 5)).toHaveClass(prefixClassname("calendar__day--start"))
    expect(getDay(container, 20)).toHaveClass(prefixClassname("calendar__day--end"))

    rerender(<Calendar min={min} max={max} value={[] as never} />)
    rerender(<Calendar min={january(2)} max={max} value={[] as never} />)
    expect(container.querySelector(`.${prefixClassname("calendar__confirm")}`)).toHaveClass(
      prefixClassname("button--disabled"),
    )
  })

  it("selects a single day and confirms immediately without a footer", () => {
    const onChange = jest.fn()
    const onConfirm = jest.fn()
    const { container } = render(
      <Calendar
        min={min}
        max={max}
        defaultValue={january(10)}
        showConfirm={false}
        onChange={onChange}
        onConfirm={onConfirm}
      />,
    )

    fireEvent.click(getDay(container, 12))

    expectDate(onChange.mock.calls[0][0], january(12))
    expectDate(onConfirm.mock.calls[0][0], january(12))
    expect(getDay(container, 10)).not.toHaveClass(prefixClassname("calendar__day--active"))
    expect(getDay(container, 12)).toHaveClass(prefixClassname("calendar__day--active"))
  })

  it("waits for the default confirm button before confirming", () => {
    const onConfirm = jest.fn()
    const { container } = render(
      <Calendar
        min={min}
        max={max}
        defaultValue={january(10)}
        confirmText="Apply"
        onConfirm={onConfirm}
      />,
    )

    fireEvent.click(getDay(container, 12))
    expect(onConfirm).not.toHaveBeenCalled()

    const confirm = container.querySelector(
      `.${prefixClassname("calendar__confirm")}`,
    ) as HTMLElement
    expect(confirm).toHaveTextContent("Apply")
    fireEvent.click(confirm)

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expectDate(onConfirm.mock.calls[0][0], january(12))
  })

  it("does not change values in readonly mode", () => {
    const onChange = jest.fn()
    const onConfirm = jest.fn()
    const { container } = render(
      <Calendar
        min={min}
        max={max}
        defaultValue={january(10)}
        readonly
        showConfirm={false}
        onChange={onChange}
        onConfirm={onConfirm}
      />,
    )

    fireEvent.click(getDay(container, 12))

    expect(onChange).not.toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--active"))
  })

  it("adds and removes dates in multiple mode", () => {
    const onChange = jest.fn()
    const { container } = render(
      <Calendar
        type="multiple"
        min={min}
        max={max}
        defaultValue={[january(10)]}
        onChange={onChange}
      />,
    )

    fireEvent.click(getDay(container, 11))

    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--start"))
    expect(getDay(container, 11)).toHaveClass(prefixClassname("calendar__day--end"))
    expect(onChange.mock.calls[0][0]).toHaveLength(2)
    expectDate(onChange.mock.calls[0][0][0], january(10))
    expectDate(onChange.mock.calls[0][0][1], january(11))

    fireEvent.click(getDay(container, 10))

    expect(getDay(container, 10)).not.toHaveClass(prefixClassname("calendar__day--active"))
    expect(getDay(container, 11)).toHaveClass(prefixClassname("calendar__day--active"))
    expect(onChange.mock.calls[1][0]).toHaveLength(1)
    expectDate(onChange.mock.calls[1][0][0], january(11))
  })

  it("marks consecutive multiple selections and starts from a controlled empty value", () => {
    const onChange = jest.fn()
    const { container, rerender } = render(
      <Calendar
        type="multiple"
        min={min}
        max={max}
        value={[january(10), january(11), january(12)]}
      />,
    )

    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--start"))
    expect(getDay(container, 11)).toHaveClass(prefixClassname("calendar__day--middle"))
    expect(getDay(container, 12)).toHaveClass(prefixClassname("calendar__day--end"))

    rerender(<Calendar type="multiple" min={min} max={max} value={null} onChange={onChange} />)
    fireEvent.click(getDay(container, 15))

    expect(onChange.mock.calls[0][0]).toHaveLength(1)
    expectDate(onChange.mock.calls[0][0][0], january(15))
  })

  it("selects a range and enables the confirm button when complete", () => {
    const onChange = jest.fn()
    const onConfirm = jest.fn()
    const { container } = render(
      <Calendar
        type="range"
        min={min}
        max={max}
        defaultValue={null}
        confirmText="Book"
        confirmDisabledText="Select an end date"
        onChange={onChange}
        onConfirm={onConfirm}
      />,
    )
    const confirm = container.querySelector(
      `.${prefixClassname("calendar__confirm")}`,
    ) as HTMLElement

    expect(confirm).toHaveClass(prefixClassname("button--disabled"))
    expect(confirm).toHaveTextContent("Select an end date")

    fireEvent.click(getDay(container, 10))
    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--start"))
    expect(confirm).toHaveClass(prefixClassname("button--disabled"))

    fireEvent.click(getDay(container, 12))
    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--start"))
    expect(getDay(container, 11)).toHaveClass(prefixClassname("calendar__day--middle"))
    expect(getDay(container, 12)).toHaveClass(prefixClassname("calendar__day--end"))
    expect(confirm).not.toHaveClass(prefixClassname("button--disabled"))
    expect(confirm).toHaveTextContent("Book")
    expect(onConfirm).not.toHaveBeenCalled()

    fireEvent.click(confirm)

    expect(onChange).toHaveBeenCalledTimes(2)
    expectDate(onChange.mock.calls[1][0][0], january(10))
    expectDate(onChange.mock.calls[1][0][1], january(12))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expectDate(onConfirm.mock.calls[0][0][0], january(10))
    expectDate(onConfirm.mock.calls[0][0][1], january(12))
  })

  it("restarts range selection when choosing an earlier day", () => {
    const onChange = jest.fn()
    const { container } = render(
      <Calendar
        type="range"
        min={min}
        max={max}
        defaultValue={[january(10)]}
        onChange={onChange}
      />,
    )

    fireEvent.click(getDay(container, 8))

    expect(onChange.mock.calls[0][0]).toHaveLength(1)
    expectDate(onChange.mock.calls[0][0][0], january(8))
    expect(getDay(container, 8)).toHaveClass(prefixClassname("calendar__day--start"))
  })

  it("restarts an incomplete range when choosing an earlier day", () => {
    const onChange = jest.fn()
    const { container } = render(
      <Calendar type="range" min={min} max={max} defaultValue={null} onChange={onChange} />,
    )

    fireEvent.click(getDay(container, 10))
    fireEvent.click(getDay(container, 8))

    expectDate(onChange.mock.calls[1][0][0], january(8))
  })

  it("selects a one-day range when clicking the start again", () => {
    const onChange = jest.fn()
    const { container } = render(
      <Calendar
        type="range"
        min={min}
        max={max}
        defaultValue={null}
        showConfirm={false}
        onChange={onChange}
      />,
    )

    fireEvent.click(getDay(container, 10))
    fireEvent.click(getDay(container, 10))

    expectDate(onChange.mock.calls[1][0][0], january(10))
    expectDate(onChange.mock.calls[1][0][1], january(10))
    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--active"))
    expect(getDay(container, 10)).toHaveTextContent("开始/结束")
  })

  it("can disallow selecting the same range day", () => {
    const onChange = jest.fn()
    const { container } = render(
      <Calendar
        type="range"
        min={min}
        max={max}
        defaultValue={null}
        allowSameDay={false}
        onChange={onChange}
      />,
    )

    fireEvent.click(getDay(container, 10))
    fireEvent.click(getDay(container, 10))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--start"))
  })

  it("normalizes a same-day default when same-day ranges are disabled", () => {
    const { container } = render(
      <Calendar
        type="range"
        min={min}
        max={max}
        defaultValue={[january(10), january(10)]}
        allowSameDay={false}
      />,
    )

    expect(getDay(container, 10)).toHaveClass(prefixClassname("calendar__day--start"))
    expect(getDay(container, 11)).toHaveClass(prefixClassname("calendar__day--end"))
  })

  it("limits range selection and keeps immediate confirmation pending", () => {
    const onChange = jest.fn()
    const onConfirm = jest.fn()
    const onOverRange = jest.fn()
    const { container } = render(
      <Calendar
        type="range"
        min={min}
        max={max}
        defaultValue={null}
        maxRange={3}
        showConfirm={false}
        onChange={onChange}
        onConfirm={onConfirm}
        onOverRange={onOverRange}
      />,
    )

    fireEvent.click(getDay(container, 10))
    fireEvent.click(getDay(container, 15))

    expectDate(onChange.mock.calls[1][0][0], january(10))
    expectDate(onChange.mock.calls[1][0][1], january(12))
    expect(onConfirm).not.toHaveBeenCalled()
    expect(onOverRange).toHaveBeenCalledTimes(1)
    expect(openToast).toHaveBeenCalledWith("最多选择 3 天")
  })

  it("limits multiple selection, supports custom prompts, and emits unselect", () => {
    const onChange = jest.fn()
    const onOverRange = jest.fn()
    const onUnselect = jest.fn()
    const { container } = render(
      <Calendar
        type="multiple"
        min={min}
        max={max}
        defaultValue={[january(10)]}
        maxRange={1}
        rangePrompt="最多只能选一天"
        onChange={onChange}
        onOverRange={onOverRange}
        onUnselect={onUnselect}
      />,
    )

    fireEvent.click(getDay(container, 11))

    expect(onChange).not.toHaveBeenCalled()
    expect(onOverRange).toHaveBeenCalledTimes(1)
    expect(openToast).toHaveBeenCalledWith("最多只能选一天")

    fireEvent.click(getDay(container, 10))

    expect(onUnselect).toHaveBeenCalledWith(january(10))
    expect(onChange.mock.calls[0][0]).toEqual([])
  })

  it("can suppress the max range prompt", () => {
    const { container } = render(
      <Calendar
        type="multiple"
        min={min}
        max={max}
        defaultValue={[january(10)]}
        maxRange={1}
        showRangePrompt={false}
      />,
    )

    openToast.mockClear()
    fireEvent.click(getDay(container, 11))

    expect(openToast).not.toHaveBeenCalled()
  })

  it("stops a range before a disabled formatted day", () => {
    const onChange = jest.fn()
    const onConfirm = jest.fn()
    const { container } = render(
      <Calendar
        type="range"
        min={min}
        max={max}
        defaultValue={null}
        formatter={(day) => (day.value.getDate() === 11 ? { ...day, type: "disabled" } : day)}
        showConfirm={false}
        onChange={onChange}
        onConfirm={onConfirm}
      />,
    )

    fireEvent.click(getDay(container, 10))
    fireEvent.click(getDay(container, 13))

    expect(getDay(container, 11)).toHaveClass(prefixClassname("calendar__day--disabled"))
    expectDate(onChange.mock.calls[1][0][0], january(10))
    expectDate(onChange.mock.calls[1][0][1], january(10))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expectDate(onConfirm.mock.calls[0][0][0], january(10))
    expectDate(onConfirm.mock.calls[0][0][1], january(10))
  })

  it("uses formatter content, annotations, and class names", () => {
    const { container } = render(
      <Calendar
        min={min}
        max={max}
        defaultValue={january(10)}
        formatter={(day) =>
          day.value.getDate() === 15
            ? {
                ...day,
                className: "payday",
                top: "Salary",
                bottom: "Reminder",
                children: "Payday",
              }
            : day
        }
      />,
    )
    const day = getDay(container, 15)

    expect(day).toHaveClass("payday")
    expect(day.querySelector(`.${prefixClassname("calendar__day__top")}`)).toHaveTextContent(
      "Salary",
    )
    expect(day.querySelector(`.${prefixClassname("calendar__day__bottom")}`)).toHaveTextContent(
      "Reminder",
    )
    expect(day).toHaveTextContent("Payday")
  })

  it("emits disabled date clicks without changing the selection", () => {
    const onChange = jest.fn()
    const onClickDisabledDate = jest.fn()
    const { container } = render(
      <Calendar
        min={min}
        max={max}
        defaultValue={january(10)}
        formatter={(day) => (day.value.getDate() === 15 ? { ...day, type: "disabled" } : day)}
        onChange={onChange}
        onClickDisabledDate={onClickDisabledDate}
      />,
    )

    fireEvent.click(getDay(container, 15))

    expect(onClickDisabledDate).toHaveBeenCalledWith(january(15))
    expect(onChange).not.toHaveBeenCalled()
  })

  it("switches month and year panels while respecting boundaries", () => {
    const onPanelChange = jest.fn()
    const onClickSubtitle = jest.fn()
    const panelMax = new Date(2025, 2, 31)
    const { container } = render(
      <Calendar
        min={min}
        max={panelMax}
        defaultValue={january(10)}
        switchMode="year-month"
        onPanelChange={onPanelChange}
        onClickSubtitle={onClickSubtitle}
      />,
    )
    const action = (name: string) =>
      container.querySelector(`[data-calendar-action="${name}"]`) as HTMLElement
    const subtitleText = container.querySelector(
      `.${prefixClassname("calendar__header-subtitle-text")}`,
    ) as HTMLElement

    expect(getDays(container)).toHaveLength(31)
    expect(action("previous-month")).toHaveClass(
      prefixClassname("calendar__header-action--disabled"),
    )
    expect(action("previous-year")).toHaveClass(
      prefixClassname("calendar__header-action--disabled"),
    )

    fireEvent.click(action("previous-month"))
    expect(onPanelChange).not.toHaveBeenCalled()

    fireEvent.click(action("next-month"))
    expect(subtitleText).toHaveTextContent("2024年2月")
    expect(onPanelChange).toHaveBeenCalledWith({ date: new Date(2024, 1, 10) })

    fireEvent.click(action("next-year"))
    expect(subtitleText).toHaveTextContent("2025年2月")

    fireEvent.click(subtitleText)
    expect(onClickSubtitle).toHaveBeenCalledTimes(1)
  })

  it("shows only month controls in month switch mode", () => {
    const { container } = render(
      <Calendar
        min={min}
        max={new Date(2024, 2, 31)}
        defaultValue={january(10)}
        switchMode="month"
      />,
    )

    expect(container.querySelectorAll('[data-calendar-action$="-month"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-calendar-action$="-year"]')).toHaveLength(0)
  })

  it("exposes selection and navigation methods without changing old defaults", () => {
    const calendarRef = React.createRef<CalendarInstance>()
    const onChange = jest.fn()
    const { container } = render(
      <Calendar
        ref={calendarRef}
        min={min}
        max={max}
        defaultValue={january(10)}
        onChange={onChange}
      />,
    )

    expectDate(calendarRef.current?.getSelectedDate(), january(10))

    act(() => calendarRef.current?.reset(january(15)))
    expectDate(calendarRef.current?.getSelectedDate(), january(15))
    expect(getDay(container, 15)).toHaveClass(prefixClassname("calendar__day--active"))

    act(() => calendarRef.current?.reset())
    expectDate(calendarRef.current?.getSelectedDate(), january(10))
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it("uses scrollToDate to change a switch-mode panel", async () => {
    const calendarRef = React.createRef<CalendarInstance>()
    const { container } = render(
      <Calendar
        ref={calendarRef}
        min={min}
        max={new Date(2024, 2, 31)}
        defaultValue={january(10)}
        switchMode="month"
      />,
    )

    await act(async () => {
      await calendarRef.current?.scrollToDate(new Date(2024, 2, 20))
    })

    expect(
      container.querySelector(`.${prefixClassname("calendar__header-subtitle-text")}`),
    ).toHaveTextContent("2024年3月")
    expectDate(calendarRef.current?.getSelectedDate(), january(10))
  })

  it("uses a custom footer and confirm button", () => {
    const onConfirm = jest.fn()
    const onButtonClick = jest.fn()
    const { container } = render(
      <Calendar min={min} max={max} value={january(10)} onConfirm={onConfirm}>
        text
        <span>ignored</span>
        <Calendar.Footer className="custom-footer" id="calendar-footer">
          <Calendar.Button className="custom-confirm" onClick={onButtonClick}>
            Complete
          </Calendar.Button>
          <span>Extra footer content</span>
        </Calendar.Footer>
      </Calendar>,
    )
    const footer = container.querySelector(`.${prefixClassname("calendar__footer")}`)
    const confirm = container.querySelector(
      `.${prefixClassname("calendar__confirm")}`,
    ) as HTMLElement

    expect(container.querySelectorAll(`.${prefixClassname("calendar__footer")}`)).toHaveLength(1)
    expect(footer).toHaveClass("custom-footer")
    expect(footer).toHaveAttribute("id", "calendar-footer")
    expect(confirm).toHaveClass("custom-confirm")
    expect(confirm).toHaveTextContent("Complete")

    fireEvent.click(confirm)

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onButtonClick).toHaveBeenCalledTimes(1)
    expectDate(onConfirm.mock.calls[0][0], january(10))
  })

  it("ignores unrelated children while discovering a custom footer", () => {
    const notifyConfirm = jest.fn()
    const { container } = render(
      <CalendarContext.Provider
        value={{ type: "single", firstDayOfWeek: 0, min, max, value: january(10), notifyConfirm }}
      >
        <Calendar.Footer>
          text
          <span>extra</span>
          <Calendar.Button />
          <Calendar.Button />
        </Calendar.Footer>
      </CalendarContext.Provider>,
    )

    expect(container.querySelectorAll(`.${prefixClassname("calendar__confirm")}`)).toHaveLength(2)
    expect(notifyConfirm).toHaveBeenCalledWith(true)
  })

  it("supports non-confirm calendar buttons and disabled fallback text", () => {
    const onConfirm = jest.fn()
    const onClick = jest.fn()
    const { container } = render(
      <CalendarContext.Provider
        value={{ type: "range", firstDayOfWeek: 0, min, max, value: [], onConfirm }}
      >
        <Calendar.Footer>
          <Calendar.Button type={"other" as never} onClick={onClick} />
          <Calendar.Button />
        </Calendar.Footer>
      </CalendarContext.Provider>,
    )
    const buttons = container.querySelectorAll(`.${prefixClassname("button")}`)

    expect(buttons[0]).not.toHaveClass(prefixClassname("calendar__confirm"))
    expect(buttons[1]).toHaveTextContent("确定")
    fireEvent.click(buttons[0])
    fireEvent.click(buttons[1])

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("disables a confirm button for an empty array in single mode", () => {
    const { container } = render(
      <CalendarContext.Provider value={{ type: "single", firstDayOfWeek: 0, min, max, value: [] }}>
        <Calendar.Button />
      </CalendarContext.Provider>,
    )

    expect(container.querySelector(`.${prefixClassname("calendar__confirm")}`)).toHaveClass(
      prefixClassname("button--disabled"),
    )
  })

  it("renders the default text for a custom confirm button", () => {
    const { container } = render(
      <Calendar min={min} max={max} value={january(10)}>
        <Calendar.Footer>
          <Calendar.Button />
        </Calendar.Footer>
      </Calendar>,
    )

    expect(container.querySelector(`.${prefixClassname("calendar__confirm")}`)).toHaveTextContent(
      "确定",
    )
  })

  it("preserves the existing confirm text behavior for empty children", () => {
    const { container } = render(
      <Calendar min={min} max={max} value={january(10)}>
        <Calendar.Footer>
          <Calendar.Button confirmText="Apply">{null}</Calendar.Button>
        </Calendar.Footer>
      </Calendar>,
    )

    expect(container.querySelector(`.${prefixClassname("calendar__confirm")}`)).toHaveTextContent(
      "Apply",
    )
  })

  it("renders as a rounded popup and closes from its close icon", () => {
    const onClose = jest.fn()
    const { container } = render(
      <Calendar
        min={min}
        max={max}
        value={january(10)}
        poppable
        showPopup
        popupPlacement="right"
        onClose={onClose}
      />,
    )
    const popup = container.querySelector(`.${prefixClassname("popup")}`)
    const close = container.querySelector(`.${prefixClassname("popup__close-icon")}`) as HTMLElement

    expect(popup).toHaveClass(
      prefixClassname("calendar--popup"),
      prefixClassname("popup--right"),
      prefixClassname("popup--rounded"),
    )
    expect(close).toHaveClass(prefixClassname("popup__close-icon--top-left"))

    fireEvent.click(close)

    expect(onClose).toHaveBeenCalledWith(false)
  })

  it("does not initialize scrolling for a closed popup", async () => {
    const calendarRef = React.createRef<CalendarInstance>()
    const { container } = render(
      <Calendar
        ref={calendarRef}
        min={min}
        max={max}
        defaultValue={january(10)}
        poppable
        showPopup={false}
      />,
    )

    await act(async () => {
      calendarRef.current?.reset(january(15))
      await Promise.resolve()
    })
    expect(getCalendar(container)).not.toBeInTheDocument()
  })

  it("allows an instance reset to clear an uncontrolled value", async () => {
    const calendarRef = React.createRef<CalendarInstance>()
    render(<Calendar ref={calendarRef} min={min} max={max} defaultValue={january(10)} />)

    await act(async () => {
      calendarRef.current?.reset(null)
      await Promise.resolve()
    })

    expect(calendarRef.current?.getSelectedDate()).toBeNull()
  })
})
