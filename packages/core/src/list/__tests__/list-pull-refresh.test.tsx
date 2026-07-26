import { act, render } from "@testing-library/react"
import * as React from "react"
import PullRefresh from "../../pull-refresh"
import List from "../list"

let mockScrollViewProps: any

jest.mock(
  "@taroify/hooks",
  () => {
    const React = jest.requireActual("react")

    return {
      useForceUpdate: () => {
        const [, setCount] = React.useState(0)
        return React.useCallback(() => setCount((count) => count + 1), [])
      },
      useGetter: (value: any) => {
        const valueRef = React.useRef(value)
        valueRef.current = value
        return React.useCallback(
          () => (typeof valueRef.current === "function" ? valueRef.current() : valueRef.current),
          [],
        )
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

jest.mock("../../hooks", () => {
  const React = jest.requireActual("react")

  return {
    useDidEffect: () => {},
    useMemoizedFn: (fn: (...args: any[]) => any) => {
      const fnRef = React.useRef(fn)
      fnRef.current = fn
      return React.useCallback((...args: any[]) => fnRef.current(...args), [])
    },
  }
})

jest.mock("../../utils/lodash-polyfill", () => ({
  debounce: (fn: (...args: any[]) => any) => fn,
  throttle: jest.requireActual("lodash").throttle,
}))

jest.mock("@tarojs/components", () => {
  const React = jest.requireActual("react")
  const View = React.forwardRef((props: any, ref) => {
    const { children, ...restProps } = props
    return React.createElement("div", { ...restProps, ref }, children)
  })

  return {
    View,
    ScrollView: React.forwardRef((props: any, ref) => {
      mockScrollViewProps = props
      const { children, scrollY: _scrollY, ...restProps } = props
      return React.createElement("div", { ...restProps, ref }, children)
    }),
  }
})

jest.mock("@tarojs/taro", () => ({
  nextTick: (callback: () => void) => callback(),
  usePageScroll: () => {},
}))

function createTouchEvent(clientY: number) {
  return {
    touches: [{ clientX: 0, clientY }],
    preventDefault: jest.fn(),
  }
}

function scrollTo(scrollTop: number) {
  act(() => {
    mockScrollViewProps.onScroll({
      detail: {
        scrollTop,
      },
    })
  })
}

function touchStart(clientY: number) {
  act(() => {
    mockScrollViewProps.onTouchStart(createTouchEvent(clientY))
  })
}

function touchMove(clientY: number) {
  act(() => {
    mockScrollViewProps.onTouchMove(createTouchEvent(clientY))
    jest.advanceTimersByTime(20)
  })
}

function touchEnd() {
  act(() => {
    mockScrollViewProps.onTouchEnd(createTouchEvent(0))
  })
}

describe("<List fixedHeight pullRefresh />", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("starts pulling after the list reaches the top in the same gesture", () => {
    const onRefresh = jest.fn()
    const onScroll = jest.fn()

    render(
      <PullRefresh onRefresh={onRefresh}>
        <List disabled fixedHeight pullRefresh immediateCheck={false} onScroll={onScroll} />
      </PullRefresh>,
    )

    scrollTo(100)
    touchStart(100)
    touchMove(50)
    expect(onRefresh).not.toHaveBeenCalled()

    scrollTo(0)
    touchMove(60)
    touchMove(140)
    touchMove(150)
    touchEnd()

    expect(onScroll).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ scrollTop: 0 }),
      }),
    )
    expect(onRefresh).toHaveBeenCalledTimes(1)
  })

  it("keeps an explicit reachTop value as the source of truth", () => {
    const onRefresh = jest.fn()

    render(
      <PullRefresh reachTop={false} onRefresh={onRefresh}>
        <List disabled fixedHeight pullRefresh immediateCheck={false} />
      </PullRefresh>,
    )

    scrollTo(0)
    touchStart(0)
    touchMove(80)
    touchMove(90)
    touchEnd()

    expect(onRefresh).not.toHaveBeenCalled()
  })

  it("keeps the legacy behavior when pullRefresh is not enabled", () => {
    const onRefresh = jest.fn()

    render(
      <PullRefresh onRefresh={onRefresh}>
        <List disabled fixedHeight immediateCheck={false} />
      </PullRefresh>,
    )

    scrollTo(100)
    touchStart(0)
    touchMove(80)
    touchMove(90)
    touchEnd()

    expect(onRefresh).toHaveBeenCalledTimes(1)
  })
})
