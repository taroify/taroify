# Signature 签名

### 介绍

用于签名场景的组件，基于 Canvas 实现。

请升级 `taroify` 到 >= `v0.1.1-alpha.2` 版本来使用该组件。

### 引入

```ts
import { Signature } from "@taroify/core"
```

## 代码演示

### 基础用法

默认只显示画布。传入 `showToolbar` 显示清空、撤销和确认按钮。点击确认后，`onSubmit` 收到签名图片和 Canvas 节点。

```tsx
import { Signature } from "@taroify/core"
import { Image } from "@tarojs/components"
import { useState } from "react"

function BasicSignature() {
  const [image, setImage] = useState("")
  return (
    <>
      <Signature
        showToolbar
        onSubmit={(result) => setImage(result.image)}
        onClear={() => setImage("")}
      />
      {image && <Image src={image} mode="widthFix" />}
    </>
  )
}
```

### 自定义操作及重绘

通过实例方法连接自己的按钮。弹层打开、横竖屏切换或容器尺寸变化后，可调用 `await ref.current?.resize()` 重新测量画布。笔迹以左上角为原点等比缩放，重绘后仍可撤销。

```tsx
import { Button, Signature, type SignatureInstance } from "@taroify/core"
import { useRef } from "react"

function CustomSignature() {
  const ref = useRef<SignatureInstance>(null)
  return (
    <>
      <Signature ref={ref} historySize={5} />
      <Button onClick={() => ref.current?.undo()}>撤销上一笔</Button>
    </>
  )
}
```

### 自定义颜色

通过 `penColor` 来自定义笔触颜色。

```tsx
<Signature penColor="#ff0000" />
```

### 自定义线宽

通过 `lineWidth` 来自定义线条宽度。

```tsx
<Signature lineWidth={6} />
```

### 自定义背景颜色

通过 `backgroundColor` 来自定义背景颜色。

```tsx
<Signature backgroundColor="#eee" />
```

## API

### Signature Props

| 参数            | 说明               | 类型     | 默认值           |
| --------------- | ------------------ | -------- | ---------------- |
| type            | 导出图片类型       | _string_ | `png`            |
| penColor        | 笔触颜色，默认黑色 | _string_ | `#000`           |
| lineWidth       | 线条宽度           | _number_ | `3`              |
| backgroundColor | 背景颜色           | _string_ | -                |
| canvasId        | 画布节点 ID | _string_ | 自动生成 |
| historySize     | 最多可撤销的笔数，超过上限的笔迹仍保留。设为 0 可关闭撤销 | _number_ | `20` |
| showToolbar     | 显示画布下方的操作栏 | _boolean_ | `false` |
| clearButtonText | 清空按钮文案 | _string_ | `清空` |
| undoButtonText  | 撤销按钮文案 | _string_ | `撤销` |
| confirmButtonText | 确认按钮文案 | _string_ | `确认` |
| tips | 画布初始化重试失败后显示的内容 | _ReactNode_ | `当前环境不支持签名` |

### Signature Events

| 事件名    | 说明           | 回调参数 |
| --------- | -------------- | -------- |
| onStart   | 开始签名时触发 | -        |
| onEnd     | 结束签名时触发 | -        |
| onSigning | 绘制笔迹时触发 | _event: CanvasTouchEvent_ |
| onSubmit | 点击确认或调用 `submit()` 时触发 | _result: SignatureResult_ |
| onClear | 点击清空或调用 `clear()` 时触发 | - |

### Signature 实例方法

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| getImage | 同步读取当前签名 | _SignatureResult_ |
| submit | 画布就绪后，读取当前签名并触发 `onSubmit` | _void_ |
| clear | 清空所有笔迹与撤销记录，恢复画布背景 | _void_ |
| undo | 撤销最近一笔，到达历史上限后再次调用会保留现有笔迹 | _void_ |
| resize | 重新测量并重绘，容器宽高为零时保留原画布 | _Promise&lt;void&gt;_ |

`SignatureResult` 包含 `image` 和 `canvas`。有笔迹时，`image` 为图片的 base64 数据 URL，签名为空时为 `""`。画布尚未就绪时，`getImage()` 返回 `{ image: "", canvas: null }`。

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称                           | 默认值                      | 描述         |
| ------------------------------ | --------------------------- | ------------ |
| --signature-padding            | _var(--van-padding-xs)_     | -            |
| --signature-content-height     | _200px_                     | 画布高度     |
| --signature-content-background | _var(--background-color-2)_ | 画布背景色   |
| --signature-content-border     | _1px dotted #dadada_        | 画布边框样式 |
| --signature-border-radius      | _8px_                       | 画布圆角     |
