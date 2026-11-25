# Search 搜索

### 介绍

用于搜索场景的输入框组件。

### 引入

```tsx
import { Search } from "@taroify/core"
```

## 代码演示

### 基础用法

`value` 用于控制搜索框中的文字，`onChange` 可以获得改变的值。

```tsx
function BasicSearch() {
  const [value, setValue] = useState("")
  return (
    <Search
      value={value}
      placeholder="请输入搜索关键词"
      onChange={(e) => setValue(e.detail.value)}
    />
  )
}
```

### 事件监听

Search 组件提供了 `onSearch` 和 `onCancel` 事件，`onSearch` 事件在点击键盘上的搜索/回车按钮后触发，`onCancel` 事件在点击搜索框右侧取消按钮时触发。

```tsx
function SearchWithEvents() {
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <>
      <Toast open={open} onClose={() => setOpen(false)}>
        取消
      </Toast>
      <Search
        value={value}
        placeholder="请输入搜索关键词"
        action
        onChange={(e) => setValue(e.detail.value)}
        onSearch={(e) => console.log(e.detail.value)}
        onCancel={() => setOpen(true)}
      />
    </>
  )
}
```

### 搜索框内容对齐

通过 `inputAlign` 属性设置搜索框内容的对齐方式，可选值为 `center`、`right`。

```tsx
function InputCenterSearch() {
  const [value, setValue] = useState("")
  return (
    <Search
      value={value}
      placeholder="请输入搜索关键词"
      inputAlign="center"
      onChange={(e) => setValue(e.detail.value)}
    />
  )
}
```

### 禁用搜索框

通过 `disabled` 属性禁用搜索框。

```tsx
<Search disabled placeholder="请输入搜索关键词" />
```

### 自定义背景色

通过 `className` 属性可以设置搜索框外部的背景色，通过 `shape="rounded"` 属性设置搜索框的形状。

```tsx
<Search className="background" shape="rounded" disabled placeholder="请输入搜索关键词" />
```

```scss
.background {
  --search-background-color: #4fc08d;
}
```

### 自定义按钮

设置 `action` 为 `true` 时，使用 `actionText` 自定义取消文案。启用 `clearOnCancel` 后，可编辑的输入框会在触发 `onCancel` 前通过 `onChange` 通知清空，受控用法需在 `onChange` 中更新 `value`。

将自定义内容传给 `action` 时，由自定义内容处理点击事件。

```tsx
function CustomSearch() {
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)
  return (
    <>
      <Toast open={open} onClose={() => setOpen(false)}>
        搜索
      </Toast>
      <Search
        value={value}
        label="地址"
        placeholder="请输入搜索关键词"
        action={<View onClick={() => setOpen(true)}>搜索</View>}
        onChange={(e) => setValue(e.detail.value)}
      />
    </>
  )
}
```

### 格式化输入与关联标签

设置 `formatter` 转换输入内容，设置 `formatTrigger="onBlur"` 可在失焦时转换。H5 上同时设置 `label` 和 `inputId`，点击标签即可聚焦内部输入框。

```tsx
<Search
  id="product-search"
  inputId="product-code"
  label="商品编号"
  name="code"
  autoComplete="off"
  formatter={(value) => value.trim().toUpperCase()}
  formatTrigger="onBlur"
/>
```

## API

### Props

