import { act, fireEvent, render, waitFor } from "@testing-library/react"
import { View } from "@tarojs/components"
// biome-ignore lint/style/useImportType: The classic JSX transform requires React in scope.
import * as React from "react"
import { prefixClassname } from "../../styles"
import Cascader from "../index"

jest.mock("../../swiper", () => {
  const React = jest.requireActual("react") as typeof import("react")
  const MockSwiper = ({ children }: { children?: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "mock-swiper" }, children)
  MockSwiper.Item = ({ children }: { children?: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "mock-swiper-item" }, children)

  return {
    __esModule: true,
    default: MockSwiper,
  }
})

const options = [
  {
    label: "研发中心",
    value: "development",
    children: [
      {
        label: "产线一",
        value: "line-1",
        children: [{ label: "前端", value: "frontend" }],
      },
      {
        label: "产线二",
        value: "line-2",
        disabled: true,
      },
    ],
  },
  {
    label: "客户中心",
    value: "customer",
  },
]

function getOption(container: HTMLElement, text: string) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(`.${prefixClassname("cascader__option")}`),
  ).find((option) => option.textContent?.includes(text)) as HTMLElement
}

function createRect(top: number): DOMRect {
  return {
    top,
    bottom: top + 40,
    left: 0,
    right: 100,
    width: 100,
    height: 40,
    x: 0,
    y: top,
    toJSON: () => {},
  }
}

