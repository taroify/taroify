# Switch 开关

### 介绍

用于在打开和关闭状态之间进行切换。

### 引入

```tsx
import { Switch } from "@taroify/core"
```

## 代码演示

### 基础用法

通过 `checked` 绑定开关的选中状态，`true` 表示开，`false` 表示关。

```tsx
<Switch />
```

### 禁用状态

通过 `disabled` 属性来禁用开关，禁用状态下开关不可点击。

```tsx
<Switch disabled />
```

### 加载状态

通过 `loading` 属性设置开关为加载状态，加载状态下开关不可点击。

```tsx
<Switch loading />
```

### 自定义大小

通过 `size` 属性自定义开关的大小。

```tsx
<Switch size="24" />
```

### 自定义颜色

通过 `css` 设置打开与关闭时的背景色。

```tsx
<Switch className="custom-color" />
```

```scss
.custom-color {
  --switch-background-color: #dcdee0;
  --switch-checked-color: #ee0a24;
}
```

### 搭配单元格使用

```tsx
<Cell align="center" title="标题" extra={<Switch size="24" />} />
```

## API

### Props

| 参数           | 说明                     | 类型               | 默认值    |
| -------------- | ------------------------ | ------------------ | --------- |
| defaultChecked | 默认开关选中状态             | _boolean_              | `false`   |
| checked        | 开关选中状态             | _boolean_              | `false`   |
| loading        | 是否为加载状态           | _boolean_          | `false`   |
| disabled       | 是否为禁用状态           | _boolean_          | `false`   |
| size           | 开关尺寸，默认单位为`px` | _number \| string_ | `30px`    |

### Events

| 事件名 | 说明               | 回调参数            |
| ------ | ------------------ | ------------------- |
| onChange | 开关状态切换时触发 | _value: boolean_        |

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称                              | 默认值                                                                                                                                              | 描述  |
|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|-----|
| switch-size                     | _30px * $hd_                                                                                                                                     | -   |
| switch-font-size                | _var(--switch-size)_                                                                                                                             | -   |
| switch-width                    | _2em_                                                                                                                                            | -   |
| switch-height                   | _1em_                                                                                                                                            | -   |
| switch-border                   | _var(--border-width-base) solid rgba(0, 0, 0, 0.1)_                                                                                              | -   |
| switch-background-color         | _var(--white)_                                                                                                                                   | -   |
| switch-transition-duration      | _var(--animation-duration-base)_                                                                                                                 | -   |
| switch-node-size                | _1em_                                                                                                                                            | -   |
| switch-node-width               | _var(--switch-node-size)_                                                                                                                        | -   |
| switch-node-height              | _var(--switch-node-size)_                                                                                                                        | -   |
| switch-node-translate-x         | _translateX(calc(var(--switch-width) - var(--switch-node-size)))_                                                                                | -   |
| switch-node-background-color    | _var(--white)_                                                                                                                                   | -   |
| switch-node-box-shadow          | _0 3px * $hd 1px * $hd 0 rgba(0, 0, 0, 0.05), <br/>0 2px * $hd 2px * $hd 0 rgba(0, 0, 0, 0.1),<br/> 0 3px * $hd 3px * $hd 0 rgba(0, 0, 0, 0.05)_ | -   |
| switch-checked-color            | _var(var(--primary-color)_                                                                                                                       | -   |
| switch-checked-background-color | _var(--switch-checked-color)_                                                                                                                    | -   |
| switch-loading-color            | _var(--switch-checked-color)_                                                                                                                    | -   |
| switch-disabled-opacity         | _var(--disabled-opacity)_                                                                                                                        | -   |
