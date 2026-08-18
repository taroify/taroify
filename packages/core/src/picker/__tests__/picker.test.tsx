import { act, fireEvent, render, renderHook } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import Picker, { type PickerInstance } from "../index"
import PickerColumn, { findEnabledIndex, getElementTranslateY } from "../picker-column"
import PickerContext from "../picker.context"
import {
  getPickerOptionKey,
  getPickerValue,
  validPickerColumn,
  type PickerOptionObject,
} from "../picker.shared"
import { mapToChildrenOptions } from "../use-picker-options"
import usePickerOptions from "../use-picker-options"
import "../style"

jest.mock("../../styles/style", () => ({}))
jest.mock("../../loading/style", () => ({}))
jest.mock("../index.scss", () => ({}))

const cities = [
  { label: "杭州", value: "Hangzhou" },
  { label: "宁波", value: "Ningbo" },
  { label: "温州", value: "Wenzhou" },
]

function getColumn(container: HTMLElement, index = 0) {
  return container.querySelectorAll(`.${prefixClassname("picker-column")}`)[index] as HTMLElement
}

function getWrapper(container: HTMLElement, index = 0) {
  return container.querySelectorAll(`.${prefixClassname("picker-column__wrapper")}`)[
    index
  ] as HTMLElement
}

function touch(target: HTMLElement, type: "touchStart" | "touchMove", x: number, y: number) {
  fireEvent[type](target, { touches: [{ clientX: x, clientY: y }] })
}

