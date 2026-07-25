import { render } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import Flex from ".."

describe("<Flex />", () => {
  it("uses a single gutter value as horizontal spacing", () => {
    const { container } = render(
      <Flex gutter="20">
        <Flex.Item span={12}>1</Flex.Item>
        <Flex.Item span={12}>2</Flex.Item>
      </Flex>,
    )
    const flex = container.querySelector(`.${prefixClassname("flex")}`)
    const items = Array.from(container.querySelectorAll(`.${prefixClassname("flex-item")}`))

    expect(flex).toHaveStyle({ marginLeft: "-10px", marginRight: "-10px" })
    for (const item of items) {
      expect(item).toHaveStyle({ paddingLeft: "10px", paddingRight: "10px" })
      expect(item).not.toHaveStyle({ marginBottom: "20px" })
    }
  })

  it("keeps nowrap as the default", () => {
    const { container } = render(
      <Flex gutter={[20, 16]}>
        <Flex.Item span={12}>1</Flex.Item>
        <Flex.Item span={12}>2</Flex.Item>
        <Flex.Item span={12}>3</Flex.Item>
        <Flex.Item span={12}>4</Flex.Item>
      </Flex>,
    )
    const flex = container.querySelector(`.${prefixClassname("flex")}`)
    const items = Array.from(container.querySelectorAll(`.${prefixClassname("flex-item")}`))

    expect(flex).toHaveClass(prefixClassname("flex--nowrap"))
    for (const item of items) {
      expect(item).not.toHaveStyle({ marginBottom: "16px" })
    }
  })

  it("applies horizontal and vertical gutter to wrapped rows", () => {
    const { container } = render(
      <Flex gutter={["20", "16"]} wrap="wrap">
        <Flex.Item span="12">1</Flex.Item>
        <Flex.Item span="12">2</Flex.Item>
        <Flex.Item span="12">3</Flex.Item>
        <Flex.Item span="12">4</Flex.Item>
      </Flex>,
    )
    const flex = container.querySelector(`.${prefixClassname("flex")}`)
    const items = Array.from(container.querySelectorAll(`.${prefixClassname("flex-item")}`))

    expect(flex).toHaveStyle({ marginLeft: "-10px", marginRight: "-10px" })
    for (const item of items) {
      expect(item).toHaveStyle({ paddingLeft: "10px", paddingRight: "10px" })
    }
    expect(items[0]).toHaveStyle({ marginBottom: "16px" })
    expect(items[1]).toHaveStyle({ marginBottom: "16px" })
    expect(items[2]).not.toHaveStyle({ marginBottom: "16px" })
    expect(items[3]).not.toHaveStyle({ marginBottom: "16px" })
  })

  it("ignores non-element children when calculating wrapped rows", () => {
    const { container } = render(
      <Flex gutter={[0, 16]} wrap="wrap">
        text
        <Flex.Item span={24}>1</Flex.Item>
        <Flex.Item span={24}>2</Flex.Item>
      </Flex>,
    )
    const items = Array.from(container.querySelectorAll(`.${prefixClassname("flex-item")}`))

    expect(items[0]).toHaveStyle({ marginBottom: "16px" })
    expect(items[1]).not.toHaveStyle({ marginBottom: "16px" })
  })
})
