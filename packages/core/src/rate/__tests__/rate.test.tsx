import { act, fireEvent, render, waitFor } from "@testing-library/react"
import * as React from "react"
import { Star, StarOutlined } from "@taroify/icons"
import Field from "../../field"
import Form, { type FormInstance } from "../../form"
import { getRects, type Rect } from "../../utils/dom/rect"
import { getClientCoordinates } from "../../utils/dom/event"
import Rate, { type RateProps, type RateThemeVars } from "../index"
import RateItem from "../rate-item"
import RateContext from "../rate.context"
import { getRateScore, normalizeRateCount, normalizeRateValue, RateStatus } from "../rate.shared"
import "../style"

jest.mock("../../utils/dom/rect", () => ({
  ...jest.requireActual("../../utils/dom/rect"),
  getRects: jest.fn(),
}))
jest.mock("../../styles/style", () => ({}))
jest.mock("../index.scss", () => ({}))

const measure = jest.mocked(getRects)
const rect = (left: number, top = 10, width = 20, height = 20): Rect => ({
  left,
  top,
  width,
  height,
  right: left + width,
  bottom: top + height,
  id: "",
  dataset: {},
})
const row = [rect(10), rect(34), rect(58), rect(82), rect(106)]
const root = (container: HTMLElement) => container.querySelector(".taroify-rate") as HTMLElement
const fullCount = (container: HTMLElement) =>
  container.querySelectorAll(".taroify-rate__icon--full:not(.taroify-rate__icon--half)").length

