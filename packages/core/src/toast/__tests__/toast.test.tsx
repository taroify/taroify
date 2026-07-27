import { act, cleanup, render } from "@testing-library/react"
import { View } from "@tarojs/components"
import * as React from "react"
import Backdrop from "../../backdrop"
import { usePopupBackdrop } from "../../popup"
import { prefixClassname } from "../../styles"
import Toast from "../toast"
import { pendingToastSelectorSet, toastEvents, toastSelectorSet } from "../toast.shared"

let mockPopupProps: Record<string, any> = {}
const mockRestartAutoClose = jest.fn()
const mockStopAutoClose = jest.fn()

jest.mock("../../hooks", () => ({
  useTimeout: jest.fn(() => ({
    restart: mockRestartAutoClose,
    stop: mockStopAutoClose,
  })),
}))

jest.mock("../../backdrop", () => {
  const React = require("react")
  const MockBackdrop = (props: Record<string, any>) =>
    React.createElement("div", {
      ...props,
      "data-testid": props["data-testid"] || "custom-backdrop",
    })
  MockBackdrop.displayName = "Backdrop"
  return {
    __esModule: true,
    default: MockBackdrop,
  }
})

jest.mock("../../popup", () => {
  const React = require("react")
  const MockPopupBackdrop = (props: Record<string, any>) =>
    React.createElement("div", {
      ...props,
      "data-testid": props["data-testid"] || "default-backdrop",
    })
  MockPopupBackdrop.displayName = "PopupBackdrop"

  const MockPopup = (props: Record<string, any>) => {
    mockPopupProps = props
    return React.createElement(
      "div",
      {
        className: props.className,
        "data-testid": "popup",
        "data-open": String(props.open),
      },
      props.children,
    )
  }
  MockPopup.Backdrop = MockPopupBackdrop

  return {
    __esModule: true,
    default: MockPopup,
    usePopupBackdrop: jest.fn((element) => element),
  }
})

jest.mock("@taroify/icons", () => {
  const React = require("react")
  return {
    Fail: (props: Record<string, any>) =>
      React.createElement("span", { ...props, "data-testid": "fail-icon" }),
    Success: (props: Record<string, any>) =>
      React.createElement("span", { ...props, "data-testid": "success-icon" }),
  }
})

jest.mock("../../loading", () => {
  const React = require("react")
  return {
    __esModule: true,
    default: (props: Record<string, any>) =>
      React.createElement("span", { ...props, "data-testid": "loading-icon" }),
  }
})

const usePopupBackdropMock = usePopupBackdrop as jest.MockedFunction<typeof usePopupBackdrop>

