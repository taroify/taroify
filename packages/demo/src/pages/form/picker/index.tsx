import { Field, Input, Picker, Popup, Toast } from "@taroify/core"
import { View } from "@tarojs/components"
import * as React from "react"
import { useMemo, useState } from "react"
import Block from "../../../components/block"
import CustomWrapper from "../../../components/custom-wrapper"
import Page from "../../../components/page"
import "./index.scss"

function BasicPicker() {
  const columns = useMemo(() => [
    { label2: "杭州", value: "Hangzhou" },
    { label2: "宁波", value: "Ningbo" },
    { label2: "温州", value: "Wenzhou" },
    { label2: "绍兴", value: "Shaoxing" },
    { label2: "湖州", value: "Huzhou" }
  ], [])

  return (
    <>
      <Toast id="toast" />
      <Picker
        title="标题"
        columns={columns}
        columnsFieldNames={{ label: "label2" }}
        onChange={(value) => Toast.open(`当前值：${value}`)}
        onConfirm={(value) => Toast.open(`当前值：${value}`)}
      >
      </Picker>
    </>
  )
}

function DefaultPicker() {
  const columns = useMemo(() => [
    { label: "杭州", value: "Hangzhou" },
    { label: "宁波", value: "Ningbo" },
    { label: "温州", value: "Wenzhou" },
    { label: "绍兴", value: "Shaoxing" },
    { label: "湖州", value: "Huzhou" }
  ], [])
  return (
    <>
      <Toast id="toast" />
      <Picker
        defaultValue="Wenzhou"
        title="标题"
        columns={columns}
        onChange={(value) => Toast.open(`当前值：${value}`)}
        onConfirm={(value) => Toast.open(`当前值：${value}`)}
      >
      </Picker>
    </>
  )
}

function PickerWithMultiColumns() {
  const columns = useMemo(() => [
    [
      { label: "周一", value: "Monday" },
      { label: "周二", value: "Tuesday" },
      { label: "周三", value: "Wednesday" },
      { label: "周四", value: "Thursday" },
      { label: "周五", value: "Friday" }
    ],
    [
      { label: "上午", value: "morning" },
      { label: "下午", value: "afternoon"},
      { label: "晚上", value: "evening"}
    ]
  ], [])
  return (
    <>
      <Toast id="toast" />
      <Picker
        defaultValue={["Monday", "evening"]}
        title="标题"
        columns={columns}
        onChange={(value) => Toast.open(`当前值：${value}`)}
        onConfirm={(value) => Toast.open(`当前值：${value}`)}
      >
      </Picker>
    </>
  )
}

function DisabledPicker() {
  const columns = useMemo(() => [
    { label: "杭州", value: "Hangzhou" },
    { label: "宁波", value: "Ningbo" },
    { label: "温州", value: "Wenzhou", disabled: true },
    { label: "绍兴", value: "Shaoxing" },
    { label: "湖州", value: "Huzhou" }
  ], [])
  return (
    <Picker
      columns={columns}
      onChange={(value) => Toast.open(`当前值：${value}`)}
      onConfirm={(value) => Toast.open(`当前值：${value}`)}
    >
    </Picker>
  )
}

function LoadingPicker() {
  const columns = useMemo(() => [
    { label: "杭州", value: "Hangzhou" },
    { label: "宁波", value: "Ningbo" },
    { label: "温州", value: "Wenzhou" },
    { label: "绍兴", value: "Shaoxing" },
    { label: "湖州", value: "Huzhou" }
  ], [])

  return (
    <>
      <Toast id="toast" />
      <Picker
        loading
        title="标题"
        columns={columns}
        onChange={(value) => Toast.open(`当前值：${value}`)}
        onConfirm={(value) => Toast.open(`当前值：${value}`)}
      >
      </Picker>
    </>
  )
}

function ToolbarPicker() {
  return (
    <Picker
      title="底部工具栏"
      toolbarPosition="bottom"
      columns={[
        { label: "杭州", value: "Hangzhou" },
        { label: "宁波", value: "Ningbo" },
        { label: "温州", value: "Wenzhou" },
      ]}
    />
  )
}

