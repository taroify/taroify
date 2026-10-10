import { act, fireEvent, render } from "@testing-library/react"
import * as React from "react"
import AreaPicker from "../../area-picker"
import DatetimePicker from "../../datetime-picker"
import Picker from "../../picker"
import { prefixClassname } from "../../styles"
import PickerGroup from "../index"
import "../style"

jest.mock("../../styles/style", () => ({}))
jest.mock("../../picker/style", () => ({}))
jest.mock("../../tabs/style", () => ({}))
jest.mock("../index.scss", () => ({}))

const cities = [
  { label: "杭州", value: "Hangzhou" },
  { label: "宁波", value: "Ningbo" },
  { label: "温州", value: "Wenzhou" },
]
const periods = [
  { label: "上午", value: "AM" },
  { label: "下午", value: "PM" },
]

function selected(value: string, index = 0) {
  return {
    selectedValues: [value],
    selectedOptions: [expect.objectContaining({ value, index })],
    selectedIndexes: [index],
  }
}

async function renderGroup(element: React.ReactElement) {
  const result = render(element)
  await act(async () => {
    await jest.runAllTimersAsync()
  })
  return result
}

function activeTitle(container: HTMLElement) {
  return container.querySelector(`.${prefixClassname("tabs__tab--active")}`)?.textContent
}