async function click(target: HTMLElement, x: number, y = 20) {
  await act(async () => {
    fireEvent.click(target, { clientX: x, clientY: y })
  })
}
function touch(target: HTMLElement, type: "touchStart" | "touchMove", x: number, y = 20) {
  fireEvent[type](target, { touches: [{ clientX: x, clientY: y }] })
}
function pendingMeasurement() {
  let resolve!: (rects: Rect[]) => void
  const promise = new Promise<Rect[]>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

beforeEach(() => {
  measure.mockReset()
  measure.mockResolvedValue(row)
})
afterEach(() => {
  jest.restoreAllMocks()
  jest.useRealTimers()
})

describe("Rate selection", () => {
  it("renders defaults, forwards View props and changes uncontrolled values only once per score", async () => {
    const onChange = jest.fn()
    const onClick = jest.fn()
    const { container } = render(
      <Rate id="rating" className="custom" onChange={onChange} onClick={onClick} />,
    )
    expect(root(container)).toHaveAttribute("id", "rating")
    expect(root(container)).toHaveClass("custom")
    expect(container.querySelectorAll(".taroify-rate__item")).toHaveLength(5)
    expect(fullCount(container)).toBe(0)
    await click(root(container), 60)
    expect(onChange).toHaveBeenCalledWith(3)
    expect(fullCount(container)).toBe(3)
    await click(root(container), 60)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(2)
    expect(measure).toHaveBeenCalledTimes(2)
  })

  it("supports controlled values and uses the latest change callback", async () => {
    const first = jest.fn()
    const next = jest.fn()
    const { container, rerender } = render(<Rate value={1} onChange={first} />)
    await click(root(container), 90)
    expect(first).toHaveBeenCalledWith(4)
    expect(fullCount(container)).toBe(1)
    rerender(<Rate value={4} onChange={next} />)
    expect(fullCount(container)).toBe(4)
    await click(root(container), 110)
    expect(next).toHaveBeenCalledWith(5)
  })

  it("allows click selection when touchable is false without measuring or selecting on moves", async () => {
    const onChange = jest.fn()
    const { container } = render(<Rate touchable={false} onChange={onChange} />)
    const target = root(container)
    touch(target, "touchStart", 12)
    touch(target, "touchMove", 100)
    fireEvent.touchEnd(target)
    expect(measure).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
    touch(target, "touchStart", 60)
    fireEvent.touchEnd(target)
    await click(target, 60)
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it.each([{ disabled: true }, { readonly: true }, { count: 0 }])(
    "blocks value changes with %p but forwards callbacks",
    async (props) => {
      const onChange = jest.fn()
      const onClick = jest.fn()
      const onTouchStart = jest.fn()
      const { container } = render(
        <Rate {...props} onChange={onChange} onClick={onClick} onTouchStart={onTouchStart} />,
      )
      const target = root(container)
      touch(target, "touchStart", 20)
      touch(target, "touchMove", 100)
      fireEvent.touchEnd(target)
      await click(target, 100)
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onTouchStart).toHaveBeenCalledTimes(1)
      expect(onChange).not.toHaveBeenCalled()
      expect(measure).not.toHaveBeenCalled()
    },
  )

  it("clears repeated full or half scores only when enabled", async () => {
    const onChange = jest.fn()
    const { container, rerender } = render(<Rate defaultValue={3} clearable onChange={onChange} />)
    await click(root(container), 60)
    expect(onChange).toHaveBeenLastCalledWith(0)
    await click(root(container), 90)
    expect(onChange).toHaveBeenLastCalledWith(4)
    rerender(<Rate value={2.5} allowHalf clearable onChange={onChange} />)
    await click(root(container), 60)
    expect(onChange).toHaveBeenLastCalledWith(0)
    rerender(<Rate value={2.5} allowHalf onChange={onChange} />)
    onChange.mockClear()
    await click(root(container), 60)
    expect(onChange).not.toHaveBeenCalled()
    await click(root(container), 70)
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it("keeps custom icons, numeric/string sizes, zero gutter, colors and style overrides", () => {
    const theme: RateThemeVars = { rateIconFullColor: "green" }
    const props: RateProps = {
      count: "4",
      size: "28px",
      gutter: "8px",
      color: theme.rateIconFullColor,
    }
    const { container, rerender } = render(
      <Rate
        {...props}
        defaultValue={2.5}
        allowHalf
        emptyColor="gray"
        disabledColor="silver"
        icon={<Star className="chosen" />}
        emptyIcon={<StarOutlined className="empty" />}
        style={{ "--rate-icon-full-color": "blue" } as React.CSSProperties}
      />,
    )
    expect(container.querySelectorAll(".taroify-rate__item")).toHaveLength(4)
    expect(container.querySelector(".chosen")).toBeInTheDocument()
    expect(container.querySelector(".empty")).toBeInTheDocument()
    expect(root(container).style.getPropertyValue("--rate-icon-full-color")).toBe("blue")
    expect(root(container).style.getPropertyValue("--rate-icon-empty-color")).toBe("gray")
    expect(root(container).style.getPropertyValue("--rate-icon-disabled-color")).toBe("silver")
    expect(container.querySelector(".taroify-rate__item")).toHaveStyle({ paddingRight: "8px" })
    expect(container.querySelector(".taroify-rate__icon")).toHaveStyle({ fontSize: "28px" })
    expect(container.querySelector(".taroify-rate__icon--half")).toHaveStyle({ width: "0.5em" })
    rerender(<Rate defaultValue={2.5} allowHalf disabled size={24} gutter={0} />)
    expect(container.querySelector(".taroify-rate__icon")).toHaveStyle({ fontSize: "24px" })
    expect(container.querySelector(".taroify-rate__item")).toHaveStyle({ paddingRight: "0px" })
    expect(container.querySelector(".taroify-rate__icon--half")).toHaveClass(
      "taroify-rate__icon--disabled",
    )
    expect(root(container).style.getPropertyValue("--rate-icon-full-color")).toBe("")
  })

  it.each([
    [3.3, false, false, 3, undefined],
    [3.3, true, false, 3, undefined],
    [3.7, true, false, 3, "0.5em"],
    [3.3, true, true, 3, "0.3em"],
    [0, true, true, 0, undefined],
    [-2, true, true, 0, undefined],
    [10, true, true, 5, undefined],
    [Number.NaN, true, true, 0, undefined],
    [Number.POSITIVE_INFINITY, false, false, 0, undefined],
  ])(
    "renders value %p with half=%p readonly=%p without changing it",
    (value, allowHalf, readonly, full, width) => {
      const onChange = jest.fn()
      const { container } = render(
        <Rate
          value={value as number}
          allowHalf={allowHalf as boolean}
          readonly={readonly as boolean}
          onChange={onChange}
        />,
      )
      expect(fullCount(container)).toBe(full)
      const half = container.querySelector(".taroify-rate__icon--half")
      if (width) expect(half).toHaveStyle({ width })
      else expect(half).toBeNull()
      expect(onChange).not.toHaveBeenCalled()
    },
  )

  it("updates count safely and toggles wrapping without changing the value", () => {
    const onChange = jest.fn()
    const { container, rerender } = render(<Rate count="6" value={5} onChange={onChange} />)
    expect(container.querySelectorAll(".taroify-rate__item")).toHaveLength(6)
    expect(root(container)).not.toHaveClass("taroify-rate--wrap")
    rerender(<Rate count={2.9} value={5} wrap onChange={onChange} />)
    expect(container.querySelectorAll(".taroify-rate__item")).toHaveLength(2)
    expect(fullCount(container)).toBe(2)
    expect(root(container)).toHaveClass("taroify-rate--wrap")
    rerender(<Rate count="bad" onChange={onChange} />)
    expect(container.querySelectorAll(".taroify-rate__item")).toHaveLength(0)
    expect(onChange).not.toHaveBeenCalled()
  })

  it("converts rpx dimensions consistently and falls back to theme sizes for invalid input", () => {
    jest.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(375)
    const { container, rerender } = render(<Rate size="48rpx" gutter="12rpx" />)
    expect(container.querySelector(".taroify-rate__icon")).toHaveStyle({ fontSize: "24px" })
    expect(container.querySelector(".taroify-rate__item")).toHaveStyle({ paddingRight: "6px" })
    rerender(<Rate size={-1} gutter="bad" />)
    expect((container.querySelector(".taroify-rate__icon") as HTMLElement).style.fontSize).toBe("")
    expect((container.querySelector(".taroify-rate__item") as HTMLElement).style.paddingRight).toBe(
      "",
    )
  })

  it("integrates with Field/Form for selection, clearing and submission", async () => {
    const ref = React.createRef<FormInstance>()
    const onSubmit = jest.fn()
    const { container } = render(
      <Form ref={ref} defaultValues={{ score: 2 }} onSubmit={onSubmit}>
        <Field name="score">
          <Rate clearable />
        </Field>
      </Form>,
    )
    expect(fullCount(container)).toBe(2)
    await click(root(container), 60)
    act(() => ref.current?.submit())
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0].detail.value.score).toBe(3)
    await click(root(container), 60)
    act(() => ref.current?.submit())
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2))
    expect(onSubmit.mock.calls[1][0].detail.value.score).toBe(0)
  })
})

