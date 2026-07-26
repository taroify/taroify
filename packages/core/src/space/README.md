# Space 间距

### 介绍

设置组件之间的间距。

### 引入

```tsx
import { Button, Space } from "@taroify/core"
```

## 代码演示

### 基础用法

```tsx
<Space>
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
</Space>
```

### 垂直

```tsx
<Block title="垂直">
  <Space direction="vertical" fill>
    <Button color="primary" block>
      主要按钮
    </Button>
    <Button color="primary" block>
      主要按钮
    </Button>
    <Button color="primary" block>
      主要按钮
    </Button>
  </Space>
</Block>
```

### 间距

```tsx
<Space size="large">
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
</Space>
```

### 自定义间距

通过 `size` 设置间距。传入数字时会通过 Taro 的尺寸转换处理；也可以传入带单位的字符串、CSS 变量，或者使用数组分别设置 `[水平间距, 垂直间距]`。

```tsx
<Space size={16}>
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
</Space>
<Space size="32px">
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
</Space>
<Space size="var(--space-gap)">
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
</Space>
<Space size={[16, "32px"]}>
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
</Space>
```

### 分隔符 <Tag tag="v1.0.2" />

通过 `separator` 在相邻子元素之间设置分隔内容。

```tsx
<Space separator="|">
  <Button variant="text" color="primary">编辑</Button>
  <Button variant="text" color="primary">删除</Button>
  <Button variant="text" color="primary">更多</Button>
</Space>
```

### 居中

```tsx
<Space justify="center">
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
</Space>
```

### 不换行

```tsx
<Space wrap="nowrap">
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
  <Button color="primary">主要按钮</Button>
</Space>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 排列方向，可选值为 `horizontal` `vertical` | _SpaceDirection_ | `horizontal` |
| size | 间距大小，数组依次表示水平和垂直间距 | _SpaceSize_ | `small` |
| wrap | 子元素的换行方式，可选值为 `nowrap` `wrap` `wrap-reverse` | _SpaceWrap_ | `wrap` |
| justify | 主轴对齐方式，可选值为 `start` `end` `center` `space-around` `space-between` | _SpaceJustify_ | `start` |
| align | 交叉轴对齐方式，可选值为 `start` `center` `end` `baseline` `stretch` | _SpaceAlign_ | `start` |
| fill | 是否填充整个父元素 | _boolean_ | `false` |
| separator <Tag tag="v1.0.2" /> | 相邻子元素之间的分隔内容 | _ReactNode_ | - |

### 类型定义

组件导出以下类型定义：

```ts
import type {
  SpaceAlign,
  SpaceDirection,
  SpaceJustify,
  SpaceProps,
  SpaceSize,
  SpaceSizePreset,
  SpaceSizeValue,
  SpaceThemeVars,
  SpaceWrap,
} from "@taroify/core"
```

`SpaceSize` 支持预设尺寸、数字、带单位的字符串、CSS 变量，以及由这些值组成的数组：

```ts
type SpaceSize =
  | "mini"
  | "small"
  | "medium"
  | "large"
  | number
  | string
  | [number | string, (number | string)?]
```

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称                               | 默认值                         | 描述 |
| ---------------------------------- | ------------------------------ | ---- |
| --space-item-gap-mini              | _var(--padding-xs)_            | -    |
| --space-item-gap-small             | _var(--padding-sm)_            | -    |
| --space-item-gap-medium            | _var(--padding-md)_            | -    |
| --space-item-gap-large             | _var(--padding-lg)_            | -    |
| --space-item-vertical-gap-mini     | _var(--space-item-gap-mini)_   | -    |
| --space-item-vertical-gap-small    | _var(--space-item-gap-small)_  | -    |
| --space-item-vertical-gap-medium   | _var(--space-item-gap-medium)_ | -    |
| --space-item-vertical-gap-large    | _var(--space-item-gap-large)_  | -    |
| --space-item-horizontal-gap-mini   | _var(--space-item-gap-mini)_   | -    |
| --space-item-horizontal-gap-small  | _var(--space-item-gap-small)_  | -    |
| --space-item-horizontal-gap-medium | _var(--space-item-gap-medium)_ | -    |
| --space-item-horizontal-gap-large  | _var(--space-item-gap-large)_  | -    |