describe("<Cascader />", () => {
  it("selects data options, ignores disabled options and finishes at a leaf", async () => {
    const onSelect = jest.fn()
    const onChange = jest.fn()
    const onTabClick = jest.fn()
    const { container, getByText } = render(
      <Cascader
        animated={false}
        className="custom-cascader"
        defaultValue={[]}
        options={options}
        title="请选择部门"
        onSelect={onSelect}
        onChange={onChange}
        onTabClick={onTabClick}
      />,
    )

    expect(container.querySelector(`.${prefixClassname("cascader")}`)).toHaveClass(
      "custom-cascader",
    )
    expect(container.querySelector(`.${prefixClassname("cascader__header")}`)).toHaveTextContent(
      "请选择部门",
    )
    expect(container.querySelector(`.${prefixClassname("cascader__close-icon")}`)).toBeNull()

    fireEvent.click(getByText("研发中心"))

    expect(onSelect).toHaveBeenLastCalledWith(
      ["development"],
      [expect.objectContaining({ children: "研发中心", value: "development" })],
    )
    expect(onChange).not.toHaveBeenCalled()
    await waitFor(() => expect(getByText("产线一")).toBeInTheDocument())

    fireEvent.click(getByText("产线二"))
    expect(onSelect).toHaveBeenCalledTimes(1)

    fireEvent.click(getByText("产线一"))
    await waitFor(() => expect(getByText("前端")).toBeInTheDocument())
    fireEvent.click(getByText("前端"))

    expect(onChange).toHaveBeenCalledWith(
      ["development", "line-1", "frontend"],
      [
        expect.objectContaining({ children: "研发中心", value: "development" }),
        expect.objectContaining({ children: "产线一", value: "line-1" }),
        expect.objectContaining({ children: "前端", value: "frontend" }),
      ],
    )

    const tabs = container.querySelectorAll(`.${prefixClassname("tabs__tab")}`)
    fireEvent.click(tabs[0])
    expect(onTabClick).toHaveBeenCalledWith(
      expect.objectContaining({ title: "研发中心", value: 0 }),
    )
  })

  it("keeps controlled values authoritative", () => {
    const onSelect = jest.fn()
    const onChange = jest.fn()
    const { container } = render(
      <Cascader
        animated={false}
        value={["customer"]}
        options={options}
        onSelect={onSelect}
        onChange={onChange}
      />,
    )

    fireEvent.click(getOption(container, "客户中心"))

    expect(onSelect).toHaveBeenCalledWith(
      ["customer"],
      [expect.objectContaining({ value: "customer" })],
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  it("loads child options asynchronously and finishes when loading returns no children", async () => {
    const loadData = jest
      .fn()
      .mockResolvedValueOnce([{ label: "异步子项", value: "async-child" }])
      .mockResolvedValueOnce([])
    const onChange = jest.fn()
    const { getByText } = render(
      <Cascader
        animated={false}
        defaultValue={[]}
        options={[{ label: "异步父项", value: "async-parent" }]}
        loadData={loadData}
        onChange={onChange}
      />,
    )

    fireEvent.click(getByText("异步父项"))

    await waitFor(() => expect(getByText("异步子项")).toBeInTheDocument())
    expect(loadData).toHaveBeenNthCalledWith(
      1,
      ["async-parent"],
      [expect.objectContaining({ value: "async-parent" })],
    )

    fireEvent.click(getByText("异步子项"))

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(
        ["async-parent", "async-child"],
        [
          expect.objectContaining({ value: "async-parent" }),
          expect.objectContaining({ value: "async-child" }),
        ],
      ),
    )
  })

  it("ignores an async result when its source option was removed while loading", async () => {
    const mutableOptions = [{ label: "即将移除", value: "removing" }]
    let resolveLoad: (options: typeof mutableOptions) => void = () => {}
    const loadData = jest.fn(
      () =>
        new Promise<typeof mutableOptions>((resolve) => {
          resolveLoad = resolve
        }),
    )
    const { container } = render(
      <Cascader animated={false} defaultValue={[]} options={mutableOptions} loadData={loadData} />,
    )

    fireEvent.click(getOption(container, "即将移除"))
    mutableOptions.splice(0)

    await act(async () => {
      resolveLoad([{ label: "过期子项", value: "stale" }])
    })

    expect(loadData).toHaveBeenCalledTimes(1)
    expect(container).not.toHaveTextContent("过期子项")
  })

  it("supports compound tabs and options without changing their event shape", async () => {
    const optionClick = jest.fn()
    const onChange = jest.fn()
    const { container, getByText } = render(
      <Cascader animated={false} defaultValue={[]} onChange={onChange}>
        文本节点
        <View>忽略节点</View>
        <Cascader.Header className="custom-header" data-testid="compound-header">
          手动选择
        </Cascader.Header>
        <Cascader.Tab>
          非选项文本
          <View>非选项元素</View>
          <Cascader.Option disabled value="disabled">
            禁用项
          </Cascader.Option>
          <Cascader.Option value="manual-parent" onClick={optionClick}>
            手动父项
          </Cascader.Option>
          <Cascader.Option value="值回退" />
        </Cascader.Tab>
        <Cascader.Tab>
          <Cascader.Option>手动叶子</Cascader.Option>
        </Cascader.Tab>
      </Cascader>,
    )

    expect(container.querySelector(".custom-header")).toHaveTextContent("手动选择")

    fireEvent.click(getByText("禁用项"))
    expect(onChange).not.toHaveBeenCalled()

    fireEvent.click(getByText("手动父项"))
    expect(optionClick).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(getByText("手动叶子")).toBeInTheDocument())

    fireEvent.click(getByText("手动叶子"))

    expect(onChange).toHaveBeenCalledWith(
      ["manual-parent", 0],
      [
        expect.objectContaining({ children: "手动父项", value: "manual-parent" }),
        expect.objectContaining({ children: "手动叶子", value: 0 }),
      ],
    )
  })

  it("customizes data options and the content around each option list", () => {
    const renderOption = jest.fn(({ option, selected, tabIndex }) => (
      <View>
        {option.name}-{selected ? "selected" : "idle"}-{tabIndex}
      </View>
    ))
    const renderOptionsTop = jest.fn(({ options: currentOptions, tabIndex }) => (
      <View>
        顶部-{currentOptions.length}-{tabIndex}
      </View>
    ))
    const renderOptionsBottom = jest.fn(({ options: currentOptions, tabIndex }) => (
      <View>
        底部-{currentOptions.length}-{tabIndex}
      </View>
    ))
    const customOptions = [{ name: "自定义选项", code: "custom" }]
    const { getByText } = render(
      <Cascader
        animated={false}
        defaultValue={[]}
        options={customOptions}
        fieldNames={{ label: "name", value: "code" }}
        renderOption={renderOption}
        renderOptionsTop={renderOptionsTop}
        renderOptionsBottom={renderOptionsBottom}
      />,
    )

    expect(getByText("顶部-1-0")).toBeInTheDocument()
    expect(getByText("自定义选项-idle-0")).toBeInTheDocument()
    expect(getByText("底部-1-0")).toBeInTheDocument()
    expect(renderOption).toHaveBeenCalledWith({
      option: customOptions[0],
      selected: false,
      tabIndex: 0,
    })
    expect(renderOptionsTop).toHaveBeenCalledWith({ options: customOptions, tabIndex: 0 })
    expect(renderOptionsBottom).toHaveBeenCalledWith({ options: customOptions, tabIndex: 0 })

    fireEvent.click(getByText("自定义选项-idle-0"))

    expect(getByText("自定义选项-selected-0")).toBeInTheDocument()
    expect(renderOption).toHaveBeenLastCalledWith({
      option: customOptions[0],
      selected: true,
      tabIndex: 0,
    })
  })

  it("adds compatible header controls and preserves custom close handlers", () => {
    const iconClick = jest.fn()
    const onClose = jest.fn()
    const { container, getByTestId, getByText, rerender } = render(
      <Cascader
        showHeader
        closeable
        closeIcon={
          <View data-testid="custom-close" className="custom-close" onClick={iconClick}>
            关闭
          </View>
        }
        onClose={onClose}
      />,
    )

    const customClose = getByTestId("custom-close")
    expect(customClose).toHaveClass("custom-close", prefixClassname("cascader__close-icon"))

    fireEvent.click(customClose)
    expect(iconClick).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)

    rerender(<Cascader title="隐藏标题" showHeader={false} />)
    expect(container.querySelector(`.${prefixClassname("cascader__header")}`)).toBeNull()
    expect(container.querySelector(`.${prefixClassname("cascader")}`)).toHaveClass(
      prefixClassname("cascader--headerless"),
    )

    rerender(<Cascader closeable closeIcon="文字关闭" onClose={onClose} />)
    fireEvent.click(getByText("文字关闭"))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it("renders the default close icon and can force an empty header", () => {
    const onClose = jest.fn()
    const { container, rerender } = render(<Cascader closeable onClose={onClose} />)
    const closeIcon = container.querySelector(
      `.${prefixClassname("cascader__close-icon")}`,
    ) as HTMLElement

    expect(closeIcon).toBeInTheDocument()
    fireEvent.click(closeIcon)
    expect(onClose).toHaveBeenCalledTimes(1)

    rerender(<Cascader showHeader />)
    expect(container.querySelector(`.${prefixClassname("cascader__header")}`)).toBeInTheDocument()

    rerender(<Cascader />)
    expect(container.querySelector(`.${prefixClassname("cascader__header")}`)).toBeNull()
  })

  it("scrolls only the active H5 options container after it has mounted", async () => {
    jest.useFakeTimers()
    try {
      const { container } = render(
        <Cascader
          animated={false}
          defaultValue={["development", "line-1", "frontend"]}
          options={options}
          autoScrollToSelected
        />,
      )
      const getOptionLists = () =>
        container.querySelectorAll<HTMLElement>(`.${prefixClassname("cascader__options")}`)
      const firstList = getOptionLists()[0]
      const firstOption = firstList.querySelector<HTMLElement>(
        `.${prefixClassname("cascader__option--active")}`,
      )!
      firstList.scrollTop = 40
      jest.spyOn(firstList, "getBoundingClientRect").mockReturnValue(createRect(100))
      jest.spyOn(firstOption, "getBoundingClientRect").mockReturnValue(createRect(260))

      expect(container.querySelector(`.${prefixClassname("cascader")}`)).toHaveClass(
        prefixClassname("cascader--h5"),
      )
      expect(firstList).not.toHaveAttribute("scroll-into-view")
      await act(async () => {
        jest.runAllTimers()
        await Promise.resolve()
      })
      expect(firstList).not.toHaveAttribute("scroll-into-view")
      expect(firstList.scrollTop).toBe(200)

      const tabs = container.querySelectorAll(`.${prefixClassname("tabs__tab")}`)
      fireEvent.click(tabs[1])
      const secondList = getOptionLists()[1]
      const secondOption = secondList.querySelector<HTMLElement>(
        `.${prefixClassname("cascader__option--active")}`,
      )!
      jest.spyOn(secondList, "getBoundingClientRect").mockReturnValue(createRect(120))
      jest.spyOn(secondOption, "getBoundingClientRect").mockReturnValue(createRect(300))

      expect(secondList).not.toHaveAttribute("scroll-into-view")
      await act(async () => {
        jest.runAllTimers()
        await Promise.resolve()
      })
      expect(firstList).not.toHaveAttribute("scroll-into-view")
      expect(secondList).not.toHaveAttribute("scroll-into-view")
      expect(firstList.scrollTop).toBe(200)
      expect(secondList.scrollTop).toBe(180)
    } finally {
      jest.useRealTimers()
    }
  })

  it("keeps placeholder components renderable on their own", () => {
    const { container, rerender } = render(<Cascader.Option />)
    expect(container).toBeEmptyDOMElement()

    rerender(<Cascader.Tab />)
    expect(container).toBeEmptyDOMElement()
  })
})