describe("<PickerGroup />", () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers()
    })
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it("uses one toolbar and confirms all pickers, including unvisited tabs", async () => {
    const onConfirm = jest.fn()
    const childConfirm = jest.fn()
    const { container, getByText } = await renderGroup(
      <PickerGroup tabs={["城市", "时段"]} title="预约" onConfirm={onConfirm} id="group">
        <Picker columns={cities} onConfirm={childConfirm}>
          <Picker.Toolbar>
            <Picker.Title>子工具栏</Picker.Title>
          </Picker.Toolbar>
        </Picker>
        <Picker columns={periods} defaultValue="PM" />
      </PickerGroup>,
    )
    expect(container.querySelectorAll(`.${prefixClassname("picker__toolbar")}`)).toHaveLength(1)
    expect(container.querySelectorAll(`.${prefixClassname("picker")}`)).toHaveLength(2)
    expect(container.querySelector("#group")).toHaveClass(prefixClassname("picker-group"))
    expect(container).not.toHaveTextContent("子工具栏")
    fireEvent.click(getByText("确认"))
    expect(onConfirm).toHaveBeenCalledWith([selected("Hangzhou"), selected("PM", 1)])
    expect(childConfirm).toHaveBeenCalledWith(
      ["Hangzhou"],
      [expect.objectContaining({ value: "Hangzhou" })],
    )
  })

  it("advances through tabs before confirming and supports direct tab clicks", async () => {
    const onConfirm = jest.fn()
    const onActiveTabChange = jest.fn()
    const { container, getByText, queryByText } = await renderGroup(
      <PickerGroup
        tabs={["城市", "时段"]}
        nextStepText="下一步"
        confirmText="完成"
        onConfirm={onConfirm}
        onActiveTabChange={onActiveTabChange}
      >
        <Picker columns={cities} />
        <Picker columns={periods} />
      </PickerGroup>,
    )
    fireEvent.click(getByText("下一步"))
    expect(activeTitle(container)).toBe("时段")
    expect(onActiveTabChange).toHaveBeenLastCalledWith(1)
    expect(onConfirm).not.toHaveBeenCalled()
    expect(queryByText("下一步")).toBeNull()
    fireEvent.click(getByText("城市"))
    expect(activeTitle(container)).toBe("城市")
    expect(onActiveTabChange).toHaveBeenLastCalledWith(0)
    fireEvent.click(getByText("时段"))
    fireEvent.click(getByText("完成"))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it("honors controlled tabs without changing them until the parent updates", async () => {
    const onActiveTabChange = jest.fn()
    const group = (activeTab: number) => (
      <PickerGroup
        tabs={["城市", "时段"]}
        activeTab={activeTab}
        nextStepText="下一步"
        onActiveTabChange={onActiveTabChange}
      >
        <Picker columns={cities} />
        <Picker columns={periods} />
      </PickerGroup>
    )
    const { container, getByText, rerender } = await renderGroup(group(0))
    fireEvent.click(getByText("下一步"))
    expect(onActiveTabChange).toHaveBeenCalledWith(1)
    expect(activeTitle(container)).toBe("城市")
    rerender(group(1))
    expect(activeTitle(container)).toBe("时段")
    fireEvent.click(getByText("城市"))
    expect(onActiveTabChange).toHaveBeenLastCalledWith(0)
    expect(activeTitle(container)).toBe("时段")
  })

  it("supports defaultActiveTab and cancel without confirming or reverting child values", async () => {
    const onConfirm = jest.fn()
    const onCancel = jest.fn()
    const childCancel = jest.fn()
    const onChange = jest.fn()
    const { container, getByText } = await renderGroup(
      <PickerGroup
        tabs={["城市", "时段"]}
        defaultActiveTab={1}
        cancelText="返回"
        onConfirm={onConfirm}
        onCancel={onCancel}
      >
        <Picker columns={cities} onCancel={childCancel} />
        <Picker columns={periods} onChange={onChange} />
      </PickerGroup>,
    )
    expect(activeTitle(container)).toBe("时段")
    fireEvent.click(getByText("下午"))
    fireEvent.click(getByText("返回"))
    expect(onChange).toHaveBeenCalledWith("PM", expect.anything(), expect.anything())
    expect(onCancel).toHaveBeenCalledWith()
    expect(childCancel).not.toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
    fireEvent.click(getByText("确认"))
    expect(onConfirm).toHaveBeenCalledWith([selected("Hangzhou"), selected("PM", 1)])
  })

  it("allows custom toolbars and hides both group and child toolbars when requested", async () => {
    const onConfirm = jest.fn()
    const onCancel = jest.fn()
    const content = (
      <>
        <PickerGroup.Toolbar>
          <PickerGroup.Button>返回</PickerGroup.Button>
          <PickerGroup.Title>自定义标题</PickerGroup.Title>
          <PickerGroup.Button>提交</PickerGroup.Button>
        </PickerGroup.Toolbar>
        <Picker columns={cities} />
      </>
    )
    const { container, getByText, rerender } = await renderGroup(
      <PickerGroup tabs={["城市"]} onConfirm={onConfirm} onCancel={onCancel}>
        {content}
      </PickerGroup>,
    )
    fireEvent.click(getByText("提交"))
    fireEvent.click(getByText("返回"))
    expect(onConfirm).toHaveBeenCalledWith([selected("Hangzhou")])
    expect(onCancel).toHaveBeenCalledTimes(1)
    rerender(
      <PickerGroup tabs={["城市"]} showToolbar={false}>
        {content}
      </PickerGroup>,
    )
    expect(container.querySelector(`.${prefixClassname("picker__toolbar")}`)).toBeNull()
  })

  it("works with DatetimePicker, AreaPicker and wrapped custom pickers", async () => {
    function CustomPicker() {
      return <Picker columns={periods} />
    }
    const onConfirm = jest.fn()
    const dateConfirm = jest.fn()
    const date = new Date(2024, 5, 15)
    const { getByText } = await renderGroup(
      <PickerGroup tabs={["日期", "地区", "时段"]} onConfirm={onConfirm}>
        <DatetimePicker type="date" defaultValue={date} onConfirm={dateConfirm} />
        <AreaPicker
          areaList={{
            province_list: { "330000": "浙江省" },
            city_list: { "330100": "杭州市" },
            county_list: { "330102": "上城区" },
          }}
        />
        <CustomPicker />
      </PickerGroup>,
    )
    fireEvent.click(getByText("确认"))
    expect(onConfirm.mock.calls[0][0].map(({ selectedValues }) => selectedValues)).toEqual([
      ["2024", "06", "15"],
      ["330000", "330100", "330102"],
      ["AM"],
    ])
    expect(dateConfirm).toHaveBeenCalledWith(date)
  })

  it("settles momentum before collecting results", async () => {
    const onConfirm = jest.fn()
    const now = jest.spyOn(Date, "now")
    const { container, getByText } = await renderGroup(
      <PickerGroup tabs={["城市", "时段"]} onConfirm={onConfirm}>
        <Picker columns={cities} />
        <Picker columns={periods} />
      </PickerGroup>,
    )
    now.mockReturnValueOnce(0).mockReturnValueOnce(10).mockReturnValueOnce(20)
    const column = container.querySelector(`.${prefixClassname("picker-column")}`)!
    const wrapper = container.querySelector(`.${prefixClassname("picker-column__wrapper")}`)!
    fireEvent.touchStart(column, { touches: [{ clientX: 0, clientY: 0 }] })
    fireEvent.touchMove(column, { touches: [{ clientX: 0, clientY: -100 }] })
    fireEvent.touchEnd(column)
    expect(wrapper).toHaveStyle({ transitionDuration: "800ms" })
    fireEvent.click(getByText("确认"))
    expect(wrapper).toHaveStyle({ transitionDuration: "0ms" })
    expect(onConfirm).toHaveBeenCalledWith([selected("Wenzhou", 2), selected("AM")])
  })

  it("applies linked date bounds before confirming a pending momentum change", async () => {
    const onConfirm = jest.fn()
    const min = new Date(2026, 0, 1)
    const max = new Date(2028, 11, 31)
    function DateRange() {
      const [start, setStart] = React.useState(min)
      return (
        <PickerGroup tabs={["开始", "结束"]} onConfirm={onConfirm}>
          <DatetimePicker type="date" value={start} onChange={setStart} min={min} max={max} />
          <DatetimePicker type="date" defaultValue={min} min={start} max={max} />
        </PickerGroup>
      )
    }
    const { container, getByText } = await renderGroup(<DateRange />)
    jest.spyOn(Date, "now").mockReturnValueOnce(0).mockReturnValueOnce(10).mockReturnValueOnce(20)
    const column = container.querySelector(`.${prefixClassname("picker-column")}`)!
    fireEvent.touchStart(column, { touches: [{ clientX: 0, clientY: 0 }] })
    fireEvent.touchMove(column, { touches: [{ clientX: 0, clientY: -100 }] })
    fireEvent.touchEnd(column)
    fireEvent.click(getByText("确认"))
    expect(onConfirm.mock.calls[0][0].map(({ selectedValues }) => selectedValues)).toEqual([
      ["2028", "01", "01"],
      ["2028", "01", "01"],
    ])
  })

  it("preserves keyed picker state and result order through fragments, reorder and removal", async () => {
    const onConfirm = jest.fn()
    const city = <Picker key="city" columns={cities} />
    const period = <Picker key="period" columns={periods} />
    const { container, getByText, rerender } = await renderGroup(
      <React.StrictMode>
        <PickerGroup tabs={["城市", "时段"]} onConfirm={onConfirm}>
          <React.Fragment key="pickers">
            {[city, period]}
            {false}
          </React.Fragment>
        </PickerGroup>
      </React.StrictMode>,
    )
    fireEvent.click(getByText("宁波"))
    rerender(
      <React.StrictMode>
        <PickerGroup tabs={["时段", "城市"]} onConfirm={onConfirm}>
          <React.Fragment key="pickers">
            {[period, city]}
            {null}
          </React.Fragment>
        </PickerGroup>
      </React.StrictMode>,
    )
    fireEvent.click(getByText("确认"))
    expect(onConfirm).toHaveBeenLastCalledWith([selected("AM"), selected("Ningbo", 1)])
    fireEvent.click(getByText("城市"))
    rerender(
      <React.StrictMode>
        <PickerGroup tabs={["时段"]} onConfirm={onConfirm}>
          <React.Fragment key="pickers">{[period]}</React.Fragment>
        </PickerGroup>
      </React.StrictMode>,
    )
    expect(activeTitle(container)).toBe("时段")
    fireEvent.click(getByText("确认"))
    expect(onConfirm).toHaveBeenLastCalledWith([selected("AM")])
  })

  it("uses current child props and callbacks after rerender", async () => {
    const onConfirm = jest.fn()
    const oldConfirm = jest.fn()
    const newConfirm = jest.fn()
    const { getByText, rerender } = await renderGroup(
      <PickerGroup tabs={["城市"]} onConfirm={onConfirm}>
        <Picker columns={cities} value="Hangzhou" onConfirm={oldConfirm} />
      </PickerGroup>,
    )
    rerender(
      <PickerGroup tabs={["城市"]} onConfirm={onConfirm}>
        <Picker columns={cities} value="Ningbo" onConfirm={newConfirm} />
      </PickerGroup>,
    )
    fireEvent.click(getByText("确认"))
    expect(onConfirm).toHaveBeenCalledWith([selected("Ningbo", 1)])
    expect(oldConfirm).not.toHaveBeenCalled()
    expect(newConfirm).toHaveBeenCalledTimes(1)
  })

  it("keeps groups independent and does not require a group confirm callback", async () => {
    const onConfirm = jest.fn()
    const childConfirm = jest.fn()
    const { getByText } = await renderGroup(
      <>
        <PickerGroup tabs={["城市"]} confirmText="确认城市" onConfirm={onConfirm}>
          <Picker columns={cities} />
        </PickerGroup>
        <PickerGroup tabs={["时段"]} confirmText="确认时段">
          <Picker columns={periods} onConfirm={childConfirm} />
        </PickerGroup>
      </>,
    )
    fireEvent.click(getByText("确认城市"))
    expect(onConfirm).toHaveBeenCalledWith([selected("Hangzhou")])
    expect(childConfirm).not.toHaveBeenCalled()
    fireEvent.click(getByText("确认时段"))
    expect(childConfirm).toHaveBeenCalledTimes(1)
  })

  it("returns empty snapshots for missing or unselectable pickers without shifting tab order", async () => {
    const onConfirm = jest.fn()
    const { getByText, rerender } = await renderGroup(
      <PickerGroup tabs={["空", "禁用", "缺失"]} activeTab={Number.NaN} onConfirm={onConfirm}>
        <Picker columns={[]} />
        <Picker columns={cities.map((option) => ({ ...option, disabled: true }))} />
      </PickerGroup>,
    )
    fireEvent.click(getByText("确认"))
    const empty = { selectedValues: [], selectedOptions: [], selectedIndexes: [] }
    expect(onConfirm).toHaveBeenLastCalledWith([empty, empty, empty])
    rerender(<PickerGroup onConfirm={onConfirm} />)
    fireEvent.click(getByText("确认"))
    expect(onConfirm).toHaveBeenLastCalledWith([])
  })
})
