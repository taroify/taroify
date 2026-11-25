import { act, render } from "@testing-library/react"
import * as React from "react"
import type { NativeInputProps } from "../../input/native-input"
import Search, { type SearchInstance } from "../index"

let mockNativeInputProps: NativeInputProps

jest.mock("../../utils/base", () => ({
  ...jest.requireActual("../../utils/base"),
  inBrowser: false,
}))

jest.mock("../../input/native-input", () => ({
  __esModule: true,
  default: (props: NativeInputProps) => {
    mockNativeInputProps = props
    return null
  },
}))

describe("Search on mini programs", () => {
  it("forwards native properties and supports ref focus, native blur and refocus", () => {
    const ref = React.createRef<SearchInstance>()
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    render(
      <Search
        ref={ref}
        inputId="keyword"
        name="q"
        enableNative={false}
        onFocus={onFocus}
        onBlur={onBlur}
      />,
    )
    expect(mockNativeInputProps).toEqual(
      expect.objectContaining({
        id: "keyword",
        name: "q",
        confirmType: "search",
        enableNative: false,
      }),
    )
    expect(mockNativeInputProps.nativeProps).toBeUndefined()
    expect(mockNativeInputProps.focus).toBeUndefined()

    act(() => ref.current?.focus())
    expect(mockNativeInputProps.focus).toBe(true)
    act(() => mockNativeInputProps.onFocus?.({ detail: { value: "", height: 0 } } as never))
    expect(onFocus).toHaveBeenCalledTimes(1)

    act(() => mockNativeInputProps.onBlur?.({ detail: { value: "" } } as never))
    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(mockNativeInputProps.focus).toBe(false)
    act(() => ref.current?.focus())
    expect(mockNativeInputProps.focus).toBe(true)
    act(() => ref.current?.blur())
    expect(mockNativeInputProps.focus).toBe(false)
  })

  it("gives the declarative focus property priority over ref methods", () => {
    const ref = React.createRef<SearchInstance>()
    const { rerender } = render(<Search ref={ref} focus={false} />)
    act(() => ref.current?.focus())
    expect(mockNativeInputProps.focus).toBe(false)

    rerender(<Search ref={ref} focus />)
    act(() => ref.current?.blur())
    expect(mockNativeInputProps.focus).toBe(true)

    rerender(<Search />)
    expect(mockNativeInputProps.focus).toBeUndefined()
  })
})
