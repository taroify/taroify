import type { ReactElement } from "react"
import { mountPortal, unmountPortal } from "../../utils/dom/portal"
import { allowMultiple, openToast } from "../toast.imperative"

jest.mock("../../utils/dom/portal", () => ({
  mountPortal: jest.fn(),
  unmountPortal: jest.fn(),
}))

const mountPortalMock = mountPortal as jest.MockedFunction<typeof mountPortal>

describe("toast imperative", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    allowMultiple(true)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    allowMultiple(false)
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
})
