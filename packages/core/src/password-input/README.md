# PasswordInput 密码输入框

### 介绍

带网格的输入框组件，可以用于输入密码、短信验证码等场景，通常与[数字键盘](/components/number-keyboard/)组件配合使用。

### 引入

```tsx
import { PasswordInput } from "@taroify/core";
```

## 代码演示

### 基础用法

搭配数字键盘组件来实现密码输入功能。

```tsx
function BasicPasswordInput() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("123")

  return (
    <>
      <PasswordInput focus value={value} onFocus={() => setOpen(true)} />
      <NumberKeyboard
        open={open}
        value={value}
        maxlength={6}
        onChange={setValue}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
```

### 自定义长度

通过 `length` 属性来设置密码长度。

```tsx
<PasswordInput length={6} value="123" />
```

### 格子间距

通过 `gutter` 属性来设置格子之间的间距。

```tsx
<PasswordInput gutter={10} value="123" />
```

### 明文展示

将 `mask` 设置为 `false` 可以明文展示输入的内容，适用于短信验证码等场景。

```tsx
<PasswordInput mask={false} value="123" />
```

### 提示信息

通过 `feedback` 属性设置提示信息，例如当输入六位时提示密码错误。

```tsx
<PasswordInput feedback="密码为 6 位数字" value="123" />
<PasswordInput feedback={{ color: "danger", children: "密码为 6 位数字" }} value="123" />
<PasswordInput feedback={<PasswordInput.Feedback color="danger" children="密码为 6 位数字" />} value="123" />
```

## API

### PasswordInput Props

| 参数       | 说明                                  | 类型           | 默认值                         |
|----------|-------------------------------------|--------------|-----------------------------|
| value    | 密码值                                 | _string_     | `''`                        |
| length   | 密码最大长度                              | _number \| string_                     | `6` |
| gutter   | 输入框格子之间的间距，如 `20px` `2em`，默认单位为`px` | _number \| string_                     | `0` |
| mask     | 是否隐藏密码内容                            | _boolean_    | `true`                      |
| focus    | 是否聚焦，聚焦时会显示光标                       | _boolean_    | `false`                     |
| feedback | 输入框下方文字提示           | _ReactText \| PasswordInputFeedbackProps \| ReactElement_ | - |

### PasswordInput Events

| 事件名     | 说明       | 回调参数 |
|---------|----------|------|
| onFocus | 输入框聚焦时触发 | -    |


### PasswordInput.Feedback Props

| 参数    | 说明                                                      | 类型       | 默认值 |
|-------|---------------------------------------------------------|----------|-----|
| color | 颜色，可选值为 `primary` `info` `success`  `warning`  `danger` | _string_ | -   |

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称                                       | 默认值                               | 描述  |
|------------------------------------------|-----------------------------------|-----|
| password-input-height                    | _50px * $hd_                      | -   |
| password-input-margin                    | _0 var(--padding-md)_             | -   |
| password-input-border-radius             | _6px * $hd_                       | -   |
| password-input-item-font-size            | _20px * $hd_                      | -   |
| password-input-item-background-color     | _var(--white)_                    | -   |
| password-input-mask-size                 | _10px * $hd_                      | -   |
| password-input-mask-width                | _var(--password-input-mask-size)_ | -   |
| password-input-mask-height               | _var(--password-input-mask-size)_ | -   |
| password-input-mask-color                | _var(--black)_                    | -   |
| password-input-cursor-color              | _var(--text-color)_               | -   |
| password-input-cursor-width              | _1px * $hd_                       | -   |
| password-input-cursor-height             | _40%_                             | -   |
| password-input-cursor-animation-duration | _1s_                              | -   |
| password-input-feedback-margin-top       | _var(--padding-md)_               | -   |
| password-input-feedback-font-size        | _var(--font-size-md)_             | -   |
| password-input-feedback-color            | _var(--gray-6)_                   | -   |
| password-input-feedback-primary-color    | _var(--primary-color)_            | -   |
| password-input-feedback-info-color       | _var(--info-color)_               | -   |
| password-input-feedback-success-color    | _var(--success-color)_            | -   |
| password-input-feedback-warning-color    | _var(--warning-color)_            | -   |
| password-input-feedback-danger-color     | _var(--danger-color)_             | -   |
