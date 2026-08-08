# Field 输入框

### 介绍

用户可以在文本框内输入或编辑文字。

### 引入

```tsx
import { Field } from "@taroify/core"
```

## 代码演示

### 基础用法

可以通过 `value` 设置输入框的值，通过 `placeholder` 设置占位提示文字，通过 `onChange` 事件获得改变的值。

```tsx
import { Cell, Field, Input } from "@taroify/core"

function BasicField() {
  const [value, setValue] = useState("")
  return (
    <Cell.Group inset>
      <Field label="文本">
        <Input placeholder="请输入文本" value={value} onChange={(e) => setValue(e.detail.value)} />
      </Field>
    </Cell.Group>
  )
}
```

### 自定义类型

根据 `type` 属性定义不同类型的输入框，默认值为 `text`。

```tsx
import { Cell, Field, Input } from "@taroify/core"

function CustomField() {
  const [text, setText] = useState("")
  const [idcard, setIdcard] = useState("")
  const [number, setNumber] = useState("")
  const [digit, setDigit] = useState("")
  const [password, setPassword] = useState("")
  return (
    <Cell.Group inset>
      <Field label="文本">
        <Input placeholder="请输入文本" value={text} onChange={(e) => setText(e.detail.value)} />
      </Field>
      <Field label="身份证号">
        <Input
          type="idcard"
          placeholder="请输入身份证号"
          value={idcard}
          onChange={(e) => setIdcard(e.detail.value)}
        />
      </Field>
      <Field label="整数">
        <Input
          type="number"
          placeholder="请输入整数"
          value={number}
          onChange={(e) => setNumber(e.detail.value)}
        />
      </Field>
      <Field label="数字">
        <Input
          type="digit"
          placeholder="请输入数字（支持小数）"
          value={digit}
          onChange={(e) => setDigit(e.detail.value)}
        />
      </Field>
      <Field label="密码">
        <Input
          password
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.detail.value)}
        />
      </Field>
    </Cell.Group>
  )
}
```

### 限制数值范围 <Tag tag="v1.0.5" />

对于 `number` 和 `digit` 类型，可以通过 `min` 和 `max` 设置允许输入的数值范围。输入值超出范围时，会在输入框失焦后自动调整为最接近的边界值。

```tsx
import { Cell, Field, Input } from "@taroify/core"

function RangeField() {
  const [value, setValue] = useState("50")

  return (
    <Cell.Group inset>
      <Field label="数量">
        <Input
          type="number"
          min={1}
          max={100}
          value={value}
          placeholder="请输入 1 至 100"
          onChange={(event) => setValue(event.detail.value)}
        />
      </Field>
    </Cell.Group>
  )
}
```

`min` 和 `max` 会自动调整输入值。如果需要保留用户输入并显示错误提示，请使用 Form 的 `rules.validator` 进行校验。

### 禁用输入框

通过 `readonly` 将输入框设置为只读状态，通过 `disabled` 将输入框设置为禁用状态。

```tsx
import { Cell, Field, Input } from "@taroify/core"

function DisabledField() {
  return (
    <Cell.Group inset>
      <Field label="文本">
        <Input placeholder="输入框只读" readonly />
      </Field>
      <Field label="文本">
        <Input placeholder="输入框已禁用" disabled />
      </Field>
    </Cell.Group>
  )
}
```

### 显示图标

通过 `icon` 和 `rightIcon` 配置输入框两侧的图标，通过设置 `clearable` 在输入过程中展示清除图标。

```tsx
import { Cell, Field, Input } from "@taroify/core"

function IconField() {
  return (
    <Cell.Group inset>
      <Field label="文本" icon={<SmileOutlined />} rightIcon={<WarningOutlined />}>
        <Input placeholder="显示图标" />
      </Field>
      <Field label="文本" icon={<MusicOutlined />}>
        <Input placeholder="显示清除图标" clearable />
      </Field>
    </Cell.Group>
  )
}
```

### 错误提示

设置 `required` 属性可以显示必填星号，可以配合 `Input` 或 `Field.Feedback` 组件显示对应的错误提示。

