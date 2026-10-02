---
title: PickerGroup 选择器组
description: 使用 Taroify PickerGroup 组合多个选择器，通过统一工具栏、标签切换和下一步按钮完成日期时间、日期范围与地区选择，支持受控标签和自定义工具栏。
---

# PickerGroup 选择器组

### 介绍

该组件从 `v1.1.0` 开始提供。

组合多个选择器，在一次交互中完成多个值的选择。支持 Picker、DatetimePicker、AreaPicker，以及内部使用 Picker 的自定义组件。

每个标签页对应一个选择器，`tabs` 与子组件按顺序一一对应。支持数组、Fragment 和条件渲染；动态增删时请同步更新 `tabs`，并为子组件提供稳定的 `key`。

### 引入

```tsx
import { PickerGroup } from "@taroify/core"
```

## 代码演示

### 选择日期时间

PickerGroup 统一渲染工具栏，并自动隐藏子选择器的工具栏（包括自定义工具栏）。将标题、确认、取消设置在组上，子组件的 `value`、`onChange`、`min`、`max` 等属性仍正常使用。

```tsx
import { DatetimePicker, PickerGroup, Toast } from "@taroify/core"
import { useState } from "react"

function Example() {
  const [date, setDate] = useState(new Date(2026, 9, 2))
  const [time, setTime] = useState(new Date(2026, 9, 2, 12, 30))

  return (
    <>
      <Toast id="toast" />
      <PickerGroup
        title="预约时间"
        tabs={["选择日期", "选择时间"]}
        onConfirm={([dateResult, timeResult]) => {
          Toast.open(
            `${dateResult.selectedValues.join("/")} ${timeResult.selectedValues.join(":")}`,
          )
        }}
        onCancel={() => Toast.open("取消选择")}
      >
        <DatetimePicker type="date" value={date} onChange={setDate} />
        <DatetimePicker type="hour-minute" value={time} onChange={setTime} />
      </PickerGroup>
    </>
  )
}
```

Taroify 的日期、时间选择由 DatetimePicker 提供：`date` 选择年月日，`hour-minute` 选择时分，`time` 选择时分秒。

### 下一步按钮

设置 `nextStepText` 后，非最后一个标签页显示“下一步”，点击切换到下一页；最后一页显示确认按钮。用户仍然可以直接点击标签切换。

```tsx
<PickerGroup title="预约时间" tabs={["选择日期", "选择时间"]} nextStepText="下一步">
  <DatetimePicker type="date" />
  <DatetimePicker type="hour-minute" />
</PickerGroup>
```

### 选择日期范围

放置两个日期选择器，并将开始日期作为结束日期的 `min`。范围约束由业务设置，PickerGroup 不自动建立子选择器之间的联动。

```tsx
import { DatetimePicker, PickerGroup } from "@taroify/core"
import { useState } from "react"

function Example() {
  const [start, setStart] = useState(new Date(2026, 9, 2))

  return (
    <PickerGroup title="日期范围" tabs={["开始日期", "结束日期"]}>
      <DatetimePicker type="date" value={start} onChange={setStart} />
      <DatetimePicker type="date" min={start} defaultValue={new Date(2026, 9, 3)} />
    </PickerGroup>
  )
}
```

### 选择时间范围

```tsx
<PickerGroup title="时间范围" tabs={["开始时间", "结束时间"]}>
  <DatetimePicker type="hour-minute" defaultValue={new Date(2026, 9, 2, 9)} />
  <DatetimePicker type="hour-minute" defaultValue={new Date(2026, 9, 2, 18)} />
</PickerGroup>
```

### 受控模式

默认由组件管理选中标签，可用 `defaultActiveTab` 设置初始索引。传入 `activeTab` 后为受控模式，需要在 `onActiveTabChange` 中更新索引，点击标签和下一步都会触发该回调。

