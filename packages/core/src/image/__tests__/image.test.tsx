import { fireEvent, render } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import Image from "../image"

jest.mock("@tarojs/components", () => {
  const React = jest.requireActual("react")
  return {
    View: React.forwardRef((props: any, ref: any) => {
      const { children, ...restProps } = props
      return React.createElement("div", { ...restProps, ref }, children)
    }),
    Image: React.forwardRef((props: any, ref: any) => {
      const {
        imgProps,
        lazyLoad: _lazyLoad,
        mode: _mode,
        webp: _webp,
        showMenuByLongpress: _showMenuByLongpress,
        ...restProps
      } = props
      return React.createElement("img", { ...restProps, ...imgProps, ref })
    }),
  }
})

describe("<Image />", () => {
  it("resets the failed state when src changes", () => {
    const { container, rerender } = render(
      <Image src="failed.png" fallback="加载失败" placeholder="加载中" />,
    )

    fireEvent.error(container.querySelector("img") as HTMLImageElement)

    expect(container).toHaveTextContent("加载失败")
    expect(container.querySelector("img")).not.toBeInTheDocument()

    rerender(<Image src="success.png" fallback="加载失败" placeholder="加载中" />)

    expect(container.querySelector("img")).toHaveAttribute("src", "success.png")
    expect(container).toHaveTextContent("加载中")
    expect(container).not.toHaveTextContent("加载失败")
  })

  it("forwards native load and error events", () => {
    const onLoad = jest.fn()
    const onError = jest.fn()
    const { container, rerender } = render(
      <Image src="success.png" onLoad={onLoad} onError={onError} />,
    )
    const image = container.querySelector("img") as HTMLImageElement

    fireEvent.load(image)

    expect(onLoad).toHaveBeenCalledWith(expect.objectContaining({ type: "load" }))

    rerender(<Image src="failed.png" onLoad={onLoad} onError={onError} />)
    fireEvent.error(container.querySelector("img") as HTMLImageElement)

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ type: "error" }))
  })

  it("renders default loading and fallback icons", () => {
    const { container } = render(<Image src="image.png" placeholder fallback />)

    expect(container.querySelector(".van-icon-photo")).toHaveClass(
      prefixClassname("image__placeholder-icon"),
    )

    fireEvent.error(container.querySelector("img") as HTMLImageElement)

    expect(container.querySelector(".van-icon-photo-fail")).toHaveClass(
      prefixClassname("image__fallback-icon"),
    )
  })

  it("keeps supporting a loading placeholder without src", () => {
    const { container } = render(<Image placeholder="加载中" />)

    expect(container).toHaveTextContent("加载中")
    expect(container.querySelector("img")).not.toBeInTheDocument()
  })

  it("preserves the class name of a custom placeholder", () => {
    const { container } = render(
      <Image src="image.png" placeholder={<span className="custom-placeholder">加载中</span>} />,
    )

    expect(container.querySelector(".custom-placeholder")).toHaveClass(
      prefixClassname("image__placeholder"),
      prefixClassname("image__placeholder-icon"),
    )
  })

  it("applies custom radius to the image and wrapper", () => {
    const { container } = render(
      <Image src="image.png" width="100px" height="80px" radius="12px" />,
    )
    const wrapper = container.firstElementChild
    const image = container.querySelector("img")

    expect(wrapper).toHaveStyle({
      width: "100px",
      height: "80px",
      borderRadius: "12px",
      overflow: "hidden",
    })
    expect(image).toHaveStyle({ borderRadius: "12px" })
  })

  it("applies a zero radius to square images", () => {
    const { container } = render(React.createElement(Image, { src: "image.png", shape: "square" }))
    const wrapper = container.firstElementChild
    const image = container.querySelector("img")

    expect(wrapper).toHaveStyle({ borderRadius: 0, overflow: "hidden" })
    expect(image).toHaveStyle({ borderRadius: 0 })
  })

  it("forwards native image props and merges alt into imgProps", () => {
    const { container } = render(
      <Image
        src="image.png"
        alt="商品图片"
        webp
        showMenuByLongpress
        imgProps={{ crossOrigin: "anonymous", title: "预览" }}
      />,
    )
    const image = container.querySelector("img")

    expect(image).toHaveAttribute("alt", "商品图片")
    expect(image).toHaveAttribute("crossorigin", "anonymous")
    expect(image).toHaveAttribute("title", "预览")
  })
})
