import { fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
import Slider from ".."

jest.mock("../../utils/base", () => ({
  ...jest.requireActual("../../utils/base"),
  inBrowser: false,
}))

it("keeps H5 keyboard props off native Views and preserves readonly content", () => {
  const onChange = jest.fn()
  const { container } = render(
    <Slider readonly defaultValue={30} onChange={onChange}>
      <Slider.Thumb>{({ value }) => React.createElement("span", null, value)}</Slider.Thumb>
    </Slider>,
  )

  expect(screen.getByText("30")).toBeInTheDocument()
  expect(screen.queryByRole("slider")).toBeNull()
  const control = container.querySelector(".taroify-slider__thumb-wrapper")!
  expect(control).not.toHaveAttribute("tabindex")
  fireEvent.keyDown(control, { key: "End" })
  expect(onChange).not.toHaveBeenCalled()
})