```tsx
import { Cell, Field, Input } from "@taroify/core"

function ErrorField() {
  return (
    <Cell.Group inset>
      <Field label="用户名" required>
        <Input placeholder="请输入用户名" color="danger" />
      </Field>
      <Field
        required
        label="手机号"
        feedback={<Field.Feedback status="invalid">手机号格式错误</Field.Feedback>}
      >
        <Input placeholder="请输入手机号" />
      </Field>
    </Cell.Group>
  )
}
```

`required` 只控制必填星号的显示，实际校验需要通过 `rules.required` 配置。

### 自动显示必填星号 <Tag tag="v1.0.5" />

在 Form 上设置 `required="auto"` 后，Field 会根据 `rules` 中的 `required` 规则自动决定是否显示必填星号，避免重复配置。

```tsx
import { Cell, Field, Form, Input } from "@taroify/core"

function RequiredAutoField() {
  return (
    <Form required="auto">
      <Cell.Group inset>
        <Field label="用户名" name="username" rules={[{ required: true }]}>
          <Input placeholder="自动显示必填星号" />
        </Field>
        <Field label="昵称" name="nickname" rules={[{ required: false }]}>
          <Input placeholder="非必填项不显示星号" />
        </Field>
      </Cell.Group>
    </Form>
  )
}
```

也可以在单个 Field 上设置 `required="auto"`。Field 上显式设置的 `required` 优先于 Form 的配置。

### 插入按钮

通过 `Button` 可以在输入框尾部插入按钮。

```tsx
import { Cell, Field, Input } from "@taroify/core"

function ButtonField() {
  return (
    <Cell.Group inset>
      <Field align="center" label="短信验证码">
        <Input placeholder="请输入短信验证码" />
        <Button size="small" color="primary">
          发送验证码
        </Button>
      </Field>
    </Cell.Group>
  )
}
```

### 格式化输入内容 <Tag tag="v1.0.5" />

通过 `formatter` 可以格式化 Input 或 Textarea 的输入内容，`formatTrigger` 用于指定格式化时机，默认在输入内容变化时执行。

```tsx
import { Cell, Field, Input } from "@taroify/core"

function FormatterField() {
  const [changeValue, setChangeValue] = useState("")
  const [blurValue, setBlurValue] = useState("")
  const formatter = (value: string) => value.replace(/\d/g, "")

  return (
    <Cell.Group inset>
      <Field label="实时格式化">
        <Input
          value={changeValue}
          formatter={formatter}
          placeholder="输入内容中的数字会被过滤"
          onChange={(event) => setChangeValue(event.detail.value)}
        />
      </Field>
      <Field label="失焦格式化">
        <Input
          value={blurValue}
          formatter={formatter}
          formatTrigger="onBlur"
          placeholder="失焦后过滤数字"
          onChange={(event) => setBlurValue(event.detail.value)}
        />
      </Field>
    </Cell.Group>
  )
}
```

Input/Textarea 的 `formatter` 会改变实际输入值；Form 校验规则中的 `formatter` 仅格式化参与校验的值，两者用途不同。

### 高度自适应

对于 Textarea 组件，可以通过 `autoHeight` 属性设置高度自适应。

```tsx
import { Cell, Field, Textarea } from "@taroify/core"
import { getEnv } from "@tarojs/taro"
const env = getEnv();
function FieldWithTextarea() {
  return (
    <Cell.Group inset style={{ "--textarea-line-height": env === "WEB" ? "1.2rem" : "1" }}>
      <Field align="start" label="留言">
        <Textarea autoHeight placeholder="请输入留言" />
      </Field>
    </Cell.Group>
  )
}
```
>Tips: 微信placeholder不支持line-height

### 显示字数统计

设置 `limit` 属性后会在底部显示字数统计。

```tsx
import { Cell, Field, Textarea } from "@taroify/core"
import { getEnv } from "@tarojs/taro"
const env = getEnv();
function FieldWithTextareaLimit() {
  return (
    <Cell.Group inset style={{ "--textarea-line-height": env === "WEB" ? "1.2rem" : "1" }}>
      <Field align="start" label="留言">
        <Textarea style={{ height: "48px" }} limit={50} placeholder="请输入留言" />
      </Field>
    </Cell.Group>
  )
}
```

