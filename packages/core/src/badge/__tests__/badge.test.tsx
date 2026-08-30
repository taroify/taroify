import { fireEvent, render } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import Badge, { type BadgePosition } from "../badge"

describe("<Badge />", () => {
  it("renders an independent badge and passes view props", () => {
    const onClick = jest.fn()
    const { container } = render(
      <Badge
        content={5}
        id="message-count"
        className="custom-badge"
        style={{ backgroundColor: "blue" }}
        data-testid="badge"
        onClick={onClick}
      />,
    )

    const badge = container.querySelector(`.${prefixClassname("badge__badge")}`) as HTMLElement

    expect(badge).toHaveClass("custom-badge", prefixClassname("badge--content"))
    expect(badge).not.toHaveClass(prefixClassname("badge--fixed"))
    expect(badge).not.toHaveClass(
      prefixClassname("badge--top-left"),
      prefixClassname("badge--top-right"),
      prefixClassname("badge--bottom-left"),
      prefixClassname("badge--bottom-right"),
    )
    expect(badge).toHaveAttribute("id", "message-count")
    expect(badge).toHaveAttribute("data-testid", "badge")
    expect(badge).toHaveStyle({ backgroundColor: "rgb(0, 0, 255)" })
    expect(badge).toHaveTextContent("5")

    fireEvent.click(badge)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("renders zero as valid badge content", () => {
    const { container } = render(<Badge content={0} />)
    const badge = container.querySelector(`.${prefixClassname("badge__badge")}`)

    expect(badge).toHaveClass(prefixClassname("badge--content"))
    expect(badge).toHaveTextContent("0")
  })

  it("caps numeric content only when it exceeds max", () => {
    const { container, rerender } = render(<Badge content={9} max={9} />)
    const badge = container.querySelector(`.${prefixClassname("badge__badge")}`)

    expect(badge).toHaveTextContent("9")

    rerender(<Badge content={10} max={9} />)

    expect(badge).toHaveTextContent("9+")
  })

  it("does not apply max to string content", () => {
    const { container } = render(<Badge content="100" max={9} />)

    expect(container.querySelector(`.${prefixClassname("badge__badge")}`)).toHaveTextContent("100")
  })

  it("renders a dot and suppresses other content", () => {
    const { container } = render(
      <Badge dot content="99">
        目标元素
      </Badge>,
    )
    const badge = container.querySelector(`.${prefixClassname("badge__badge")}`)

    expect(badge).toHaveClass(prefixClassname("badge--dot"), prefixClassname("badge--fixed"))
    expect(badge).not.toHaveTextContent("99")
    expect(container).toHaveTextContent("目标元素")
  })

  it("treats content=true as a dot", () => {
    const { container } = render(<Badge content />)
    const badge = container.querySelector(`.${prefixClassname("badge__badge")}`)

    expect(badge).toHaveClass(prefixClassname("badge--dot"))
    expect(badge).toBeEmptyDOMElement()
  })

  it.each<BadgePosition>(["top-left", "top-right", "bottom-left", "bottom-right"])(
    "renders at the %s position",
    (position) => {
      const { container } = render(
        <Badge content={1} position={position}>
          目标元素
        </Badge>,
      )

      expect(container.querySelector(`.${prefixClassname("badge__badge")}`)).toHaveClass(
        prefixClassname(`badge--${position}`),
      )
    },
  )

  it("wraps children and keeps badge view props on the badge element", () => {
    const onClick = jest.fn()
    const { container } = render(
      <Badge
        content="Hot"
        className="custom-wrapper"
        id="badge-content"
        style={{ color: "yellow" }}
        onClick={onClick}
      >
        商品
      </Badge>,
    )

    const wrapper = container.querySelector(`.${prefixClassname("badge-wrapper")}`)
    const badge = container.querySelector(`.${prefixClassname("badge__badge")}`) as HTMLElement

    expect(wrapper).toHaveClass("custom-wrapper")
    expect(wrapper).not.toHaveAttribute("id")
    expect(wrapper).toHaveTextContent("商品Hot")
    expect(badge).toHaveClass(prefixClassname("badge--content"), prefixClassname("badge--fixed"))
    expect(badge).not.toHaveClass("custom-wrapper")
    expect(badge).toHaveAttribute("id", "badge-content")
    expect(badge).toHaveStyle({ color: "rgb(255, 255, 0)" })

    fireEvent.click(badge)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not render a badge when wrapped content is empty", () => {
    const { container } = render(<Badge>目标元素</Badge>)

    expect(container.querySelector(`.${prefixClassname("badge-wrapper")}`)).toHaveTextContent(
      "目标元素",
    )
    expect(container.querySelector(`.${prefixClassname("badge__badge")}`)).not.toBeInTheDocument()
  })

  it("renders custom React content", () => {
    const { container, getByTestId } = render(
      <Badge content={<span data-testid="custom-content">!</span>} />,
    )

    expect(container.querySelector(`.${prefixClassname("badge__badge")}`)).toHaveClass(
      prefixClassname("badge--content"),
    )
    expect(getByTestId("custom-content")).toHaveTextContent("!")
  })

  it("uses a Badge element supplied as content to decorate children", () => {
    const { container } = render(
      <Badge
        className="nested-badge"
        content={<Badge content={8} position="bottom-left" data-testid="nested-badge-content" />}
      >
        目标元素
      </Badge>,
    )

    const wrapper = container.querySelector(`.${prefixClassname("badge-wrapper")}`)
    const badge = container.querySelector(`.${prefixClassname("badge__badge")}`)

    expect(wrapper).toHaveClass("nested-badge")
    expect(wrapper).toHaveTextContent("目标元素8")
    expect(badge).toHaveClass(
      prefixClassname("badge--fixed"),
      prefixClassname("badge--bottom-left"),
    )
    expect(badge).toHaveAttribute("data-testid", "nested-badge-content")
  })
})
