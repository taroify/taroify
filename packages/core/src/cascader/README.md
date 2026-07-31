# Cascader 级联选择

### 介绍

级联选择框，用于多层级数据的选择，典型场景为省市区选择。

### 引入

```tsx
import { Cascader } from "@taroify/core"
```

## 代码演示

### 基础用法

级联选择组件可以搭配 Field 和 Popup 组件使用，示例如下：

```tsx
import { Cascader, Field, Popup } from "@taroify/core"
import { ArrowRight } from "@taroify/icons"
import { useState } from "react"

const dept = [
  {
    label: "研发中心",
    value: "1",
    children: [
      {
        label: "产线1",
        value: "1-1",
        children: [
          {
            label: "研发",
            value: "1-1-1",
          },
          {
            label: "测试",
            value: "1-1-2",
          },
          {
            label: "产品",
            value: "1-1-3",
          },
        ],
      },
      {
        label: "产线2",
        value: "1-2",
      },
    ],
  },
  {
    label: "客户中心",
    value: "2",
    children: [
      {
        label: "客服",
        value: "2-1",
      },
      {
        label: "销售",
        value: "2-2",
      },
    ],
  },
]

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
            setFieldValue(options.map((item) => item.children).join("/"))
          }}
        />
      </Popup>
    </>
  )
}
```

### 自定义颜色

通过 CSS 变量来设置选中状态的高亮颜色。

```tsx
<Cascader className="custom-color" />
```

```scss
.custom-color {
  --tabs-active-color: red;
  --cascader-active-color: red;
}
```

### 标题栏与关闭按钮 <Tag tag="v1.0.3" />

设置 `closeable` 后展示关闭按钮，点击时触发 `onClose`。通过 `closeIcon` 可以自定义关闭图标；通过
`showHeader={false}` 可以隐藏整个标题栏。

```tsx
import { Cross } from "@taroify/icons"

<Cascader
  title="请选择部门"
  closeable
  closeIcon={<Cross />}
  onClose={() => setOpen(false)}
/>

<Cascader options={dept} showHeader={false} />
```

### 异步加载选项

通过 loadData 返回下一级的选项，返回空数组[]时结束触发 onChange

```tsx
export const dynamic = [
  {
    label: "产品",
    value: "1",
  },
  {
    label: "测试",
    value: "2",
  },
  {
    label: "研发",
    value: "3",
  },
]

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
              resolve(
                len > 3
                  ? []
                  : [
                      { label: `动态${len}-1`, value: Math.random() },
                      { label: `动态${len}-2`, value: Math.random() },
                    ],
              )
            })
          }}
          title="请选择"
          swipeable
          value={value}
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
```

> Tips: 数据量大时，可关闭 animated，swipeable，避免卡顿

### 自定义选项内容 <Tag tag="v1.0.3" />

数据模式下可以通过 `renderOption` 自定义选项内容，通过 `renderOptionsTop` 和
`renderOptionsBottom` 在每一级选项的上方、下方插入内容。回调中的 `option` 和 `options`
均为传入的原始数据。

```tsx
import { View } from "@tarojs/components"

<Cascader
  options={dept}
  renderOption={({ option, selected, tabIndex }) => (
    <View className={selected ? "option-active" : undefined}>
      {tabIndex + 1}. {option.label}
    </View>
  )}
  renderOptionsTop={({ options, tabIndex }) => (
    <View className="level-tip">
      第 {tabIndex + 1} 级，共 {options.length} 项
    </View>
  )}
  renderOptionsBottom={({ tabIndex }) => (
    <View className="level-tip">已展示第 {tabIndex + 1} 级全部选项</View>
  )}
/>
```

### 自动定位选中项 <Tag tag="v1.0.3" />

设置 `autoScrollToSelected` 后，切换标签时会自动将该级已选中的选项滚动到可视区域。该功能默认关闭，
不会改变已有页面的滚动行为。使用较长的同级选项列表可以直观看到定位效果。

