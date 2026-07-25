# Image 图片

### 介绍

增强版的 taro Image 组件，提供多种图片填充模式，支持图片懒加载、加载中提示、加载失败提示。

### 引入

```tsx
import { Image } from "@taroify/core"
```

## 代码演示

### 基础用法

基础用法与 Taro `Image` 组件一致，支持 `webp`、`fadeIn`、`showMenuByLongpress`
等原生图片属性，也可以设置 H5 的 `imgProps`。<br />
通过 `width` 和 `height` 设置图片大小，若未指定，会从 style 中读取`width`,`height`属性。<br />
`width`、`height` 和 `radius` 为 number 时，会经过 `pxTransform` 转换。

```tsx
<Image width={200} height={200} src="https://img.yzcdn.cn/vant/cat.jpeg" />
```

### 填充模式

通过 `mode` 属性可以设置图片填充模式，可选值见下方表格。

```tsx
<Image width={200} height={200} mode="scaleToFill" src="https://img.yzcdn.cn/vant/cat.jpeg" />
```

### 圆形图片

通过 `shape="circle"` 设置圆形图片，可以配合 `mode` 属性展示不同的填充效果。

```tsx
<Image shape="circle" mode="scaleToFill" width={200} height={200} src="https://img.yzcdn.cn/vant/cat.jpeg" />
<Image shape="circle" mode="aspectFit" width={200} height={200} src="https://img.yzcdn.cn/vant/cat.jpeg" />
<Image shape="circle" mode="aspectFill" width={200} height={200} src="https://img.yzcdn.cn/vant/cat.jpeg" />
```

### 圆角图片 <Tag tag="v1.0.2" />

通过 `shape="rounded"` 设置默认圆角，通过 `radius` 属性自定义圆角大小。

```tsx
<Image shape="rounded" width={200} height={200} src="https://img.yzcdn.cn/vant/cat.jpeg" />
<Image radius={24} width={200} height={200} src="https://img.yzcdn.cn/vant/cat.jpeg" />
```

### 图片懒加载

设置 `lazyLoad` 属性来开启图片懒加载。

```tsx
<Image lazyLoad width={200} height={200} src="https://img.yzcdn.cn/vant/cat.jpeg" />
```

### 加载中提示

通过 `placeholder` 设置加载中提示。设置为 `true` 时使用默认图标，也可以传入文本或自定义节点。

```tsx
import { Photo } from "@taroify/icons"

<Image width={200} height={200} src="image.png" placeholder />
<Image width={200} height={200} src="image.png" placeholder="加载中..." />
<Image width={200} height={200} src="image.png" placeholder={<Photo />} />
```

### 加载失败提示

通过 `fallback` 设置加载失败提示。设置为 `true` 时使用默认图标，也可以传入文本或自定义节点。

```tsx
import { PhotoFail } from "@taroify/icons"

<Image width={200} height={200} src="error" fallback />
<Image width={200} height={200} src="error" fallback="加载失败" />
<Image width={200} height={200} src="error" fallback={<PhotoFail />} />
```

## API

### Props

| 参数         | 说明                                 | 类型                   | 默认值        |
| ------------ | ------------------------------------ | ---------------------- | ------------- |
| src          | 图片链接                             | _string_               | -             |
| mode         | 图片填充模式                         | _ImageMode_            | `scaleToFill` |
| alt          | 替代文本                             | _string_               | -             |
| width        | 宽度                                 | _string \| number_      | -             |
| height       | 高度                                 | _string \| number_      | -             |
| shape        | 图片形状 `square` `rounded` `circle` | _ImageShape_           | -             |
| radius <Tag tag="v1.0.2" /> | 圆角大小                             | _string \| number_      | -             |
| lazyLoad     | 是否开启图片懒加载                   | _boolean_              | `false`       |
| placeholder  | 加载中提示                           | _boolean \| ReactNode_ | `false`       |
| fallback     | 加载失败提示                         | _boolean \| ReactNode_ | `false`       |

### Modes

| 名称        | 含义                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| scaleToFill | 缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素                                                                |
| aspectFit   | 缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。                                       |
| aspectFill  | 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。 |
| widthFix    | 缩放模式，宽度不变，高度自动变化，保持原图宽高比不变                                                                                 |
| heightFix   | 缩放模式，高度不变，宽度自动变化，保持原图宽高比不变                                                                                 |
| top         | 裁剪模式，不缩放图片，只显示图片的顶部区域                                                                                           |
| bottom      | 裁剪模式，不缩放图片，只显示图片的底部区域                                                                                           |
| center      | 裁剪模式，不缩放图片，只显示图片的中间区域                                                                                           |
| left        | 裁剪模式，不缩放图片，只显示图片的左边区域                                                                                           |
| right       | 裁剪模式，不缩放图片，只显示图片的右边区域                                                                                           |
| topLeft     | 裁剪模式，不缩放图片，只显示图片的左上边区域                                                                                         |
| topRight    | 裁剪模式，不缩放图片，只显示图片的右上边区域                                                                                         |
| bottomLeft  | 裁剪模式，不缩放图片，只显示图片的左下边区域                                                                                         |
| bottomRight | 裁剪模式，不缩放图片，只显示图片的右下边区域                                                                                         |

### Events

| 事件名  | 说明               | 回调参数                 |
| ------- | ------------------ | ------------------------ |
| onClick | 点击图片时触发     | _event: ITouchEvent_     |
| onLoad  | 图片加载完毕时触发 | _event: ImageLoadEvent_  |
| onError | 图片加载失败时触发 | _event: ImageErrorEvent_ |

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称                                 | 默认值                    | 描述 |
| ------------------------------------ | ------------------------- | ---- |
| --image-placeholder-color            | _var(var(--gray-6)_       | -    |
| --image-placeholder-font-size        | _var(--font-size-md)_     | -    |
| --image-placeholder-icon-size        | _32px \* $hd_             | -    |
| --image-placeholder-icon-color       | _var(--gray-4)_           | -    |
| --image-placeholder-background-color | _var(--background-color)_ | -    |
