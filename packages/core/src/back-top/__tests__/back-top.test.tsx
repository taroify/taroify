import { act, fireEvent, render, waitFor } from "@testing-library/react"
import * as React from "react"
import { getScrollParent, getScrollTop } from "../../utils/dom/scroll"
import { prefixClassname } from "../../styles"
import BackTop from "../index"

let mockPageScrollHandler: (() => Promise<void>) | undefined

jest.mock("@tarojs/taro", () => ({
  nextTick: (callback: () => void) => callback(),
  usePageScroll: (callback: () => Promise<void>) => {
    mockPageScrollHandler = callback
  },
}))

jest.mock("../../utils/dom/scroll", () => ({
  getScrollParent: jest.fn(),
  getScrollTop: jest.fn(),
}))

const mockedGetScrollParent = getScrollParent as jest.MockedFunction<typeof getScrollParent>
const mockedGetScrollTop = getScrollTop as jest.MockedFunction<typeof getScrollTop>

describe("<BackTop />", () => {
  let scrollTo: jest.Mock
  let scrollParent: HTMLElement

  beforeEach(() => {
    mockPageScrollHandler = undefined
    scrollTo = jest.fn()
    scrollParent = { scrollTo } as unknown as HTMLElement
    mockedGetScrollParent.mockResolvedValue(scrollParent)
    mockedGetScrollTop.mockResolvedValue(0)
  })

  it("renders the default icon, styles and view props", async () => {
    const { container } = render(
      <BackTop
        id="page-back-top"
        className="custom-back-top"
        style={{ color: "red", right: "999px" }}
        data-testid="back-top"
      />,
    )

    const backTop = container.querySelector(`.${prefixClassname("back-top")}`)

    expect(backTop).toHaveClass("custom-back-top")
    expect(backTop).toHaveAttribute("id", "page-back-top")
    expect(backTop).toHaveAttribute("data-testid", "back-top")
    expect(backTop).toHaveStyle({
      color: "rgb(255, 0, 0)",
      right: "30px",
      bottom: "40px",
      zIndex: "100",
    })
    expect(container.querySelector(".van-icon-back-top")).toBeInTheDocument()
    await waitFor(() => expect(mockedGetScrollParent).toHaveBeenCalledWith(backTop))
  })

  it("supports custom position styles and zero as custom content", () => {
    const { container } = render(
      <BackTop right={12} bottom="24px" zIndex={200}>
        {0}
      </BackTop>,
    )

    const backTop = container.querySelector(`.${prefixClassname("back-top")}`)

    expect(backTop).toHaveStyle({ right: "12px", bottom: "24px", zIndex: "200" })
    expect(backTop).toHaveTextContent("0")
    expect(container.querySelector(".van-icon-back-top")).not.toBeInTheDocument()
  })

  it("becomes active at the default 200px scroll threshold", async () => {
    const { container } = render(<BackTop />)
    const backTop = container.querySelector(`.${prefixClassname("back-top")}`)

    await waitFor(() => expect(mockedGetScrollParent).toHaveBeenCalled())
    mockedGetScrollTop.mockResolvedValueOnce(199)

    await act(async () => {
      await mockPageScrollHandler?.()
    })

    expect(mockedGetScrollTop).toHaveBeenLastCalledWith(scrollParent)
    expect(backTop).not.toHaveClass("active")

    mockedGetScrollTop.mockResolvedValueOnce(200)
    await act(async () => {
      await mockPageScrollHandler?.()
    })

    expect(backTop).toHaveClass("active")
  })

  it("uses a custom scroll threshold", async () => {
    const { container } = render(<BackTop offset={50} />)
    const backTop = container.querySelector(`.${prefixClassname("back-top")}`)

    await waitFor(() => expect(mockedGetScrollParent).toHaveBeenCalled())
    mockedGetScrollTop.mockResolvedValueOnce(50)

    await act(async () => {
      await mockPageScrollHandler?.()
    })

    expect(backTop).toHaveClass("active")
  })

  it("stays inactive when a scroll parent cannot be resolved", async () => {
    mockedGetScrollParent.mockResolvedValue(undefined)
    mockedGetScrollTop.mockResolvedValue(1000)
    const { container } = render(<BackTop />)
    const backTop = container.querySelector(`.${prefixClassname("back-top")}`)

    await waitFor(() => expect(mockedGetScrollParent).toHaveBeenCalled())
    await act(async () => {
      await mockPageScrollHandler?.()
    })

    expect(mockedGetScrollTop).toHaveBeenCalledWith(undefined)
    expect(backTop).not.toHaveClass("active")
  })

  it.each([
    [false, "smooth"],
    [true, "auto"],
  ])("scrolls to the top with immediate=%s", async (immediate, behavior) => {
    const onClick = jest.fn()
    const { container } = render(<BackTop immediate={immediate} onClick={onClick} />)
    const backTop = container.querySelector(`.${prefixClassname("back-top")}`) as HTMLElement

    await waitFor(() => expect(mockedGetScrollParent).toHaveBeenCalled())
    fireEvent.click(backTop)

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledWith(expect.anything())
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior })
  })
})
