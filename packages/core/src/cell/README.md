# Cell 单元格

### 介绍

单元格为列表中的单个展示项。

### 引入

```tsx
import { Cell } from "@taroify/core"
```

## 代码演示

### 基础用法

`Cell` 可以单独使用，也可以与 `Cell.Group` 搭配使用，`Cell.Group` 可以为 `Cell` 提供上下外边框。

```tsx
<Cell title="单元格">内容</Cell>
<Cell title="单元格" brief="描述信息">内容</Cell>
```

### 卡片风格

通过 `Cell.Group` 的 `inset` 属性，可以将单元格转换为圆角卡片风格。卡片模式不会显示上下外边框。

```tsx
<Cell.Group inset>
  <Cell title="单元格">内容</Cell>
  <Cell title="单元格">内容</Cell>
</Cell.Group>
```

### 单元格大小

通过 `size` 属性可以控制单元格的大小。

```tsx
<Cell title="单元格">内容</Cell>
<Cell title="单元格" brief="描述信息" size="large">内容</Cell>
```

### 展示图标

通过 `icon` 属性在标题左侧展示图标。

```tsx
<Cell icon={<LocationOutlined />} title="单元格">
  内容
</Cell>
```

### 只设置内容

只设置 `children` 时，内容会靠左对齐。

```tsx
<Cell>内容</Cell>
```

### 展示箭头

设置 `isLink` 属性后会在单元格右侧展示箭头，并且可以通过 `arrowDirection` 控制箭头方向。

```tsx
<Cell title="单元格" isLink />
<Cell title="单元格" isLink children="内容" />
<Cell title="单元格" isLink arrowDirection="down" children="内容" />
```

### 页面导航 <Tag tag="v1.0.1" />

使用 `Cell.Link` 可以通过 Taro `Navigator` 完成页面跳转。`Cell.Link` 默认展示右侧箭头并开启点击反馈。

```tsx
<Cell.Link title="订单详情" url="/pages/order/detail/index">
  查看
</Cell.Link>
<Cell.Link title="返回上一页" openType="navigateBack" />
```

### 额外内容 <Tag tag="v1.0.1" />

通过 `extra` 属性可以在右侧图标之后放置额外内容。

```tsx
<Cell title="消息通知" isLink extra={<Switch checked />}>
  已开启
</Cell>
```

### 分组标题

通过 `Cell.Group` 的 `title` 属性可以指定分组标题。

```tsx
<Cell.Group title="分组 1">
  <Cell title="单元格">内容</Cell>
</Cell.Group>
<Cell.Group title="分组 2">
  <Cell title="单元格">内容</Cell>
</Cell.Group>
```

### 对齐方式

通过 `align` 属性可以改变 `Cell` 的左右内容的对齐方式。

```tsx
<Cell title="单元格" brief="align start" size="large" align="start">内容</Cell>
<Cell title="单元格" brief="align center" size="large" align="center">内容</Cell>
<Cell title="单元格" brief="align end" size="large" align="end">内容</Cell>
```

## 升级提示

- `Cell.Group` 的标题和内容容器现在是同级节点，传入的原生 View 属性会作用于内容容器。
- `Cell.Group` 在 `inset` 模式下不再显示上下外边框。
- `Cell` 显式设置的 `clickable` 优先于 `isLink` 和 `Cell.Group clickable`。
- `icon` 和 `rightIcon` 会被统一的布局节点包裹，自定义图标会自动获得标准间距和对齐。
- `size="large"` 现在会正确应用大尺寸描述文字样式。

## API

### Cell.Group Props

| 参数      | 说明                       | 类型        | 默认值  |
| --------- | -------------------------- | ----------- | ------- |
| title     | 分组标题                   | _ReactNode_ | `-`     |
| inset     | 是否展示为圆角卡片风格     | _boolean_   | `false` |
| bordered  | 是否显示非卡片模式的外边框 | _boolean_   | `true`  |
| clickable | 是否为子单元格开启点击反馈 | _boolean_   | `false` |

### Cell Props