| 参数                              | 说明                                                                                          | 类型                                                                                  | 默认值       |
| --------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------ |
| label | 搜索框内左侧标签，H5 设置 `inputId` 时关联输入框 | _ReactNode_ | - |
| left | 搜索框外左侧内容 | _ReactNode_ | - |
| id | 外层容器的 ID | _string_ | - |
| inputId | 内部输入框的 ID | _string_ | - |
| name | 原生输入框的表单字段名 | _string_ | - |
| autoComplete | 原生输入框的自动完成设置，仅 H5 | _string_ | - |
| shape                             | 搜索框形状，可选值为 `square` `rounded`                                                       | _string_                                                                              | -            |
| maxlength                         | 输入的最大字符数                                                                              | _number \| string_                                                                    | -            |
| placeholder                       | 占位提示文字                                                                                  | _string_                                                                              | -            |
| autoFocus                         | 自动聚焦，iOS 系统不支持该属性                                                                | _boolean_                                                                             | `false`      |
| focus                             | 获取焦点                                                                                      | _boolean_                                                                             | `false`      |
| disabled                          | 是否禁用输入框                                                                                | _boolean_                                                                             | `false`      |
| readonly | 是否只读，只读时禁止编辑和清空 | _boolean_ | `false` |
| icon                              | 输入框左侧图标                                                                                | _ReactNode_                                                                           | `<Search />` |
| rightIcon                         | 输入框右侧图标                                                                                | _ReactNode_                                                                           | -            |
| action                            | 是否在搜索框右侧显示取消按钮                                                                  | _boolean \| ReactNode_                                                                | `false`      |
| actionText | 默认取消按钮的文案，`action` 为 `true` 时生效 | _string_ | `取消` |
| clearOnCancel | 点击默认取消按钮时是否清空可编辑的输入框 | _boolean_ | `false` |
| inputAlign                        | 输入框内容对齐方式，可选值为 `center` `right`                                                 | _string_                                                                              | `left`       |
| inputColor                        | 输入框内容颜色，可选值为 `primary` `info` `success` `warning` `danger`                        | _string_                                                                              | -            |
| clearable                         | 是否启用清除图标，点击清除图标后会清空输入框                                                  | _boolean_                                                                             | `true`       |
| clearIcon                         | 清除图标                                                                                      | _string_                                                                              | `<Clear />`  |
| clearTrigger                      | 显示清除图标的时机，`always` 表示输入框不为空时展示，<br>`focus` 表示输入框聚焦且不为空时展示 | _string_                                                                              | `focus`      |
| formatter | 输入内容格式化函数 | _(value: string) => string_ | - |
| formatTrigger | 格式化时机，可选值为 `onChange`、`onBlur` | _string_ | `onChange` |
| feedback                          | 提示文案，为空时不展示                                                                        | _string \| [FormFeedbackProps](/components/form/#formfeedback-props) \| ReactElement_ | -            |
| enableNative | 使用原生键盘（仅支付宝小程序）                                                                | _boolean_                                                                             | `true`       |

### Events

| 事件名   | 说明                 | 回调参数                                                 |
| -------- | -------------------- | -------------------------------------------------------- |
| onSearch | 确定搜索时触发       | _event: BaseEventOrig<InputProps.inputValueEventDetail>_ |
| onChange | 输入框内容变化时触发 | _event: BaseEventOrig<InputProps.inputEventDetail>_      |
| onFocus  | 输入框获得焦点时触发 | _event: BaseEventOrig<InputProps.inputForceEventDetail>_ |
| onBlur | 输入框失去焦点时触发 | _event: BaseEventOrig<InputProps.inputValueEventDetail>_ |
| onClear | 点击清除按钮后触发 | _event: ITouchEvent_ |
| onCancel | 点击取消按钮时触发 | _event: ITouchEvent_ |
| onClickInput | 点击输入区域时触发 | _event: ITouchEvent_ |
| onClickLeftIcon | 点击左侧图标时触发 | _event: ITouchEvent_ |
| onClickRightIcon | 点击右侧图标时触发 | _event: ITouchEvent_ |

### 实例方法

通过 `ref` 调用 `focus()` 和 `blur()`。在小程序中，传入 `focus` 属性时由该属性控制焦点。

```tsx
import { Search, type SearchInstance } from "@taroify/core"
import { useRef } from "react"

function FocusableSearch() {
  const searchRef = useRef<SearchInstance>(null)
  return <Search ref={searchRef} onSearch={() => searchRef.current?.blur()} />
}
```

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称                                    | 默认值                                    | 描述 |
| --------------------------------------- | ----------------------------------------- | ---- |
| --search-padding                        | _10px \* $hd var(--padding-sm)_           | -    |
| --search-background-color               | _var(--white)_                            | -    |
| --search-content-padding-left           | _var(--padding-sm)_                       | -    |
| --search-content-background-color       | _var(--gray-1)_                           | -    |
| --search-content-border-radius          | _var(--border-radius-sm)_                 | -    |
| --search-content-square-border-radius   | _0_                                       | -    |
| --search-content-rounded-border-radius  | _var(--border-radius-max)_                | -    |
| --search-input-height                   | _34px \* $hd_                             | -    |
| --search-label-padding                  | _0 5px \* $hd_                            | -    |
| --search-label-color                    | _var(--text-color)_                       | -    |
| --search-label-font-size                | _var(--font-size-md)_                     | -    |
| --search-label-line-height              | _var(--search-input-height)_              | -    |
| --search-field-padding                  | _5px * $hd var(--padding-xs) 5px * $hd 0_ | -    |
| --search-left-icon-color                | _var(--gray-6)_                           | -    |
| --search-action-padding                 | _0 var(--padding-xs)_                     | -    |
| --search-action-color                   | _var(--text-color)_                       | -    |
| --search-action-line-height             | _var(--search-input-height)_              | -    |
| --search-action-font-size               | _var(--font-size-md)_                     | -    |
| --search-action-active-background-color | _var(--active-color)_                     | -    |
