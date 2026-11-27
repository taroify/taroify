import { createSelectorQuery, getEnv, getWindowInfo } from "@tarojs/taro"
import { act, createEvent, fireEvent, render, renderHook, screen } from "@testing-library/react"
import * as React from "react"
import useCanvas from "../../hooks/use-canvas"
import { getRect, makeRect, type Rect } from "../../utils/dom/rect"
import Signature, { type SignatureInstance, type SignatureProps } from ".."
import "../style"

jest.mock("../../styles/style", () => ({}))
jest.mock("../../button/style", () => ({}))
jest.mock("../index.scss", () => ({}))
jest.mock("../../utils/dom/rect", () => ({
  ...jest.requireActual("../../utils/dom/rect"),
  getRect: jest.fn(),
}))
jest.mock("@tarojs/taro", () => ({
  getEnv: jest.fn(),
  getWindowInfo: jest.fn(),
  nextTick: (callback: () => void) => callback(),
  createSelectorQuery: jest.fn(),
}))
// jsdom does not hydrate Taro's Stencil element with a native canvas.
beforeAll(() => {
  customElements.define(
    "taro-canvas-core",
    class extends HTMLElement {
      connectedCallback() {
        this.appendChild(document.createElement("canvas"))
      }
    },
  )
})

const measure = jest.mocked(getRect)
const env = jest.mocked(getEnv)
const windowInfo = jest.mocked(getWindowInfo)
const initialRect = { ...makeRect(200, 100), left: 10, top: 20 }
const ctx = {
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  scale: jest.fn(),
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  lineWidth: 0,
  lineCap: "",
  strokeStyle: "",
  fillStyle: "",
}

beforeEach(() => {
  measure.mockReset().mockResolvedValue(initialRect)
  env.mockReturnValue("WEB" as ReturnType<typeof getEnv>)
  windowInfo.mockReturnValue({ pixelRatio: 2 } as ReturnType<typeof getWindowInfo>)
  jest
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  jest
    .spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect")
    .mockReturnValue(initialRect as unknown as DOMRect)
  jest
    .spyOn(HTMLCanvasElement.prototype, "toDataURL")
    .mockImplementation((type) => `data:${type};base64,ink`)
})

afterEach(() => {
  jest.restoreAllMocks()
  jest.useRealTimers()
})

function mount(props: SignatureProps = {}) {
  const ref = React.createRef<SignatureInstance>()
  const view = render(<Signature {...props} ref={ref} />)
  return { ...view, ref, canvas: view.container.querySelector("canvas")! }
}

function touch(canvas: HTMLCanvasElement, type: "touchStart" | "touchMove", x: number, y: number) {
  const event = createEvent[type](canvas, { touches: [{ x, y, clientX: x + 10, clientY: y + 20 }] })
  fireEvent(canvas, event)
  return event
}

function stroke(canvas: HTMLCanvasElement, x = 5) {
  touch(canvas, "touchStart", x, 10)
  touch(canvas, "touchMove", x + 10, 20)
  fireEvent.touchEnd(canvas)
}

function deferredRect() {
  let finish!: (rect: Rect) => void
  measure.mockReturnValueOnce(
    new Promise((resolve) => {
      finish = resolve
    }),
  )
  return finish
}

