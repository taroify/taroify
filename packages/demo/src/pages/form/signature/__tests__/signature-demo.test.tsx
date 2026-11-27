import { Signature, type SignatureProps } from "@taroify/core"
import { act, render } from "@testing-library/react"
import * as React from "react"
import SignatureDemo from ".."

jest.mock("@taroify/core", () => ({ Signature: jest.fn(() => null) }))
jest.mock("../../../../components/block", () => ({ children }) => children)
jest.mock("../../../../components/page", () => ({ children }) => children)
jest.mock("../index.scss", () => ({}))

it("previews a submitted signature and removes the preview on clear", () => {
  const { container } = render(<SignatureDemo />)
  const props = jest.mocked(Signature).mock.calls.map(([props]) => props as SignatureProps)
  expect(props).toEqual([
    expect.objectContaining({ showToolbar: true }),
    { penColor: "#ff0000" },
    { lineWidth: 6 },
    { backgroundColor: "#eee", showToolbar: true },
  ])
  expect(container.querySelector("[src]")).toBeNull()
  const image = "data:image/png;base64,aW5r"
  act(() => props[0].onSubmit!({ image, canvas: document.createElement("canvas") }))
  expect(container.querySelector("[src]")).toHaveAttribute("src", image)
  act(() => props[0].onClear!())
  expect(container.querySelector("[src]")).toBeNull()
})
