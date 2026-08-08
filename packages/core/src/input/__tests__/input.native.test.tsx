import { render } from "@testing-library/react"
import * as React from "react"
import Input from "../input"
import type { NativeInputProps } from "../native-input"

let mockNativeInputProps: NativeInputProps

jest.mock("../../utils/base", () => ({
  inBrowser: false,
}))

jest.mock("../native-input", () => ({
  __esModule: true,
  default: (props: NativeInputProps) => {
    mockNativeInputProps = props
    return null
  },
}))

describe("<Input /> outside the browser", () => {
  it.each([
    ["readonly", { readonly: true }, true],
    ["disabled", { disabled: true }, true],
    ["editable", {}, false],
  ])("should map %s state to the native disabled property", (_, props, expected) => {
    render(<Input {...props} />)

    expect(Boolean(mockNativeInputProps.disabled)).toBe(expected)
  })
})
