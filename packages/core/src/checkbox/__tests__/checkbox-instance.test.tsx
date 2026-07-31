import { act, render } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import Checkbox, { type CheckboxGroupInstance, type CheckboxInstance } from "../index"

const checkedIconClass = prefixClassname("checkbox__icon--checked")

describe("<Checkbox /> instance", () => {
  it("toggles an uncontrolled checkbox and accepts an explicit checked state", () => {
    const ref = React.createRef<CheckboxInstance>()
    const onChange = jest.fn()
    const { container } = render(<Checkbox ref={ref} onChange={onChange} />)
    const icon = container.querySelector(`.${prefixClassname("checkbox__icon")}`)

    expect(ref.current?.toggle).toEqual(expect.any(Function))

    act(() => ref.current?.toggle())
    expect(icon).toHaveClass(checkedIconClass)
    expect(onChange).toHaveBeenLastCalledWith(true)

    act(() => ref.current?.toggle(false))
    expect(icon).not.toHaveClass(checkedIconClass)
    expect(onChange).toHaveBeenLastCalledWith(false)

    act(() => ref.current?.toggle(true))
    expect(icon).toHaveClass(checkedIconClass)
    expect(onChange).toHaveBeenLastCalledWith(true)
  })

  it("emits changes without mutating a controlled checkbox", () => {
    const ref = React.createRef<CheckboxInstance>()
    const onChange = jest.fn()
    const { container, rerender } = render(
      <Checkbox ref={ref} checked={false} onChange={onChange} />,
    )
    const icon = container.querySelector(`.${prefixClassname("checkbox__icon")}`)

    act(() => ref.current?.toggle(true))
    expect(onChange).toHaveBeenCalledWith(true)
    expect(icon).not.toHaveClass(checkedIconClass)

    rerender(<Checkbox ref={ref} checked onChange={onChange} />)
    expect(icon).toHaveClass(checkedIconClass)

    act(() => ref.current?.toggle())
    expect(onChange).toHaveBeenLastCalledWith(false)
    expect(icon).toHaveClass(checkedIconClass)
  })

  it("allows a disabled checkbox to be changed programmatically", () => {
    const ref = React.createRef<CheckboxInstance>()
    const onChange = jest.fn()
    const { container } = render(<Checkbox ref={ref} disabled onChange={onChange} />)
    const icon = container.querySelector(`.${prefixClassname("checkbox__icon")}`)

    act(() => ref.current?.toggle(true))

    expect(icon).toHaveClass(checkedIconClass)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it("updates the checkbox group and respects max", () => {
    const firstRef = React.createRef<CheckboxInstance>()
    const secondRef = React.createRef<CheckboxInstance>()
    const thirdRef = React.createRef<CheckboxInstance>()
    const onChange = jest.fn()
    const { container } = render(
      <Checkbox.Group defaultValue={["a"]} max={2} onChange={onChange}>
        <Checkbox ref={firstRef} name="a" />
        <Checkbox ref={secondRef} name="b" />
        <Checkbox ref={thirdRef} name="c" />
      </Checkbox.Group>,
    )
    const icons = container.querySelectorAll(`.${prefixClassname("checkbox__icon")}`)

    act(() => firstRef.current?.toggle(true))
    expect(onChange).not.toHaveBeenCalled()

    act(() => secondRef.current?.toggle())
    expect(onChange).toHaveBeenLastCalledWith(["a", "b"])
    expect(icons[1]).toHaveClass(checkedIconClass)

    act(() => firstRef.current?.toggle(false))
    expect(onChange).toHaveBeenLastCalledWith(["b"])
    expect(icons[0]).not.toHaveClass(checkedIconClass)

    act(() => firstRef.current?.toggle(true))
    onChange.mockClear()
    act(() => thirdRef.current?.toggle(true))
    expect(onChange).not.toHaveBeenCalled()
    expect(icons[2]).not.toHaveClass(checkedIconClass)
  })
})

describe("<Checkbox.Group /> instance", () => {
  it("supports invert, check all and uncheck all", () => {
    const ref = React.createRef<CheckboxGroupInstance>()
    const onChange = jest.fn()
    const { container } = render(
      <Checkbox.Group ref={ref} defaultValue={["a", "c"]} onChange={onChange}>
        <Checkbox name="a" />
        <Checkbox name="b" />
        <Checkbox name="c" disabled />
      </Checkbox.Group>,
    )
    const icons = container.querySelectorAll(`.${prefixClassname("checkbox__icon")}`)

    expect(ref.current?.toggleAll).toEqual(expect.any(Function))

    act(() => ref.current?.toggleAll())
    expect(onChange).toHaveBeenLastCalledWith(["b"])
    expect(icons[0]).not.toHaveClass(checkedIconClass)
    expect(icons[1]).toHaveClass(checkedIconClass)
    expect(icons[2]).not.toHaveClass(checkedIconClass)

    act(() => ref.current?.toggleAll(true))
    expect(onChange).toHaveBeenLastCalledWith(["a", "b", "c"])

    act(() => ref.current?.toggleAll(false))
    expect(onChange).toHaveBeenLastCalledWith([])
  })

  it("preserves disabled checkboxes when skipDisabled is enabled", () => {
    const ref = React.createRef<CheckboxGroupInstance>()
    const onChange = jest.fn()
    render(
      <Checkbox.Group ref={ref} defaultValue={["c"]} onChange={onChange}>
        <Checkbox name="a" />
        <Checkbox name="b" />
        <Checkbox name="c" disabled />
      </Checkbox.Group>,
    )

    act(() => ref.current?.toggleAll({ checked: true, skipDisabled: true }))
    expect(onChange).toHaveBeenLastCalledWith(["a", "b", "c"])

    act(() => ref.current?.toggleAll({ skipDisabled: true }))
    expect(onChange).toHaveBeenLastCalledWith(["c"])
  })

  it("emits changes without mutating a controlled group", () => {
    const ref = React.createRef<CheckboxGroupInstance>()
    const onChange = jest.fn()
    const { container } = render(
      <Checkbox.Group ref={ref} value={["a"]} onChange={onChange}>
        <Checkbox name="a" />
        <Checkbox name="b" />
      </Checkbox.Group>,
    )
    const icons = container.querySelectorAll(`.${prefixClassname("checkbox__icon")}`)

    act(() => ref.current?.toggleAll(true))

    expect(onChange).toHaveBeenCalledWith(["a", "b"])
    expect(icons[0]).toHaveClass(checkedIconClass)
    expect(icons[1]).not.toHaveClass(checkedIconClass)
  })

  it("unregisters unmounted checkboxes", () => {
    const ref = React.createRef<CheckboxGroupInstance>()
    const onChange = jest.fn()
    const renderGroup = (showSecond: boolean) => (
      <Checkbox.Group ref={ref} onChange={onChange}>
        <Checkbox name="a" />
        {showSecond && <Checkbox name="b" />}
      </Checkbox.Group>
    )
    const { rerender } = render(renderGroup(true))

    rerender(renderGroup(false))
    act(() => ref.current?.toggleAll(true))

    expect(onChange).toHaveBeenCalledWith(["a"])
  })
})