```tsx
<Cascader
  options={dept}
  defaultValue={["1", "1-1", "1-1-1"]}
  autoScrollToSelected
/>
```

### 自定义字段名

```tsx
const fieldNames = {
  label: "name",
  value: "code",
  children: "data",
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
            setFieldValue(options.map((item) => item.children).join("/"))
          }}
        />
      </Popup>
    </>
  )
}
```

### 手动控制 DOM

可以通过 `Cascader.Header`, `Cascader.Tab`, `Cascader.Option`，配合 `useCascader` 自己控制 DOM

```tsx
import { Cascader, Field, Popup } from "@taroify/core"
import { ArrowRight } from "@taroify/icons"
import { useState } from "react"
import { useCascader } from "@taroify/hooks"

function BasicCascader() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string[]>([])
  const [fieldValue, setFieldValue] = useState("")
  const { columns } = useCascader({ value, depth: 3, options: area })
  return (
    <>
      <Field label="选项值" isLink onClick={() => setOpen(true)}>
        <Input readonly placeholder="请选择地区" value={fieldValue} />
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <Popup.Close />
        <Cascader
          value={value}
          onSelect={setValue}
          onChange={(_values_, options) => {
            setOpen(false)
            setFieldValue(options.map((item) => item.children).join("/"))
          }}
        >
          <Cascader.Header>请选择所在地区</Cascader.Header>
          {columns.map((options, index) => (
            <Cascader.Tab key={index}>
              {options.map((option) => (
                <Cascader.Option key={option.value} value={option.value}>
                  {option.label}
                </Cascader.Option>
              ))}
            </Cascader.Tab>
          ))}
        </Cascader>
      </Popup>
    </>
  )
}
```

通过改变 selected.children，同样可以动态加载选项

```tsx
const onSelect = (_value) => {
  const level = _value.length - 1
  const selected = columns[level].find((item) => item.value === _value[level])
  if (selected && level < depth - 1) {
    selected.children = [
      { label: `动态${level}-1`, value: Math.random() },
      { label: `动态${level}-2`, value: Math.random() },
    ]
  }

  setValue(_value)
}
```

## API

### Cascader Props

| 参数                 | 说明                                                        | 类型                                                                   | 默认值                                                     |
| -------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| value                | 选中项的值                                                  | _string[]_                                                             | -                                                          |
| placeholder          | 未选中时的提示文案                                          | _ReactNode_                                                            | `请选择`                                                   |
| title                | 顶部标题                                                    | _ReactNode_                                                            | -                                                          |
| showHeader <Tag tag="v1.0.3" /> | 是否显示标题栏，未设置时根据标题、Header 或关闭按钮自动判断 | _boolean_                                                    | -                                                          |
| closeable <Tag tag="v1.0.3" /> | 是否显示关闭按钮                                  | _boolean_                                                              | `false`                                                    |
| closeIcon <Tag tag="v1.0.3" /> | 自定义关闭图标                                    | _ReactNode_                                                            | `<Cross />`                                                |
| swipeable            | 是否开启手势左右滑动切换                                    | _boolean_                                                              | `false`                                                    |
| animated             | 是否开启动过渡动画                                          | _boolean_                                                              | `true`                                                     |
| options              | 可选项数据源                                                | _CascaderDataOption[]_                                                 | `[]`                                                       |
| loadData             | 动态加载数据                                                | _(values: string[], options: CascaderEventOption[]) => Promise&lt;any[]&gt;_ | -                                                     |
| fieldNames           | 自定义 options 结构中的字段                                 | _CascaderFieldNames_                                                   | `{ label: 'label', value: 'value', children: 'children' }` |
| ellipsis             | 是否省略过长的标题文字                                      | _boolean_                                                              | `true`                                                     |
| autoScrollToSelected <Tag tag="v1.0.3" /> | 切换标签时是否自动定位该级选中项              | _boolean_                                                              | `false`                                                    |
| renderOption <Tag tag="v1.0.3" /> | 自定义数据模式下的选项内容                        | _(props: CascaderOptionRenderProps) => ReactNode_                      | -                                                          |
| renderOptionsTop <Tag tag="v1.0.3" /> | 自定义每级选项列表上方内容                    | _(props: CascaderOptionsRenderProps) => ReactNode_                     | -                                                          |
| renderOptionsBottom <Tag tag="v1.0.3" /> | 自定义每级选项列表下方内容                 | _(props: CascaderOptionsRenderProps) => ReactNode_                     | -                                                          |