test("keeps the canvas-only default and synchronous empty and non-empty exports", async () => {
  const onSubmit = jest.fn()
  const onStart = jest.fn()
  const onSigning = jest.fn()
  const onEnd = jest.fn()
  const { canvas, ref, container, rerender } = mount({
    onSubmit,
    onStart,
    onSigning,
    onEnd,
    className: "paper",
  })
  expect(container.firstChild).toHaveClass("paper")
  expect(canvas.parentElement!.id).toMatch(/^taroify-canvas\d+$/)
  expect(screen.queryByText("确认")).toBeNull()
  const api = ref.current!
  expect(api.getImage()).toEqual({ image: "", canvas: null })
  api.clear()
  api.undo()
  api.submit()
  await api.resize()
  expect(onSubmit).not.toHaveBeenCalled()

  await act(async () => {})
  expect(canvas.width).toBe(400)
  expect(canvas.height).toBe(200)
  expect(ref.current!.getImage()).toEqual({ canvas, image: "" })
  fireEvent.touchStart(canvas, { touches: [] })
  touch(canvas, "touchMove", 1, 1)
  fireEvent.touchEnd(canvas)
  expect(onStart).not.toHaveBeenCalled()
  touch(canvas, "touchStart", 2, 4)
  fireEvent.touchMove(canvas, { touches: [] })
  fireEvent.touchEnd(canvas)
  expect(ref.current!.getImage().image).toBe("")
  expect(onEnd).toHaveBeenCalledTimes(1)

  touch(canvas, "touchStart", 3, 6)
  const event = touch(canvas, "touchMove", 4, 7)
  touch(canvas, "touchMove", 8, 9)
  fireEvent.touchCancel(canvas)
  expect(onSigning.mock.calls[0][0]).toBe(event)
  expect(event.defaultPrevented).toBe(true)
  expect(ctx.moveTo.mock.calls).toEqual([
    [3, 6],
    [4, 7],
  ])
  expect(ctx.lineTo.mock.calls).toEqual([
    [4, 7],
    [8, 9],
  ])
  expect(ctx.lineWidth).toBe(3)
  expect(ctx.strokeStyle).toBe("#000")
  expect(onStart).toHaveBeenCalledTimes(2)
  expect(onEnd).toHaveBeenCalledTimes(2)

  expect(ref.current!.getImage()).toEqual({ canvas, image: "data:image/png;base64,ink" })
  expect(onSubmit).not.toHaveBeenCalled()
  for (const type of ["jpg", "jpeg"]) {
    rerender(<Signature ref={ref} type={type} onSubmit={onSubmit} />)
    ref.current!.submit()
    expect(canvas.toDataURL).toHaveBeenLastCalledWith("image/jpeg", 0.8)
    expect(onSubmit).toHaveBeenLastCalledWith({ canvas, image: "data:image/jpeg;base64,ink" })
  }
})

test("keeps strokes, styles and undo history across aspect ratio and device pixel ratio changes", async () => {
  const { ref, canvas, rerender } = mount({
    canvasId: "contract",
    backgroundColor: "white",
    penColor: "red",
    lineWidth: 6,
  })
  await act(async () => {})
  expect(canvas.parentElement!.id).toBe("contract")
  stroke(canvas, 12)
  rerender(<Signature ref={ref} canvasId="contract" showToolbar backgroundColor="white" />)
  stroke(canvas, 52)

  measure.mockResolvedValue(makeRect(100, 200))
  windowInfo.mockReturnValue({ pixelRatio: 3 } as ReturnType<typeof getWindowInfo>)
  ctx.moveTo.mockClear()
  await ref.current!.resize()
  expect([canvas.width, canvas.height]).toEqual([300, 600])
  expect(ctx.scale).toHaveBeenLastCalledWith(3, 3)
  expect(ctx.moveTo.mock.calls).toEqual([
    [6, 5],
    [26, 5],
  ])
  fireEvent.click(screen.getByText("撤销"))
  expect(ctx.lineTo).toHaveBeenLastCalledWith(11, 10)
  expect(ctx.strokeStyle).toBe("red")
  expect(ctx.lineWidth).toBe(3)
  expect(ctx.fillStyle).toBe("white")
  expect(ctx.fillRect).toHaveBeenLastCalledWith(0, 0, 100, 200)
  expect(ref.current!.getImage().image).toBeTruthy()

  measure.mockResolvedValue(initialRect)
  await ref.current!.resize()
  expect(ctx.moveTo).toHaveBeenLastCalledWith(12, 10)
  expect(ctx.lineWidth).toBe(6)
  ref.current!.undo()
  expect(ref.current!.getImage()).toEqual({ canvas, image: "" })
  ref.current!.submit()
  ref.current!.clear()
})