### 输入框内容对齐

通过 Input 组件的 `align` 属性可以设置输入框内容的对齐方式，可选值为 `center`、`right`。

```tsx
import { Cell, Field, Input } from "@taroify/core"

function FieldWithInputAlign() {
  return (
    <Cell.Group inset>
      <Field label="文本">
        <Input align="left" placeholder="输入框内容左对齐" />
      </Field>
      <Field label="文本">
        <Input align="center" placeholder="输入框内容居中对齐" />
      </Field>
      <Field label="文本">
        <Input align="right" placeholder="输入框内容右对齐" />
      </Field>
    </Cell.Group>
  )
}
```

### 顶部标签 <Tag tag="v1.0.5" />

通过 Form 的 `labelAlign="top"` 可以让标签显示在输入控件上方，适合 Textarea、长标签和窄屏表单。

```tsx
import { Cell, Field, Form, Textarea } from "@taroify/core"

function FieldWithTopLabel() {
  return (
    <Form labelAlign="top">
      <Cell.Group inset>
        <Field label="留言">
          <Textarea style={{ height: "48px" }} placeholder="请输入留言" />
        </Field>
      </Cell.Group>
    </Form>
  )
}
```

单个 Field 也可以通过 `label={{ children: "留言", align: "top" }}` 设置顶部标签。


### 标签（Field.Label）和反馈（Field.Feedback）

使用 `label` 和 `feedback` 属性的对象或元素表示法，提供全部属性。

```tsx
import { Cell, Field, Input } from "@taroify/core"

function FieldWithVaraintLabel() {
  return (
    <Cell.Group inset>
      <Field label="文本">
        <Input placeholder="请输入文本" />
      </Field>
      <Field label={{ children: "文本" }}>
        <Input placeholder="请输入文本" />
      </Field>
      <Field label={<Field.Label>文本</Field.Label>}>
        <Input placeholder="请输入文本" />
      </Field>
    </Cell.Group>
  )
}
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 左侧文本 | _string \| [FormLabelProps](/components/form/#formlabel-props) \| ReactElement_ | - |
| feedback | 提示文案，为空时不展示 | _string \| [FormFeedbackProps](/components/form/#formfeedback-props) \| ReactElement_ | - |

> 属性继承自 Form.Item 组件，但不支持 `noStyle` 和 `shouldUpdate`。更多属性参见：[Form.Item 组件](/components/form/#formitem-props)

### Input Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| align | 输入内容对齐方式，可选值为 `left` `center` `right` | _string_ | - |
| readonly | 是否只读 | _boolean_ | `false` |
| clearable | 是否显示清除图标 | _boolean_ | `false` |
| clearIcon | 自定义清除图标 | _ReactNode_ | `Clear` |
| clearTrigger | 清除图标显示时机，可选值为 `focus` `always` | _string_ | `focus` |
| formatter <Tag tag="v1.0.5" /> | 输入内容格式化函数 | _(value: string) => string_ | - |
| formatTrigger <Tag tag="v1.0.5" /> | 格式化触发时机，可选值为 `onChange` `onBlur` | _string_ | `onChange` |
| min <Tag tag="v1.0.5" /> | `number` 或 `digit` 类型允许的最小值，失焦时生效 | _number_ | - |
| max <Tag tag="v1.0.5" /> | `number` 或 `digit` 类型允许的最大值，失焦时生效 | _number_ | - |

> 其他属性继承自 Taro Input 组件。不同小程序平台支持的原生属性可能不同，请以对应 Taro 版本的 Input 文档为准。

### Textarea Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| limit | 是否显示字数统计，传入数字时同时限制最大长度 | _boolean \| number_ | `false` |
| readonly | 是否只读 | _boolean_ | `false` |
| formatter <Tag tag="v1.0.5" /> | 输入内容格式化函数 | _(value: string) => string_ | - |
| formatTrigger <Tag tag="v1.0.5" /> | 格式化触发时机，可选值为 `onChange` `onBlur` | _string_ | `onChange` |

> 其他属性继承自 Taro Textarea 组件。
