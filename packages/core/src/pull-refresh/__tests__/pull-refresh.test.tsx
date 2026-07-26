import { act, fireEvent, render } from "@testing-library/react"
import * as React from "react"
import PullRefresh from "../pull-refresh"

let mockEnv = "WEB"
let mockPlatform = "ios"

jest.mock(
  "@taroify/hooks",
  () => {
    const React = jest.requireActual("react")

    return {
      useForceUpdate: () => {
        const [, setCount] = React.useState(0)
        return React.useCallback(() => setCount((count: number) => count + 1), [])
      },
      useToRef: (value: any) => {
        const valueRef = React.useRef(value)
        valueRef.current = value
        return valueRef
      },
    }
  },
  { virtual: true },
)

jest.mock("@tarojs/components", () => {
  const React = jest.requireActual("react")
  const View = React.forwardRef((props: any, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { catchMove: _catchMove, children, ...restProps } = props
    return React.createElement("div", { ...restProps, ref }, children)
  })

  return { View }
})

jest.mock("@tarojs/taro", () => ({
  getEnv: () => mockEnv,
  getSystemInfoSync: () => ({ platform: mockPlatform }),
  nextTick: (callback: () => void) => callback(),
}))

function getTrack(container: HTMLElement) {
  return container.querySelector(".taroify-pull-refresh__track") as HTMLElement
}

function touch(target: HTMLElement, type: "touchStart" | "touchMove", clientY: number) {
  fireEvent[type](target, {
    touches: [{ clientX: 0, clientY }],
  })
}

describe("<PullRefresh />", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockEnv = "WEB"
    mockPlatform = "ios"
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it("flushes the latest movement before deciding whether to refresh", () => {
    const onRefresh = jest.fn()
    const { container } = render(<PullRefresh onRefresh={onRefresh} />)
    const track = getTrack(container)

    touch(track, "touchStart", 0)
    touch(track, "touchMove", 40)
    touch(track, "touchMove", 60)
    fireEvent.touchEnd(track)

    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(track.style.transform).toBe("translate3d(0,50px, 0)")
  })

  it("does not allow a trailing movement to reopen the track after release", () => {
    const onRefresh = jest.fn()
    const { container } = render(<PullRefresh onRefresh={onRefresh} />)
    const track = getTrack(container)

    touch(track, "touchStart", 0)
    touch(track, "touchMove", 20)
    touch(track, "touchMove", 30)
    fireEvent.touchEnd(track)

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(onRefresh).not.toHaveBeenCalled()
    expect(track.style.transform).toBe("")
  })

  it("always resets a cancelled gesture without refreshing", () => {
    const onRefresh = jest.fn()
    const { container } = render(<PullRefresh onRefresh={onRefresh} />)
    const track = getTrack(container)

    touch(track, "touchStart", 0)
    touch(track, "touchMove", 80)
    fireEvent.touchCancel(track)

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(onRefresh).not.toHaveBeenCalled()
    expect(track.style.transform).toBe("")
  })

  it("resets an active gesture when reachTop changes before release", () => {
    const onRefresh = jest.fn()
    const { container, rerender } = render(<PullRefresh reachTop onRefresh={onRefresh} />)
    const track = getTrack(container)

    touch(track, "touchStart", 0)
    touch(track, "touchMove", 30)
    rerender(<PullRefresh reachTop={false} onRefresh={onRefresh} />)
    fireEvent.touchEnd(track)

    expect(onRefresh).not.toHaveBeenCalled()
    expect(track.style.transform).toBe("")
  })

  it("smooths sparse touch updates on Android WeChat Mini Program", () => {
    mockEnv = "WEAPP"
    mockPlatform = "android"
    const { container } = render(<PullRefresh />)
    const track = getTrack(container)

    touch(track, "touchStart", 0)
    touch(track, "touchMove", 20)

    expect(track.style.transitionDuration).toBe("300ms")
    expect(track.style.transform).toBe("translate3d(0,20px, 0)")
  })
})