describe("Rate gestures and async measurement", () => {
  it("reads native DOMRect getters as well as mini-program plain rectangles", async () => {
    measure.mockResolvedValue(
      row.map(
        ({ left, top, width, height }) => new DOMRect(left, top, width, height) as unknown as Rect,
      ),
    )
    const onChange = jest.fn()
    const { container } = render(<Rate onChange={onChange} />)
    await click(root(container), 110)
    expect(onChange).toHaveBeenCalledWith(5)
  })
  it("measures once per gesture, selects on moves without click callbacks, and suppresses the trailing click", async () => {
    jest.spyOn(Date, "now").mockReturnValue(1000)
    const onClick = jest.fn()
    const onChange = jest.fn()
    const onTouchStart = jest.fn()
    const onTouchMove = jest.fn()
    const onTouchEnd = jest.fn()
    const { container } = render(
      <Rate
        defaultValue={3}
        clearable
        onClick={onClick}
        onChange={onChange}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />,
    )
    const target = root(container)
    touch(target, "touchStart", 12)
    await act(async () => {
      touch(target, "touchMove", 60)
      touch(target, "touchMove", 90)
    })
    expect(measure).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith(4)
    await click(target, 90)
    expect(onClick).not.toHaveBeenCalled()
    fireEvent.touchEnd(target)
    await click(target, 90)
    expect(onClick).not.toHaveBeenCalled()
    expect(onTouchStart).toHaveBeenCalledTimes(1)
    expect(onTouchMove).toHaveBeenCalledTimes(2)
    expect(onTouchEnd).toHaveBeenCalledTimes(1)
    touch(target, "touchStart", 90)
    fireEvent.touchEnd(target)
    await click(target, 90)
    expect(onChange).toHaveBeenLastCalledWith(0)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not clear the score while dragging across the currently selected value", async () => {
    const onChange = jest.fn()
    const { container } = render(<Rate defaultValue={3} clearable onChange={onChange} />)
    touch(root(container), "touchStart", 12)
    await act(async () => {
      touch(root(container), "touchMove", 60)
    })
    expect(onChange).not.toHaveBeenCalled()
    expect(fullCount(container)).toBe(3)
  })

  it("retains the latest move while the measurement is pending, including after touchend", async () => {
    const pending = pendingMeasurement()
    measure.mockReturnValue(pending.promise)
    const onChange = jest.fn()
    const { container } = render(<Rate onChange={onChange} />)
    touch(root(container), "touchStart", 12)
    touch(root(container), "touchMove", 60)
    touch(root(container), "touchMove", 110)
    fireEvent.touchEnd(root(container))
    await act(async () => {
      pending.resolve(row)
    })
    expect(onChange.mock.calls).toEqual([[5]])
    expect(measure).toHaveBeenCalledTimes(1)
  })

  it("ignores an older click whose measurement resolves after a newer click", async () => {
    const old = pendingMeasurement()
    const latest = pendingMeasurement()
    measure.mockReturnValueOnce(old.promise).mockReturnValueOnce(latest.promise)
    const onChange = jest.fn()
    const { container } = render(<Rate onChange={onChange} />)
    await click(root(container), 60)
    await click(root(container), 110)
    await act(async () => {
      latest.resolve(row)
      old.resolve(row)
    })
    expect(onChange.mock.calls).toEqual([[5]])
  })

  it("discards results after cancel, unmount, or a subsequent gesture", async () => {
    const pending = pendingMeasurement()
    measure.mockReturnValue(pending.promise)
    const onChange = jest.fn()
    const onTouchCancel = jest.fn()
    const { container, unmount } = render(
      <Rate onChange={onChange} onTouchCancel={onTouchCancel} />,
    )
    const target = root(container)
    touch(target, "touchStart", 12)
    touch(target, "touchMove", 100)
    fireEvent.touchCancel(target)
    await act(async () => {
      pending.resolve(row)
    })
    await click(target, 100)
    expect(onChange).not.toHaveBeenCalled()
    expect(onTouchCancel).toHaveBeenCalledTimes(1)
    const old = pendingMeasurement()
    measure.mockReturnValue(old.promise)
    touch(target, "touchStart", 12)
    touch(target, "touchMove", 100)
    touch(target, "touchStart", 12)
    await act(async () => {
      old.resolve(row)
    })
    expect(onChange).not.toHaveBeenCalled()
    const last = pendingMeasurement()
    measure.mockReturnValue(last.promise)
    await click(target, 60)
    unmount()
    await act(async () => {
      last.resolve(row)
    })
    expect(onChange).not.toHaveBeenCalled()
  })

  it.each<RateProps>([
    { disabled: true },
    { readonly: true },
    { touchable: false },
    { count: 2 },
    { size: 30 },
    { gutter: 10 },
    { allowHalf: true },
    { clearable: true },
    { wrap: true },
    { style: { width: "100px" } },
    { className: "new-layout" },
  ])("invalidates a pending selection after changing %p", async (props) => {
    const pending = pendingMeasurement()
    measure.mockReturnValue(pending.promise)
    const onChange = jest.fn()
    const { container, rerender } = render(<Rate onChange={onChange} />)
    await click(root(container), 110)
    rerender(<Rate {...props} onChange={onChange} />)
    await act(async () => {
      pending.resolve(row)
    })
    expect(onChange).not.toHaveBeenCalled()
  })

  it("uses a fresh layout for the next gesture and measures icon content instead of gaps", async () => {
    const onChange = jest.fn()
    measure.mockResolvedValueOnce(row).mockResolvedValueOnce([rect(100), rect(140), rect(180)])
    const { container } = render(<Rate allowHalf onChange={onChange} />)
    await click(root(container), 21)
    expect(onChange).toHaveBeenLastCalledWith(1)
    await click(root(container), 159)
    expect(onChange).toHaveBeenLastCalledWith(2)
    expect(measure).toHaveBeenLastCalledWith(expect.anything(), " .taroify-rate__item-content")
  })

  it("preserves vertical scrolling and ignores moves without a valid single-touch start", async () => {
    const onChange = jest.fn()
    const { container } = render(<Rate onChange={onChange} />)
    const target = root(container)
    touch(target, "touchMove", 80)
    fireEvent.touchStart(target, { touches: [] })
    touch(target, "touchMove", 80)
    touch(target, "touchStart", 20)
    await act(async () => {
      touch(target, "touchMove", 22, 22)
      const event = new Event("touchmove", { bubbles: true, cancelable: true })
      Object.defineProperty(event, "touches", { value: [{ clientX: 23, clientY: 80 }] })
      fireEvent(target, event)
      expect(event.defaultPrevented).toBe(false)
      fireEvent.touchMove(target, { touches: [] })
    })
    fireEvent.touchEnd(target)
    await click(target, 100)
    expect(onChange).not.toHaveBeenCalled()
    expect(target).not.toHaveAttribute("catch-move", "true")
  })

  it("allows a later mouse click if a platform emits no synthetic click after dragging", async () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(1000)
    const onClick = jest.fn()
    const { container } = render(<Rate onClick={onClick} />)
    touch(root(container), "touchStart", 12)
    await act(async () => {
      touch(root(container), "touchMove", 60)
    })
    fireEvent.touchEnd(root(container))
    now.mockReturnValue(1500)
    await click(root(container), 110)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(fullCount(container)).toBe(5)
  })

  it("does not emit for hidden, empty or rejected measurements", async () => {
    measure
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([rect(0, 0, 0, 0)])
      .mockRejectedValueOnce(new Error("measurement failed"))
    const onChange = jest.fn()
    const { container } = render(<Rate onChange={onChange} />)
    await click(root(container), 60)
    await click(root(container), 60)
    await click(root(container), 60)
    expect(onChange).not.toHaveBeenCalled()
  })

  it("selects the right score on wrapped rows and clamps drags beyond the first/last row", async () => {
    measure.mockResolvedValue([rect(10), rect(34), rect(58), rect(10, 40), rect(34, 40)])
    const onChange = jest.fn()
    const { container } = render(<Rate wrap allowHalf onChange={onChange} />)
    await click(root(container), 11, 45)
    expect(onChange).toHaveBeenLastCalledWith(3.5)
    await click(root(container), 35, 45)
    expect(onChange).toHaveBeenLastCalledWith(4.5)
    await click(root(container), 45, 100)
    expect(onChange).toHaveBeenLastCalledWith(5)
    await click(root(container), 0, 0)
    expect(onChange).toHaveBeenLastCalledWith(0.5)
  })
})

