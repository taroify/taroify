import { fireEvent, render } from "@testing-library/react"
// biome-ignore lint/correctness/noUnusedImports: the TypeScript JSX transform requires React in scope
import * as React from "react"
import { HAIRLINE_BORDER_LEFT, HAIRLINE_BORDER_SURROUND } from "../../styles/hairline"
import { prefixClassname } from "../../styles"
import PasswordInput from "../index"
import PasswordInputComponent from "../password-input"
import PasswordInputFeedback from "../password-input-feedback"

function getSecurity(container: HTMLElement) {
  return container.querySelector(`.${prefixClassname("password-input__security")}`) as HTMLElement
}

function getItems(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll(`.${prefixClassname("password-input__item")}`),
  ) as HTMLElement[]
}

describe("<PasswordInput />", () => {
  it("exposes its compound feedback component", () => {
    expect(PasswordInput).toBe(PasswordInputComponent)
    expect(PasswordInput.Feedback).toBe(PasswordInputFeedback)
  })

  it("renders the default masked input and forwards view props", () => {
    const { container } = render(
      <PasswordInput className="custom-input" data-testid="password-input" />,
    )
    const root = container.firstElementChild as HTMLElement
    const security = getSecurity(container)
    const items = getItems(container)

    expect(root).toHaveClass(prefixClassname("password-input"), "custom-input")
    expect(root).toHaveAttribute("data-testid", "password-input")
    expect(security).toHaveClass(HAIRLINE_BORDER_SURROUND)
    expect(items).toHaveLength(6)
    expect(items[1]).toHaveClass(HAIRLINE_BORDER_LEFT)
    expect(
      container.querySelectorAll(`.${prefixClassname("password-input__item--mask")}`),
    ).toHaveLength(6)
    expect(container.querySelector(`.${prefixClassname("password-input__cursor")}`)).toBeNull()

    fireEvent.touchStart(security)
  })

  it("supports string length and preserves explicit gutter units", () => {
    const onFocus = jest.fn()
    const { container } = render(
      <PasswordInput
        value="12"
        length="4"
        gutter="2em"
        focus
        feedback="请输入四位密码"
        onFocus={onFocus}
      />,
    )
    const security = getSecurity(container)
    const items = getItems(container)
    const masks = Array.from(
      container.querySelectorAll(`.${prefixClassname("password-input__item--mask")}`),
    ) as HTMLElement[]

    expect(security).not.toHaveClass(HAIRLINE_BORDER_SURROUND)
    expect(items).toHaveLength(4)
    expect(items[0].style.marginLeft).toBe("")
    expect(items[1].style.marginLeft).toBe("2em")
    expect(items[1]).not.toHaveClass(HAIRLINE_BORDER_LEFT)
    expect(masks[0]).toHaveStyle({ visibility: "visible" })
    expect(masks[1]).toHaveStyle({ visibility: "visible" })
    expect(masks[2]).toHaveStyle({ visibility: "hidden" })
    expect(items[2]).toHaveClass(prefixClassname("password-input__item--focus"))
    expect(items[2].querySelector(`.${prefixClassname("password-input__cursor")}`)).not.toBeNull()
    expect(container).toHaveTextContent("请输入四位密码")

    fireEvent.touchStart(security)
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it("adds px to a numeric-string gutter and renders plain text", () => {
    const { container } = render(
      <PasswordInput value="12" length={3} gutter="10" mask={false} focus={false} />,
    )
    const items = getItems(container)

    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent("1")
    expect(items[1]).toHaveTextContent("2")
    expect(items[1].style.marginLeft).toBe("10px")
    expect(container.querySelector(`.${prefixClassname("password-input__item--mask")}`)).toBeNull()
  })

  it("keeps the deprecated focused prop as the higher-priority alias", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined)
    const { container } = render(<PasswordInput value="1" focus={false} focused />)

    expect(container.querySelector(`.${prefixClassname("password-input__cursor")}`)).not.toBeNull()
    expect(warn).toHaveBeenCalledWith(
      "[Deprecated] The focused prop is deprecated. Please use the focus prop.",
    )
    warn.mockRestore()
  })
})

describe("<PasswordInput.Feedback />", () => {
  it.each(["primary", "info", "success", "warning", "danger"] as const)(
    "renders the %s color",
    (color) => {
      const { container } = render(
        <PasswordInput.Feedback color={color} className="custom-feedback" data-testid={color}>
          {color}
        </PasswordInput.Feedback>,
      )
      const feedback = container.firstElementChild as HTMLElement

      expect(feedback).toHaveClass(
        prefixClassname("password-input__feedback"),
        prefixClassname(`password-input__feedback--${color}`),
        "custom-feedback",
      )
      expect(feedback).toHaveAttribute("data-testid", color)
    },
  )

  it("renders without a color modifier", () => {
    const { container } = render(<PasswordInput.Feedback>提示</PasswordInput.Feedback>)
    const feedback = container.firstElementChild as HTMLElement

    expect(feedback).toHaveClass(prefixClassname("password-input__feedback"))
    expect(feedback.className).toBe(prefixClassname("password-input__feedback"))
  })
})
