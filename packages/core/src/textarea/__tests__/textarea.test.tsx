import { act, render } from "@testing-library/react"
import type { BaseEventOrig } from "@tarojs/components/types/common"
import type { InputProps as TaroInputProps } from "@tarojs/components/types/Input"
import type { TextareaProps as TaroTextareaProps } from "@tarojs/components/types/Textarea"
import * as React from "react"
import type { NativeTextareaProps } from "../native-textarea"
import Textarea from "../textarea"

let mockNativeTextareaProps: NativeTextareaProps

jest.mock(
  "@taroify/hooks",
  () => {
    const React = jest.requireActual("react")

    return {
      useUncontrolled: ({ value }: { value?: string }) => {
        const [internalValue, setInternalValue] = React.useState(value)
        return {
          value: value === undefined ? internalValue : value,
          setValue: setInternalValue,
        }
      },
    }
  },
  { virtual: true },
)

jest.mock("@tarojs/components", () => ({
  View: "div",
}))

jest.mock("../native-textarea", () => ({
  __esModule: true,
  default: (props: NativeTextareaProps) => {
    mockNativeTextareaProps = props
    return null
  },
}))

function createInputEvent(value: string) {
  return {
    type: "input",
    detail: {
      value,
    },
  } as BaseEventOrig<TaroInputProps.inputEventDetail>
}

describe("<Textarea />", () => {
  it("should truncate values exceeding a numeric limit", () => {
    const onInput = jest.fn()
    const onChange = jest.fn()
    const event = createInputEvent("1234")
    render(<Textarea limit={3} onInput={onInput} onChange={onChange} />)

    act(() => {
      mockNativeTextareaProps.onInput?.(event)
    })

    expect(mockNativeTextareaProps.maxlength).toBe(3)
    expect(mockNativeTextareaProps.value).toBe("123")
    expect(onInput).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ value: "123" }),
      }),
    )
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ value: "123" }),
      }),
    )
    expect(event.detail.value).toBe("1234")
  })

  it("should preserve the original event when the value is within the limit", () => {
    const onInput = jest.fn()
    const onChange = jest.fn()
    const event = createInputEvent("123")
    render(<Textarea limit={3} onInput={onInput} onChange={onChange} />)

    act(() => {
      mockNativeTextareaProps.onInput?.(event)
    })

    expect(onInput).toHaveBeenCalledWith(event)
    expect(onChange).toHaveBeenCalledWith(event)
  })

  it.each([
    ["emoji", "a😀b", 3, "a😀"],
    ["combining characters", "e\u0301x", 1, "e\u0301"],
  ])("should safely truncate %s", (_, inputValue, limit, expectedValue) => {
    const event = createInputEvent(inputValue)
    render(<Textarea limit={limit} />)

    act(() => {
      mockNativeTextareaProps.onInput?.(event)
    })

    expect(mockNativeTextareaProps.value).toBe(expectedValue)
  })

  it("should emit the truncated value in controlled mode", () => {
    const onChange = jest.fn()
    const event = createInputEvent("1234")
    render(<Textarea limit={3} value="12" onChange={onChange} />)

    act(() => {
      mockNativeTextareaProps.onInput?.(event)
    })

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ value: "123" }),
      }),
    )
  })

  it.each([
    ["boolean limit", { limit: true, maxlength: 3 }],
    ["unlimited numeric limit", { limit: -1 }],
    ["native maxlength", { maxlength: 3 }],
  ])("should preserve native behavior for %s", (_, props) => {
    const event = createInputEvent("1234")
    render(<Textarea {...props} />)

    act(() => {
      mockNativeTextareaProps.onInput?.(event)
    })

    expect(mockNativeTextareaProps.value).toBe("1234")
  })

  it("should format the value on change by default", () => {
    const onInput = jest.fn()
    const onChange = jest.fn()
    const formatter = jest.fn((value: string) => value.replace(/\d/g, ""))
    render(<Textarea formatter={formatter} onInput={onInput} onChange={onChange} />)

    act(() => {
      mockNativeTextareaProps.onInput?.(createInputEvent("a1b2"))
    })

    expect(formatter).toHaveBeenCalledWith("a1b2")
    expect(mockNativeTextareaProps.value).toBe("ab")
    expect(onInput).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "ab" }) }),
    )
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "ab" }) }),
    )
  })

  it("should format the value on blur when requested", () => {
    const onChange = jest.fn()
    const onBlur = jest.fn()
    const formatter = jest.fn((value: string) => value.trim())
    render(
      <Textarea formatter={formatter} formatTrigger="onBlur" onChange={onChange} onBlur={onBlur} />,
    )

    act(() => {
      mockNativeTextareaProps.onInput?.(createInputEvent(" value "))
    })
    expect(formatter).not.toHaveBeenCalled()
    onChange.mockClear()

    act(() => {
      mockNativeTextareaProps.onBlur?.({
        type: "blur",
        detail: { value: " value ", cursor: 7 },
      } as BaseEventOrig<TaroTextareaProps.onBlurEventDetail>)
    })

    expect(formatter).toHaveBeenCalledWith(" value ")
    expect(mockNativeTextareaProps.value).toBe("value")
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "value", cursor: 7 }) }),
    )
    expect(onBlur).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "value", cursor: 7 }) }),
    )
  })

  it("should preserve an unchanged value on blur", () => {
    const onChange = jest.fn()
    const onBlur = jest.fn()
    const blurEvent = {
      type: "blur",
      detail: { value: "value", cursor: 5 },
    } as BaseEventOrig<TaroTextareaProps.onBlurEventDetail>
    render(
      <Textarea
        formatter={(value) => value}
        formatTrigger="onBlur"
        onChange={onChange}
        onBlur={onBlur}
      />,
    )

    act(() => {
      mockNativeTextareaProps.onBlur?.(blurEvent)
    })

    expect(onChange).not.toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalledWith(blurEvent)
  })

  it.each([
    ["numeric limit", { limit: 3 }],
    ["native maxlength", { maxlength: 3 }],
  ])("should truncate a formatted value using the %s", (_, props) => {
    render(<Textarea {...props} formatter={(value) => `${value}45`} />)

    act(() => {
      mockNativeTextareaProps.onInput?.(createInputEvent("123"))
    })

    expect(mockNativeTextareaProps.value).toBe("123")
  })

  it("should allow a formatter to expand an unlimited value", () => {
    render(<Textarea formatter={(value) => `${value}!`} />)

    act(() => {
      mockNativeTextareaProps.onInput?.(createInputEvent("hello"))
    })

    expect(mockNativeTextareaProps.value).toBe("hello!")
  })
})
