# Popup 弹出层

### 介绍

弹出层容器，用于展示弹窗、信息提示等内容，支持多个弹出层叠加展示。

### 引入

```tsx
import { Popup } from "@taroify/core"
```

## 代码演示

### 基础用法

通过 `open` 控制弹出层是否展示。

```tsx
const [open, setOpen] = useState(false)

<Popup open={open} onClose={setOpen}>
  内容
</Popup>
```

### 弹出位置

通过 `placement` 属性设置弹出位置，默认居中弹出，可以设置为 `top`、`bottom`、`left`、`right`。

```tsx
<Popup defaultOpen placement="top" style={{ height: "30%" }} />
```

### 关闭图标 <Tag tag="v1.0.2" />

设置 `closeable` 属性后，会在弹出层的右上角显示关闭图标。通过 `closeIcon` 自定义图标，通过 `closeIconPlacement` 设置图标位置。

```tsx
<Popup
  defaultOpen
  closeable
  closeIcon={<Close />}
  closeIconPlacement="bottom-right"
  placement="bottom"
  style={{ height: "30%" }}
/>
```

也可以使用 `Popup.Close` 自定义关闭图标。

```tsx
<Popup defaultOpen placement="bottom" style={{ height: "30%" }}>
  <Popup.Close>
    <Close />
  </Popup.Close>
</Popup>
```

### 遮罩层 <Tag tag="v1.0.2" />

通过 `backdrop` 隐藏遮罩层，或传入对象配置遮罩层属性。`closeOnClickBackdrop` 用于控制点击遮罩层时是否关闭弹出层。

```tsx
<Popup open backdrop={false} />

<Popup
  open
  backdrop={{
    style: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
  }}
  closeOnClickBackdrop={false}
/>
```

### 关闭前回调 <Tag tag="v1.0.2" />

通过 `beforeClose` 属性可以在关闭前执行同步或异步逻辑，返回 `true` 时关闭，返回其他值或 Promise 被拒绝时保持打开。

```tsx
import type { PopupCloseAction } from "@taroify/core"

function beforeClose(action: PopupCloseAction) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(action === "close"), 1000)
  })
}

<Popup open closeable beforeClose={beforeClose} />
```

### 销毁内容 <Tag tag="v1.0.2" />

默认情况下，弹出层关闭后内容仍会保留。设置 `destroyOnClose` 后，内容会在离场动画结束后卸载。

```tsx
<Popup open={open} destroyOnClose>
  <HeavyContent />
</Popup>
```

### 圆角弹窗

设置 `rounded` 属性后，弹窗会根据弹出位置添加不同的圆角样式。

```tsx
<Popup open rounded style={{ padding: "64px" }}>
  内容
</Popup>

<Popup open rounded placement="bottom" style={{ height: "30%" }} />
```

### 禁止滚动穿透

`lock` 默认开启，用于阻止遮罩层和弹出层内容区域的滑动穿透。如果弹出层内容需要滚动，可以根据高度是否固定选择以下方案。

#### 固定高度滚动

使用 `ScrollView` 时，需要通过 `scrollY` 开启纵向滚动，并为滚动区域设置明确高度。该方案适用于 H5 和小程序。

```tsx
<Popup
  open={open}
  lock
  placement="bottom"
  style={{ height: "70vh", overflow: "hidden" }}
>
  <ScrollView scrollY style={{ height: "100%" }}>
    <LongContent />
  </ScrollView>
</Popup>
```

#### 自适应高度滚动

在微信小程序中，如果需要内容较少时自适应高度、超过最大高度后滚动，可以设置 `catchMove={false}` 允许弹出层内容滚动，并通过 `PageMeta` 阻止底层页面滚动。

```tsx
import { PageMeta } from "@tarojs/components"

function Page() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <PageMeta pageStyle={open ? "overflow: hidden;" : ""} />

      <Popup
        open={open}
        lock
        catchMove={false}
        placement="bottom"
        style={{ maxHeight: "70vh" }}
        onClose={setOpen}
      >
        <LongContent />
      </Popup>
    </>
  )
}
```

`PageMeta` 需要 Taro 3.6.19 及以上版本，应作为页面内的第一个节点，并在页面配置中开启 `enablePageMeta`：

```ts
export default definePageConfig({
  enablePageMeta: true,
})
```

## API

