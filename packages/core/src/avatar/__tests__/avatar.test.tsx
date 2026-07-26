import { View } from "@tarojs/components"
import { fireEvent, render } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import Avatar from "../index"
import type { AvatarShape, AvatarSize, AvatarSpacing } from "../avatar.shared"

jest.mock("@tarojs/components", () => {
  const React = jest.requireActual("react")
  return {
    View: React.forwardRef((props: any, ref: any) => {
      const { children, catchMove: _catchMove, ...restProps } = props
      return React.createElement("div", { ...restProps, ref }, children)
    }),
    Image: React.forwardRef((props: any, ref: any) => {
      const { imgProps, lazyLoad: _lazyLoad, ...restProps } = props
      return React.createElement("img", { ...restProps, ...imgProps, ref })
    }),
  }
})

describe("<Avatar />", () => {
  it("renders children with default classes and passes view props", () => {
    const onClick = jest.fn()
    const { container, getByText } = render(
      <Avatar
        className="custom-avatar"
        style={{ backgroundColor: "red" }}
        data-testid="avatar"
        onClick={onClick}
      >
        AB
      </Avatar>,
    )

    const avatar = container.querySelector(`.${prefixClassname("avatar")}`)

    expect(avatar).toHaveClass(
      "custom-avatar",
      prefixClassname("avatar--circle"),
      prefixClassname("avatar--medium"),
    )
    expect(avatar).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" })
    expect(avatar).toHaveAttribute("data-testid", "avatar")

    fireEvent.click(getByText("AB"))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it.each<AvatarShape>(["circle", "square", "rounded"])("renders the %s shape", (shape) => {
    const { container } = render(<Avatar shape={shape}>A</Avatar>)

    expect(container.querySelector(`.${prefixClassname("avatar")}`)).toHaveClass(
      prefixClassname(`avatar--${shape}`),
    )
  })

  it.each<AvatarSize>(["mini", "small", "medium", "large"])(
    "applies the %s size to the avatar and image",
    (size) => {
      const { container } = render(<Avatar src="avatar.png" size={size} />)

      expect(container.querySelector(`.${prefixClassname("avatar")}`)).toHaveClass(
        prefixClassname(`avatar--${size}`),
      )
      expect(container.querySelector(`.${prefixClassname("image")}`)).toHaveClass(
        prefixClassname(`avatar__image--${size}`),
      )
    },
  )

  it("renders an image with alternative text instead of fallback children", () => {
    const { container } = render(
      <Avatar src="avatar.png" alt="用户头像" shape="rounded">
        备用内容
      </Avatar>,
    )

    const image = container.querySelector(`.${prefixClassname("image")}`)

    expect(image).toHaveAttribute("src", "avatar.png")
    expect(image).toHaveClass(prefixClassname("image--rounded"))
    expect(image).toHaveAttribute("alt", "用户头像")
    expect(container).not.toHaveTextContent("备用内容")
  })
})

describe("<Avatar.Group />", () => {
  it.each<AvatarSpacing>(["mini", "small", "medium", "large"])(
    "renders the %s spacing",
    (spacing) => {
      const { container } = render(
        <Avatar.Group spacing={spacing}>
          <Avatar>A</Avatar>
        </Avatar.Group>,
      )

      expect(container.querySelector(`.${prefixClassname("avatar-group")}`)).toHaveClass(
        prefixClassname(`avatar-group--spacing-${spacing}`),
      )
    },
  )

  it("keeps only avatars and applies the group shape while preserving styles", () => {
    const { container } = render(
      <Avatar.Group className="custom-group" shape="square">
        <Avatar shape="circle" style={{ backgroundColor: "red" }}>
          A
        </Avatar>
        <View>忽略内容</View>
        <Avatar shape="rounded">B</Avatar>
      </Avatar.Group>,
    )

    const group = container.querySelector(`.${prefixClassname("avatar-group")}`)
    const avatars = group?.querySelectorAll(`.${prefixClassname("avatar")}`)

    expect(group).toHaveClass("custom-group")
    expect(avatars).toHaveLength(2)
    expect(avatars?.[0]).toHaveClass(prefixClassname("avatar--square"))
    expect(avatars?.[0]).not.toHaveClass(prefixClassname("avatar--circle"))
    expect(avatars?.[0]).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)", zIndex: "0" })
    expect(avatars?.[1]).toHaveClass(prefixClassname("avatar--square"))
    expect(avatars?.[1]).toHaveStyle({ zIndex: "1" })
    expect(container).not.toHaveTextContent("忽略内容")
  })

  it("limits visible avatars and derives the remaining count from children", () => {
    const { container } = render(
      <Avatar.Group limit={2}>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
        <Avatar>C</Avatar>
        <Avatar>D</Avatar>
      </Avatar.Group>,
    )

    const avatars = container.querySelectorAll(`.${prefixClassname("avatar")}`)

    expect(avatars).toHaveLength(3)
    expect(avatars[0]).toHaveTextContent("A")
    expect(avatars[1]).toHaveTextContent("B")
    expect(avatars[2]).toHaveTextContent("+2")
    expect(avatars[2]).toHaveStyle({ zIndex: "4" })
    expect(container).not.toHaveTextContent("C")
    expect(container).not.toHaveTextContent("D")
  })

  it("uses total for the remaining count and supports a single child", () => {
    const { container } = render(
      <Avatar.Group total={5}>
        <Avatar size="small">A</Avatar>
      </Avatar.Group>,
    )

    const avatars = container.querySelectorAll(`.${prefixClassname("avatar")}`)

    expect(avatars).toHaveLength(2)
    expect(avatars[1]).toHaveTextContent("+4")
    expect(avatars[1]).toHaveClass(prefixClassname("avatar--small"))
  })

  it("does not render a zero counter when the avatar count equals the limit", () => {
    const { container } = render(
      <Avatar.Group limit={2}>
        <Avatar>A</Avatar>
        <Avatar>B</Avatar>
      </Avatar.Group>,
    )

    expect(container.querySelectorAll(`.${prefixClassname("avatar")}`)).toHaveLength(2)
    expect(container).not.toHaveTextContent("+0")
  })

  it("inherits the first hidden avatar size for the remaining counter", () => {
    const { container } = render(
      <Avatar.Group limit={2}>
        <Avatar size="mini">A</Avatar>
        <Avatar size="small">B</Avatar>
        <Avatar size="large">C</Avatar>
      </Avatar.Group>,
    )

    const avatars = container.querySelectorAll(`.${prefixClassname("avatar")}`)

    expect(avatars[2]).toHaveTextContent("+1")
    expect(avatars[2]).toHaveClass(prefixClassname("avatar--large"))
  })
})
