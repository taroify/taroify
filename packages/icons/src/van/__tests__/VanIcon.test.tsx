import { render } from "@testing-library/react"
import * as React from "react"
import {
  ArrowDoubleLeft,
  ArrowDoubleRight,
  CashOutlined,
  LinkOutlined,
  MiniprogramOutlined,
  Qq,
  WechatMoments,
  Weibo,
} from "../../index"
import VanIcon from "../VanIcon"

describe("<VanIcon />", () => {
  it("should not add inherit modifier when using preset color", () => {
    const { container } = render(<VanIcon name="success" color="success" />)
    const el = container.firstChild as HTMLElement

    expect(el).toHaveClass("taroify-icon--success")
    expect(el).not.toHaveClass("taroify-icon--inherit")
  })

  it("should keep preset size modifier without inherit modifier", () => {
    const { container } = render(<VanIcon name="success" size="small" color="success" />)
    const el = container.firstChild as HTMLElement

    expect(el).toHaveClass("taroify-icon--success")
    expect(el).toHaveClass("taroify-icon--small")
    expect(el).not.toHaveClass("taroify-icon--inherit")
  })

  it("should render an image icon", () => {
    const src = "https://example.com/icon.png"
    const { container } = render(<ArrowDoubleLeft src={src} />)
    const el = container.firstChild as HTMLElement
    const image = container.querySelector(".taroify-icon__image")

    expect(el).not.toHaveClass("van-icon-arrow-double-left")
    expect(image).toHaveAttribute("src", src)
  })

  it.each([
    ["arrow-double-left", ArrowDoubleLeft],
    ["arrow-double-right", ArrowDoubleRight],
    ["cash-o", CashOutlined],
    ["link-o", LinkOutlined],
    ["miniprogram-o", MiniprogramOutlined],
    ["wechat-moments", WechatMoments],
    ["qq", Qq],
    ["weibo", Weibo],
  ])("should render the new %s icon", (name, Icon) => {
    const { container } = render(<Icon />)

    expect(container.firstChild).toHaveClass(`van-icon-${name}`)
  })
})