describe("Rate geometry and item rendering", () => {
  it.each([
    ["5", 5],
    [2.9, 2],
    [-1, 0],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
    ["", 0],
  ])("normalizes count %p to %p", (value, expected) => {
    expect(normalizeRateCount(value as number | string)).toBe(expected)
  })
  it("normalizes display values without losing readonly decimal precision", () => {
    expect(normalizeRateValue(3.3, 5)).toBe(3.3)
    expect(normalizeRateValue(8, 5)).toBe(5)
    expect(normalizeRateValue(-1, 5)).toBe(0)
  })
  it("handles invalid coordinates, staggered heights, row gaps and zero coordinates", () => {
    expect(getRateScore(row, { clientX: Number.NaN, clientY: 20 }, false)).toBeUndefined()
    expect(getRateScore(row, { clientX: 20, clientY: Number.NaN }, false)).toBeUndefined()
    expect(
      getRateScore(
        [rect(0, 0), rect(30, 5, 20, 10), rect(0, 40)],
        { clientX: 35, clientY: 18 },
        true,
      ),
    ).toBe(1.5)
    expect(getRateScore([rect(0, 0), rect(0, 40)], { clientX: 1, clientY: 35 }, false)).toBe(2)
    expect(getRateScore([rect(0, 0)], { clientX: 10, clientY: 0 }, true)).toBe(1)
    expect(getClientCoordinates({ clientX: 0, clientY: 0 } as MouseEvent)).toEqual({
      clientX: 0,
      clientY: 0,
    })
    expect(getClientCoordinates({ detail: { x: 0, y: 0 } } as never)).toEqual({
      clientX: 0,
      clientY: 0,
    })
    expect(getClientCoordinates({ detail: { clientX: 12, clientY: 20 } } as never)).toEqual({
      clientX: 12,
      clientY: 20,
    })
  })
  it("supports standalone item defaults and overlays an empty fractional icon safely", () => {
    const { container, rerender } = render(
      <RateItem score={1} value={0} status={RateStatus.Void} />,
    )
    expect(container.querySelector(".taroify-rate__item-content")).toBeEmptyDOMElement()
    rerender(
      <RateContext.Provider value={{ icon: <Star />, emptyIcon: <StarOutlined /> }}>
        <RateItem
          className="custom-item"
          style={{ paddingRight: "9px" }}
          score={1}
          value={0.3}
          half
          status={RateStatus.Void}
        />
      </RateContext.Provider>,
    )
    expect(container.querySelector(".custom-item")).toHaveStyle({ paddingRight: "9px" })
    expect(container.querySelector(".taroify-rate__icon--half")).not.toHaveClass(
      "taroify-rate__icon--full",
    )
  })
})
