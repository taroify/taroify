import { act, fireEvent, render } from "@testing-library/react"
import type { BaseEventOrig } from "@tarojs/components/types/common"
import type { InputProps as TaroInputProps } from "@tarojs/components/types/Input"
import * as React from "react"
import Input, { resolveOnChange } from "../input"
import type { NativeInputProps } from "../native-input"

let mockNativeInputProps: NativeInputProps

jest.mock("../native-input", () => ({
  __esModule: true,
  default: (props: NativeInputProps) => {
    mockNativeInputProps = props
    return null
  },
}))

describe("<Input />", () => {
  afterEach(() => jest.useRealTimers())

  it("should filter non-numeric characters when type is number", () => {
    const onInput = jest.fn()
    const onChange = jest.fn()
    render(<Input type="number" onInput={onInput} onChange={onChange} />)

    const event = {
      type: "input",
      detail: {
        value: "123abc",
      },
    } as BaseEventOrig<TaroInputProps.inputEventDetail>
    let returnedValue: unknown

    act(() => {
      returnedValue = mockNativeInputProps.onInput?.(event)
    })

    expect(returnedValue).toBe("123")
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
  })

  it("should preserve the original event when no formatting is needed", () => {
    const onInput = jest.fn()
    const onChange = jest.fn()
    const event = {
      type: "input",
      detail: {
        value: "hello",
      },
    } as BaseEventOrig<TaroInputProps.inputEventDetail>
    let returnedValue: unknown
    render(<Input onInput={onInput} onChange={onChange} />)

    act(() => {
      returnedValue = mockNativeInputProps.onInput?.(event)
    })

    expect(returnedValue).toBeUndefined()
    expect(onInput).toHaveBeenCalledWith(event)
    expect(onChange).toHaveBeenCalledWith(event)
    expect(mockNativeInputProps.value).toBe("hello")
  })

  it("should format the value on change by default", () => {
    const onInput = jest.fn()
    const onChange = jest.fn()
    const formatter = jest.fn((value: string) => value.replace(/\d/g, ""))
    const event = {
      type: "input",
      detail: {
        value: "a1b2",
      },
    } as BaseEventOrig<TaroInputProps.inputEventDetail>
    let returnedValue: unknown
    render(<Input formatter={formatter} onInput={onInput} onChange={onChange} />)

    act(() => {
      returnedValue = mockNativeInputProps.onInput?.(event)
    })

    expect(formatter).toHaveBeenCalledWith("a1b2")
    expect(returnedValue).toBe("ab")
    expect(mockNativeInputProps.value).toBe("ab")
    expect(onInput).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "ab" }) }),
    )
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "ab" }) }),
    )
  })

  it("should format the value on blur when requested", () => {
    jest.useFakeTimers()
    const onChange = jest.fn()
    const onBlur = jest.fn()
    const formatter = jest.fn((value: string) => value.trim())
    render(
      <Input formatter={formatter} formatTrigger="onBlur" onChange={onChange} onBlur={onBlur} />,
    )

    const inputEvent = {
      type: "input",
      detail: { value: " value " },
    } as BaseEventOrig<TaroInputProps.inputEventDetail>
    act(() => {
      mockNativeInputProps.onInput?.(inputEvent)
    })
    expect(formatter).not.toHaveBeenCalled()
    onChange.mockClear()

    const blurEvent = {
      type: "blur",
      detail: { value: " value " },
    } as BaseEventOrig<TaroInputProps.inputValueEventDetail>
    act(() => {
      mockNativeInputProps.onBlur?.(blurEvent)
      jest.runAllTimers()
    })

    expect(formatter).toHaveBeenCalledWith(" value ")
    expect(mockNativeInputProps.value).toBe("value")
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "value" }) }),
    )
    expect(onBlur).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "value" }) }),
    )
  })

  it.each([
    ["minimum", { type: "number" as const, min: 10 }, "2", "10"],
    ["maximum", { type: "number" as const, max: 100 }, "120", "100"],
    ["decimal range", { type: "digit" as const, min: 1.5, max: 2.5 }, "3.2", "2.5"],
  ])("should clamp a value to the %s on blur", (_, props, inputValue, expectedValue) => {
    const onChange = jest.fn()
    const onBlur = jest.fn()
    render(<Input {...props} onChange={onChange} onBlur={onBlur} />)

    act(() => {
      mockNativeInputProps.onBlur?.({
        type: "blur",
        detail: { value: inputValue },
      } as BaseEventOrig<TaroInputProps.inputValueEventDetail>)
    })

    expect(mockNativeInputProps.value).toBe(expectedValue)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: expectedValue }) }),
    )
    expect(onBlur).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: expectedValue }) }),
    )
  })

  it.each([
    ["an in-range number", { type: "number" as const, min: 1, max: 100 }, "50"],
    ["an empty value", { type: "number" as const, min: 1 }, ""],
    ["a non-numeric value", { type: "digit" as const, min: 1 }, "not-a-number"],
    ["a non-numeric input type", { type: "text" as const, min: 1 }, "0"],
    ["no range", { type: "digit" as const }, "120"],
  ])("should preserve %s on blur", (_, props, inputValue) => {
    const onChange = jest.fn()
    const onBlur = jest.fn()
    const blurEvent = {
      type: "blur",
      detail: { value: inputValue },
    } as BaseEventOrig<TaroInputProps.inputValueEventDetail>
    render(<Input {...props} onChange={onChange} onBlur={onBlur} />)

    act(() => {
      mockNativeInputProps.onBlur?.(blurEvent)
    })

    expect(onChange).not.toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalledWith(blurEvent)
  })

  it("should apply the blur formatter after clamping", () => {
    const formatter = jest.fn((value: string) => `¥${value}`)
    const onChange = jest.fn()
    render(
      <Input
        type="digit"
        min={1}
        max={100}
        formatter={formatter}
        formatTrigger="onBlur"
        onChange={onChange}
      />,
    )

    act(() => {
      mockNativeInputProps.onBlur?.({
        type: "blur",
        detail: { value: "120" },
      } as BaseEventOrig<TaroInputProps.inputValueEventDetail>)
    })

    expect(formatter).toHaveBeenCalledWith("100")
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "¥100" }) }),
    )
  })

  it("should expose focus and clear interactions without changing their existing callbacks", () => {
    const onFocus = jest.fn()
    const onInput = jest.fn()
    const onChange = jest.fn()
    const onClear = jest.fn()
    const { container } = render(
      <Input
        value="value"
        clearable
        onFocus={onFocus}
        onInput={onInput}
        onChange={onChange}
        onClear={onClear}
      />,
    )

    const focusEvent = {
      type: "focus",
      detail: { value: "value", height: 0 },
    } as BaseEventOrig<TaroInputProps.inputForceEventDetail>
    act(() => {
      mockNativeInputProps.onFocus?.(focusEvent)
    })
    expect(onFocus).toHaveBeenCalledWith(focusEvent)

    const clearIcon = container.querySelector(".taroify-input__clear")
    expect(clearIcon).not.toBeNull()
    fireEvent.click(clearIcon!)

    expect(onClear).toHaveBeenCalledTimes(1)
    expect(onInput).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "" }) }),
    )
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ value: "" }) }),
    )
  })

  it("should support the always clear trigger", () => {
    const { container } = render(<Input value="value" clearable clearTrigger="always" />)

    expect(container.querySelector(".taroify-input__clear")).not.toBeNull()
  })

  it("should not show a clear icon for an empty or disabled input", () => {
    const { container, rerender } = render(<Input value="" clearable clearTrigger="always" />)
    expect(container.querySelector(".taroify-input__clear")).toBeNull()

    rerender(<Input value="value" clearable clearTrigger="always" disabled />)
    expect(container.querySelector(".taroify-input__clear")).toBeNull()
  })

  it("should resolve clear, replacement and unchanged events", () => {
    const callback = jest.fn()
    const inputEvent = {
      type: "input",
      detail: { value: "old" },
    } as BaseEventOrig<TaroInputProps.inputEventDetail>

    resolveOnChange(inputEvent, undefined)
    resolveOnChange(inputEvent, callback, "new")
    resolveOnChange(inputEvent, callback)
    resolveOnChange({ type: "input", detail: "invalid" } as never, callback, "replacement")
    resolveOnChange({ type: "tap", detail: { value: "old", cursor: 1 } } as never, callback)
    resolveOnChange({ type: "click", detail: "invalid" } as never, callback)

    expect(callback.mock.calls.map(([event]) => event.detail.value)).toEqual([
      "new",
      "old",
      "replacement",
      "",
      "",
    ])
  })
})