### Popup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultOpen | 默认是否显示弹出层 | _boolean_ | `false` |
| open | 是否显示弹出层 | _boolean_ | `false` |
| placement | 弹出位置，可选值为 `top` `bottom` `right` `left` `center` | _PopupPlacement_ | `center` |
| duration | 动画时长，单位毫秒 | _number_ | `300` |
| rounded | 是否显示圆角 | _boolean_ | `false` |
| lock | 是否锁定背景滚动 | _boolean_ | `true` |
| catchMove | 是否拦截弹出层内容区域的触摸移动事件，设置为 `false` 后可使用普通 `View` 的溢出滚动 | _boolean_ | `lock` |
| backdrop <Tag tag="v1.0.2" /> | 是否显示遮罩层，或传入遮罩层配置 | _boolean \| Omit&lt;PopupBackdropProps, "open"&gt;_ | `true` |
| closeOnClickBackdrop <Tag tag="v1.0.2" /> | 点击遮罩层时是否关闭弹出层 | _boolean_ | `true` |
| closeable <Tag tag="v1.0.2" /> | 是否显示关闭图标 | _boolean_ | `false` |
| closeIcon <Tag tag="v1.0.2" /> | 自定义关闭图标 | _ReactNode_ | `<Cross />` |
| closeIconPlacement <Tag tag="v1.0.2" /> | 关闭图标位置，可选值为 `top-left` `top-right` `bottom-left` `bottom-right` | _PopupClosePlacement_ | `top-right` |
| beforeClose <Tag tag="v1.0.2" /> | 关闭前的回调函数，返回 `true` 时关闭 | _(action: PopupCloseAction) => boolean \| Promise&lt;boolean&gt;_ | - |
| destroyOnClose <Tag tag="v1.0.2" /> | 关闭后是否卸载弹出层内容 | _boolean_ | `false` |
| mountOnEnter | 首次打开时是否挂载弹出层内容 | _boolean_ | `true` |
| transitionAppear | 首次挂载且已打开时是否执行入场动画 | _boolean_ | `true` |
| transition <Tag tag="v1.0.2" /> | 动画名称 | _string_ | 根据 `placement` 自动设置 |
| transitionTimeout <Tag tag="v1.0.2" /> | 动画超时时间，单位毫秒 | _PopupTransitionTimeout_ | `duration` |
| transaction <Tag tag="待废弃" /> | 请使用 `transition` | _string_ | - |
| transactionTimeout <Tag tag="待废弃" /> | 请使用 `transitionTimeout` | _PopupTransitionTimeout_ | - |

动画相关参数继承自 `Transition` 组件，详细属性参见：[Transition 组件](/components/style/#动画)。

| Popup 参数 | Transition 对应参数 |
| --- | --- |
| mountOnEnter | mountOnEnter |
| transition | name |
| transitionAppear | appear |
| transitionTimeout | timeout |
| onTransitionEnter | onEnter |
| onTransitionEntered | onEntered |
| onTransitionExit | onExit |
| onTransitionExited | onExited |

### Popup.Backdrop Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | 遮罩层类名 | _string_ | - |
| style | 遮罩层样式 | _CSSProperties_ | - |
| open | 是否显示遮罩层 | _boolean_ | `true` |
| closeable | 点击遮罩层后是否关闭弹出层 | _boolean_ | `true` |
| duration | 动画时长，单位毫秒 | _number_ | `300` |
| lock | 是否锁定背景滚动 | _boolean_ | `true` |

### Popup.Close Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| placement | 关闭图标位置，可选值为 `top-left` `top-right` `bottom-left` `bottom-right` | _PopupClosePlacement_ | `top-right` |
| children | 图标内容 | _ReactNode_ | `<Cross />` |
| onClick <Tag tag="v1.0.2" /> | 点击关闭图标时触发 | _(event: ITouchEvent) => void_ | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| onClick | 点击弹出层时触发 | _event: ITouchEvent_ |
| onOpen <Tag tag="v1.0.2" /> | 打开弹出层且入场动画开始时触发 | - |
| onOpened <Tag tag="v1.0.2" /> | 入场动画结束时触发 | - |
| onClose | 关闭弹出层时触发 | _opened: boolean_ |
| onClosed <Tag tag="v1.0.2" /> | 离场动画结束时触发 | - |

### 类型定义

组件相关类型可从 `@taroify/core` 直接导入：

```tsx
import type {
  PopupBackdropProps,
  PopupCloseAction,
  PopupClosePlacement,
  PopupCloseProps,
  PopupPlacement,
  PopupProps,
  PopupThemeVars,
  PopupTransitionTimeout,
} from "@taroify/core"
```

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --popup-z-index | _1010_ | - |
| --popup-background-color | _var(--background-color-light)_ | - |
| --popup-animation-duration | _var(--animation-duration-base)_ | - |
| --popup-rounded-border-radius | _16px \* $hd_ | - |
| --popup-close-icon-z-index | _1_ | - |
| --popup-close-icon-size | _22px \* $hd_ | - |
| --popup-close-icon-color | _var(--gray-5)_ | - |
| --popup-close-icon-active-color | _var(--gray-6)_ | - |
| --popup-close-icon-margin | _16px \* $hd_ | - |
