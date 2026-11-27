import { render } from "@testing-library/react"
import { createElement, type ReactNode, type RefObject } from "react"
import Transition from "../transition"

// Each case selects a platform and React version for the current render.
let mockInWechat = false
let mockReactVersion = "18.2.0"
// Capture the ref so the test can compare it to the rendered child.
let mockNodeRef: RefObject<HTMLElement> | undefined

jest.mock("react", () => ({
  __esModule: true,
  ...jest.requireActual<typeof import("react")>("react"),
  get version() {
    return mockReactVersion
  },
}))

jest.mock("../../utils/base", () => ({
  get inWechat() {
    return mockInWechat
  },
}))

jest.mock("react-transition-group", () => ({
  CSSTransition: ({
    children,
    nodeRef,
  }: {
    children: ReactNode
    nodeRef?: RefObject<HTMLElement>
  }) => {
    mockNodeRef = nodeRef
    return children
  },
}))

describe("<Transition />", () => {
  it.each([
    { inWechat: true, version: "18.2.0", usesNodeRef: false },
    { inWechat: true, version: "19.0.0", usesNodeRef: true },
    { inWechat: false, version: "18.2.0", usesNodeRef: true },
  ])(
    "sets nodeRef=$usesNodeRef on React $version (WeChat: $inWechat)",
    ({ inWechat, version, usesNodeRef }) => {
      mockInWechat = inWechat
      mockReactVersion = version

      const { container } = render(createElement(Transition, null, createElement("div")))

      expect(mockNodeRef?.current).toBe(usesNodeRef ? container.firstChild : undefined)
    },
  )
})
