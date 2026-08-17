# Picker 选择器

### 介绍

提供多个选项集合供用户选择，支持单列和多列选择，通常与[弹出层](/components/popup/)组件配合使用。

### 引入

```tsx
import { Picker } from "@taroify/core"
```

## 代码演示

### 基础用法

通过 `columns` 配置选项，`value` 可以是字符串或数字。

```tsx
const columns = [
  { label: "杭州", value: "Hangzhou" },
  { label: "宁波", value: "Ningbo" },
  { label: "温州", value: "Wenzhou" },
]

<Picker
  title="标题"
  columns={columns}
  onChange={(value) => Toast.open(`当前值：${value}`)}
  onConfirm={(value) => Toast.open(`当前值：${value}`)}
/>
```

### 默认选中项

通过 `defaultValue` 设置初始选中项；通过 `value` 可以受控使用。

```tsx
<Picker defaultValue="Wenzhou" title="标题" columns={columns} />
```

### 多列选择

`columns` 为二维数组时展示多列，值使用数组并按列对应。

```tsx
const columns = [
  [
    { label: "周一", value: "Monday" },
    { label: "周二", value: "Tuesday" },
    { label: "周三", value: "Wednesday" },
  ],
  [
    { label: "上午", value: "morning" },
    { label: "下午", value: "afternoon" },
    { label: "晚上", value: "evening" },
  ],
]

<Picker defaultValue={["Monday", "evening"]} title="标题" columns={columns} />
```

### 自定义 Columns 结构

通过 `columnsFieldNames` 指定选项标签和值对应的字段。

```tsx
const columns = [
  { cityName: "杭州", cityCode: 1 },
  { cityName: "宁波", cityCode: 2 },
]

<Picker
  columns={columns}
  columnsFieldNames={{ label: "cityName", value: "cityCode" }}
/>
```

### 禁用选项

通过 `disabled` 禁用选项，点击禁用项不会改变当前选择。

```tsx
<Picker
  columns={[
    { label: "杭州", value: "Hangzhou" },
    { label: "宁波", value: "Ningbo", disabled: true },
    { label: "温州", value: "Wenzhou" },
  ]}
/>
```

### 加载状态

异步获取数据时，可以通过 `loading` 显示加载提示。

```tsx
<Picker loading columns={[]} />
```

### 工具栏控制 <Tag tag="v1.1.0" />

通过 `showToolbar` 控制工具栏是否显示，通过 `toolbarPosition` 将工具栏放到选项区域底部。

```tsx
<Picker showToolbar={false} columns={columns} />
<Picker title="底部工具栏" toolbarPosition="bottom" columns={columns} />
```

### 空状态 <Tag tag="v1.1.0" />

当所有列都没有选项且不在加载状态时，可以通过 `empty` 或 `renderEmpty` 自定义空状态。两者同时设置时，`renderEmpty` 优先。

```tsx
<Picker columns={[]} empty="暂无可选项" />
<Picker columns={[]} renderEmpty={() => <View>暂无可选项</View>} />
```

### 选项区域内容 <Tag tag="v1.1.0" />

通过 `columnsTop` 和 `columnsBottom` 在滚轮选项区域的前后插入内容。

```tsx
<Picker
  columns={columns}
  columnsTop={<View>请选择城市</View>}
  columnsBottom={<View>选择结果将在确认后生效</View>}
/>
```

### 监听选项交互 <Tag tag="v1.1.0" />

`onClickOption` 在点击可用选项时触发，`onScrollInto` 在点击或拖拽使选项进入中间选择区域时触发。

```tsx
<Picker
  columns={columns}
  onClickOption={({ currentOption }) => {
    Toast.open(`点击了：${currentOption.label}`)
  }}
  onScrollInto={({ currentOption, columnIndex }) => {
    console.log(columnIndex, currentOption)
  }}
/>
```

### 搭配弹出层使用

