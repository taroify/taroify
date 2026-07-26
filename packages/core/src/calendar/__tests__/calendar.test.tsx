import { fireEvent, render } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import Calendar from ".."
import CalendarContext from "../calendar.context"
import CalendarDay from "../calendar-day"
import {
  cloneDate,
  compareDate,
  compareYearMonth,
  createDayByOffset,
  createNextDay,
  createPreviousDay,
  createToday,
  genMonthId,
  getEndDayOfMonth,
} from "../calendar.shared"

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
    const { container } = render(
      <CalendarContext.Provider value={{ type: "single", firstDayOfWeek: 0, min, max, onDayClick }}>
        <CalendarDay type="disabled" value={january(10)}>
          10
        </CalendarDay>
      </CalendarContext.Provider>,
    )

    fireEvent.click(getDay(container, 1))

    expect(onDayClick).not.toHaveBeenCalled()
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

  it("uses a custom footer and confirm button", () => {
    const onConfirm = jest.fn()
    const onButtonClick = jest.fn()
    const { container } = render(
      <Calendar min={min} max={max} value={january(10)} onConfirm={onConfirm}>
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
})