| 参数           | 说明                                                    | 类型            | 默认值   |
| -------------- | ------------------------------------------------------- | --------------- | -------- |
| title          | 左侧标题                                                | _ReactNode_     | `-`      |
| children       | 右侧内容                                                | _ReactNode_     | `-`      |
| brief          | 标题下方的描述信息                                      | _ReactNode_     | `-`      |
| size <Tag tag="v1.0.1" /> | 单元格大小，可选值为 `normal` `large`，`medium` 已废弃  | _string_        | `normal` |
| icon           | 左侧[图标](/components/icon)或[图片](/components/image) | _ReactNode_     | `-`      |
| rightIcon      | 右侧自定义图标                                          | _ReactNode_     | `-`      |
| extra <Tag tag="v1.0.1" /> | 右侧图标之后的额外内容                                  | _ReactNode_     | `-`      |
| bordered       | 是否显示内边框                                          | _boolean_       | `true`   |
| clickable      | 是否开启点击反馈，显式值优先于分组和链接状态            | _boolean_       | `-`      |
| isLink         | 是否展示右侧箭头并开启点击反馈                          | _boolean_       | `false`  |
| arrowDirection | 箭头方向，可选值为 `left` `right` `up` `down`           | _string_        | `right`  |
| required       | 是否显示表单必填星号                                    | _boolean_       | `false`  |
| align          | 对齐方式，可选值为 `start` `center` `end`               | _string_        | `-`      |
| titleStyle     | 左侧标题额外样式                                        | _CSSProperties_ | `-`      |
| titleClass     | 左侧标题额外类名                                        | _string_        | `-`      |
| valueClass     | 右侧内容额外类名                                        | _string_        | `-`      |
| briefClass     | 标题下方的描述信息额外类名                              | _string_        | `-`      |

`Cell` 还继承了 Taro `View` 的原生属性。

### Cell.Link Props <Tag tag="v1.0.1" />

`Cell.Link` 支持 Cell 内容与样式属性，并继承 Taro `Navigator` 的 `url`、`openType`、`target` 等原生属性。`isLink` 和 `clickable` 的默认值均为 `true`。

### Cell Events

| 事件名  | 说明             | 回调参数             |
| ------- | ---------------- | -------------------- |
| onClick | 点击单元格时触发 | _event: ITouchEvent_ |

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称                             | 默认值                                                                    | 描述 |
| -------------------------------- | ------------------------------------------------------------------------- | ---- |
| --cell-font-size                 | _var(--font-size-md)_                                                     | -    |
| --cell-line-height               | _24px \* $hd_                                                             | -    |
| --cell-color                     | _var(--text-color)_                                                       | -    |
| --cell-background-color          | _var(--background-color-2)_                                               | -    |
| --cell-border-color              | _var(--border-color)_                                                     | -    |
| --cell-value-color               | _var(--gray-6)_                                                           | -    |
| --cell-value-font-size <Tag tag="v1.0.1" /> | _inherit_                                                                 | -    |
| --cell-active-color              | _var(--active-color)_                                                     | -    |
| --cell-required-color            | _var(--danger-color)_                                                     | -    |
| --cell-required-padding-right    | _2px \* $hd_                                                              | -    |
| --cell-icon-size                 | _16px \* $hd_                                                             | -    |
| --cell-left-icon-margin-right <Tag tag="v1.0.1" /> | _4px \* $hd_                                                              | -    |
| --cell-right-icon-margin-left <Tag tag="v1.0.1" /> | _4px \* $hd_                                                              | -    |
| --cell-right-icon-color <Tag tag="v1.0.1" /> | _var(--cell-value-color)_                                                 | -    |
| --cell-extra-margin-left <Tag tag="v1.0.1" /> | _var(--padding-base)_                                                     | -    |
| --cell-icon-margin-left          | _4px \* $hd_                                                              | 即将废弃 |
| --cell-right-icon-margin-right   | _4px \* $hd_                                                              | 即将废弃 |
| --cell-brief-margin-top          | _var(--padding-base)_                                                     | -    |
| --cell-brief-font-size           | _var(--font-size-sm)_                                                     | -    |
| --cell-brief-line-height         | _var(--line-height-sm)_                                                   | -    |
| --cell-brief-color               | _var(--gray-6)_                                                           | -    |
| --cell-vertical-padding          | _10px \* $hd_                                                             | -    |
| --cell-horizontal-padding        | _var(--padding-md)_                                                       | -    |
| --cell-vertical-padding-large    | _var(--padding-sm)_                                                       | -    |
| --cell-title-font-size-large     | _var(--font-size-lg)_                                                     | -    |
| --cell-brief-font-size-large <Tag tag="v1.0.1" /> | _var(--font-size-md)_                                                     | -    |
| --cell-value-font-size-large <Tag tag="v1.0.1" /> | _inherit_                                                                 | -    |
| --cell-subtitle-font-size-large  | _var(--font-size-md)_                                                     | 即将废弃 |
| --cell-group-background-color    | _var(--background-color-2)_                                               | -    |
| --cell-group-title-color         | _var(--gray-6)_                                                           | -    |
| --cell-group-title-padding       | _var(--padding-md) var(--padding-md) var(--padding-xs)_                   | -    |
| --cell-group-title-font-size     | _var(--font-size-md)_                                                     | -    |
| --cell-group-title-line-height   | _16px \* $hd_                                                             | -    |
| --cell-group-inset-padding       | _0 var(--padding-md)_                                                     | -    |
| --cell-group-inset-border-radius | _var(--border-radius-lg)_                                                 | -    |
| --cell-group-inset-title-padding | _var(--padding-md) var(--padding-md) var(--padding-xs) var(--padding-xl)_ | -    |