Picker 通常用于辅助表单填写，可以搭配 Popup 和 Field 使用。

```tsx
function PickerPopup() {
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <>
      <Field label="城市" isLink onClick={() => setOpen(true)}>
        <Input readonly placeholder="选择城市" value={value} />
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <Popup.Backdrop />
        <Picker
          title="选择城市"
          columns={columns}
          onCancel={() => setOpen(false)}
          onConfirm={(values) => {
            setValue((values as string[])[0])
            setOpen(false)
          }}
        />
      </Popup>
    </>
  )
}
```

### 手动控制 DOM

通过 `Picker.Toolbar`、`Picker.Title`、`Picker.Button`、`Picker.Columns`、`Picker.Column` 和 `Picker.Option` 手动组织内容。

```tsx
<Picker>
  <Picker.Toolbar>
    <Picker.Button type="cancel">取消</Picker.Button>
    <Picker.Title>标题</Picker.Title>
    <Picker.Button type="confirm">确认</Picker.Button>
  </Picker.Toolbar>
  <Picker.Column>
    <Picker.Option value="Monday">周一</Picker.Option>
    <Picker.Option value="Tuesday">周二</Picker.Option>
  </Picker.Column>
</Picker>
```

## API

### Picker Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultValue <Tag tag="v1.1.0" /> | 默认选中的值，v1.1.0 起支持数字 | _string \| number \| Array&lt;string \| number&gt;_ | - |
| value <Tag tag="v1.1.0" /> | 选中的值，v1.1.0 起支持数字 | _string \| number \| Array&lt;string \| number&gt;_ | - |
| title | 顶部栏标题 | _ReactNode_ | - |
| confirmText | 确认按钮文字 | _ReactNode_ | `确认` |
| cancelText | 取消按钮文字 | _ReactNode_ | `取消` |
| columns | 配置每一列显示的数据 | _PickerOptionData[] \| PickerOptionData[][]_ | - |
| columnsFieldNames | 自定义 `columns` 中的标签和值字段 | _PickerFieldNames_ | `{ label: "label", value: "value" }` |
| loading | 是否显示加载状态 | _boolean_ | `false` |
| readonly | 是否为只读状态 | _boolean_ | `false` |
| siblingCount | 可见选项的相邻个数，总可见数量为该值的两倍 | _number_ | `3` |
| optionHeight | 选项高度，支持 `px`、`vw`、`vh`、`rem`、`rpx` | _number \| string_ | `44` |
| showToolbar <Tag tag="v1.1.0" /> | 是否显示工具栏 | _boolean_ | `true` |
| toolbarPosition <Tag tag="v1.1.0" /> | 工具栏位置，可选值为 `top`、`bottom` | _PickerToolbarPosition_ | `top` |
| swipeDuration <Tag tag="v1.1.0" /> | 快速滑动时惯性滚动的时长，单位毫秒 | _number \| string_ | `800` |
| empty <Tag tag="v1.1.0" /> | 空状态内容 | _ReactNode_ | - |
| renderEmpty <Tag tag="v1.1.0" /> | 空状态渲染函数，优先级高于 `empty` | _() => ReactNode_ | - |
| columnsTop <Tag tag="v1.1.0" /> | 选项区域上方内容 | _ReactNode_ | - |
| columnsBottom <Tag tag="v1.1.0" /> | 选项区域下方内容 | _ReactNode_ | - |

### Picker Events

单列 `onChange` 保持返回单个值；多列返回数组。为保持兼容，`onConfirm` 和 `onCancel` 的值参数保持数组形式。

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| onConfirm | 点击确认按钮时触发 | 选中值，选中选项 |
| onCancel | 点击取消按钮时触发 | 选中值，选中选项 |
| onChange | 选项改变时触发 | 选中值，当前选项，当前列 |
| onClickOption <Tag tag="v1.1.0" /> | 点击可用选项时触发 | _PickerClickOptionEventParams_ |
| onScrollInto <Tag tag="v1.1.0" /> | 选项进入中间选择区域时触发 | _PickerScrollIntoEventParams_ |

