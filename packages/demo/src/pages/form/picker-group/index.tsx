import {
  AreaPicker,
  Button,
  DatetimePicker,
  Field,
  Input,
  Picker,
  PickerGroup,
  type PickerGroupConfirmEventParams,
  Popup,
  SafeArea,
  Toast,
} from "@taroify/core"
import { areaList } from "@vant/area-data"
import * as React from "react"
import { useState } from "react"
import Block from "../../../components/block"
import CustomWrapper from "../../../components/custom-wrapper"
import Page from "../../../components/page"
import "./index.scss"

const min = new Date(2026, 0, 1)
const max = new Date(2030, 11, 31, 23, 59, 59)
const initialDate = new Date(2026, 9, 2, 12, 30)
const periods = [
  { label: "上午配送", value: "AM" },
  { label: "下午配送", value: "PM" },
]

function showResult(results: PickerGroupConfirmEventParams) {
  Toast.open(results.map(({ selectedValues }) => selectedValues.join(" / ")).join("\n"))
}

function DateTimeGroup({ nextStepText }: { nextStepText?: string }) {
  return (
    <PickerGroup
      title="预约时间"
      tabs={["选择日期", "选择时间"]}
      nextStepText={nextStepText}
      onConfirm={showResult}
      onCancel={() => Toast.open("取消选择")}
    >
      <DatetimePicker type="date" defaultValue={initialDate} min={min} max={max} />
      <DatetimePicker type="hour-minute" defaultValue={initialDate} />
    </PickerGroup>
  )
}

function DateRangeGroup() {
  const [start, setStart] = useState(initialDate)
  return (
    <PickerGroup title="日期范围" tabs={["开始日期", "结束日期"]} onConfirm={showResult}>
      <DatetimePicker type="date" value={start} onChange={setStart} min={min} max={max} />
      <DatetimePicker type="date" defaultValue={new Date(2026, 9, 3)} min={start} max={max} />
    </PickerGroup>
  )
}

function TimeRangeGroup() {
  return (
    <PickerGroup title="时间范围" tabs={["开始时间", "结束时间"]} onConfirm={showResult}>
      <DatetimePicker type="hour-minute" defaultValue={new Date(2026, 9, 2, 9)} />
      <DatetimePicker type="hour-minute" defaultValue={new Date(2026, 9, 2, 18)} />
    </PickerGroup>
  )
}

function ControlledGroup() {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <>
      <Button block onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}>
        切换标签，当前为 {activeTab + 1}
      </Button>
      <PickerGroup
        tabs={["选择地区", "配送时段"]}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        nextStepText="下一步"
        onConfirm={showResult}
      >
        <AreaPicker areaList={areaList} defaultValue={["330000", "330100", "330102"]} />
        <Picker columns={periods} />
      </PickerGroup>
    </>
  )
}

function CustomToolbarGroup() {
  return (
    <PickerGroup tabs={["开始时间", "结束时间"]} onConfirm={showResult}>
      <PickerGroup.Toolbar>
        <PickerGroup.Button type="cancel">返回</PickerGroup.Button>
        <PickerGroup.Title>自定义工具栏</PickerGroup.Title>
        <PickerGroup.Button type="confirm">提交</PickerGroup.Button>
      </PickerGroup.Toolbar>
      <DatetimePicker type="hour-minute" defaultValue={initialDate} />
      <DatetimePicker type="hour-minute" defaultValue={new Date(2026, 9, 2, 18)} />
    </PickerGroup>
  )
}

function PopupGroup() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  return (
    <>
      <Field label="预约时间" isLink onClick={() => setOpen(true)}>
        <Input readonly value={value} placeholder="选择日期和时间" />
      </Field>
      <Popup open={open} onClose={setOpen} rounded placement="bottom">
        <Popup.Backdrop />
        <PickerGroup
          title="预约时间"
          tabs={["选择日期", "选择时间"]}
          nextStepText="下一步"
          onCancel={() => setOpen(false)}
          onConfirm={([date, time]) => {
            setValue(`${date.selectedValues.join("/")} ${time.selectedValues.join(":")}`)
            setOpen(false)
          }}
        >
          <DatetimePicker type="date" defaultValue={initialDate} min={min} max={max} />
          <DatetimePicker type="hour-minute" defaultValue={initialDate} />
        </PickerGroup>
        <SafeArea position="bottom" />
      </Popup>
    </>
  )
}

export default function PickerGroupDemo() {
  return (
    <Page title="PickerGroup 选择器组" className="picker-group-demo">
      <Toast id="toast" />
      <Block variant="card" title="选择日期时间">
        <CustomWrapper>
          <DateTimeGroup />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="下一步按钮">
        <CustomWrapper>
          <DateTimeGroup nextStepText="下一步" />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="选择日期范围">
        <CustomWrapper>
          <DateRangeGroup />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="选择时间范围">
        <CustomWrapper>
          <TimeRangeGroup />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="受控模式与地区选择">
        <CustomWrapper>
          <ControlledGroup />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="自定义工具栏">
        <CustomWrapper>
          <CustomToolbarGroup />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="搭配弹出层使用">
        <CustomWrapper>
          <PopupGroup />
        </CustomWrapper>
      </Block>
    </Page>
  )
}
