import { fireEvent, render } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import ActionSheet from "../index"

describe("<ActionSheet />", () => {
  it("renders the description, actions, cancel button and default safe area", () => {
    const { container } = render(
      <ActionSheet
        defaultOpen
        className="custom-action-sheet"
        description="请选择操作"
        cancelText="取消"
        actions={[
          {
            name: "编辑",
            subname: "修改当前内容",
            value: "edit",
            className: "custom-action",
            style: { color: "red" },
          },
          { name: "删除", value: "delete", disabled: true },
          { name: "提交", value: "submit", loading: true },
        ]}
      />,
    )

    const sheet = container.querySelector(`.${prefixClassname("action-sheet")}`)
    const header = container.querySelector(`.${prefixClassname("action-sheet__header")}`)
    const actions = container.querySelectorAll(`.${prefixClassname("action-sheet__action")}`)

    expect(sheet).toHaveClass("custom-action-sheet", prefixClassname("popup--rounded"))
    expect(header).toHaveTextContent("请选择操作")
    expect(actions).toHaveLength(3)
    expect(actions[0]).toHaveClass("custom-action")
    expect(actions[0]).toHaveStyle({ color: "rgb(255, 0, 0)" })
    expect(actions[0]).toHaveTextContent("编辑修改当前内容")
    expect(actions[1]).toHaveClass(prefixClassname("sheet__item--disabled"))
    expect(actions[2]).toHaveClass(prefixClassname("sheet__item--loading"))
    expect(actions[2].querySelector(`.${prefixClassname("loading")}`)).toBeInTheDocument()
    expect(
      container.querySelector(`.${prefixClassname("sheet__button--cancel")}`),
    ).toHaveTextContent("取消")
    expect(container.querySelector(`.${prefixClassname("safe-area--bottom")}`)).toBeInTheDocument()
  })

  it("calls the action click handler and onSelect with the selected action", () => {
    const onClick = jest.fn()
    const onSelect = jest.fn()
    const { container } = render(
      <ActionSheet
        defaultOpen
        actions={[
          {
            name: "编辑",
            subname: "修改当前内容",
            value: "edit",
            onClick,
          },
        ]}
        onSelect={onSelect}
      />,
    )

    fireEvent.click(
      container.querySelector(`.${prefixClassname("action-sheet__button")}`) as HTMLElement,
    )

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith({
      disabled: undefined,
      loading: undefined,
      name: "编辑",
      value: "edit",
      children: "修改当前内容",
    })
  })

  it.each([
    ["disabled", { disabled: true }],
    ["loading", { loading: true }],
  ])("does not select a %s action", (state, stateProps) => {
    const onClick = jest.fn()
    const onSelect = jest.fn()
    const { container } = render(
      <ActionSheet
        defaultOpen
        actions={[{ name: "不可选择", value: "blocked", onClick, ...stateProps }]}
        onSelect={onSelect}
      />,
    )

    const button = container.querySelector(`.${prefixClassname("action-sheet__button")}`)
    const action = container.querySelector(`.${prefixClassname("action-sheet__action")}`)

    if (state === "loading") {
      expect(button).not.toBeInTheDocument()
    }
    fireEvent.click((button || action) as HTMLElement)

    expect(onClick).not.toHaveBeenCalled()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it("calls onCancel after clicking the generated cancel button", () => {
    const onCancel = jest.fn()
    const { getByText } = render(<ActionSheet defaultOpen cancelText="取消" onCancel={onCancel} />)

    fireEvent.click(getByText("取消"))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it("renders compound children instead of generated content", () => {
    const onCancel = jest.fn()
    const onSelect = jest.fn()
    const { container } = render(
      <ActionSheet
        defaultOpen
        description="自动描述"
        cancelText="自动取消"
        actions={[{ name: "自动选项" }]}
        onCancel={onCancel}
        onSelect={onSelect}
      >
        <ActionSheet.Header title="自定义标题">自定义描述</ActionSheet.Header>
        <ActionSheet.Action name="自定义选项" value="custom">
          自定义副标题
        </ActionSheet.Action>
        <ActionSheet.Button type="cancel">自定义取消</ActionSheet.Button>
      </ActionSheet>,
    )

    expect(container).toHaveTextContent("自定义标题")
    expect(container).toHaveTextContent("自定义描述")
    expect(container).toHaveTextContent("自定义选项")
    expect(container).toHaveTextContent("自定义副标题")
    expect(container).not.toHaveTextContent("自动描述")
    expect(container).not.toHaveTextContent("自动取消")
    expect(container).not.toHaveTextContent("自动选项")
    expect(
      container.querySelector(`.${prefixClassname("action-sheet__header")}`),
    ).toBeInTheDocument()
    expect(container.querySelector(`.${prefixClassname("safe-area")}`)).not.toBeInTheDocument()

    const buttons = container.querySelectorAll(`.${prefixClassname("action-sheet__button")}`)
    fireEvent.click(buttons[0])
    fireEvent.click(
      container.querySelector(`.${prefixClassname("sheet__button--cancel")}`) as HTMLElement,
    )

    expect(onSelect).toHaveBeenCalledWith({
      disabled: undefined,
      loading: undefined,
      name: "自定义选项",
      value: "custom",
      children: "自定义副标题",
    })
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it("supports changing the generated safe area position", () => {
    const { container, rerender } = render(<ActionSheet defaultOpen safeArea="top" />)

    expect(container.querySelector(`.${prefixClassname("safe-area--top")}`)).toBeInTheDocument()
    expect(
      container.querySelector(`.${prefixClassname("safe-area--bottom")}`),
    ).not.toBeInTheDocument()

    rerender(<ActionSheet defaultOpen safeArea="bottom" />)

    expect(container.querySelector(`.${prefixClassname("safe-area--bottom")}`)).toBeInTheDocument()
    expect(container.querySelector(`.${prefixClassname("safe-area--top")}`)).not.toBeInTheDocument()
  })
})