test("fits strokes added in newly available space and replays an in-progress stroke", async () => {
  const { ref, canvas } = mount()
  await act(async () => {})
  stroke(canvas)
  measure.mockResolvedValue(makeRect(100, 200))
  await ref.current!.resize()
  touch(canvas, "touchStart", 10, 100)
  touch(canvas, "touchMove", 14, 120)
  measure.mockResolvedValue(initialRect)
  await ref.current!.resize()
  expect(ctx.lineTo).toHaveBeenLastCalledWith(28 * (100 / 240), 100)
  touch(canvas, "touchMove", 16, 90)
  fireEvent.touchEnd(canvas)
  ref.current!.undo()
  expect(ctx.lineTo).toHaveBeenLastCalledWith(15 * (100 / 240), 20 * (100 / 240))
})

test("enforces bounded undo without erasing older ink or reviving expired history", async () => {
  const { ref, canvas, rerender } = mount()
  await act(async () => {})
  for (let i = 0; i < 21; i++) stroke(canvas, i)
  for (let i = 0; i < 21; i++) ref.current!.undo()
  expect(ctx.moveTo).toHaveBeenLastCalledWith(0, 10)
  expect(ref.current!.getImage().image).toBeTruthy()

  rerender(<Signature ref={ref} historySize={0} />)
  stroke(canvas, 50)
  ctx.clearRect.mockClear()
  rerender(<Signature ref={ref} historySize={1.9} />)
  ref.current!.undo()
  expect(ctx.clearRect).not.toHaveBeenCalled()
  stroke(canvas, 80)
  ref.current!.undo()
  expect(ctx.moveTo).toHaveBeenLastCalledWith(50, 10)
  stroke(canvas, 90)
  rerender(<Signature ref={ref} historySize={-1} />)
  ctx.clearRect.mockClear()
  ref.current!.undo()
  expect(ctx.clearRect).not.toHaveBeenCalled()
  ref.current!.clear()
  expect(ref.current!.getImage().image).toBe("")
  rerender(<Signature ref={ref} historySize={1} />)
  stroke(canvas)
  ref.current!.undo()
  expect(ref.current!.getImage().image).toBe("")
})

test("dispatches toolbar and instance actions exactly once with customizable labels", async () => {
  const onSubmit = jest.fn()
  const onClear = jest.fn()
  const { canvas, ref } = mount({
    showToolbar: true,
    onSubmit,
    onClear,
    confirmButtonText: "保存",
    clearButtonText: "重写",
    undoButtonText: "回退",
  })
  fireEvent.click(screen.getByText("保存"))
  expect(onSubmit).not.toHaveBeenCalled()
  await act(async () => {})
  fireEvent.click(screen.getByText("保存"))
  expect(onSubmit).toHaveBeenCalledWith({ image: "", canvas })
  stroke(canvas)
  fireEvent.click(screen.getByText("保存"))
  expect(onSubmit).toHaveBeenLastCalledWith(ref.current!.getImage())
  fireEvent.click(screen.getByText("回退"))
  expect(onClear).not.toHaveBeenCalled()
  touch(canvas, "touchStart", 0, 0)
  touch(canvas, "touchMove", 9, 9)
  fireEvent.click(screen.getByText("重写"))
  touch(canvas, "touchMove", 10, 10)
  expect(ref.current!.getImage().image).toBe("")
  ref.current!.clear()
  expect(onClear).toHaveBeenCalledTimes(2)
  expect(onSubmit).toHaveBeenCalledTimes(2)
})

test("ignores hidden dimensions, superseded measurements and late resizes after unmount", async () => {
  const { ref, canvas, unmount } = mount()
  await act(async () => {})
  const finish = deferredRect()
  const pending = ref.current!.resize()
  measure.mockResolvedValue(makeRect(50, 50))
  await ref.current!.resize()
  finish(initialRect)
  await pending
  expect(canvas.width).toBe(100)
  stroke(canvas)
  for (const rect of [makeRect(0, 50), makeRect(50, 0)]) {
    measure.mockResolvedValue(rect)
    await ref.current!.resize()
    expect(canvas.width).toBe(100)
    expect(ref.current!.getImage().image).toBeTruthy()
  }
  const finishUnmounted = deferredRect()
  const last = ref.current!.resize()
  unmount()
  finishUnmounted(initialRect)
  await last
  expect(canvas.width).toBe(100)
})

