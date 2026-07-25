import { fireEvent, render, waitFor } from "@testing-library/react"
import { View } from "@tarojs/components"
import * as React from "react"
import { prefixClassname } from "../../styles"
import { useLockScrollTaro } from "../../utils/dom/use-lock-scroll-taro"
import Popup, { usePopupBackdrop } from ".."

const transitionPropsList: Record<string, any>[] = []

jest.mock("../../transition", () => {
  const actual = jest.requireActual("../../transition")
  return {
    ...actual,
    __esModule: true,
    default: (props: Record<string, any>) => {
      transitionPropsList.push(props)
      return props.children
    },
  }
})

jest.mock("../../utils/dom/use-lock-scroll-taro", () => ({
  useLockScrollTaro: jest.fn(),
}))

const mockedUseLockScrollTaro = useLockScrollTaro as jest.MockedFunction<typeof useLockScrollTaro>

function getPopupTransitionProps() {
  return [...transitionPropsList].reverse().find((props) => {
    const className = props.children?.props?.className
    return typeof className === "string" && className.includes(prefixClassname("popup"))
  })
}

function DefaultPopupBackdrop() {
  return <>{usePopupBackdrop(undefined, true)}</>
}

describe("<Popup />", () => {
  beforeEach(() => {
    transitionPropsList.length = 0
    jest.clearAllMocks()
  })

  it("renders placement, rounded style and transition options", () => {
    const { container } = render(
      <Popup
        open
        placement="bottom"
        rounded
        duration={250}
        className="custom-popup"
        data-testid="popup"
      >
        内容
      </Popup>,
    )
    const popup = container.querySelector(`.${prefixClassname("popup")}`) as HTMLElement
    const transitionProps = getPopupTransitionProps()

    expect(popup).toHaveClass(
      "custom-popup",
      prefixClassname("popup--bottom"),
      prefixClassname("popup--rounded"),
    )
    expect(popup).toHaveAttribute("data-testid", "popup")
    expect(popup.style.getPropertyValue("--animation-duration-base")).toBe("250ms")
    expect(transitionProps).toEqual(
      expect.objectContaining({
        in: true,
        name: "slide-up",
        timeout: 250,
        mountOnEnter: true,
        unmountOnExit: false,
      }),
    )
    expect(mockedUseLockScrollTaro).toHaveBeenLastCalledWith(true)
  })

  it("forwards the ref to the popup element", () => {
    const ref = React.createRef<HTMLElement>()

    render(<Popup ref={ref} open />)

    expect(ref.current).toHaveClass(prefixClassname("popup"))
  })

  it.each([
    ["top", "slide-down"],
    ["right", "slide-right"],
    ["left", "slide-left"],
    ["center", "fade"],
  ] as const)("uses the %s placement transition", (placement, transition) => {
    render(<Popup open placement={placement} />)

    expect(getPopupTransitionProps()?.name).toBe(transition)
  })

  it("renders with default closed state", () => {
    render(<Popup />)

    expect(getPopupTransitionProps()?.in).toBe(false)
  })

  it("closes an uncontrolled popup after clicking the backdrop", () => {
    const onClose = jest.fn()
    const { container } = render(<Popup defaultOpen onClose={onClose} />)
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`) as HTMLElement

    fireEvent.click(backdrop)

    expect(onClose).toHaveBeenCalledWith(false)
    expect(getPopupTransitionProps()?.in).toBe(false)
    expect(backdrop).not.toHaveClass(prefixClassname("backdrop--open"))
    expect(mockedUseLockScrollTaro).toHaveBeenLastCalledWith(false)
  })

  it("classifies a custom backdrop and regular element children", () => {
    const { getByTestId } = render(
      <Popup open>
        <Popup.Backdrop data-testid="custom-backdrop" />
        <View data-testid="popup-content">内容</View>
      </Popup>,
    )

    expect(getByTestId("custom-backdrop")).toHaveClass(prefixClassname("backdrop--open"))
    expect(getByTestId("popup-content")).toHaveTextContent("内容")
  })

  it("supports the default backdrop hook argument and true options", () => {
    const { container } = render(<DefaultPopupBackdrop />)

    expect(container.querySelector(`.${prefixClassname("backdrop")}`)).toBeInTheDocument()
  })

  it("supports close shortcut and hiding the backdrop", () => {
    const onClose = jest.fn()
    const { container, getByTestId } = render(
      <Popup
        defaultOpen
        backdrop={false}
        closeable
        closeIcon={<View data-testid="close-icon" className="custom-icon" />}
        closeIconPlacement="bottom-left"
        onClose={onClose}
      />,
    )
    const icon = getByTestId("close-icon")
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`)

    expect(icon).toHaveClass(
      "custom-icon",
      prefixClassname("popup__close-icon"),
      prefixClassname("popup__close-icon--bottom-left"),
    )
    expect(backdrop).not.toHaveClass(prefixClassname("backdrop--open"))

    fireEvent.click(icon)

    expect(onClose).toHaveBeenCalledWith(false)
  })

  it("places the default close icon based on popup placement", () => {
    const { container, rerender } = render(<Popup open closeable />)

    expect(container.querySelector(`.${prefixClassname("popup__close-icon")}`)).toHaveClass(
      prefixClassname("popup__close-icon--top-right"),
    )

    rerender(<Popup open closeable placement="right" />)

    expect(container.querySelector(`.${prefixClassname("popup__close-icon")}`)).toHaveClass(
      prefixClassname("popup__close-icon--top-left"),
    )
  })

  it("renders non-element close content", () => {
    const { getByText } = render(
      <Popup open>
        <Popup.Close>关闭</Popup.Close>
      </Popup>,
    )

    expect(getByText("关闭")).toBeInTheDocument()
  })

  it("preserves custom close icon handlers and bottom-right placement", () => {
    const childClick = jest.fn()
    const closeClick = jest.fn()
    const onClose = jest.fn()
    const { getByTestId } = render(
      <Popup defaultOpen backdrop={false} onClose={onClose}>
        <Popup.Close placement="bottom-right" onClick={closeClick}>
          <View data-testid="custom-close" className="custom-close" onClick={childClick} />
        </Popup.Close>
      </Popup>,
    )
    const icon = getByTestId("custom-close")

    expect(icon).toHaveClass("custom-close", prefixClassname("popup__close-icon--bottom-right"))
    expect(icon).not.toHaveClass(prefixClassname("popup__close-icon--bottom-left"))

    fireEvent.click(icon)

    expect(childClick).toHaveBeenCalledTimes(1)
    expect(closeClick).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledWith(false)
  })

  it("blocks closing when beforeClose returns false", async () => {
    const beforeClose = jest.fn().mockResolvedValue(false)
    const onClose = jest.fn()
    const { container } = render(<Popup defaultOpen beforeClose={beforeClose} onClose={onClose} />)
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`) as HTMLElement

    fireEvent.click(backdrop)

    await waitFor(() => expect(beforeClose).toHaveBeenCalledWith("backdrop"))
    expect(onClose).not.toHaveBeenCalled()
    expect(getPopupTransitionProps()?.in).toBe(true)
  })

  it("closes after an asynchronous beforeClose resolves true", async () => {
    const beforeClose = jest.fn().mockResolvedValue(true)
    const onClose = jest.fn()
    const { container } = render(<Popup defaultOpen beforeClose={beforeClose} onClose={onClose} />)
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`) as HTMLElement

    fireEvent.click(backdrop)

    await waitFor(() => expect(onClose).toHaveBeenCalledWith(false))
    expect(getPopupTransitionProps()?.in).toBe(false)
  })

  it("ignores repeated close requests while beforeClose is pending", async () => {
    let resolveBeforeClose: (value: boolean) => void = () => {}
    const beforeClose = jest.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveBeforeClose = resolve
        }),
    )
    const onClose = jest.fn()
    const { container } = render(<Popup defaultOpen beforeClose={beforeClose} onClose={onClose} />)
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`) as HTMLElement

    fireEvent.click(backdrop)
    fireEvent.click(backdrop)

    expect(beforeClose).toHaveBeenCalledTimes(1)
    resolveBeforeClose(true)
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })

  it("stays open when beforeClose rejects", async () => {
    const beforeClose = jest.fn().mockRejectedValue(new Error("cancel"))
    const onClose = jest.fn()
    const { container } = render(<Popup defaultOpen beforeClose={beforeClose} onClose={onClose} />)
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`) as HTMLElement

    fireEvent.click(backdrop)

    await waitFor(() => expect(beforeClose).toHaveBeenCalledTimes(1))
    expect(onClose).not.toHaveBeenCalled()
    expect(getPopupTransitionProps()?.in).toBe(true)
  })

  it("supports backdrop options and disabling backdrop close", () => {
    const onClose = jest.fn()
    const { container } = render(
      <Popup
        defaultOpen
        backdrop={{ className: "custom-backdrop" }}
        closeOnClickBackdrop={false}
        onClose={onClose}
      />,
    )
    const backdrop = container.querySelector(`.${prefixClassname("backdrop")}`) as HTMLElement

    expect(backdrop).toHaveClass("custom-backdrop", prefixClassname("backdrop--open"))
    fireEvent.click(backdrop)
    expect(onClose).not.toHaveBeenCalled()
    expect(getPopupTransitionProps()?.in).toBe(true)
  })

  it("prefers corrected transition props and composes lifecycle events", () => {
    const onOpen = jest.fn()
    const onOpened = jest.fn()
    const onClosed = jest.fn()
    const onTransitionEnter = jest.fn()
    const onTransitionEntered = jest.fn()
    const onTransitionExited = jest.fn()

    render(
      <Popup
        open
        transition="correct-transition"
        transitionTimeout={0}
        transaction="legacy-transition"
        transactionTimeout={100}
        destroyOnClose
        onOpen={onOpen}
        onOpened={onOpened}
        onClosed={onClosed}
        onTransitionEnter={onTransitionEnter}
        onTransitionEntered={onTransitionEntered}
        onTransitionExited={onTransitionExited}
      />,
    )
    const transitionProps = getPopupTransitionProps()

    expect(transitionProps).toEqual(
      expect.objectContaining({
        name: "correct-transition",
        timeout: 0,
        unmountOnExit: true,
      }),
    )

    transitionProps?.onEnter(true)
    transitionProps?.onEntered(false)
    transitionProps?.onExited()

    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onOpened).toHaveBeenCalledTimes(1)
    expect(onClosed).toHaveBeenCalledTimes(1)
    expect(onTransitionEnter).toHaveBeenCalledWith(true)
    expect(onTransitionEntered).toHaveBeenCalledWith(false)
    expect(onTransitionExited).toHaveBeenCalledTimes(1)
  })

  it("keeps deprecated transaction props working", () => {
    render(<Popup open transaction="legacy-transition" transactionTimeout={120} />)

    expect(getPopupTransitionProps()).toEqual(
      expect.objectContaining({
        name: "legacy-transition",
        timeout: 120,
      }),
    )
  })
})