describe("<Toast />", () => {
  beforeEach(() => {
    mockPopupProps = {}
    toastSelectorSet.clear()
    pendingToastSelectorSet.clear()
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
    toastSelectorSet.clear()
    pendingToastSelectorSet.clear()
  })

  it("renders the default closed toast and cleans selector registrations", () => {
    const { getByTestId, getByText, unmount } = render(
      <Toast id="notice" className="custom-toast" data-testid="forwarded">
        Message
      </Toast>,
    )

    expect(getByTestId("popup")).toHaveAttribute("data-open", "false")
    expect(getByTestId("popup")).toHaveClass(
      "custom-toast",
      prefixClassname("toast"),
      prefixClassname("toast--middle"),
      prefixClassname("toast--text"),
    )
    expect(getByText("Message")).toBeInTheDocument()
    expect(getByTestId("default-backdrop")).toBeInTheDocument()
    expect(mockPopupProps).toEqual(
      expect.objectContaining({
        id: "notice",
        "data-testid": "forwarded",
      }),
    )
    expect(usePopupBackdropMock).toHaveBeenCalledWith(expect.anything(), undefined)
    expect(mockStopAutoClose).toHaveBeenCalled()
    expect(toastSelectorSet).toContain("#notice")

    pendingToastSelectorSet.add("#notice")
    unmount()

    expect(toastSelectorSet).not.toContain("#notice")
    expect(pendingToastSelectorSet).not.toContain("#notice")
  })

  it("auto closes an open toast and emits onClose", () => {
    const onClose = jest.fn()
    const { getByTestId } = render(
      <Toast id="success" defaultOpen type="success" position="top" onClose={onClose}>
        Saved
      </Toast>,
    )

    expect(getByTestId("popup")).toHaveAttribute("data-open", "true")
    expect(getByTestId("popup")).toHaveClass(prefixClassname("toast--top"))
    expect(getByTestId("popup")).not.toHaveClass(prefixClassname("toast--success"))
    expect(getByTestId("success-icon")).toHaveClass(prefixClassname("toast__icon"))
    expect(getByTextWithClass("Saved", prefixClassname("toast__message"))).toBeInTheDocument()
    expect(mockRestartAutoClose).toHaveBeenCalledWith(expect.any(Function), 3000)

    const close = mockRestartAutoClose.mock.calls.find(
      (call) => typeof call[0] === "function",
    )?.[0] as () => void
    act(() => close())

    expect(onClose).toHaveBeenCalledWith(false)
    expect(mockStopAutoClose).toHaveBeenCalled()
    expect(getByTestId("popup")).toHaveAttribute("data-open", "false")
  })

  it("renders preset and custom icons", () => {
    const customIcon = React.createElement(View, {
      "data-testid": "custom-icon",
      className: "original-icon",
    } as any)
    const { getByTestId, queryByTestId, rerender } = render(
      <Toast defaultOpen duration={0} type="loading">
        Loading
      </Toast>,
    )

    expect(getByTestId("loading-icon")).toHaveClass(
      prefixClassname("toast__loading"),
      prefixClassname("toast__icon"),
    )
    expect(mockRestartAutoClose).not.toHaveBeenCalled()

    rerender(
      <Toast defaultOpen duration={0} type="fail">
        Failed
      </Toast>,
    )
    expect(getByTestId("fail-icon")).toHaveClass(prefixClassname("toast__icon"))

    rerender(
      <Toast defaultOpen duration={0} icon="!" type="text">
        Text icon
      </Toast>,
    )
    expect(queryByTestId("fail-icon")).not.toBeInTheDocument()
    expect(mockPopupProps.className).not.toContain(prefixClassname("toast--text"))

    rerender(
      <Toast defaultOpen duration={0} icon={customIcon}>
        Custom
      </Toast>,
    )
    expect(getByTestId("custom-icon")).toHaveClass("original-icon", prefixClassname("toast__icon"))
  })

  it("renders content, custom backdrop and non-preset classes", () => {
    const backdropOptions = { lock: false }
    const toastWithBackdropProps = { backdrop: backdropOptions } as any
    const { getByTestId, getByText, queryByTestId } = render(
      <Toast
        {...toastWithBackdropProps}
        id="custom"
        defaultOpen
        type={"custom" as any}
        position={"center" as any}
      >
        <Backdrop data-testid="provided-backdrop" />
        <View data-testid="element-content">Element</View>
        Plain text
      </Toast>,
    )

    expect(getByTestId("provided-backdrop")).toBeInTheDocument()
    expect(queryByTestId("default-backdrop")).not.toBeInTheDocument()
    expect(getByTestId("element-content")).toHaveTextContent("Element")
    expect(getByText("Plain text")).toBeInTheDocument()
    expect(getByTestId("popup")).not.toHaveClass(
      prefixClassname("toast--center"),
      prefixClassname("toast--custom"),
    )
    expect(usePopupBackdropMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({ "data-testid": "provided-backdrop" }),
      }),
      backdropOptions,
    )
  })

  it("responds only to matching open and close events", () => {
    const onClose = jest.fn()
    const { getByTestId, queryByText } = render(
      <Toast id="event-toast" duration={250} onClose={onClose}>
        Initial
      </Toast>,
    )

    act(() => {
      toastEvents.trigger("open", {
        selector: "#other",
        message: "Ignored",
      })
      toastEvents.trigger("close", "#other")
    })
    expect(queryByText("Ignored")).not.toBeInTheDocument()
    expect(getByTestId("popup")).toHaveAttribute("data-open", "false")

    act(() => {
      toastEvents.trigger("open", {
        selector: "#event-toast",
        message: "Updated",
        position: "bottom",
      })
    })
    expect(queryByText("Updated")).toBeInTheDocument()
    expect(getByTestId("popup")).toHaveAttribute("data-open", "true")
    expect(getByTestId("popup")).toHaveClass(prefixClassname("toast--bottom"))
    expect(mockRestartAutoClose).toHaveBeenCalledWith()
    expect(mockRestartAutoClose).toHaveBeenCalledWith(expect.any(Function), 250)

    act(() => {
      toastEvents.trigger("close", "#event-toast")
    })
    expect(onClose).toHaveBeenCalledWith(false)
    expect(getByTestId("popup")).toHaveAttribute("data-open", "false")
  })

  it("supports a selectorless toast and an absent close callback", () => {
    const { unmount } = render(<Toast defaultOpen duration={0} />)

    expect(toastSelectorSet.size).toBe(0)

    act(() => {
      toastEvents.trigger("close", "")
    })
    expect(mockPopupProps.open).toBe(false)

    unmount()
    expect(toastSelectorSet.size).toBe(0)
  })
})

function getByTextWithClass(text: string, className: string) {
  const element = Array.from(document.querySelectorAll(`.${className}`)).find(
    (candidate) => candidate.textContent === text,
  )
  if (!element) {
    throw new Error(`Unable to find "${text}" in .${className}`)
  }
  return element
}
