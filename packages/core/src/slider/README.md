# Slider 滑块

### 介绍

滑动输入条，用于在给定的范围内选择一个值。

### 引入

```tsx
import { Slider } from "@taroify/core"
```

## 代码演示

### 基础用法

```tsx
<Slider defaultValue={50} />
```

### 双滑块

添加 `range` 开启双滑块模式，使用 `[最小值, 最大值]` 传入和接收区间。未提供初始值时，默认选中整个区间。拖动越过另一个滑块后，回调仍按数值从小到大返回。

```tsx
<Slider range defaultValue={[20, 60]} />
```

### 指定选择范围

```tsx
<Slider min={-50} max={50} defaultValue={0} />
```

### 禁用

```tsx
<Slider disabled defaultValue={50} />
```

### 只读 <Tag tag="v1.1.0" />

`readonly` 保留滑块的正常外观，并禁止通过用户交互修改值。

```tsx
<Slider readonly defaultValue={50} />
```

### 指定步长

```tsx
<Slider step={10} defaultValue={50} />
```

### 自定义样式

```tsx
<Slider className="custom-color" size={4} defaultValue={50} />
```

```scss
.custom-color {
  --slider-active-background-color: #ee0a24;
}
```

### 自定义按钮渲染函数 <Tag tag="v1.1.0" />

```tsx
function StyledThumbSlider() {
  return (
    <Slider className="custom-color" defaultValue={50}>
      <Slider.Thumb>
        {({ value, dragging }) => (
          <View className="custom-thumb">{dragging ? `${value}%` : value}</View>
        )}
      </Slider.Thumb>
    </Slider>
  )
}
```

```scss
.custom-color {
  --slider-active-background-color: #ee0a24;
}

.custom-thumb {
  width: 26px * 2;
  color: #fff;
  font-size: 10px * 2;
  line-height: 18px * 2;
  text-align: center;
  background-color: var(--slider-active-background-color);
  border-radius: 100px * 2;
}
```

### 垂直方向

设置 `orientation="vertical"` 属性后，滑块会垂直展示，且高度为 100% 父元素高度。

```tsx
<Slider orientation="vertical" defaultValue={50} />
<Slider
  style={{ marginLeft: "100px" }}
  range
  orientation="vertical"
  defaultValue={[20, 60]}
/>
```

### 反向 <Tag tag="v1.1.0" />

`reverse` 使值在水平方向上从右向左增大，在垂直方向上从下向上增大。

```tsx
<Slider reverse defaultValue={50} />
```

### H5 键盘操作 <Tag tag="v1.1.0" />

使用 Tab 将焦点移到滑块。向右键和向上键增大数值，向左键和向下键减小数值，Home 和 End 分别跳到当前滑块可选的最小值和最大值。双滑块可分别聚焦，键盘操作时每个滑块以另一个滑块的当前值为界。

可用 `ariaLabel` 或 `aria-labelledby` 为各滑块提供业务名称，并用 `aria-valuetext` 描述当前数值的单位。

```tsx
<Slider range defaultValue={[20, 60]}>
  <Slider.Thumb ariaLabel="最低价格" />
  <Slider.Thumb ariaLabel="最高价格" />
</Slider>
```

## API

### Slider Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultValue | 非受控模式的初始值 | _number \| [number, number]_ | `min` 或 `[min, max]` <Tag tag="v1.1.0" /> |
| value | 受控模式的当前值 | _number \| [number, number]_ | - |
| max | 最大值 | _number \| string_ | `100` |
| min | 最小值 | _number \| string_ | `0` |
| step | 步长 | _number \| string_ | `1` |
| size | 进度条高度，默认单位为 `px` | _number \| string_ | `2px` |
| range | 是否开启双滑块模式 | _boolean_ | `false` |
| reverse <Tag tag="v1.1.0" /> | 是否反转轨道的值方向 | _boolean_ | `false` |
| disabled | 是否禁用滑块 | _boolean_ | `false` |
| readonly <Tag tag="v1.1.0" /> | 是否为只读状态，只读状态下无法修改滑块的值 | _boolean_ | `false` |
| orientation | 滑块按钮展示方向，`vertical` 为垂直展示 | _SliderOrientation_ | `horizontal` |

### Slider.Thumb Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 滑块按钮大小，默认单位为 `px` |_number \| string_ | `24px` |
| children | 自定义滑块节点，支持渲染函数 <Tag tag="v1.1.0" /> | _ReactNode \| ((props: SliderThumbRenderProps) => ReactNode)_ | - |

渲染函数收到当前滑块的 `value`、`dragging` 和 `index`。双滑块的 `index` 为 `0` 或 `1`，分别对应区间最小值和最大值。单滑块的 `index` 为 `undefined`。

### Slider Events

| 事件名      | 说明           | 回调参数            |
|----------|--------------|-----------------|
| onChange | 拖动、点击轨道或键盘操作使数值变化时实时触发 | _value: number \| [number, number]_ |
| onDragStart <Tag tag="v1.1.0" /> | 触摸滑块并开始移动时触发 | _event: ITouchEvent_ |
| onDragEnd <Tag tag="v1.1.0" /> | 结束或取消拖动时触发 | _event: ITouchEvent_ |

### 类型定义 <Tag tag="v1.1.0" />

```tsx
import type { SliderProps, SliderThumbProps, SliderThumbRenderProps } from "@taroify/core"
```

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称                                 | 默认值                                        | 描述  |
|------------------------------------|--------------------------------------------|-----|
| --slider-border-radius             | _var(--border-radius-max)_                 | -   |
| --slider-active-background-color   | _var(--blue)_                              | -   |
| --slider-inactive-background-color | _var(--gray-3)_                            | -   |
| --slider-disabled-opacity          | _var(--disabled-opacity)_                  | -   |
| --slider-track-height              | _2px * $hd_                                | -   |
| --slider-track-transition-duration | _var(--animation-duration-fast)_           | -   |
| --slider-thumb-width               | _24px * $hd_                               | -   |
| --slider-thumb-height              | _24px * $hd_                               | -   |
| --slider-thumb-border-radius       | _50%_                                      | -   |
| --slider-thumb-background-color    | _var(--white)_                             | -   |
| --slider-thumb-box-shadow          | _0 1px * $hd 2px * $hd rgba(0, 0, 0, 0.5)_ | -   |