function EmptyPicker() {
  return <Picker columns={[]} renderEmpty={() => <View>暂无可选项</View>} />
}

function PickerWithContent() {
  const columns = useMemo(
    () => [
      { label: "杭州", value: "Hangzhou" },
      { label: "宁波", value: "Ningbo" },
      { label: "温州", value: "Wenzhou" },
    ],
    [],
  )

  return (
    <Picker
      columns={columns}
      swipeDuration={800}
      columnsTop={<View className="picker-demo__columns-title">请选择城市</View>}
      columnsBottom={
        <View className="picker-demo__columns-hint">点击选项也可以完成选择</View>
      }
      onClickOption={({ currentOption }) => Toast.open(`点击了：${currentOption.label}`)}
    />
  )
}

function PickerPopup() {
  const [value, setValue] = useState("")
  const [openPicker, setOpenPicker] = useState(false)
  const columns = useMemo(() => [
    { label: "杭州", value: "Hangzhou" },
    { label: "宁波", value: "Ningbo" },
    { label: "温州", value: "Wenzhou" },
    { label: "绍兴", value: "Shaoxing" },
    { label: "湖州", value: "Huzhou" }
  ], [])
  return (
    <>
      <Field label="城市" isLink onClick={() => setOpenPicker(true)}>
        <Input readonly placeholder="选择城市" value={value} />
      </Field>
      <Popup open={openPicker} rounded placement="bottom" onClose={setOpenPicker}>
        <Popup.Backdrop />
        <Picker
          title="搭配弹出层使用"
          cancelText="取消"
          confirmText="确认"
          columns={columns}
          onCancel={() => setOpenPicker(false)}
          onConfirm={(values) => {
            setValue(String(values[0] ?? ""))
            setOpenPicker(false)
          }}
        >
        </Picker>
      </Popup>
    </>
  )
}

function ManualPicker() {
  return (
    <>
      <Toast id="toast" />
      <Picker
        onChange={(value) => Toast.open(`当前值：${value}`)}
        onConfirm={(value) => Toast.open(`当前值：${value}`)}
      >
        <Picker.Toolbar>
          <Picker.Button>取消</Picker.Button>
          <Picker.Title>标题</Picker.Title>
          <Picker.Button>确认</Picker.Button>
        </Picker.Toolbar>
        <Picker.Column>
          <Picker.Option>周一</Picker.Option>
          <Picker.Option>周二</Picker.Option>
          <Picker.Option>周三</Picker.Option>
          <Picker.Option>周四</Picker.Option>
          <Picker.Option>周五</Picker.Option>
        </Picker.Column>
        <Picker.Column>
          <Picker.Option>上午</Picker.Option>
          <Picker.Option>下午</Picker.Option>
          <Picker.Option>晚上</Picker.Option>
        </Picker.Column>
      </Picker>
    </>
  )
}

export default function PickerDemo() {
  return (
    <Page title="Picker 选择器" className="picker-demo">
      <Block variant="card" title="基础用法">
        <CustomWrapper>
          <BasicPicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="默认选中项">
        <CustomWrapper>
          <DefaultPicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="多列选择">
        <CustomWrapper>
          <PickerWithMultiColumns />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="禁用选项">
        <CustomWrapper>
          <DisabledPicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="加载状态">
        <CustomWrapper>
          <LoadingPicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="工具栏位置">
        <CustomWrapper>
          <ToolbarPicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="空状态">
        <CustomWrapper>
          <EmptyPicker />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="选项区域内容">
        <CustomWrapper>
          <PickerWithContent />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="搭配弹出层使用">
        <CustomWrapper>
          <PickerPopup />
        </CustomWrapper>
      </Block>
      <Block variant="card" title="手动控制DOM">
        <CustomWrapper>
          <ManualPicker />
        </CustomWrapper>
      </Block>
    </Page>
  )
}
