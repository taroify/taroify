import { pxTransform } from "@tarojs/taro"
import { render } from "@testing-library/react"
// biome-ignore lint/correctness/noUnusedImports: JSX is compiled with the classic React runtime.
import * as React from "react"
import { prefixClassname } from "../../styles"
import Space from ".."
import type {
  SpaceAlign,
  SpaceDirection,
  SpaceJustify,
  SpaceSizePreset,
  SpaceWrap,
} from "../space.shared"

jest.mock("@tarojs/taro", () => ({
  pxTransform: (size = 0) => `${size}px`,
}))

function getSpace(container: HTMLElement) {
  return container.querySelector(`.${prefixClassname("space")}`) as HTMLElement
}

function getItems(container: HTMLElement) {
  return Array.from(container.querySelectorAll(`.${prefixClassname("space__item")}`))
}

describe("<Space />", () => {
  it("renders defaults and passes View props", () => {
    const onClick = jest.fn()
    const { container, getByTestId } = render(
      <Space
        className="custom-space"
        style={{ backgroundColor: "red" }}
        data-testid="space"
        onClick={onClick}
      >
        <span>First</span>
        <span>Second</span>
      </Space>,
    )
    const space = getSpace(container)
    const items = getItems(container)

    expect(space).toHaveClass(
      "custom-space",
      prefixClassname("space--horizontal"),
      prefixClassname("space--small"),
      prefixClassname("flex--row"),
      prefixClassname("flex--wrap"),
    )
    expect(space).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" })
    expect(items).toHaveLength(2)
    for (const item of items) {
      expect(item).toHaveClass(
        prefixClassname("space__item"),
        prefixClassname("space__item--small"),
      )
    }

    getByTestId("space").click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it.each<SpaceSizePreset>(["mini", "small", "medium", "large"])(
    "renders the %s preset size",
    (size) => {
      const { container } = render(
        <Space size={size}>
          <span>Item</span>
        </Space>,
      )

      expect(getSpace(container)).toHaveClass(prefixClassname(`space--${size}`))
      expect(getItems(container)[0]).toHaveClass(prefixClassname(`space__item--${size}`))
    },
  )

  it("transforms a numeric size for both axes", () => {
    const { container } = render(
      <Space size={16}>
        <span>Item</span>
      </Space>,
    )

    expect(getItems(container)[0]).toHaveStyle({
      marginRight: pxTransform(16),
      marginBottom: pxTransform(16),
    })
  })

  it.each(["2rem", "var(--space-gap)"])("keeps the custom size %s", (size) => {
    const { container } = render(
      <Space size={size}>
        <span>Item</span>
      </Space>,
    )

    expect(getItems(container)[0]).toHaveStyle({
      marginRight: size,
      marginBottom: size,
    })
    expect(getSpace(container)).not.toHaveClass(
      prefixClassname("space--mini"),
      prefixClassname("space--small"),
      prefixClassname("space--medium"),
      prefixClassname("space--large"),
    )
  })

  it("supports mixed horizontal and vertical sizes", () => {
    const { container } = render(
      <Space size={[16, "var(--vertical-gap)"]}>
        <span>Item</span>
      </Space>,
    )

    expect(getItems(container)[0]).toHaveStyle({
      marginRight: pxTransform(16),
      marginBottom: "var(--vertical-gap)",
    })
  })

  it("supports an array without a vertical size", () => {
    const { container } = render(
      <Space size={["2rem"]}>
        <span>Item</span>
      </Space>,
    )
    const item = getItems(container)[0] as HTMLElement

    expect(item).toHaveStyle({ marginRight: "2rem" })
    expect(item.style.marginBottom).toBe("")
  })

  it("passes direction, alignment, justification, wrapping and fill to the layout", () => {
    const direction: SpaceDirection = "vertical"
    const align: SpaceAlign = "stretch"
    const justify: SpaceJustify = "space-between"
    const wrap: SpaceWrap = "wrap-reverse"
    const { container } = render(
      <Space direction={direction} align={align} justify={justify} wrap={wrap} fill>
        <span>Item</span>
      </Space>,
    )
    const space = getSpace(container)

    expect(space).toHaveClass(
      prefixClassname("space--vertical"),
      prefixClassname("flex--column"),
      prefixClassname("flex--align-stretch"),
      prefixClassname("flex--justify-space-between"),
      prefixClassname("flex--wrap-reverse"),
    )
    expect(getItems(container)[0]).toHaveClass(prefixClassname("space__item--fill"))
  })

  it("falls back to the Flex direction for an unsupported direction", () => {
    const { container } = render(
      <Space direction={"unsupported" as SpaceDirection}>
        <span>Item</span>
      </Space>,
    )
    const space = getSpace(container)

    expect(space).toHaveClass(prefixClassname("flex--row"))
    expect(space).not.toHaveClass(
      prefixClassname("space--horizontal"),
      prefixClassname("space--vertical"),
    )
  })

  it("renders separators only between adjacent children", () => {
    const { container } = render(
      <Space separator={<span data-testid="separator">|</span>} fill>
        <span>First</span>
        <span>Second</span>
        <span>Third</span>
      </Space>,
    )
    const space = getSpace(container)
    const items = getItems(container)
    const separators = Array.from(
      container.querySelectorAll(`.${prefixClassname("space__separator")}`),
    )

    expect(items).toHaveLength(5)
    expect(separators).toHaveLength(2)
    expect(separators[0]).toHaveClass(
      prefixClassname("space__item"),
      prefixClassname("space__item--small"),
    )
    expect(separators[0]).toHaveStyle({ alignSelf: "center" })
    expect(separators[0]).not.toHaveClass(prefixClassname("space__item--fill"))
    expect(Array.from(space.children).map((item) => item.textContent)).toEqual([
      "First",
      "|",
      "Second",
      "|",
      "Third",
    ])
  })

  it("does not force cross-axis alignment on vertical separators", () => {
    const { container } = render(
      <Space direction="vertical" separator="|">
        <span>First</span>
        <span>Second</span>
      </Space>,
    )
    const separator = container.querySelector(
      `.${prefixClassname("space__separator")}`,
    ) as HTMLElement

    expect(separator.style.alignSelf).toBe("")
  })

  it("does not render a separator for a single child or a null separator", () => {
    const { container, rerender } = render(
      <Space separator="|">
        <span>Only</span>
      </Space>,
    )
    const selector = `.${prefixClassname("space__separator")}`

    expect(container.querySelector(selector)).not.toBeInTheDocument()

    rerender(
      <Space separator={null}>
        <span>First</span>
        <span>Second</span>
      </Space>,
    )

    expect(container.querySelector(selector)).not.toBeInTheDocument()
  })
})
