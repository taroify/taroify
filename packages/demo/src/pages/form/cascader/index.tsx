import { Cascader, Field, Input, Popup, Tag } from "@taroify/core"
import { Close } from "@taroify/icons"
import { View } from "@tarojs/components"
import { useState } from "react"
import Block from "../../../components/block"
import Page from "../../../components/page"
import { area, customArea, customRenderOptions, dept, dynamic } from "./area"
import "./index.scss"

function BasicCascader() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string[]>([])
  const [fieldValue, setFieldValue] = useState("")
  return (
    <>
      <Field label="选项值" isLink onClick={() => setOpen(true)}>
        <Input readonly placeholder="请选择部门" value={fieldValue} />
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <Popup.Close />
        <Cascader
          options={dept}
          value={value}
          title="请选择部门"
          placeholder="请选择"
          onSelect={setValue}
          onChange={(_values_, options) => {
            setOpen(false)
            setFieldValue(
              options.map(item => item.children).join("/")
            )
          }}
        />
      </Popup>
    </>
  )
}

function CustomColorCascader() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string[]>([])
  const [fieldValue, setFieldValue] = useState("")
  return (
    <>
      <Field label="选项值" isLink onClick={() => setOpen(true)}>
        <Input readonly placeholder="请选择地区" value={fieldValue} />
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <Popup.Close />
        <Cascader
          className="custom-color"
          swipeable
          title="请选择地区"
          options={area}
          value={value}
          onSelect={setValue}
          onChange={(_values_, options) => {
            setOpen(false)
            setFieldValue(
              options.map(item => item.children).join("/")
            )
          }}
        >
        </Cascader>
      </Popup>
    </>
  )
}

type HeaderMode = "closeable" | "headerless"

function HeaderCascader() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<HeaderMode>("closeable")

  const show = (nextMode: HeaderMode) => {
    setMode(nextMode)
    setOpen(true)
  }

  return (
    <>
      <Field label="关闭按钮" isLink onClick={() => show("closeable")}>
        自定义图标
      </Field>
      <Field label="隐藏标题栏" isLink onClick={() => show("headerless")}>
        无标题栏
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <Cascader
          key={mode}
          options={area}
          title={mode === "closeable" ? "请选择地区" : undefined}
          showHeader={mode === "headerless" ? false : undefined}
          closeable={mode === "closeable"}
          closeIcon={<Close />}
          onClose={() => setOpen(false)}
          onChange={() => setOpen(false)}
        />
      </Popup>
    </>
  )
}

function DynamicCascader() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string[]>([])
  const [fieldValue, setFieldValue] = useState("")
  return (
    <>
      <Field label="选项值" isLink onClick={() => setOpen(true)}>
        <Input readonly placeholder="请选择" value={fieldValue} />
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <Popup.Close />
        <Cascader
          options={dynamic}
          loadData={(_values_) => {
            const len = _values_.length
            return new Promise((resolve) => {
              resolve(len > 3 ? [] : [
                { label: `动态${len}-1`, value: Math.random() },
                { label: `动态${len}-2`, value: Math.random() }
              ])
            })
          }}
          title="请选择"
          swipeable
          value={value}
          onSelect={setValue}
          onChange={(_values_, options) => {
            setOpen(false)
            setFieldValue(
              options.map(item => item.children).join("/")
            )
          }}
        />
      </Popup>
    </>
  )
}

function CustomRenderCascader() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string[]>([])
  const [fieldValue, setFieldValue] = useState("")

  return (
    <>
      <Field label="选项值" isLink onClick={() => setOpen(true)}>
        <Input readonly placeholder="请选择部门" value={fieldValue} />
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <Popup.Close />
        <Cascader
          options={customRenderOptions}
          title="请选择部门"
          value={value}
          renderOptionsTop={({ options, tabIndex }) => (
            <View className="level-tip">
              第 {tabIndex + 1} 级，共 {options.length} 项
            </View>
          )}
          renderOption={({ option, selected }) => (
            <View
              className={[
                "custom-option",
                selected && "custom-option--active",
                option.disabled && "custom-option--disabled",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <View className="custom-option__title">
                {option.label}
                {option.badge && (
                  <Tag color="primary" shape="rounded">
                    {option.badge}
                  </Tag>
                )}
              </View>
              {option.brief && <View className="custom-option__brief">{option.brief}</View>}
            </View>
          )}
          renderOptionsBottom={({ options }) =>
            options.some((option) => option.disabled) ? (
              <View className="options-footer">灰色选项暂不可用</View>
            ) : null
          }
          onSelect={setValue}
          onChange={(_values_, options) => {
            setOpen(false)
            setFieldValue(options.map((item) => item.children).join("/"))
          }}
        />
      </Popup>
    </>
  )
}

function AutoScrollCascader() {
  const [open, setOpen] = useState(false)
  const [fieldValue, setFieldValue] = useState("研发中心/产线1/产品11")

  return (
    <>
      <Field label="选项值" isLink onClick={() => setOpen(true)}>
        <Input readonly value={fieldValue} />
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <Popup.Close />
        <Cascader
          options={dept}
          title="请选择部门"
          defaultValue={["1", "1-1", "1-1-13"]}
          autoScrollToSelected
          onChange={(_values_, options) => {
            setOpen(false)
            setFieldValue(options.map((item) => item.children).join("/"))
          }}
        />
      </Popup>
    </>
  )
}

const fieldNames = {
  label: "name",
  value: "code",
  children: "data"
}
function CustomFieldCascader() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string[]>([])
  const [fieldValue, setFieldValue] = useState("")
  return (
    <>
      <Field label="选项值" isLink onClick={() => setOpen(true)}>
        <Input readonly placeholder="请选择地区" value={fieldValue} />
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <Popup.Close />
        <Cascader
          options={customArea}
          fieldNames={fieldNames}
          value={value}
          title="请选择地区"
          placeholder="请选择"
          onSelect={setValue}
          onChange={(_values_, options) => {
            setOpen(false)
            setFieldValue(
              options.map(item => item.children).join("/")
            )
          }}
        />
      </Popup>
    </>
  )
}

export default function CascaderDemo() {
  return (
    <Page title="Cascader 级联选择" className="cascader-demo">
      <Block variant="card" title="基础用法">
        <BasicCascader />
      </Block>
      <Block variant="card" title="自定义颜色">
        <CustomColorCascader />
      </Block>
      <Block variant="card" title="标题栏与关闭按钮">
        <HeaderCascader />
      </Block>
      <Block variant="card" title="异步加载选项">
        <DynamicCascader />
      </Block>
      <Block variant="card" title="自定义选项内容">
        <CustomRenderCascader />
      </Block>
      <Block variant="card" title="自动定位选中项">
        <AutoScrollCascader />
      </Block>
      <Block variant="card" title="自定义字段名">
        <CustomFieldCascader />
      </Block>
    </Page>
  )
}
