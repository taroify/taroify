import { act, fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
import { getRect, type Rect } from "../../utils/dom/rect"
import Slider, { type SliderProps, type SliderThumbRenderProps } from ".."
import "../style"

jest.mock("../../utils/dom/rect", () => ({ getRect: jest.fn() }))
jest.mock("../../styles/style", () => ({}))
jest.mock("../index.scss", () => ({}))

const measure = jest.mocked(getRect)
const rect: Rect = {
  id: "",
  dataset: {},
  left: 10,
  right: 110,
  top: 20,
  bottom: 120,
  width: 100,
  height: 100,
}

function sliderView(container: HTMLElement) {
  return container.querySelector<HTMLElement>(".taroify-slider")!
}

function track(container: HTMLElement) {
  return container.querySelector<HTMLElement>(".taroify-slider__track")!
}

function thumb(name?: string) {
  return screen.getByRole("slider", { name })
}

async function click(target: HTMLElement, clientX: number, clientY = 20) {
  await act(async () => {
    fireEvent.click(target, { clientX, clientY })
  })
}

function touch(
  target: HTMLElement,
  type: "touchStart" | "touchMove",
  clientX: number,
  clientY = 20,
) {
  fireEvent[type](target, { touches: [{ clientX, clientY }] })
}

function pendingMeasurement() {
  let complete!: (value: Rect) => void
  const promise = new Promise<Rect>((resolve) => {
    complete = resolve
  })
  measure.mockReturnValueOnce(promise)
  return () => act(async () => complete(rect))
}

beforeEach(() => {
  measure.mockReset().mockResolvedValue(rect)
})

describe("Slider values", () => {
  it("forwards root props, keeps the track clickable, and emits distinct live values", async () => {
    const onChange = jest.fn()
    const onClick = jest.fn()
    const onDragStart = jest.fn()
    const onDragEnd = jest.fn()
    const { container } = render(
      <Slider
        id="volume"
        className="custom"
        ariaLabel="音量"
        size={4}
        style={{ marginLeft: 5 }}
        onChange={onChange}
        onClick={onClick}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />,
    )
    const root = sliderView(container)
    expect(root).toHaveAttribute("id", "volume")
    expect(root).toHaveClass("custom")
    expect(root.style.marginLeft).toBe("5px")
    expect(root.style.height).toBe("4px")
    expect(thumb("音量")).toHaveAttribute("aria-valuenow", "0")

    await click(root, 50)
    await click(root, 50)
    expect(track(container).style.width).toBe("40%")
    expect(onClick).toHaveBeenCalledTimes(2)
    expect(onChange.mock.calls).toEqual([[40]])
    expect(onDragStart).not.toHaveBeenCalled()
    expect(onDragEnd).not.toHaveBeenCalled()

    await click(thumb(), 70)
    expect(onClick).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("moves the closest endpoint on range clicks with controlled and uncontrolled values", async () => {
    const value = Object.freeze([20, 60])
    const onChange = jest.fn()
    const { container, rerender } = render(<Slider range value={value} onChange={onChange} />)
    const root = sliderView(container)
    await click(root, 35)
    await click(root, 95)
    expect(onChange.mock.calls).toEqual([[[25, 60]], [[20, 85]]])
    expect(thumb("最小值")).toHaveAttribute("aria-valuenow", "20")
    expect(value).toEqual([20, 60])

    rerender(<Slider range value={[25, 85]} onChange={onChange} />)
    expect(thumb("最大值")).toHaveAttribute("aria-valuenow", "85")
    expect(track(container).style.left).toBe("25%")
    expect(track(container).style.width).toBe("60%")
  })

  it("normalizes reversed, missing and invalid endpoints without changing input arrays", () => {
    const value = Object.freeze([120, -3])
    const { rerender } = render(<Slider range min={10} max={90} value={value} />)
    expect(thumb("最小值")).toHaveAttribute("aria-valuenow", "10")
    expect(thumb("最大值")).toHaveAttribute("aria-valuenow", "90")
    expect(value).toEqual([120, -3])

    rerender(<Slider range min={10} max={90} value={[undefined, 50]} />)
    expect(thumb("最大值")).toHaveAttribute("aria-valuenow", "50")
    rerender(<Slider range min={10} max={90} value={[40, Number.NaN]} />)
    expect(thumb("最小值")).toHaveAttribute("aria-valuenow", "40")
    expect(thumb("最大值")).toHaveAttribute("aria-valuenow", "90")
    rerender(<Slider range min={10} max={90} value={40} />)
    expect(thumb("最小值")).toHaveAttribute("aria-valuenow", "10")
    expect(thumb("最大值")).toHaveAttribute("aria-valuenow", "90")
  })

  it.each([
    { min: 0, max: 10, step: 6, clickX: 110, expected: 10 },
    { min: 0, max: 8, step: 6, clickX: 106, expected: 8 },
    { min: -1, max: 0.5, step: 0.1, clickX: 90, expected: 0.2 },
    {
      min: Number.NaN,
      max: Number.POSITIVE_INFINITY,
      step: Number.POSITIVE_INFINITY,
      clickX: 26,
      expected: 16,
    },
    { min: 0, max: 100, step: 0, clickX: 24, expected: 14 },
  ])("keeps the result at $expected within the configured limits", async (params) => {
    const { clickX, expected, ...bounds } = params
    const onChange = jest.fn()
    const { container } = render(<Slider {...bounds} onChange={onChange} />)
    await click(sliderView(container), clickX)
    expect(onChange.mock.calls).toEqual([[expected]])
    expect(thumb()).toHaveAttribute("aria-valuenow", String(expected))
  })

  it("renders a collapsed range and sizes a vertical track by width", async () => {
    const onChange = jest.fn()
    const { container } = render(
      <Slider min={10} max={2} orientation="vertical" size={7} onChange={onChange} />,
    )
    expect(sliderView(container)).toHaveClass("taroify-slider--vertical")
    expect(sliderView(container).style.width).toBe("7px")
    expect(track(container).style.height).toBe("0%")
    expect(track(container).style.top).toBe("0%")
    expect(thumb()).toHaveAttribute("aria-valuemax", "10")
    await click(sliderView(container), 10, 40)
    expect(onChange).not.toHaveBeenCalled()
  })

  it("ignores stale, zero-sized, malformed, and failed click measurements", async () => {
    const onChange = jest.fn()
    const { container, unmount } = render(<Slider onChange={onChange} />)
    const root = sliderView(container)
    const resolveOlderClick = pendingMeasurement()
    await click(root, 20)
    await click(root, 90)
    await resolveOlderClick()

    measure.mockResolvedValueOnce({ ...rect, width: 0 })
    await click(root, 100)
    measure.mockRejectedValueOnce(new Error("Selector unavailable"))
    await click(root, 100)
    await act(async () => {
      fireEvent(root, new Event("click", { bubbles: true }))
    })
    const resolveAfterUnmount = pendingMeasurement()
    await click(root, 10)
    unmount()
    await resolveAfterUnmount()

    expect(onChange.mock.calls).toEqual([[80]])
  })

  it.each([
    { orientation: "horizontal", reverse: true, side: "right", axis: "width", x: 90, y: 20 },
    { orientation: "vertical", reverse: false, side: "top", axis: "height", x: 10, y: 40 },
    { orientation: "vertical", reverse: true, side: "bottom", axis: "height", x: 10, y: 100 },
  ] as const)("maps $orientation reverse=$reverse clicks and fill to $side", async (params) => {
    const { orientation, reverse, side, axis, x, y } = params
    const { container } = render(
      <Slider range defaultValue={[30, 60]} orientation={orientation} reverse={reverse} />,
    )
    await click(sliderView(container), x, y)
    expect(thumb("最小值")).toHaveAttribute("aria-valuenow", "20")
    expect(track(container).style[side]).toBe("20%")
    expect(track(container).style[axis]).toBe("40%")
    const position = reverse ? "right" : "left"
    expect(thumb("最小值")).toHaveClass(`taroify-slider__thumb-wrapper-${position}`)
  })
})

describe("Slider drag lifecycle", () => {
  it("emits start once, live changes, and end once in order", async () => {
    const order: Array<string | number> = []
    const onDragStart = jest.fn((event) => order.push(event.type))
    const onDragEnd = jest.fn((event) => order.push(event.type))
    const { container } = render(
      <Slider
        defaultValue={20}
        step={5}
        onChange={(value) => order.push(value)}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />,
    )
    const root = sliderView(container)
    const control = thumb()

    touch(control, "touchMove", 35)
    fireEvent.touchEnd(control)
    fireEvent.touchStart(control, { touches: [] })
    touch(control, "touchStart", 30)
    fireEvent.touchMove(control, { touches: [] })
    fireEvent.touchEnd(control)
    expect(onDragStart).not.toHaveBeenCalled()
    expect(onDragEnd).not.toHaveBeenCalled()

    touch(control, "touchStart", 30)
    await act(async () => touch(control, "touchMove", 40))
    expect(root).toHaveClass("taroify-slider--dragging")
    touch(control, "touchMove", 41)
    touch(control, "touchMove", 55)
    expect(order).toEqual(["touchmove", 30, 45])
    fireEvent.touchEnd(control)
    fireEvent.touchEnd(control)

    expect(root).not.toHaveClass("taroify-slider--dragging")
    expect(order).toEqual(["touchmove", 30, 45, "touchend"])
    expect(onDragStart).toHaveBeenCalledTimes(1)
    expect(onDragEnd).toHaveBeenCalledTimes(1)
    expect(measure).toHaveBeenCalledTimes(1)
  })

  it("applies the last movement before reporting end if measurement is pending", async () => {
    const order: Array<string | number[]> = []
    render(
      <Slider range onChange={(value) => order.push(value)} onDragEnd={() => order.push("end")} />,
    )
    const resolve = pendingMeasurement()
    const control = thumb("最小值")
    touch(control, "touchStart", 10)
    touch(control, "touchMove", 20)
    touch(control, "touchMove", 50)
    fireEvent.touchEnd(control)
    touch(control, "touchMove", 90)
    fireEvent.touchEnd(control)
    expect(order).toEqual([])
    await resolve()
    expect(order).toEqual([[40, 100], "end"])
  })

  it("treats touchcancel as the end of a valid drag", async () => {
    const onDragEnd = jest.fn()
    render(<Slider onDragEnd={onDragEnd} />)
    const control = thumb()
    touch(control, "touchStart", 10)
    await act(async () => touch(control, "touchMove", 20))
    fireEvent.touchCancel(control)

    expect(onDragEnd).toHaveBeenCalledTimes(1)
    expect(onDragEnd.mock.calls[0][0].type).toBe("touchcancel")
  })

  it("ignores obsolete measurements after readonly becomes active", async () => {
    const onChange = jest.fn()
    const onDragEnd = jest.fn()
    const { rerender } = render(<Slider onChange={onChange} onDragEnd={onDragEnd} />)
    const resolve = pendingMeasurement()
    const control = thumb()
    touch(control, "touchStart", 10)
    touch(control, "touchMove", 60)
    fireEvent.touchEnd(control)
    rerender(<Slider readonly onChange={onChange} onDragEnd={onDragEnd} />)
    await resolve()
    expect(onChange).not.toHaveBeenCalled()
    expect(onDragEnd).not.toHaveBeenCalled()
  })

  it("ends the gesture even if layout measurement fails", async () => {
    const onChange = jest.fn()
    const onDragEnd = jest.fn()
    measure.mockRejectedValueOnce(new Error("Selector unavailable"))
    render(<Slider onChange={onChange} onDragEnd={onDragEnd} />)
    const target = thumb()
    touch(target, "touchStart", 10)
    await act(async () => touch(target, "touchMove", 50))
    fireEvent.touchEnd(target)
    expect(onChange).not.toHaveBeenCalled()
    expect(onDragEnd).toHaveBeenCalledTimes(1)
  })

  it("crosses both handles without mutating a controlled array and moves the active render state", async () => {
    const value = Object.freeze([20, 60])
    const readThumb = ({ value, dragging, index }: SliderThumbRenderProps) => (
      <span>{[index, value, dragging].join(":")}</span>
    )
    const onChange = jest.fn()
    function ControlledRange() {
      const [current, setCurrent] = React.useState<ReadonlyArray<number>>(value)
      return (
        <Slider
          range
          value={current}
          onChange={(next) => {
            onChange(next)
            setCurrent(next)
          }}
        >
          <Slider.Thumb>{readThumb}</Slider.Thumb>
          <Slider.Thumb>{readThumb}</Slider.Thumb>
        </Slider>
      )
    }
    render(<ControlledRange />)
    const lower = thumb("最小值")
    const upper = thumb("最大值")

    touch(lower, "touchStart", 30)
    await act(async () => touch(lower, "touchMove", 70))
    expect(lower).toHaveTextContent("0:60:true")
    touch(lower, "touchMove", 90)
    expect(upper).toHaveTextContent("1:80:true")
    expect(lower).toHaveTextContent("0:60:false")
    fireEvent.touchEnd(lower)

    touch(upper, "touchStart", 90)
    await act(async () => touch(upper, "touchMove", 50))
    expect(lower).toHaveTextContent("0:40:true")
    expect(upper).toHaveTextContent("1:60:false")
    fireEvent.touchEnd(upper)
    expect(lower).toHaveTextContent("0:40:false")
    expect(onChange.mock.calls).toEqual([[[60, 60]], [[60, 80]], [[40, 60]]])
    expect(value).toEqual([20, 60])
  })

  it("uses the vertical axis and reverses the drag delta in range mode", async () => {
    const onChange = jest.fn()
    render(
      <Slider range orientation="vertical" reverse defaultValue={[20, 60]} onChange={onChange} />,
    )
    const lower = thumb("最小值")
    touch(lower, "touchStart", 10, 100)
    await act(async () => touch(lower, "touchMove", 35, 80))
    fireEvent.touchEnd(lower)
    expect(onChange.mock.calls).toEqual([[[40, 60]]])
  })
})

describe("Slider.H5", () => {
  it.each([{ readonly: true }, { disabled: true }])(
    "blocks value changes with %p",
    async (props) => {
      const onChange = jest.fn()
      const onClick = jest.fn()
      const onDragStart = jest.fn()
      const onDragEnd = jest.fn()
      const { container } = render(
        <Slider
          {...props}
          defaultValue={50}
          onChange={onChange}
          onClick={onClick}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />,
      )
      const control = thumb("滑块")
      touch(control, "touchStart", 60)
      touch(control, "touchMove", 70)
      fireEvent.touchEnd(control)
      fireEvent.keyDown(control, { key: "End" })
      await click(sliderView(container), 100)
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onChange).not.toHaveBeenCalled()
      expect(onDragStart).not.toHaveBeenCalled()
      expect(onDragEnd).not.toHaveBeenCalled()
      expect(measure).not.toHaveBeenCalled()
      expect(control).toHaveAttribute("aria-valuenow", "50")
      if ("disabled" in props) {
        expect(control).toHaveAttribute("aria-disabled", "true")
        expect(control.tabIndex).toBe(-1)
      } else {
        expect(control).toHaveAttribute("aria-readonly", "true")
        expect(control.tabIndex).toBe(0)
      }
    },
  )

  it("supports focus, all standard arrows, Home, End, and a partial last step", () => {
    const onChange = jest.fn()
    render(<Slider max={8} step={6} onChange={onChange} orientation="vertical" reverse />)
    const control = thumb()
    expect(control).toHaveAttribute("aria-orientation", "vertical")
    expect(control).toHaveAttribute("aria-valuemin", "0")
    expect(control).toHaveAttribute("aria-valuemax", "8")
    expect(control).toHaveClass("taroify-slider__thumb-wrapper-left")
    control.focus()
    expect(control).toHaveFocus()
    for (const key of ["Tab", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End", "ArrowDown"]) {
      fireEvent.keyDown(control, { key })
    }
    expect(onChange.mock.calls).toEqual([[6], [8], [6], [0], [8], [6]])
  })

  it("provides per-thumb labels, value descriptions and dependent keyboard boundaries", () => {
    const onChange = jest.fn()
    render(
      <>
        <span id="maximum-price">最高价格</span>
        <Slider range defaultValue={[20, 60]} onChange={onChange}>
          <Slider.Thumb ariaLabel="最低价格" aria-valuetext="20 元" />
          <Slider.Thumb aria-label="价格上限" aria-labelledby="maximum-price" />
        </Slider>
      </>,
    )
    const lower = thumb("最低价格")
    const upper = thumb("最高价格")
    expect(lower).toHaveAttribute("aria-valuetext", "20 元")
    expect(lower).toHaveAttribute("aria-valuemax", "60")
    expect(upper).toHaveAttribute("aria-label", "价格上限")
    expect(upper).toHaveAttribute("aria-valuemin", "20")
    fireEvent.keyDown(lower, { key: "End" })
    fireEvent.keyDown(upper, { key: "Home" })
    fireEvent.keyDown(lower, { key: "ArrowDown" })
    fireEvent.keyDown(upper, { key: "Home" })
    expect(onChange.mock.calls).toEqual([[[60, 60]], [[59, 60]], [[59, 59]]])
    expect(upper).toHaveAttribute("aria-valuemin", "59")
  })

  it("preserves static thumb children and default thumb view props", () => {
    const props: SliderProps = { range: true, defaultValue: [30, 80] }
    render(
      <Slider {...props}>
        {false}
        <Slider.Thumb className="custom" id="custom-thumb" />
        <Slider.Thumb>
          <span>thumb content</span>
        </Slider.Thumb>
      </Slider>,
    )
    expect(document.getElementById("custom-thumb")).toHaveClass("custom", "taroify-slider__thumb")
    expect(thumb("最大值")).toHaveTextContent("thumb content")
  })

  it("passes the single value to a render function and respects its empty result", async () => {
    const renderThumb = jest.fn(() => null)
    const { container } = render(
      <Slider defaultValue={50}>
        <Slider.Thumb>{renderThumb}</Slider.Thumb>
      </Slider>,
    )
    expect(renderThumb).toHaveBeenLastCalledWith({ value: 50, dragging: false, index: undefined })
    expect(container.querySelector(".taroify-slider__thumb")).toBeNull()
    touch(thumb(), "touchStart", 60)
    await act(async () => touch(thumb(), "touchMove", 80))
    expect(renderThumb).toHaveBeenLastCalledWith({ value: 70, dragging: true, index: undefined })
    fireEvent.touchEnd(thumb())
    expect(renderThumb).toHaveBeenLastCalledWith({ value: 70, dragging: false, index: undefined })
  })

  it("renders a standalone thumb safely", () => {
    render(<Slider.Thumb ariaLabel="Standalone" />)
    const control = thumb("Standalone")
    touch(control, "touchStart", 10)
    touch(control, "touchMove", 40)
    fireEvent.touchEnd(control)
    fireEvent.touchCancel(control)
    fireEvent.keyDown(control, { key: "ArrowRight" })
    expect(control).toHaveAttribute("aria-valuenow", "0")
  })
})