describe("<Picker />", () => {
  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it("renders numeric values, custom fields and the default toolbar", () => {
    const onChange = jest.fn()
    const onConfirm = jest.fn()
    const onCancel = jest.fn()
    const onClickOption = jest.fn()
    const onScrollInto = jest.fn()
    const columns = [
      { name: "一", code: 1 },
      { name: "二", code: 2 },
    ]
    const { container, getByText } = render(
      <Picker
        title="数字"
        columns={columns}
        columnsFieldNames={{ label: "name", value: "code" }}
        defaultValue={1}
        onChange={onChange}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onClickOption={onClickOption}
        onScrollInto={onScrollInto}
        id="picker"
      />,
    )

    expect(container.querySelector(`.${prefixClassname("picker")}`)).toHaveAttribute("id", "picker")
    expect(container).toHaveTextContent("取消数字确认")

    fireEvent.click(getByText("二"))
    expect(onChange).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ index: 1, label: "二", value: 2 }),
      expect.objectContaining({ index: 0 }),
    )
    expect(onClickOption).toHaveBeenCalledWith({
      selectedValues: [2],
      selectedOptions: [expect.objectContaining({ value: 2 })],
      selectedIndexes: [1],
      columnIndex: 0,
      currentOption: expect.objectContaining({ value: 2 }),
    })
    expect(onScrollInto).toHaveBeenLastCalledWith({
      columnIndex: 0,
      currentOption: expect.objectContaining({ value: 2 }),
    })

    fireEvent.click(getByText("确认"))
    fireEvent.click(getByText("取消"))
    expect(onConfirm).toHaveBeenCalledWith([2], [expect.objectContaining({ value: 2 })])
    expect(onCancel).toHaveBeenCalledWith([2], [expect.objectContaining({ value: 2 })])
  })

  it("supports toolbar visibility, bottom placement and surrounding content", () => {
    const { container, rerender } = render(
      <Picker
        showToolbar={false}
        columns={cities}
        columnsTop={<div data-testid="top">顶部</div>}
        columnsBottom={<div data-testid="bottom">底部</div>}
      />,
    )
    expect(container.querySelector(`.${prefixClassname("picker__toolbar")}`)).toBeNull()
    expect(container.textContent).toContain("顶部杭州宁波温州底部")

    rerender(
      <Picker title="底部工具栏" toolbarPosition="bottom" columns={cities}>
        <div>附加内容</div>
      </Picker>,
    )
    const root = container.querySelector(`.${prefixClassname("picker")}`)!
    const toolbar = container.querySelector(`.${prefixClassname("picker__toolbar")}`)!
    const columns = container.querySelector(`.${prefixClassname("picker__columns")}`)!
    expect(root.compareDocumentPosition(toolbar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(columns.compareDocumentPosition(toolbar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(container).toHaveTextContent("附加内容")
  })

  it("renders empty content and hides mask and frame for empty columns", () => {
    const renderEmpty = jest.fn(() => <span>暂无数据</span>)
    const { container, rerender } = render(
      <Picker columns={[]} empty="备用内容" renderEmpty={renderEmpty} />,
    )
    expect(renderEmpty).toHaveBeenCalled()
    expect(container).toHaveTextContent("暂无数据")
    expect(container.querySelector(`.${prefixClassname("picker__mask")}`)).toBeNull()
    expect(container.querySelector(`.${prefixClassname("picker__frame")}`)).toBeNull()

    rerender(<Picker columns={cities} renderEmpty={renderEmpty} />)
    expect(renderEmpty).toHaveBeenCalledTimes(1)

    rerender(<Picker columns={[]} empty="空" loading />)
    expect(container.querySelector(`.${prefixClassname("picker__empty")}`)).toBeNull()
    expect(container.querySelector(`.${prefixClassname("picker__loading")}`)).toBeInTheDocument()

    rerender(<Picker columns={[]} empty="空" />)
    expect(container).toHaveTextContent("空")
  })

  it("clears removed and empty columns from the selected snapshot", () => {
    const ref = React.createRef<PickerInstance>()
    const onConfirm = jest.fn()
    const { getByText, rerender } = render(
      <Picker
        ref={ref}
        columns={[cities, [{ label: "上午", value: "AM" }]]}
        defaultValue={["Ningbo", "AM"]}
        onConfirm={onConfirm}
      />,
    )
    expect(ref.current?.getSelectedOptions().map(({ value }) => value)).toEqual(["Ningbo", "AM"])

    rerender(<Picker ref={ref} columns={cities} value="Ningbo" onConfirm={onConfirm} />)
    fireEvent.click(getByText("确认"))
    expect(onConfirm).toHaveBeenLastCalledWith(
      ["Ningbo"],
      [expect.objectContaining({ value: "Ningbo" })],
    )

    rerender(<Picker ref={ref} columns={[]} onConfirm={onConfirm} />)
    act(() => ref.current?.confirm())
    expect(onConfirm).toHaveBeenLastCalledWith([], [])
    expect(ref.current?.getSelectedOptions()).toEqual([])
  })

  it("falls back to the first enabled option and leaves all-disabled columns unselected", () => {
    const ref = React.createRef<PickerInstance>()
    const onChange = jest.fn()
    const onConfirm = jest.fn()
    const { getByText, rerender } = render(
      <Picker
        ref={ref}
        columns={[
          { label: "禁用", value: "disabled", disabled: true },
          { label: "可用", value: "enabled" },
        ]}
        value="missing"
        onChange={onChange}
        onConfirm={onConfirm}
      />,
    )
    expect(ref.current?.getSelectedOptions()[0]).toMatchObject({ value: "enabled", index: 1 })

    fireEvent.click(getByText("禁用"))
    expect(onChange).not.toHaveBeenCalled()

    rerender(
      <Picker
        ref={ref}
        columns={[
          { label: "甲", value: "a", disabled: true },
          { label: "乙", value: "b", disabled: true },
        ]}
        onConfirm={onConfirm}
      />,
    )
    fireEvent.click(getByText("确认"))
    expect(onConfirm).toHaveBeenLastCalledWith([], [])
    expect(ref.current?.getSelectedOptions()).toEqual([])
  })

  it("does not emit misaligned values when an earlier column is unavailable", () => {
    const onChange = jest.fn()
    const availableColumn = [
      { label: "选项一", value: "one" },
      { label: "选项二", value: "two" },
    ]
    const { getByText, rerender } = render(
      <Picker columns={[[], availableColumn]} onChange={onChange} />,
    )

    fireEvent.click(getByText("选项二"))
    expect(onChange).not.toHaveBeenCalled()

    rerender(
      <Picker
        columns={[[{ label: "不可用", value: "disabled", disabled: true }], availableColumn]}
        onChange={onChange}
      />,
    )
    fireEvent.click(getByText("选项二"))
    expect(onChange).not.toHaveBeenCalled()
  })

  it("supports manual composition and custom toolbar button inference", () => {
    const onConfirm = jest.fn()
    const onCancel = jest.fn()
    const { container, getByText } = render(
      <Picker onConfirm={onConfirm} onCancel={onCancel}>
        <Picker.Toolbar className="toolbar">
          工具栏文本
          <span>忽略</span>
          <Picker.Button>返回</Picker.Button>
          <Picker.Title>手动</Picker.Title>
          <Picker.Button>完成</Picker.Button>
          <Picker.Button>多余</Picker.Button>
        </Picker.Toolbar>
        <Picker.Columns>
          <Picker.Column className="column">
            <Picker.Option value="A" label={<span>选项 A</span>} />
            <Picker.Option value="B">
              <span>选项 B</span>
            </Picker.Option>
            <Picker.Option>纯文本</Picker.Option>
            <Picker.Option />
          </Picker.Column>
        </Picker.Columns>
      </Picker>,
    )
    expect(container.querySelector(".toolbar")).toBeInTheDocument()
    expect(container.querySelector(".column")).toBeInTheDocument()
    fireEvent.click(getByText("返回"))
    fireEvent.click(getByText("完成"))
    expect(onCancel).toHaveBeenCalled()
    expect(onConfirm).toHaveBeenCalled()
  })

  it("supports direct columns, multiple Picker.Columns children and an empty Picker.Columns", () => {
    const { container, rerender } = render(
      <Picker>
        <Picker.Column>
          <Picker.Option>A</Picker.Option>
        </Picker.Column>
      </Picker>,
    )
    expect(getColumn(container)).toHaveTextContent("A")

    rerender(
      <Picker>
        <Picker.Columns>
          <Picker.Column>
            <Picker.Option>A</Picker.Option>
          </Picker.Column>
          <Picker.Column>
            <Picker.Option>B</Picker.Option>
          </Picker.Column>
        </Picker.Columns>
      </Picker>,
    )
    expect(container.querySelectorAll(`.${prefixClassname("picker-column")}`)).toHaveLength(2)

    rerender(
      <Picker>
        <Picker.Column>不是选项节点</Picker.Column>
      </Picker>,
    )
    expect(getWrapper(container)).toBeEmptyDOMElement()

    rerender(
      <Picker empty="空列">
        <Picker.Columns>{null}</Picker.Columns>
      </Picker>,
    )
    expect(container).toHaveTextContent("空列")

    rerender(
      <Picker empty="空列">
        <Picker.Columns />
      </Picker>,
    )
    expect(container).toHaveTextContent("空列")
  })

  it("can hide an otherwise empty toolbar", () => {
    const { container } = render(<Picker columns={cities} title="" confirmText="" cancelText="" />)
    expect(container.querySelector(`.${prefixClassname("picker__toolbar")}`)).toBeNull()
  })

  it("normalizes an invalid swipe duration without changing existing callbacks", () => {
    const onClick = jest.fn()
    const onCancel = jest.fn()
    const { getByText } = render(
      <PickerContext.Provider
        value={{
          siblingCount: 3,
          optionHeight: 44,
          swipeDuration: 800,
          onCancel,
        }}
      >
        <Picker swipeDuration="invalid" columns={cities} />
        <Picker.Button onClick={onClick}>独立取消</Picker.Button>
        <Picker.Button type={"unknown" as never}>未知</Picker.Button>
      </PickerContext.Provider>,
    )
    fireEvent.click(getByText("独立取消"))
    fireEvent.click(getByText("未知"))
    expect(onClick).toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it("recalculates its offset when optionHeight changes", () => {
    const { container, rerender } = render(
      <Picker columns={cities} value="Wenzhou" optionHeight={40} />,
    )
    expect(getWrapper(container).style.transform).toContain("20px")
    expect(container.querySelector(`.${prefixClassname("picker-option")}`)).toHaveStyle({
      height: "40px",
    })

    rerender(<Picker columns={cities} value="Wenzhou" optionHeight={50} />)
    expect(getWrapper(container).style.transform).toContain("25px")
    expect(container.querySelector(`.${prefixClassname("picker-option")}`)).toHaveStyle({
      height: "50px",
    })
  })

  it("settles a regular drag and reports scroll-into changes", () => {
    jest.useFakeTimers()
    const now = jest.spyOn(Date, "now")
    now.mockReturnValueOnce(0).mockReturnValueOnce(400).mockReturnValueOnce(400)
    const onChange = jest.fn()
    const onScrollInto = jest.fn()
    const { container } = render(
      <Picker columns={cities} onChange={onChange} onScrollInto={onScrollInto} />,
    )
    const column = getColumn(container)

    touch(column, "touchStart", 0, 0)
    touch(column, "touchMove", 0, -50)
    fireEvent.touchEnd(column)
    fireEvent.transitionEnd(getWrapper(container))
    act(() => jest.runOnlyPendingTimers())

    expect(onScrollInto).toHaveBeenCalledWith({
      columnIndex: 0,
      currentOption: expect.objectContaining({ value: "Ningbo" }),
    })
    expect(onChange).toHaveBeenCalledWith(
      "Ningbo",
      expect.objectContaining({ value: "Ningbo" }),
      expect.objectContaining({ index: 0 }),
    )
  })

  it("confirms the momentum target immediately and uses the configured duration", () => {
    const now = jest.spyOn(Date, "now")
    now.mockReturnValueOnce(0).mockReturnValueOnce(10).mockReturnValueOnce(20)
    const onConfirm = jest.fn()
    const { container, getByText } = render(
      <Picker columns={cities} swipeDuration={650} onConfirm={onConfirm} />,
    )
    const column = getColumn(container)

    touch(column, "touchStart", 0, 0)
    touch(column, "touchMove", 0, -100)
    fireEvent.touchEnd(column)
    expect(getWrapper(container).style.transitionDuration).toBe("650ms")

    fireEvent.click(getByText("确认"))
    expect(onConfirm).toHaveBeenCalledWith(
      ["Wenzhou"],
      [expect.objectContaining({ value: "Wenzhou" })],
    )
    expect(getWrapper(container).style.transitionDuration).toBe("0ms")
  })

  it("keeps a pending momentum update across an unrelated parent rerender", () => {
    const now = jest.spyOn(Date, "now")
    now.mockReturnValueOnce(0).mockReturnValueOnce(10).mockReturnValueOnce(20)
    const onChange = jest.fn()
    const { container, rerender } = render(<Picker columns={cities} onChange={onChange} />)
    const column = getColumn(container)

    touch(column, "touchStart", 0, 0)
    touch(column, "touchMove", 0, -100)
    fireEvent.touchEnd(column)
    expect(getWrapper(container).style.transitionDuration).toBe("800ms")

    rerender(<Picker columns={cities} onChange={onChange} />)
    expect(getWrapper(container).style.transitionDuration).toBe("800ms")

    fireEvent.transitionEnd(getWrapper(container))
    expect(onChange).toHaveBeenCalledWith(
      "Wenzhou",
      expect.objectContaining({ value: "Wenzhou" }),
      expect.objectContaining({ index: 0 }),
    )
  })

  it("supports downward momentum and same-index vertical movement", () => {
    const now = jest.spyOn(Date, "now")
    now
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(20)
      .mockReturnValueOnce(30)
    const onScrollInto = jest.fn()
    const { container } = render(
      <Picker columns={cities} value="Wenzhou" onScrollInto={onScrollInto} />,
    )
    const column = getColumn(container)
    touch(column, "touchStart", 0, 0)
    touch(column, "touchMove", 0, 12)
    expect(onScrollInto).not.toHaveBeenCalled()
    touch(column, "touchMove", 0, 100)
    fireEvent.touchEnd(column)
    fireEvent.transitionEnd(getWrapper(container))
    expect(getWrapper(container).style.transform).toContain("110px")
  })

  it("ignores horizontal, readonly and unselectable touch gestures", () => {
    const onChange = jest.fn()
    const { container, rerender } = render(<Picker columns={cities} onChange={onChange} />)
    let column = getColumn(container)
    touch(column, "touchStart", 0, 0)
    touch(column, "touchMove", 30, 1)
    fireEvent.touchEnd(column)
    expect(onChange).not.toHaveBeenCalled()

    rerender(<Picker columns={cities} readonly onChange={onChange} />)
    column = getColumn(container)
    touch(column, "touchStart", 0, 0)
    touch(column, "touchMove", 0, -100)
    fireEvent.touchCancel(column)
    expect(onChange).not.toHaveBeenCalled()

    rerender(
      <Picker
        columns={cities.map((option) => ({ ...option, disabled: true }))}
        onChange={onChange}
      />,
    )
    column = getColumn(container)
    touch(column, "touchStart", 0, 0)
    touch(column, "touchMove", 0, -100)
    fireEvent.touchEnd(column)
    expect(onChange).not.toHaveBeenCalled()
  })

  it("continues an interrupted transition from its rendered transform", () => {
    const now = jest.spyOn(Date, "now")
    now.mockReturnValueOnce(0).mockReturnValueOnce(10).mockReturnValueOnce(20).mockReturnValue(30)
    const style = jest.spyOn(window, "getComputedStyle")
    style.mockReturnValue({ transform: "matrix(1, 0, 0, 1, 0, 66)" } as CSSStyleDeclaration)
    const { container } = render(<Picker columns={cities} />)
    const column = getColumn(container)

    touch(column, "touchStart", 0, 0)
    touch(column, "touchMove", 0, -100)
    fireEvent.touchEnd(column)
    touch(column, "touchStart", 0, 0)

    expect(getWrapper(container).style.transform).toContain("66px")
  })

  it("falls back to the target offset when an interrupted transform is unavailable", () => {
    const now = jest.spyOn(Date, "now")
    now.mockReturnValueOnce(0).mockReturnValueOnce(10).mockReturnValueOnce(20).mockReturnValue(30)
    jest
      .spyOn(window, "getComputedStyle")
      .mockReturnValue({ transform: "none" } as CSSStyleDeclaration)
    const { container } = render(<Picker columns={cities} />)
    const column = getColumn(container)
    touch(column, "touchStart", 0, 0)
    touch(column, "touchMove", 0, -100)
    fireEvent.touchEnd(column)
    const targetTransform = getWrapper(container).style.transform
    touch(column, "touchStart", 0, 0)
    expect(getWrapper(container).style.transform).toBe(targetTransform)
  })
})

describe("Picker helpers", () => {
  it("maps elements and objects to options", () => {
    const elementOptions = mapToChildrenOptions(
      [<Picker.Option key="text">文本</Picker.Option>, <Picker.Option key="label" label={2} />],
      0,
      1,
    )
    const objectOptions = mapToChildrenOptions(
      [
        { index: 2, value: "object", label: "对象" } as PickerOptionObject,
      ] as unknown as React.ReactNode,
      0,
      1,
    )
    expect([...elementOptions, ...objectOptions]).toEqual([
      expect.objectContaining({ index: 0, value: "文本", label: "文本" }),
      expect.objectContaining({ index: 1, value: 2, label: 2 }),
      expect.objectContaining({ index: 2, value: "object", label: "对象" }),
    ])
    expect(mapToChildrenOptions(["invalid"], 0, 1)).toEqual([])
  })

  it("validates columns, keys and scalar values", () => {
    const option = { index: 0, value: "value" } as PickerOptionObject
    expect(validPickerColumn(option)).toBe(option)
    expect(validPickerColumn({ index: -1 } as PickerOptionObject)).toBeUndefined()
    expect(validPickerColumn({ index: "0" } as unknown as PickerOptionObject)).toBeUndefined()
    expect(getPickerOptionKey(option)).toBe("value")
    expect(getPickerOptionKey({ index: 0, label: <span /> })).toBeUndefined()
    expect(getPickerOptionKey({ index: 0, children: "child" })).toBe("child")
    expect(getPickerValue([1, 2], true)).toEqual([1, 2])
    expect(getPickerValue([1, 2], false)).toBe(1)
  })

  it("provides safe context defaults to a standalone column", () => {
    const option = { index: 0, value: "A", label: "A" }
    const { container } = render(
      <PickerContext.Provider value={{ siblingCount: 3, optionHeight: 44, swipeDuration: 800 }}>
        <PickerColumn value="A" children={[option]} />
      </PickerContext.Provider>,
    )
    expect(getWrapper(container).style.transform).toContain("110px")
  })

  it("covers picker option defaults and internal helpers", () => {
    expect(findEnabledIndex([], 0)).toBe(-1)
    expect(
      findEnabledIndex(
        [
          { index: 0, value: "A" },
          { index: 1, value: "B", disabled: true },
        ],
        1,
      ),
    ).toBe(0)
    expect(
      findEnabledIndex(
        [
          { index: 0, value: "A", disabled: true },
          { index: 1, value: "B", disabled: true },
        ],
        1,
      ),
    ).toBe(-1)
    expect(getElementTranslateY()).toBeUndefined()

    const element = document.createElement("div")
    const style = jest.spyOn(window, "getComputedStyle")
    style.mockReturnValueOnce({ transform: "" } as CSSStyleDeclaration)
    expect(getElementTranslateY(element)).toBeUndefined()
    style.mockReturnValueOnce({ transform: "translate3d(bad)" } as CSSStyleDeclaration)
    expect(getElementTranslateY(element)).toBeUndefined()
    style.mockReturnValueOnce({
      transform: "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,22,0,1)",
    } as CSSStyleDeclaration)
    expect(getElementTranslateY(element)).toBe(22)
    style.mockReturnValueOnce({ transform: "translate3d(0, 33, 0)" } as CSSStyleDeclaration)
    expect(getElementTranslateY(element)).toBe(33)
    style.mockReturnValueOnce({ transform: "translateX(44)" } as CSSStyleDeclaration)
    expect(getElementTranslateY(element)).toBe(44)

    const { container } = render(
      <>
        <Picker.Column />
        <Picker.Option />
        <PickerColumn />
      </>,
    )
    expect(container.querySelector(`.${prefixClassname("picker-option")}`)).toBeInTheDocument()
    expect(container.querySelector(`.${prefixClassname("picker-column")}`)).toBeInTheDocument()
  })

  it("uses empty defaults when the options hook is called without arguments", () => {
    const { result } = renderHook(() => usePickerOptions())
    expect(result.current).toEqual([])
  })

  it("uses safe context fallbacks when Picker.Columns is rendered standalone", () => {
    const onChange = jest.fn()
    const { getByText } = render(
      <PickerContext.Provider
        value={{
          siblingCount: 3,
          optionHeight: 44,
          swipeDuration: 800,
          values: ["A"],
          onChange,
        }}
      >
        <Picker.Columns>
          <Picker.Column>
            <Picker.Option>A</Picker.Option>
            <Picker.Option>B</Picker.Option>
          </Picker.Column>
        </Picker.Columns>
      </PickerContext.Provider>,
    )
    fireEvent.click(getByText("B"))
    expect(onChange).toHaveBeenCalledWith(
      "B",
      expect.objectContaining({ value: "B" }),
      expect.objectContaining({ index: 0 }),
    )
  })
})
