---
title: Rate 评分
description: 使用 Taroify Rate 实现受控或非受控评分，支持半星、只读小数、再次点击清空、滑动评分与多行布局，并通过颜色属性和 CSS 变量定制样式。
---

# Rate 评分

### 介绍

用于对事物进行评级操作。

### 引入

```tsx
import { Rate } from "@taroify/core"
```

## 代码演示

### 基础用法

使用 `defaultValue` 设置非受控组件的初始评分，后续点击和滑动由组件管理。

```tsx
<Rate defaultValue={3} />
```

通过 `value` 和 `onChange` 使用受控模式，评分变化时需要更新 `value`。只传入固定的 `value` 不会自动修改评分。

```tsx
import { Rate } from "@taroify/core"
import { useState } from "react"

function Example() {
  const [value, setValue] = useState(3)
  return <Rate value={value} onChange={setValue} />
}
```

### 自定义图标

通过 `icon` 设置选中图标，`emptyIcon` 设置未选中图标，支持 React 节点。自定义图标组件需要将收到的 `className`、`style` 和 `size` 应用到图标上，以保持尺寸和半星裁切正常。

```tsx
import { Rate } from "@taroify/core"
import { Like, LikeOutlined } from "@taroify/icons"

<Rate defaultValue={3} icon={<Like />} emptyIcon={<LikeOutlined />} />
```

### 自定义样式

`size` 设置图标大小，`gutter` 设置图标间距；数字的单位为 `px`，也支持 `px`、`rpx` 等字符串尺寸。

负数和无法解析的尺寸会回退到主题默认值；`gutter={0}` 可以移除间距。

```tsx
<Rate className="custom-color" defaultValue={3} size="25px" gutter="8px" />
```

```scss
.custom-color {
  --rate-icon-empty-color: #eee;
  --rate-icon-full-color: #ffd21e;
}
```

### 便捷颜色属性 <Tag tag="v1.1.0" />

通过 `color`、`emptyColor` 和 `disabledColor` 设置选中、未选中和禁用颜色。未传时继续使用原有 CSS 变量与 ConfigProvider 主题；`style` 中显式设置的同名 CSS 变量优先。

```tsx
<Rate defaultValue={3} color="#ffd21e" emptyColor="#eee" />
<Rate defaultValue={3} disabled disabledColor="#c8c9cc" />
```

### 半星

设置 `allowHalf` 后，点击图标左半边选择半星，右半边选择整星。图标间距不参与半星宽度计算。

```tsx
<Rate defaultValue={2.5} allowHalf />
```

### 自定义数量

`count` 设置评分总数，支持数字和数字字符串。数量向下取整；负数、非数字和非有限数按 `0` 处理，不渲染评分项。

```tsx
<Rate defaultValue={3} count="6" />
```

### 可清空 <Tag tag="v1.1.0" />

设置 `clearable` 后，再次点击当前分值可重置为 `0`，支持整星和半星。滑动经过当前分值不会清空；拖动结束后的兼容点击也不会误触发清空。

```tsx
<Rate defaultValue={3} clearable />
<Rate defaultValue={2.5} allowHalf clearable />
```

### 禁用滑动

`touchable={false}` 只关闭滑动评分，仍可点击选择。使用 `disabled` 或 `readonly` 可以同时关闭点击与滑动。

```tsx
<Rate defaultValue={3} touchable={false} />
```

### 多行布局 <Tag tag="v1.1.0" />

默认保持单行。设置 `wrap` 并限制宽度后，评分项会自动换行；点击与滑动按所在行计算分值。滑动超出上下边界时使用最近的一行，超出左右边界时使用该行的首尾分值。

组件仅处理横向评分手势，纵向手势保留给页面滚动。可以从某行开始横向拖动，再移到其他行。

```tsx
<Rate defaultValue={3.5} count={10} allowHalf wrap style={{ width: "150px" }} />
```

### 禁用状态

```tsx
<Rate defaultValue={3} disabled />
```

### 只读状态

```tsx
<Rate defaultValue={3} readonly />
```

### 只读状态显示小数

同时设置 `readonly` 和 `allowHalf` 后，可以展示任意小数结果。

```tsx
<Rate value={3.3} readonly allowHalf />
```

### 监听评分变化

`onChange` 只在用户选择不同的分值或清空时触发。`onClick` 对应实际点击，不随滑动重复触发。

```tsx
import { Rate, Toast } from "@taroify/core"

<>
  <Toast id="toast" />
  <Rate defaultValue={3} onChange={(value) => Toast.open(`当前评分：${value}`)} />
</>
```

### v1.1.0 行为调整

- `touchable={false}` 现在允许点击评分；需要完全禁止编辑时请使用 `disabled` 或 `readonly`。
- 滑动评分不再调用 `onClick`；请通过 `onChange` 监听评分变化。
- `count="5"` 正确显示五个评分项，`size` 和 `gutter` 的类型补齐字符串支持。
- 超出范围的评分仅在展示时限制到 `0` 至 `count`，非有限数展示为 `0`，不会因为初始化、属性更新或数量变化而主动触发 `onChange`。
- `clearable` 和 `wrap` 默认关闭，颜色属性未设置时保持原有主题。

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultValue | 非受控模式的初始分值 | _number_ | `0` |
| value | 受控模式的当前分值，需配合 onChange 更新 | _number_ | - |
| count | 图标总数；向下取整，无效数量按 0 处理 | _number \| string_ | `5` |
| size | 图标大小，数字单位为 px | _number \| string_ | `20px` |
| gutter | 图标间距，数字单位为 px | _number \| string_ | `4px` |
| icon | 选中时的图标 | _ReactNode_ | `<Star />` |
| emptyIcon | 未选中时的图标 | _ReactNode_ | `<StarOutlined />` |
| color <Tag tag="v1.1.0" /> | 选中颜色，未设置时沿用主题 | _string_ | - |
| emptyColor <Tag tag="v1.1.0" /> | 未选中颜色，未设置时沿用主题 | _string_ | - |
| disabledColor <Tag tag="v1.1.0" /> | 禁用颜色，未设置时沿用主题 | _string_ | - |
| allowHalf | 是否允许半选 | _boolean_ | `false` |
| clearable <Tag tag="v1.1.0" /> | 是否允许再次点击当前分值后清空 | _boolean_ | `false` |
| wrap <Tag tag="v1.1.0" /> | 是否允许在容器内换行 | _boolean_ | `false` |
| readonly | 是否只读，无法通过点击或滑动修改评分 | _boolean_ | `false` |
| disabled | 是否禁用评分 | _boolean_ | `false` |
| touchable | 是否允许滑动评分，不影响点击 | _boolean_ | `true` |

支持 View 的 `className`、`style` 和触摸事件等属性。

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| onChange | 用户操作使当前分值变化时触发 | _value: number_ |
| onClick | 点击评分区域时触发，滑动不触发 | _event: ITouchEvent_ |

### 类型定义 <Tag tag="v1.1.0" />

```tsx
import type { RateProps, RateThemeVars } from "@taroify/core"
```

## 主题定制

### 样式变量

组件提供以下 CSS 变量，可配合 [ConfigProvider](/components/config-provider/) 使用。

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --rate-icon-size | _20px * $hd_ | 图标大小 |
| --rate-icon-gutter | _var(--padding-base)_ | 图标间距 |
| --rate-icon-empty-color | _var(--gray-5)_ | 未选中颜色 |
| --rate-icon-full-color | _var(--danger-color)_ | 选中颜色 |
| --rate-icon-disabled-color | _var(--gray-5)_ | 禁用颜色 |
