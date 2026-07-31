import { act, render } from "@testing-library/react"
// biome-ignore lint/style/useImportType: The classic JSX transform requires React in scope.
import * as React from "react"
import { prefixClassname } from "../../styles"
import Cascader from "../index"

jest.mock("../../utils/base", () => ({
  ...jest.requireActual("../../utils/base"),
  inBrowser: false,
}))

jest.mock("../../tabs", () => {
  const React = jest.requireActual("react") as typeof import("react")
  const MockTabs = ({ children }: { children?: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "mock-tabs" }, children)
  MockTabs.TabPane = ({ children }: { children?: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "mock-tab-pane" }, children)

  return {
    __esModule: true,
    default: MockTabs,
  }
})

describe("<Cascader /> in non-browser environment", () => {
  it("sets scroll-into-view after the active options have mounted", async () => {
    jest.useFakeTimers()
    try {
      const { container } = render(
        <Cascader
          animated={false}
          defaultValue={["selected"]}
          options={[{ label: "选中项", value: "selected" }]}
          autoScrollToSelected
        />,
      )
      const optionList = container.querySelector(
        `.${prefixClassname("cascader__options")}`,
      ) as HTMLElement

      expect(container.querySelector(`.${prefixClassname("cascader")}`)).not.toHaveClass(
        prefixClassname("cascader--h5"),
      )
      expect(optionList).not.toHaveAttribute("scroll-into-view")
      await act(async () => {
        jest.runAllTimers()
        await Promise.resolve()
      })
      expect(optionList.getAttribute("scroll-into-view")).toMatch(/-0-0$/)
    } finally {
      jest.useRealTimers()
    }
  })
})
