import { fireEvent, render } from "@testing-library/react"
import { View } from "@tarojs/components"
// biome-ignore lint/correctness/noUnusedImports: The classic JSX transform requires React in scope.
import * as React from "react"
import { prefixClassname } from "../../styles"
import Checkbox from "../index"

describe("<Checkbox />", () => {
  it("renders a custom-sized disabled checkbox with a label", () => {
    const { container } = render(
      <Checkbox size={24} disabled>
        复选框
      </Checkbox>,
    )

    expect(container.querySelector(`.${prefixClassname("checkbox__icon")}`)).toHaveStyle({
      fontSize: "24px",
    })
    expect(container.querySelector(`.${prefixClassname("checkbox__label")}`)).toHaveClass(
      prefixClassname("checkbox__label--disabled"),
    )
  })

  it("renders button shape without the checkbox icon", () => {
    const { container } = render(
      <Checkbox shape="button" defaultChecked>
        复选框
      </Checkbox>,
    )

    expect(container.querySelector(`.${prefixClassname("checkbox__button")}`)).toHaveClass(
      prefixClassname("checkbox__button--checked"),
    )
    expect(container.querySelector(`.${prefixClassname("checkbox__icon")}`)).toBeNull()
  })

  it("updates a button checkbox group after clicking an option", () => {
    const onChange = jest.fn()
    const { container } = render(
      <Checkbox.Group defaultValue={["a"]} onChange={onChange}>
        <Checkbox name="a" shape="button">
          复选框 a
        </Checkbox>
        <Checkbox name="b" shape="button">
          复选框 b
        </Checkbox>
      </Checkbox.Group>,
    )

    const checkboxes = container.querySelectorAll(`.${prefixClassname("checkbox")}`)
    const buttons = container.querySelectorAll(`.${prefixClassname("checkbox__button")}`)

    expect(buttons[0]).toHaveClass(prefixClassname("checkbox__button--checked"))
    expect(buttons[1]).not.toHaveClass(prefixClassname("checkbox__button--checked"))

    fireEvent.click(checkboxes[1])

    expect(onChange).toHaveBeenCalledWith(["a", "b"])
    expect(buttons[1]).toHaveClass(prefixClassname("checkbox__button--checked"))
  })

  it("does not update a disabled button checkbox", () => {
    const onChange = jest.fn()
    const { container } = render(
      <Checkbox shape="button" checked disabled onChange={onChange}>
        复选框
      </Checkbox>,
    )

    const checkbox = container.querySelector(`.${prefixClassname("checkbox")}`)
    const button = container.querySelector(`.${prefixClassname("checkbox__button")}`)

    expect(checkbox).toHaveClass(prefixClassname("checkbox--disabled"))
    expect(button).toHaveClass(
      prefixClassname("checkbox__button--checked"),
      prefixClassname("checkbox__button--disabled"),
    )

    if (!checkbox) throw new Error("Checkbox element not found")
    fireEvent.click(checkbox)

    expect(onChange).not.toHaveBeenCalled()
  })

  it("renders an indeterminate checkbox with a custom color and string size", () => {
    const { container, rerender } = render(
      <Checkbox indeterminate checkedColor="#ee0a24" size="24px">
        复选框
      </Checkbox>,
    )

    const icon = container.querySelector(`.${prefixClassname("checkbox__icon")}`)

    expect(icon).toHaveClass(prefixClassname("checkbox__icon--indeterminate"))
    expect(icon).toHaveStyle({
      fontSize: "24px",
      "--checkbox-checked-icon-border-color": "#ee0a24",
      "--checkbox-checked-icon-background-color": "#ee0a24",
    })
    expect(container.querySelector(".van-icon-minus")).not.toBeNull()

    rerender(<Checkbox icon={<View data-testid="custom-icon" />} />)

    expect(container.querySelector("[data-testid='custom-icon']")).not.toBeNull()
    expect(container.querySelector(".van-icon-success")).toBeNull()
  })

  it("positions the label on the left and disables label clicks", () => {
    const onChange = jest.fn()
    const { container, rerender } = render(
      <Checkbox labelPosition="left" labelDisabled onChange={onChange}>
        复选框
      </Checkbox>,
    )
    const checkbox = container.querySelector(`.${prefixClassname("checkbox")}`)
    const label = container.querySelector(`.${prefixClassname("checkbox__label")}`)
    const icon = container.querySelector(`.${prefixClassname("checkbox__icon")}`)

    expect(checkbox).toHaveClass(prefixClassname("checkbox--label-disabled"))
    expect(label).toHaveClass(prefixClassname("checkbox__label--left"))
    expect(checkbox?.firstElementChild).toBe(label)

    if (!label || !icon) throw new Error("Checkbox label or icon not found")
    fireEvent.click(label)
    expect(onChange).not.toHaveBeenCalled()

    fireEvent.click(icon)
    expect(onChange).toHaveBeenCalledWith(true)

    onChange.mockClear()
    rerender(
      <Checkbox labelPosition="left" labelDisabled disabled onChange={onChange}>
        复选框
      </Checkbox>,
    )
    const disabledIcon = container.querySelector(`.${prefixClassname("checkbox__icon")}`)
    if (!disabledIcon) throw new Error("Disabled checkbox icon not found")
    fireEvent.click(disabledIcon)
    expect(onChange).not.toHaveBeenCalled()
  })

  it("inherits shape and checked color from the group", () => {
    const { container } = render(
      <Checkbox.Group defaultValue={["a"]} shape="square" checkedColor="#ee0a24">
        <Checkbox name="a">复选框 a</Checkbox>
        <Checkbox name="b" shape="round" checkedColor="#07c160">
          复选框 b
        </Checkbox>
      </Checkbox.Group>,
    )
    const icons = container.querySelectorAll(`.${prefixClassname("checkbox__icon")}`)

    expect(icons[0]).toHaveClass(prefixClassname("checkbox__icon--square"))
    expect(icons[0]).toHaveStyle({
      "--checkbox-checked-icon-border-color": "#ee0a24",
      "--checkbox-checked-icon-background-color": "#ee0a24",
    })
    expect(icons[1]).toHaveClass(prefixClassname("checkbox__icon--round"))
    expect(icons[1]).toHaveStyle({
      "--checkbox-checked-icon-border-color": "#07c160",
      "--checkbox-checked-icon-background-color": "#07c160",
    })
  })

  it("supports opting out of checkbox group binding", () => {
    const onCheckboxChange = jest.fn()
    const onGroupChange = jest.fn()
    const { container } = render(
      <Checkbox.Group
        defaultValue={["a"]}
        disabled
        direction="horizontal"
        shape="square"
        checkedColor="#ee0a24"
        onChange={onGroupChange}
      >
        <Checkbox name="a" bindGroup={false} onChange={onCheckboxChange}>
          独立复选框
        </Checkbox>
      </Checkbox.Group>,
    )
    const checkbox = container.querySelector(`.${prefixClassname("checkbox")}`)
    const icon = container.querySelector(`.${prefixClassname("checkbox__icon")}`)

    expect(checkbox).not.toHaveClass(
      prefixClassname("checkbox--disabled"),
      prefixClassname("checkbox--horizontal"),
    )
    expect(icon).toHaveClass(prefixClassname("checkbox__icon--round"))
    expect(icon).not.toHaveStyle({
      "--checkbox-checked-icon-border-color": "#ee0a24",
    })

    if (!checkbox) throw new Error("Checkbox element not found")
    fireEvent.click(checkbox)

    expect(onCheckboxChange).toHaveBeenCalledWith(true)
    expect(onGroupChange).not.toHaveBeenCalled()
  })
})