### Cascader Events

| 事件       | 说明                   | 回调参数                                        |
| ---------- | ---------------------- | ----------------------------------------------- |
| onSelect   | 选中项变化时触发       | _values: any[], options: CascaderEventOption[]_ |
| onChange   | 全部选项选择完成后触发 | _values: any[], options: CascaderEventOption[]_ |
| onTabClick | 点击标签时触发         | _event: Tabs.TabEvent_                          |
| onClose <Tag tag="v1.0.3" /> | 点击关闭按钮时触发 | _event: ITouchEvent_                            |

### Cascader.Header Props

| 参数     | 说明     | 类型       | 默认值 |
| -------- | -------- | ---------- | ------ |
| children | 头部内容 | _ReactNoe_ | -      |

### Cascader.Tab Props

| 参数     | 说明       | 类型       | 默认值 |
| -------- | ---------- | ---------- | ------ |
| children | 子选项列表 | _ReactNoe_ | -      |

### Cascader.Option Props

| 参数     | 说明                 | 类型               | 默认值  |
| -------- | -------------------- | ------------------ | ------- |
| children | 选项内容（必填）     | _ReactNoe_         | -       |
| value    | 选项对应的值（必填） | _string \| number_ | -       |
| disabled | 是否禁用选项         | _boolean_          | `false` |

### 类型定义

通过`@taroify/core/cascader`导入类型

```tsx
import type {
  CascaderDataOption,
  CascaderEventOption,
  CascaderFieldNames,
  CascaderOptionRenderProps,
  CascaderOptionsRenderProps,
} from "@taroify/core/cascader"
```

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称                                      | 默认值                          | 描述 |
| ----------------------------------------- | ------------------------------- | ---- |
| --cascader-active-color                   | _var(--blue, $blue)_            | -    |
| --cascader-header-height                  | _48px \* $hd_                   | -    |
| --cascader-header-padding                 | _0 var(--padding-md)_           | -    |
| --cascader-header-font-size               | _var(--font-size-lg)_           | -    |
| --cascader-header-font-weight             | _var(--font-weight-bold)_       | -    |
| --cascader-header-line-height             | _20px \* $hd_                   | -    |
| --cascader-close-icon-size <Tag tag="v1.0.3" /> | _22px \* $hd_             | -    |
| --cascader-close-icon-color <Tag tag="v1.0.3" /> | _var(--gray-5)_           | -    |
| --cascader-tabs-height                    | _48px \* $hd_                   | -    |
| --cascader-tab-font-weight                | _var(--font-weight-bold)_       | -    |
| --cascader-tab-color                      | _var(--text-color)_             | -    |
| --cascader-inactive-tab-color             | _var(--gray-6)_                 | -    |
| --cascader-options-height                 | _384px \* $hd_                  | -    |
| --cascader-option-padding                 | _10px \* $hd var(--padding-md)_ | -    |
| --cascader-option-font-size               | _var(--font-size-md)_           | -    |
| --cascader-option-line-height             | _var(--line-height-md)_         | -    |
| --cascader-option-active-background-color | _var(--active-color)_           | -    |
| --cascader-disabled-option-color          | _var(--gray-5)_                 | -    |
| --cascader-active-option-color            | _var(--cascader-active-color)_  | -    |
| --cascader-active-option-font-weight      | _var(--font-weight-bold)_       | -    |
| --cascader-active-icon-font-size          | _18px \* $hd_                   | -    |
