import { fireEvent, render } from "@testing-library/react"
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
})