test("uses mini program canvas-local coordinates and retries a missing native node", async () => {
  jest.useFakeTimers()
  env.mockReturnValue("WEAPP" as ReturnType<typeof getEnv>)
  const query = {
    select: jest.fn().mockReturnThis(),
    fields: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  }
  jest
    .mocked(createSelectorQuery)
    .mockReturnValue(query as unknown as ReturnType<typeof createSelectorQuery>)
  query.exec
    .mockImplementationOnce((cb) => cb([]))
    .mockImplementation((cb) => cb([{ node: document.querySelector("canvas") }]))
  const { canvas, ref } = mount({ canvasId: "weapp" })
  await act(async () => {
    await jest.advanceTimersByTimeAsync(100)
  })
  expect(query.select).toHaveBeenCalledWith("#weapp")
  fireEvent.touchStart(canvas, { touches: [{ x: 10, y: 5 }] })
  fireEvent.touchMove(canvas, { touches: [{ x: 15, y: 20 }] })
  fireEvent.touchEnd(canvas)
  expect(ctx.moveTo).toHaveBeenLastCalledWith(10, 5)
  expect(ctx.lineTo).toHaveBeenLastCalledWith(15, 20)
  expect(ref.current!.getImage().canvas).toBe(canvas)
})

test("renders tips only after all initialization attempts fail", async () => {
  jest.useFakeTimers()
  jest
    .mocked(HTMLCanvasElement.prototype.getContext)
    .mockImplementationOnce(() => {
      throw Error("not ready")
    })
    .mockReturnValue(null)
  const { ref, canvas, rerender } = mount({ tips: <strong>请更换设备</strong>, showToolbar: true })
  touch(canvas, "touchStart", 1, 1)
  touch(canvas, "touchMove", 1, 1)
  expect(screen.queryByText("请更换设备")).toBeNull()
  await act(async () => {
    await jest.advanceTimersByTimeAsync(3000)
  })
  expect(screen.queryByText("请更换设备")).toBeNull()
  await act(async () => {
    await jest.advanceTimersByTimeAsync(100)
  })
  expect(screen.getByText("请更换设备").tagName).toBe("STRONG")
  expect(canvas).not.toBeInTheDocument()
  expect(ref.current!.getImage()).toEqual({ image: "", canvas: null })
  rerender(<Signature ref={ref} />)
  expect(screen.getByText("当前环境不支持签名")).toBeInTheDocument()
})

test("keeps the shared hook usable without options or measured dimensions", async () => {
  const host = document.createElement("div")
  const node = host.appendChild(document.createElement("canvas"))
  const hostRef = { current: host }
  measure.mockResolvedValue(makeRect(0, 0))
  windowInfo.mockReturnValue({ pixelRatio: 0 } as ReturnType<typeof getWindowInfo>)
  const { result } = renderHook(() => useCanvas("other", hostRef))
  await act(async () => {})
  expect(result.current).toEqual([node, ctx, true, false])
  expect([node.width, node.height]).toEqual([300, 150])
  expect(ctx.scale).toHaveBeenCalledWith(1, 1)
})

test("ignores success and failure after the shared hook is unmounted", async () => {
  const finish = deferredRect()
  const { unmount } = mount()
  await act(async () => {})
  unmount()
  finish(initialRect)
  await act(async () => {})
  expect(ctx.scale).not.toHaveBeenCalled()

  const missing = { current: null }
  jest.useFakeTimers()
  const hook = renderHook(() => useCanvas("removed", missing))
  hook.unmount()
  await act(async () => {})
  expect(jest.getTimerCount()).toBe(0)
})
