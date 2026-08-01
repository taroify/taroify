import { act, fireEvent, render, waitFor } from "@testing-library/react"
// biome-ignore lint/correctness/noUnusedImports: the package Babel preset uses the classic JSX runtime
import * as React from "react"
import { prefixClassname } from "../../styles"
import { getScrollTop } from "../../utils/dom/scroll"
import Calendar from ".."
import { genMonthId } from "../calendar.shared"

let mockScrollTop = 0
let mockEnvironment = "WEB"
let mockMissingMonthRef = false
const mockSetVisible = jest.fn()

jest.mock("@tarojs/taro", () => ({
  getEnv: () => mockEnvironment,
  nextTick: (callback: () => void) => callback(),
}))

jest.mock("../../utils/dom/rect", () => ({
  getRect: jest.fn(async (target) => {
    const element = target?.current ?? target
    const body = element?.classList?.contains("taroify-calendar__body")
    const height = body ? 50 : 100

    return {
      id: element?.getAttribute?.("id") ?? "",
      dataset: {},
      top: 0,
      right: 100,
      bottom: height,
      left: 0,
      width: 100,
      height,
    }
  }),
}))

jest.mock("../../utils/dom/scroll", () => ({
  getScrollTop: jest.fn(async () => mockScrollTop),
}))

jest.mock("../../utils/raf", () => ({
  __esModule: true,
  default: (callback: FrameRequestCallback) => {
    callback(0)
    return 1
  },
}))

jest.mock("../../toast", () => ({
  __esModule: true,
  default: { open: jest.fn() },
}))

jest.mock("../calendar-month", () => {
  const React = jest.requireActual("react") as typeof import("react")
  const CalendarContext = (
    jest.requireActual("../calendar.context") as typeof import("../calendar.context")
  ).default

  return {
    __esModule: true,
    default: React.forwardRef((props: { value: Date }, ref) => {
      const context = React.useContext(CalendarContext)
      React.useImperativeHandle(
        ref,
        () =>
          mockMissingMonthRef
            ? null
            : {
                disabledDays: [],
                getHeight: () => 100,
                getValue: () => props.value,
                getTitle: () => `${props.value.getFullYear()}年${props.value.getMonth() + 1}月`,
                getRectTop: async () => props.value.getMonth() * 100,
                getDisabledDays: () => [],
                setVisible: mockSetVisible,
              },
        [props.value],
      )

      return React.createElement("div", {
        id: `taroify-calendar-${props.value.getFullYear()}-${props.value.getMonth()}`,
        "data-testid": `month-${props.value.getMonth()}`,
        onClick: () =>
          context.onDayClick?.({
            type: "",
            value: props.value,
            children: props.value.getDate(),
          }),
      })
    }),
  }
})

const min = new Date(2024, 0, 1)
const max = new Date(2024, 1, 29)

describe("<Calendar /> scrolling", () => {
  beforeEach(() => {
    mockScrollTop = 0
    mockEnvironment = "WEB"
    mockMissingMonthRef = false
    mockSetVisible.mockClear()
  })

  it("updates the default subtitle to the visible month", async () => {
    const onMonthShow = jest.fn()
    const { container } = render(
      <Calendar
        min={min}
        max={max}
        value={new Date(2024, 0, 10)}
        showConfirm={false}
        lazyRender
        onMonthShow={onMonthShow}
      />,
    )
    const subtitle = container.querySelector(`.${prefixClassname("calendar__header-subtitle")}`)
    const body = container.querySelector(`.${prefixClassname("calendar__body")}`) as HTMLElement

    await waitFor(() => expect(subtitle).toHaveTextContent("2024年1月"))
    await waitFor(() => expect(getScrollTop).toHaveBeenCalled())
    await waitFor(() => expect(onMonthShow).toHaveBeenCalledWith({ date: min, title: "2024年1月" }))
    expect(mockSetVisible).toHaveBeenCalled()

    mockScrollTop = 101
    await act(async () => {
      fireEvent.scroll(body)
    })

    await waitFor(() => expect(subtitle).toHaveTextContent("2024年2月"))
    expect(onMonthShow).toHaveBeenCalledTimes(2)
  })

  it("uses scrollIntoView outside the web environment", async () => {
    mockEnvironment = "WEAPP"
    const { container } = render(
      <Calendar min={min} max={max} value={new Date(2024, 1, 10)} showConfirm={false} />,
    )
    const body = container.querySelector(`.${prefixClassname("calendar__body")}`)

    await waitFor(() =>
      expect(body).toHaveAttribute("scroll-into-view", genMonthId(new Date(2024, 1, 1))),
    )
  })

  it("uses the mini-program scroll event position and ignores stale async queries", async () => {
    mockEnvironment = "WEAPP"
    const { container } = render(
      <Calendar min={min} max={max} value={new Date(2024, 0, 10)} showConfirm={false} lazyRender />,
    )
    const subtitle = container.querySelector(`.${prefixClassname("calendar__header-subtitle")}`)
    const body = container.querySelector(`.${prefixClassname("calendar__body")}`) as HTMLElement

    await waitFor(() => expect(subtitle).toHaveTextContent("2024年1月"))
    jest.mocked(getScrollTop).mockClear()

    let resolveStaleScroll: (scrollTop: number) => void = () => undefined
    const staleScroll = new Promise<number>((resolve) => {
      resolveStaleScroll = resolve
    })
    jest.mocked(getScrollTop).mockImplementationOnce(() => staleScroll)

    fireEvent.scroll(body)
    const miniProgramScrollEvent = new Event("scroll", { bubbles: true })
    Object.defineProperty(miniProgramScrollEvent, "detail", {
      value: { scrollTop: 101 },
    })
    fireEvent(body, miniProgramScrollEvent)

    await waitFor(() => expect(subtitle).toHaveTextContent("2024年2月"))
    expect(getScrollTop).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolveStaleScroll(0)
      await staleScroll
    })

    expect(subtitle).toHaveTextContent("2024年2月")
  })

  it("does not throw while month refs are temporarily unavailable", async () => {
    mockMissingMonthRef = true
    const { container } = render(
      <Calendar min={min} max={max} value={new Date(2024, 0, 10)} showConfirm={false} lazyRender />,
    )
    const body = container.querySelector(`.${prefixClassname("calendar__body")}`) as HTMLElement

    await act(async () => {
      fireEvent.scroll(body)
    })

    expect(body).toBeInTheDocument()
  })

  it("handles overlapping scroll work, repeated months, and iOS bounce positions", async () => {
    const onMonthShow = jest.fn()
    const { container } = render(
      <Calendar
        min={min}
        max={max}
        value={new Date(2024, 0, 10)}
        lazyRender
        onMonthShow={onMonthShow}
      />,
    )
    const body = container.querySelector(`.${prefixClassname("calendar__body")}`) as HTMLElement

    fireEvent.scroll(body)
    await waitFor(() => expect(onMonthShow).toHaveBeenCalled())

    mockScrollTop = 50
    await act(async () => {
      fireEvent.scroll(body)
    })
    expect(onMonthShow).toHaveBeenCalledTimes(2)

    mockScrollTop = 250
    await act(async () => {
      fireEvent.scroll(body)
    })
    expect(body).toBeInTheDocument()
  })

  it("selects safely when month refs are missing", () => {
    mockMissingMonthRef = true
    const onChange = jest.fn()
    const { getByTestId } = render(
      <Calendar type="range" min={min} max={max} defaultValue={null} onChange={onChange} />,
    )

    fireEvent.click(getByTestId("month-0"))

    expect(onChange).toHaveBeenCalledWith([min])
  })
})
