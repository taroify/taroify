import * as React from "react"
import type { ReactElement } from "react"
import { prependPageSelector } from "../../utils/dom/element"
import { mountPortal, unmountPortal } from "../../utils/dom/portal"
import {
  allowMultiple,
  closeToast,
  createToast,
  openToast,
  resetDefaultToastOptions,
  setDefaultToastOptions,
} from "../toast.imperative"
import { pendingToastSelectorSet, toastEvents, toastSelectorSet } from "../toast.shared"

jest.mock("../../utils/dom/portal", () => ({
  mountPortal: jest.fn(),
  unmountPortal: jest.fn(),
}))

jest.mock("../../utils/dom/element", () => ({
  prependPageSelector: jest.fn((selector?: string) => (selector ? `page__${selector}` : selector)),
}))

const mountPortalMock = mountPortal as jest.MockedFunction<typeof mountPortal>
const unmountPortalMock = unmountPortal as jest.MockedFunction<typeof unmountPortal>
const prependPageSelectorMock = prependPageSelector as jest.MockedFunction<
  typeof prependPageSelector
>

describe("toast imperative", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(1234)
    allowMultiple(false)
    resetDefaultToastOptions()
    setDefaultToastOptions({
      className: undefined,
      style: undefined,
      backdrop: undefined,
      type: undefined,
      position: undefined,
      icon: undefined,
      duration: undefined,
      message: undefined,
    })
    toastSelectorSet.clear()
    pendingToastSelectorSet.clear()
    jest.spyOn(toastEvents, "trigger")
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    allowMultiple(false)
    toastSelectorSet.clear()
    pendingToastSelectorSet.clear()
    jest.restoreAllMocks()
  })

  it("should defer portal unmounting until the transition commit has finished", () => {
    const onTransitionExited = jest.fn()

    openToast({ message: "Toast", onTransitionExited })

    const toast = mountPortalMock.mock.calls[0][0] as unknown as ReactElement<{
      onTransitionExited(): void
    }>
    const toastView = mountPortalMock.mock.calls[0][1]

    toast.props.onTransitionExited()

    expect(onTransitionExited).toHaveBeenCalledTimes(1)
    expect(unmountPortal).not.toHaveBeenCalled()

    jest.runOnlyPendingTimers()

    expect(unmountPortal).toHaveBeenCalledWith(toastView)
  })

  it("opens a default toast and registers it before mounting", () => {
    const id = openToast("Toast")

    expect(id).toBe("toast")
    expect(prependPageSelectorMock).toHaveBeenCalledWith("#toast")
    expect(pendingToastSelectorSet).toContain("page__#toast")
    expect(mountPortalMock).toHaveBeenCalledTimes(1)

    const toast = mountPortalMock.mock.calls[0][0] as unknown as ReactElement<{
      children: React.ReactNode
      defaultOpen: boolean
      id: string
    }>
    expect(toast.props).toEqual(
      expect.objectContaining({
        children: "Toast",
        defaultOpen: true,
        id: "toast",
      }),
    )
  })

  it("merges, resets and overrides default options", () => {
    setDefaultToastOptions({
      selector: "#custom",
      position: "top",
      duration: 100,
    })

    expect(openToast({ message: "Custom", duration: 200 })).toBe("#custom")

    const customToast = mountPortalMock.mock.calls[0][0] as unknown as ReactElement<{
      children: React.ReactNode
      duration: number
      id: string
      position: string
    }>
    expect(customToast.props).toEqual(
      expect.objectContaining({
        children: "Custom",
        duration: 200,
        id: "#custom",
        position: "top",
      }),
    )

    resetDefaultToastOptions()
    openToast(<span>Element message</span>)
    const elementToast = mountPortalMock.mock.calls[1][0] as unknown as ReactElement<{
      children: React.ReactNode
      id: string
    }>
    expect(elementToast.props.id).toBe("toast")
    expect(React.isValidElement(elementToast.props.children)).toBe(true)
  })

  it("updates an existing mounted or pending toast", () => {
    const trigger = jest.mocked(toastEvents.trigger)
    toastSelectorSet.add("page__#toast")

    expect(openToast({ message: "Updated", position: "bottom" })).toBe("#toast")
    expect(mountPortalMock).not.toHaveBeenCalled()
    expect(trigger).toHaveBeenCalledWith(
      "open",
      expect.objectContaining({
        selector: "#toast",
        message: "Updated",
        position: "bottom",
      }),
    )

    toastSelectorSet.clear()
    pendingToastSelectorSet.add("page__#toast")
    expect(openToast("Pending update")).toBe("#toast")
    expect(mountPortalMock).not.toHaveBeenCalled()
    expect(trigger).toHaveBeenLastCalledWith(
      "open",
      expect.objectContaining({
        selector: "#toast",
        message: "Pending update",
      }),
    )
  })

  it("allows multiple toasts with unique ids and skips selector registration", () => {
    allowMultiple(true)

    expect(openToast({ selector: "#custom", message: "One" })).toBe("#custom-1234")
    expect(openToast({ selector: undefined, message: "Two" })).toBe("undefined-1234")
    expect(pendingToastSelectorSet.size).toBe(0)

    const first = mountPortalMock.mock.calls[0][0] as unknown as ReactElement<{ id: string }>
    const second = mountPortalMock.mock.calls[1][0] as unknown as ReactElement<{ id: string }>
    expect(first.props.id).toBe("#custom-1234")
    expect(second.props.id).toBe("undefined-1234")
  })

  it("falls back to the original selector and handles an absent selector", () => {
    prependPageSelectorMock.mockReturnValueOnce(undefined)

    expect(openToast({ selector: "#fallback", message: "Fallback" })).toBe("#fallback")
    expect(pendingToastSelectorSet).toContain("#fallback")

    setDefaultToastOptions({ selector: undefined })
    expect(openToast({ message: "No selector" })).toBeUndefined()

    const toast = mountPortalMock.mock.calls[1][0] as unknown as ReactElement<{
      id?: string
    }>
    expect(toast.props.id).toBeUndefined()
  })

  it("removes pending registration after exit and supports no exit callback", () => {
    openToast({ selector: "#custom", message: "Toast" })
    const toast = mountPortalMock.mock.calls[0][0] as unknown as ReactElement<{
      onTransitionExited(): void
    }>
    const toastView = mountPortalMock.mock.calls[0][1]

    toast.props.onTransitionExited()
    jest.runOnlyPendingTimers()

    expect(unmountPortalMock).toHaveBeenCalledWith(toastView)
    expect(pendingToastSelectorSet).not.toContain("page__#custom")

    setDefaultToastOptions({ selector: undefined })
    openToast("Without selector")
    const selectorlessToast = mountPortalMock.mock.calls[1][0] as unknown as ReactElement<{
      onTransitionExited(): void
    }>
    selectorlessToast.props.onTransitionExited()
    jest.runOnlyPendingTimers()

    expect(unmountPortalMock).toHaveBeenCalledTimes(2)
  })

  it("creates typed toast helpers from strings and option objects", () => {
    const success = createToast("success")

    expect(success("Saved")).toBe("toast")
    const stringToast = mountPortalMock.mock.calls[0][0] as unknown as ReactElement<{
      children: React.ReactNode
      type: string
    }>
    expect(stringToast.props).toEqual(
      expect.objectContaining({
        children: "Saved",
        type: "success",
      }),
    )

    allowMultiple(true)
    expect(success({ message: "Again", duration: 50 })).toBe("toast-1234")
    const optionsToast = mountPortalMock.mock.calls[1][0] as unknown as ReactElement<{
      duration: number
      type: string
    }>
    expect(optionsToast.props).toEqual(
      expect.objectContaining({
        duration: 50,
        type: "success",
      }),
    )
  })

  it("closes explicit and default toast selectors", () => {
    const trigger = jest.mocked(toastEvents.trigger)

    closeToast("toast-1234")
    closeToast("#custom")
    setDefaultToastOptions({ selector: "#default-custom" })
    closeToast()

    expect(trigger).toHaveBeenNthCalledWith(1, "close", "#toast-1234")
    expect(trigger).toHaveBeenNthCalledWith(2, "close", "#custom")
    expect(trigger).toHaveBeenNthCalledWith(3, "close", "#default-custom")
  })
})
