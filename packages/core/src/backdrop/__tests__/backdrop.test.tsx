import { fireEvent, render } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import { useLockScrollTaro } from "../../utils/dom/use-lock-scroll-taro"
import Backdrop from "../index"

let mockTransitionProps: Record<string, any>

jest.mock("../../transition", () => ({
  __esModule: true,
  default: (props: Record<string, any>) => {
    mockTransitionProps = props
    return props.children
  },
}))

jest.mock("../../utils/dom/use-lock-scroll-taro", () => ({
  useLockScrollTaro: jest.fn(),
}))

const mockedUseLockScrollTaro = useLockScrollTaro as jest.MockedFunction<typeof useLockScrollTaro>

describe("<Backdrop />", () => {
  beforeEach(() => {
    mockTransitionProps = {}
  })

  it("renders closed by default and passes view props", () => {
    const { container } = render(
      <Backdrop
        id="modal-backdrop"
        className="custom-backdrop"
        style={{ backgroundColor: "red" }}
        data-testid="backdrop"
      >
        遮罩内容
      </Backdrop>,
    )

    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`)

    expect(backdrop).toHaveClass("custom-backdrop")
    expect(backdrop).not.toHaveClass(prefixClassname("backdrop--open"))
    expect(backdrop).toHaveAttribute("id", "modal-backdrop")
    expect(backdrop).toHaveAttribute("data-testid", "backdrop")
    expect(backdrop).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" })
    expect(backdrop).toHaveTextContent("遮罩内容")
    expect(mockTransitionProps).toEqual(
      expect.objectContaining({
        in: false,
        appear: true,
        mountOnEnter: true,
        timeout: undefined,
        name: "fade",
      }),
    )
    expect(mockedUseLockScrollTaro).toHaveBeenLastCalledWith(false)
  })

  it("renders the open state and numeric animation duration", () => {
    const { container } = render(<Backdrop open duration={250} />)
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`) as HTMLElement

    expect(backdrop).toHaveClass(prefixClassname("backdrop--open"))
    expect(backdrop.style.getPropertyValue("--animation-duration-base")).toBe("250ms")
    expect(mockTransitionProps.timeout).toBe(250)
    expect(mockedUseLockScrollTaro).toHaveBeenLastCalledWith(true)
  })

  it("updates controlled visibility and scroll locking", () => {
    const { container, rerender } = render(<Backdrop open />)
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`)

    expect(backdrop).toHaveClass(prefixClassname("backdrop--open"))
    expect(mockedUseLockScrollTaro).toHaveBeenLastCalledWith(true)

    rerender(<Backdrop open={false} />)

    expect(backdrop).not.toHaveClass(prefixClassname("backdrop--open"))
    expect(mockTransitionProps.in).toBe(false)
    expect(mockedUseLockScrollTaro).toHaveBeenLastCalledWith(false)
  })

  it("closes an uncontrolled backdrop after a closeable click", () => {
    const onClick = jest.fn()
    const onClose = jest.fn()
    const { container } = render(
      <Backdrop defaultOpen closeable onClick={onClick} onClose={onClose} />,
    )
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`) as HTMLElement

    fireEvent.click(backdrop)

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledWith(expect.anything())
    expect(onClose).toHaveBeenCalledWith(false)
    expect(backdrop).not.toHaveClass(prefixClassname("backdrop--open"))
    expect(mockedUseLockScrollTaro).toHaveBeenLastCalledWith(false)
  })

  it("does not close after a non-closeable click", () => {
    const onClick = jest.fn()
    const onClose = jest.fn()
    const { container } = render(<Backdrop defaultOpen onClick={onClick} onClose={onClose} />)
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`) as HTMLElement

    fireEvent.click(backdrop)

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
    expect(backdrop).toHaveClass(prefixClassname("backdrop--open"))
  })

  it("notifies a controlled backdrop without changing its open state", () => {
    const onClose = jest.fn()
    const { container } = render(<Backdrop open closeable onClose={onClose} />)
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`) as HTMLElement

    fireEvent.click(backdrop)

    expect(onClose).toHaveBeenCalledWith(false)
    expect(backdrop).toHaveClass(prefixClassname("backdrop--open"))
  })

  it("prevents touch scrolling", () => {
    const { container } = render(<Backdrop open />)
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`) as HTMLElement
    const event = new Event("touchmove", { bubbles: true, cancelable: true })

    fireEvent(backdrop, event)

    expect(event.defaultPrevented).toBe(true)
  })

  it("does not lock page scrolling when lock is false", () => {
    render(<Backdrop open lock={false} />)

    expect(mockedUseLockScrollTaro).toHaveBeenLastCalledWith(false)
  })
})
