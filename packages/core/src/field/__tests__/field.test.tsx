import { act, render } from "@testing-library/react"
import type { BaseEventOrig } from "@tarojs/components/types/common"
import type { InputProps as TaroInputProps } from "@tarojs/components/types/Input"
import type { TextareaProps as TaroTextareaProps } from "@tarojs/components/types/Textarea"
import * as React from "react"
import Cell from "../../cell"
import Form, { type FormInstance, type FormItemInstance } from "../../form"
import Input from "../../input"
import type { NativeInputProps } from "../../input/native-input"
import { prefixClassname } from "../../styles"
import Textarea from "../../textarea"
import type { NativeTextareaProps } from "../../textarea/native-textarea"
import Field from "../index"

let mockNativeInputProps: NativeInputProps
let mockNativeTextareaProps: NativeTextareaProps

jest.mock("../../input/native-input", () => ({
  __esModule: true,
  default: (props: NativeInputProps) => {
    mockNativeInputProps = props
    return null
  },
}))

jest.mock("../../textarea/native-textarea", () => ({
  __esModule: true,
  default: (props: NativeTextareaProps) => {
    mockNativeTextareaProps = props
    return null
  },
}))

describe("<Field />", () => {
  afterEach(() => jest.restoreAllMocks())

  it("should automatically show required marks from field rules", () => {
    const { container } = render(
      <Form required="auto">
        <Cell.Group>
          <Field label="Required" name="required" rules={[{ required: true }]}>
            <Input />
          </Field>
          <Field label="Optional" name="optional" rules={[{ required: false }]}>
            <Input />
          </Field>
          <Field label="Without rules" name="withoutRules">
            <Input />
          </Field>
        </Cell.Group>
      </Form>,
    )

    const fields = container.querySelectorAll(`.${prefixClassname("form-item")}`)
    expect(fields[0]).toHaveClass(prefixClassname("cell--required"))
    expect(fields[1]).not.toHaveClass(prefixClassname("cell--required"))
    expect(fields[2]).not.toHaveClass(prefixClassname("cell--required"))
  })

  it("should support local auto mode and explicit overrides", () => {
    const { container } = render(
      <Form required="auto">
        <Field label="Local auto" required="auto" rules={[{ required: true }]}>
          <Input />
        </Field>
        <Field label="Explicit false" required={false} rules={[{ required: true }]}>
          <Input />
        </Field>
        <Field label="Explicit true" required>
          <Input />
        </Field>
      </Form>,
    )

    const fields = container.querySelectorAll(`.${prefixClassname("form-item")}`)
    expect(fields[0]).toHaveClass(prefixClassname("cell--required"))
    expect(fields[1]).not.toHaveClass(prefixClassname("cell--required"))
    expect(fields[2]).toHaveClass(prefixClassname("cell--required"))
  })

  it("should support top-aligned labels from the form and the field", () => {
    const { container } = render(
      <>
        <Form labelAlign="top">
          <Field label="Form top">
            <Input />
          </Field>
        </Form>
        <Field label={{ align: "top", children: "Field top" }}>
          <Input />
        </Field>
        <Field label="Default">
          <Input />
        </Field>
      </>,
    )

    const fields = container.querySelectorAll(`.${prefixClassname("form-item")}`)
    const labels = container.querySelectorAll(`.${prefixClassname("form-label")}`)
    expect(fields[0]).toHaveClass(prefixClassname("form-item--label-top"))
    expect(fields[1]).toHaveClass(prefixClassname("form-item--label-top"))
    expect(fields[2]).not.toHaveClass(prefixClassname("form-item--label-top"))
    expect(labels[0]).toHaveClass(prefixClassname("form-label--top"))
    expect(labels[1]).toHaveClass(prefixClassname("form-label--top"))
  })

  it("should render feedback, colon and an empty control without changing existing variants", () => {
    const { container, getByText } = render(
      <>
        <Field label={{ children: "Label", colon: true }} feedback="Feedback" />
        <Field label={<Field.Label align="right">Custom label</Field.Label>}>
          <Input />
        </Field>
      </>,
    )

    expect(getByText("Label:").textContent).toBe("Label:")
    expect(getByText("Feedback")).toHaveClass(prefixClassname("form-feedback"))
    expect(getByText("Custom label")).toHaveClass(prefixClassname("form-label--right"))
    expect(container.querySelectorAll(`.${prefixClassname("form-control")}`)).toHaveLength(1)
  })

  it("should retain the runtime warning for unsupported form-item props", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined)
    const unsupportedProps = { noStyle: true } as unknown as React.ComponentProps<typeof Field>

    render(<Field {...unsupportedProps} />)

    expect(warn).toHaveBeenCalledWith(
      "[Taroify] Field: not support noStyle & shouldUpdate property",
    )
  })

  it("should write a blur-formatted value back to the form", () => {
    const formRef = React.createRef<FormInstance>()
    render(
      <Form ref={formRef}>
        <Field name="amount" label="Amount">
          <Input formatter={(value) => value.trim()} formatTrigger="onBlur" />
        </Field>
      </Form>,
    )

    act(() => {
      mockNativeInputProps.onInput?.({
        type: "input",
        detail: { value: " 12 ", cursor: 4, keyCode: 0 },
      } as BaseEventOrig<TaroInputProps.inputEventDetail>)
    })
    expect(formRef.current?.getValues<{ amount: string }>().amount).toBe(" 12 ")

    act(() => {
      mockNativeInputProps.onBlur?.({
        type: "blur",
        detail: { value: " 12 " },
      } as BaseEventOrig<TaroInputProps.inputValueEventDetail>)
    })
    expect(formRef.current?.getValues<{ amount: string }>().amount).toBe("12")
  })

  it("should write a blur-formatted textarea value back to the form", () => {
    const formRef = React.createRef<FormInstance>()
    render(
      <Form ref={formRef}>
        <Field name="note" label="Note">
          <Textarea formatter={(value) => value.trim()} formatTrigger="onBlur" />
        </Field>
      </Form>,
    )

    act(() => {
      mockNativeTextareaProps.onInput?.({
        type: "input",
        detail: { value: " note ", cursor: 6, keyCode: 0 },
      } as BaseEventOrig<TaroTextareaProps.onInputEventDetail>)
      mockNativeTextareaProps.onBlur?.({
        type: "blur",
        detail: { value: " note ", cursor: 6 },
      } as BaseEventOrig<TaroTextareaProps.onBlurEventDetail>)
    })

    expect(formRef.current?.getValues<{ note: string }>().note).toBe("note")
  })

  it("should expose the underlying form-item instance", () => {
    const fieldRef = React.createRef<FormItemInstance>()

    render(
      <Form>
        <Field ref={fieldRef} name="field" label="Field">
          <Input />
        </Field>
      </Form>,
    )

    expect(fieldRef.current?.name).toBe("field")
    expect(fieldRef.current?.getValue()).toBe("")
  })
})