`PickerClickOptionEventParams` 包含 `currentOption`、`columnIndex`、`selectedValues`、`selectedOptions` 和 `selectedIndexes`；`PickerScrollIntoEventParams` 包含 `currentOption` 和 `columnIndex`。

### Picker.Toolbar Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 工具栏内容 | _ReactNode_ | - |

### Picker.Title Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 工具栏标题 | _ReactNode_ | - |

### Picker.Button Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 按钮内容 | _ReactNode_ | - |
| type | 按钮类型 | _"cancel" \| "confirm"_ | `cancel` |
| onClick | 点击按钮时触发 | _(event: ITouchEvent) => void_ | - |

### Picker.Column Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 一列选项 | _ReactNode_ | - |
| readonly | 是否只读 | _boolean_ | `false` |

### Picker.Option Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 自定义选项内容 | _ReactNode_ | - |
| value <Tag tag="v1.1.0" /> | 选项值，v1.1.0 起支持数字 | _string \| number_ | - |
| label | 选项内容 | _ReactNode_ | - |
| disabled | 是否禁用选项 | _boolean_ | `false` |

### 方法

通过 ref 可以获取 Picker 实例并调用下列方法。

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| confirm | 停止惯性滚动并触发 `onConfirm` | - | - |
| getSelectedOptions | 获取当前有效选项；空列和全部禁用列不会产生选项 | - | _PickerOptionObject[]_ |

### 类型定义 <Tag tag="v1.1.0" />

组件导出以下常用类型：

```tsx
import type {
  PickerBaseProps,
  PickerButtonProps,
  PickerCancelEventParams,
  PickerChangeEventParams,
  PickerClickOptionEventParams,
  PickerColumn,
  PickerColumnInstance,
  PickerColumnProps,
  PickerColumns,
  PickerColumnsProps,
  PickerConfirmEventParams,
  PickerFieldNames,
  PickerInstance,
  PickerOption,
  PickerOptionData,
  PickerOptionObject,
  PickerOptionProps,
  PickerProps,
  PickerScrollIntoEventParams,
  PickerSelectedState,
  PickerThemeVars,
  PickerTitleProps,
  PickerToolbarPosition,
  PickerToolbarProps,
  PickerValue,
} from "@taroify/core"
```

## 主题定制

### 样式变量

组件提供以下 CSS 变量，可以通过 [ConfigProvider](/components/config-provider/) 定制。

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --picker-background-color | _var(--background-color-2)_ | 背景颜色 |
| --picker-mask-color <Tag tag="v1.1.0" /> | _linear-gradient(...)_ | 选项区域遮罩，暗黑模式会自动切换 |
| --picker-toolbar-height | _44px \* $hd_ | 工具栏高度 |
| --picker-title-font-size | _var(--font-size-lg)_ | 标题字号 |
| --picker-title-line-height | _var(--line-height-md)_ | 标题行高 |
| --picker-action-padding | _0 var(--padding-md)_ | 操作按钮内边距 |
| --picker-action-font-size | _var(--font-size-md)_ | 操作按钮字号 |
| --picker-confirm-action-color | _var(--text-link-color)_ | 确认按钮颜色 |
| --picker-cancel-action-color | _var(--gray-6)_ | 取消按钮颜色 |
| --picker-option-color | _var(--text-color)_ | 选项颜色 |
| --picker-option-padding | _0 var(--padding-base)_ | 选项内边距 |
| --picker-option-font-size | _var(--font-size-lg)_ | 选项字号 |
| --picker-option-disabled-opacity | _0.3_ | 禁用选项透明度 |
| --picker-loading-icon-color | _var(--primary-color)_ | 加载图标颜色 |
| --picker-loading-mask-color | _rgba(255, 255, 255, 0.9)_ | 加载遮罩颜色 |