```tsx
import { Button, DatetimePicker, PickerGroup } from "@taroify/core"
import { useState } from "react"

function Example() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <Button onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}>切换标签</Button>
      <PickerGroup
        tabs={["选择日期", "选择时间"]}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        nextStepText="下一步"
      >
        <DatetimePicker type="date" />
        <DatetimePicker type="hour-minute" />
      </PickerGroup>
    </>
  )
}
```

### 自定义工具栏

使用组合组件自定义工具栏，Button 的 `type` 决定触发确认或取消。自定义确认按钮的文字由业务控制；设置 `nextStepText` 时，其点击行为仍然遵循“下一步 / 确认”的规则。

```tsx
<PickerGroup tabs={["开始日期", "结束日期"]}>
  <PickerGroup.Toolbar>
    <PickerGroup.Button type="cancel">返回</PickerGroup.Button>
    <PickerGroup.Title>日期范围</PickerGroup.Title>
    <PickerGroup.Button type="confirm">提交</PickerGroup.Button>
  </PickerGroup.Toolbar>
  <DatetimePicker type="date" />
  <DatetimePicker type="date" />
</PickerGroup>
```

### 确认与取消

确认会先停止各子选择器的惯性滚动，再按标签顺序收集结果。即使尚未访问某个标签页，也会返回其当前选中项或默认选中项。建议使用组级 `onConfirm` 的参数读取最终结果，避免在滚动结束前读取业务状态。

每项结果包含底层 Picker 的 `selectedValues`、`selectedOptions`、`selectedIndexes`。DatetimePicker 在组级结果中返回各列的字符串值（如 `["2026", "10", "02"]`），其自身的 `onChange` 和 `onConfirm` 仍然使用 `Date`。组确认也会触发子选择器的 `onConfirm`，通常只需在组上处理提交。

取消仅触发组级 `onCancel`，不触发各子选择器的取消事件，也不自动回滚选中值或关闭 Popup。需要取消还原时，请由业务维护临时值，并在确认后保存。

## API

### PickerGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tabs | 标签标题，与选择器子组件顺序对应 | ReactNode[] | `[]` |
| title | 工具栏标题 | ReactNode | - |
| showToolbar | 是否显示组工具栏；子工具栏始终隐藏 | boolean | `true` |
| nextStepText | 下一步按钮文字，非空时启用分步选择 | ReactNode | - |
| confirmText | 确认按钮文字 | ReactNode | `确认` |
| cancelText | 取消按钮文字 | ReactNode | `取消` |
| defaultActiveTab | 初始选中标签的索引，从 0 开始 | number | `0` |
| activeTab | 当前选中标签的索引，受控模式 | number | - |

支持 View 的 `className`、`style` 等属性。

### PickerGroup Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| onConfirm | 点击确认时触发；下一步不会触发 | results: PickerGroupConfirmEventParams |
| onCancel | 点击取消时触发 | - |
| onActiveTabChange | 点击标签或下一步请求切换时触发 | activeTab: number |

### PickerGroupConfirmEventParams

类型为 `PickerSelectedState[]`，每项对应一个标签页，字段如下：

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| selectedValues | 当前选中的各列值 | PickerValue[] |
| selectedOptions | 当前选中的各列选项 | PickerOptionObject[] |
| selectedIndexes | 当前选中的各列选项索引 | number[] |

空选择器或全部禁用的选择器返回空数组字段。每个标签页应包含一个底层 Picker，缺少选择器的标签页也返回空结果。

### 类型定义

```tsx
import type {
  PickerGroupProps,
  PickerGroupConfirmEventParams,
  PickerGroupThemeVars,
} from "@taroify/core"
```

## 主题定制

### 样式变量

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --picker-group-background-color | `var(--background-color-2)` | 选择器组背景色 |

工具栏复用 Picker 的样式变量，标签页复用 Tabs 的样式变量。ConfigProvider 支持通过 `pickerGroupBackgroundColor` 设置选择器组背景色。
