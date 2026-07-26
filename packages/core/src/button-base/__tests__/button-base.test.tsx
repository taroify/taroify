import { fireEvent, render } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import ButtonBase from ".."

describe("<ButtonBase />", () => {
  it("renders children with the base and custom class names", () => {
    const { container } = render(
      <ButtonBase className="custom-button" style={{ color: "red" }}>
        Confirm
      </ButtonBase>,
    )
    const button = container.querySelector("taro-button-core")

    expect(button).toHaveClass(prefixClassname("button-base"), "custom-button")
    expect(button).toHaveStyle({ color: "rgb(255, 0, 0)" })
    expect(button).toHaveTextContent("Confirm")
  })

  it("passes native Taro button properties through", () => {
    const { container } = render(
      <ButtonBase
        id="native-button"
        data-testid="native-button"
        type="primary"
        size="mini"
        formType="submit"
        openType="contact"
        hoverClass="button-hover"
        disabled
        loading
      />,
    )
    const button = container.querySelector("taro-button-core")

    expect(button).toHaveAttribute("id", "native-button")
    expect(button).toHaveAttribute("data-testid", "native-button")
    expect(button).toHaveAttribute("type", "primary")
    expect(button).toHaveAttribute("size", "mini")
    expect(button).toHaveAttribute("form-type", "submit")
    expect(button).toHaveAttribute("open-type", "contact")
    expect(button).toHaveAttribute("hover-class", "button-hover")
    expect(button).toHaveAttribute("disabled")
    expect(button).toHaveAttribute("loading")
  })

  it("passes click events through", () => {
    const onClick = jest.fn()
    const { container } = render(<ButtonBase onClick={onClick}>Click</ButtonBase>)
    const button = container.querySelector("taro-button-core") as HTMLElement

    fireEvent.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
