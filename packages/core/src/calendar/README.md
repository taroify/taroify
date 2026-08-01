# Calendar 日历

### 介绍

日历组件用于选择日期或日期区间。如要以弹层形式展示， 请使用 poppable，不要手动嵌套

### 引入

```tsx
import { Calendar } from "@taroify/core"
```

## 代码演示

### 年月切换

默认会平铺展示日期范围内的全部月份。设置 `switchMode` 后只渲染当前月份，并展示月份或年份切换按钮，适合日期跨度较大的场景。

```tsx
<Calendar
  min={new Date(2020, 0, 1)}
  max={new Date(2030, 11, 31)}
  switchMode="year-month"
/>
```

### 选择单个日期

下面演示了结合单元格来使用日历组件的用法，日期选择完成后会触发 `onConfirm` 事件。

```tsx
function formatFullDate(date?: Date) {
  if (date) {
    return `${date.getFullYear()}/${formatDate(date)}`
  }
}

function SingleCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="选择单个日期" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        type="single"
        value={value}
        poppable
        showPopup={open}
        onClose={setOpen}
        onChange={setValue}
        onConfirm={(newValue) => {
          setOpen(false)
          setFormatValue(formatFullDate(newValue))
        }}
      ></Calendar>
    </>
  )
}
```

### 选择多个日期

设置 `type` 为 `multiple` 后可以选择多个日期，此时 `onConfirm` 事件处理 value 数组结构，数组包含若干个选中的日期。

```tsx
function formatMultiple(dates: Date[]) {
  if (dates.length) {
    return `选择了 ${dates.length} 个日期`
  }
}

function MultipleCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="选择多个日期" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        type="multiple"
        value={value}
        poppable
        showPopup={open}
        onClose={setOpen}
        onChange={setValue}
        onConfirm={(newValue) => {
          setFormatValue(formatMultiple(newValue))
          setOpen(false)
        }}
      ></Calendar>
    </>
  )
}
```

### 选择日期区间

设置 `type` 为 `range` 后可以选择日期区间，此时 `onConfirm` 事件处理 value 数组结构，数组第一项为开始时间，第二项为结束时间。

```tsx
function formatRange(dateRange: Date[]) {
  if (dateRange.length) {
    const [start, end] = dateRange
    return `${formatDate(start)} - ${formatDate(end)}`
  }
}

function RangeCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="选择日期区间" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        type="range"
        value={value}
        onChange={setValue}
        poppable
        showPopup={open}
        onClose={setOpen}
        onConfirm={(newValue) => {
          setFormatValue(formatRange(newValue))
          setOpen(false)
        }}
      ></Calendar>
    </>
  )
}
```

### 快捷选择

将 `showConfirm` 设置为 `false` 可以隐藏确认按钮，这种情况下选择完成后会立即触发 confirm 事件。

```tsx
function SingleQuicklyCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="选择单个日期" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        type="single"
        value={value}
        onChange={setValue}
        poppable
        showPopup={open}
        showConfirm={false}
        onClose={setOpen}
        onConfirm={(newValue) => {
          setFormatValue(formatFullDate(newValue))
          setOpen(false)
        }}
      />
    </>
  )
}
```

### 限制选择范围

通过 `maxRange` 限制区间或多选模式下最多可选的天数。超出范围时默认提示“最多选择 n 天”，并触发 `onOverRange`。

`allowSameDay` 默认为 `true`，与历史版本行为一致；设置为 `false` 后，区间的开始和结束日期不能是同一天。

```tsx
<Calendar type="range" maxRange={5} allowSameDay={false} />
```

### 自定义颜色

通过 `css` 可以自定义日历的颜色，对选中日期和底部按钮生效。

```tsx
<Calendar style={{ "--calendar-active-color": "red" }} />
```

### 自定义日期范围

通过 `min` 和 `max` 定义日历的范围。

```tsx
function CustomRangeCalendar() {
  const [minDate] = useState(new Date(2010, 0, 1))
  const [maxDate] = useState(new Date(2010, 0, 31))
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="自定义日期范围" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        type="range"
        min={minDate}
        max={maxDate}
        value={value}
        onChange={setValue}
        poppable
        showPopup={open}
        onClose={setOpen}
        onConfirm={(newValue) => {
          setFormatValue(formatRange(newValue))
          setOpen(false)
        }}
      ></Calendar>
    </>
  )
}
```

### 自定义按钮文字

通过 `confirmText` 设置按钮文字，通过 `confirmDisabledText` 设置按钮禁用时的文字。

```tsx
function CustomConfirmCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="自定义按钮" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        type="range"
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
        }}
        poppable
        showPopup={open}
        confirmDisabledText="请选择结束时间"
        onClose={setOpen}
        onConfirm={(newValue) => {
          setFormatValue(formatRange(newValue))
          setOpen(false)
        }}
      ></Calendar>
    </>
  )
}
```

### 自定义日期文案

通过传入 `formatter` 函数来对日历上每一格的内容进行格式化。

```tsx
const dayFormatter = (day: Calendar.DayObject) => {
  if (!day.value) {
    return day
  }

  const month = day.value.getMonth() + 1
  const date = day.value.getDate()

  if (month === 5) {
    if (date === 1) {
      day.top = "劳动节"
    } else if (date === 4) {
      day.top = "青年节"
    } else if (date === 11) {
      day.children = "今天"
    }
  }

  if (day.type === "start") {
    day.bottom = "入店"
  } else if (day.type === "end") {
    day.bottom = "离店"
  } else if (day.type === "active") {
    day.bottom = "入店/离店"
  }

  return day
}

function CustomDayCalendar() {
  const [open, setOpen] = useState(false)
  const [minDate] = useState(new Date(2010, 4, 1))
  const [maxDate] = useState(new Date(2010, 4, 31))
  const [value, setValue] = useState<Date[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="自定义日期文案" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        type="range"
        min={minDate}
        max={maxDate}
        formatter={dayFormatter}
        value={value}
        onChange={setValue}
        poppable
        showPopup={open}
        onClose={setOpen}
        onConfirm={(newValue) => {
          setFormatValue(formatRange(newValue))
          setOpen(false)
        }}
      ></Calendar>
    </>
  )
}
```

### 自定义弹出位置

通过 `placement` 属性自定义弹出层的弹出位置，可选值为 `top`、`left`、`right`。

```tsx
function CustomPositionCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="自定义弹出位置" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        popupPlacement="right"
        type="single"
        value={value}
        onChange={setValue}
        poppable
        showPopup={open}
        onClose={setOpen}
        onConfirm={(newValue) => {
          setFormatValue(formatFullDate(newValue))
          setOpen(false)
        }}
      ></Calendar>
    </>
  )
}
```

### 自定义周起始日

通过 `firstDayOfWeek` 属性设置一周从哪天开始。

```tsx
function CustomFirstDayOfWeekCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="自定义周起始日" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        popupCloseIcon={false}
        popupRounded={false}
        type="single"
        value={value}
        onChange={setValue}
        poppable
        showPopup={open}
        onClose={setOpen}
        firstDayOfWeek={1}
        onConfirm={(newValue) => {
          setFormatValue(formatFullDate(newValue))
          setOpen(false)
        }}
      ></Calendar>
    </>
  )
}
```

### 平铺展示

将 `poppable` 设置为 `false`，日历会直接展示在页面内，而不是以弹层的形式出现。

```tsx
function TiledCalendar() {
  const [minDate] = useState(new Date(2012, 1, 10))
  const [maxDate] = useState(new Date(2012, 10, 20))
  const [value, setValue] = useState<Date>()
  return (
    <Calendar
      style={{ height: "500px" }}
      title="日历"
      min={minDate}
      max={maxDate}
      value={value}
      onChange={setValue}
    />
  )
}
```

### 惰性渲染

日期范围较大时，可以开启 `lazyRender`，仅渲染可视区域附近月份的日期节点。该属性默认关闭，以保持历史版本中 `formatter` 的调用时机。

```tsx
<Calendar
  style={{ height: "500px" }}
  min={new Date(2020, 0, 1)}
  max={new Date(2030, 11, 31)}
  lazyRender
/>
```

### 实例方法

通过 `ref` 可以重置选中日期、滚动到指定日期或读取当前选中日期。

```tsx
import type { CalendarInstance } from "@taroify/core/calendar"

function CalendarMethods() {
  const calendarRef = useRef<CalendarInstance>(null)

  return (
    <>
      <Button onClick={() => calendarRef.current?.scrollToDate(new Date(2028, 5, 1))}>
        滚动到 2028 年 6 月
      </Button>
      <Calendar ref={calendarRef} lazyRender />
    </>
  )
}
```

### 手动控制 Footer DOM

通过 `Calendar.Footer` `Calendar.Button` 手动控制 Footer DOM。

```tsx
function CustomConfirmCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date[]>()
  const [confirm, setConfirm] = useState("请选择结束时间")
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="自定义按钮" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        type="range"
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          setConfirm(newValue.length === 2 ? "完成" : "请选择结束时间")
        }}
        poppable
        showPopup={open}
        onClose={setOpen}
        onConfirm={(newValue) => {
          setFormatValue(formatRange(newValue))
          setOpen(false)
        }}
      >
        <Calendar.Footer>
          <Calendar.Button type="confirm">{confirm}</Calendar.Button>
        </Calendar.Footer>
      </Calendar>
    </>
  )
}
```

## API

### Props

| 参数                                      | 说明                                                                                                  | 类型                                              | 默认值                                                        |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| type                                      | 选择类型:<br>`single` 表示选择单个日期，<br>`multiple` 表示选择多个日期，<br>`range` 表示选择日期区间 | _string_                                          | `single`                                                      |
| switchMode                                | 切换模式，可选值为 `none` `month` `year-month`                                                       | _string_                                               | `none`                                                        |
| defaultValue                              | 默认选中的日期，`type` 为 `multiple` 或 `range` 时为数组，传入 `null` 表示默认不选择                  | _Date \| Date[] \| null_                          | 今天                                                          |
| value                                     | 选中的日期，`type` 为 `multiple` 或 `range` 时为数组，传入 `null` 表示默认不选择                      | _Date \| Date[] \| null_                          | 今天                                                          |
| formatter                                 | 日期格式化函数                                                                                        | _(day: Calendar.DayObject) => Calendar.DayObject_ | -                                                             |
| title                                     | 日历标题                                                                                              | _ReactNode_                                       | `日期选择`                                                    |
| showTitle                                 | 是否展示日历标题                                                                                      | _boolean_                                         | `true`                                                        |
| showSubtitle                              | 是否展示日历副标题（年月）                                                                             | _boolean_                                              | `true`                                                        |
| subtitle                                  | 自定义日历副标题                                                                                      | _ReactNode\|((date: Date) => ReactNode)_          | (date) => \`${date.getFullYear()}年${date.getMonth() + 1}月\` |
| monthTitle                                | 自定义月份标题                                                                                        | _ReactNode\|((date: Date, title: string) => ReactNode)_ | -                                                       |
| watermark                                 | 是否显示月份背景水印                                                                                  | _boolean_                                         | `true`                                                        |
| min                                       | 可选择的最小日期                                                                                      | _Date_                                            | 当前日期                                                      |
| max                                       | 可选择的最大日期                                                                                      | _Date_                                            | 当前日期的六个月后                                            |
| poppable                                  | 是否以弹层的形式展示日历                                                                               | _boolean_                                              | `false`                                                       |
| showPopup           | 是否显示日历弹窗, poppable: true 时生效                                                               | _boolean_                                         | `false`                                                       |
| popupPlacement                            | 弹出位置，可选值为 `left` `right` `top` , poppable: true 时生效                                       | _string_                                          | `bottom`                                                      |
| popupRounded                              | 是否显示圆角弹窗, poppable: true 时生效                                                               | _boolean_                                              | `true`                                                        |
| popupCloseIcon                            | 弹框是否显示关闭图标, poppable: true 时生效                                                           | _boolean_                                         | `true`                                                        |
| readonly                                  | 是否为只读状态，只读状态下不能选择日期                                                                | _boolean_                                         | `false`                                                       |
| showConfirm                               | 是否展示确认按钮                                                                                       | _boolean_                                              | `true`                                                        |
| confirmText                               | 确认按钮的文字                                                                                         | _ReactNode_                                            | `确认`                                                        |
| confirmDisabledText | 确认按钮处于禁用状态时的文字                                                                          | _ReactNode_                                       | `确认`                                                        |
| firstDayOfWeek                            | 设置周起始日                                                                                          | _0-6_                                             | `0`                                                           |
| lazyRender                                | 是否只渲染可视区域附近月份的日期节点                                                                  | _boolean_                                         | `false`                                                       |
| maxRange                                  | 区间或多选模式下最多可选天数                                                                          | _number_                                          | -                                                             |
| rangePrompt                               | 超出最多可选天数时的提示文案                                                                          | _ReactNode_                                       | `最多选择 n 天`                                               |
| showRangePrompt                           | 超出最多可选天数时是否展示提示                                                                         | _boolean_                                         | `true`                                                        |
| allowSameDay                              | 区间的开始和结束日期是否允许为同一天                                                                  | _boolean_                                         | `true`                                                        |

### Calendar.DayObject 数据结构

日历中的每个日期都对应一个 Day 对象，通过`formatter`属性可以自定义 Day 对象的内容

| 键名      | 说明                                                          | 类型     |
| --------- | ------------------------------------------------------------- | -------- |
| value     | 日期对应的 Date 对象                                          | _Date_   |
| type      | 日期类型，可选值为 `active` `start` `middle` `end` `disabled` | _string_ |
| children  | 中间显示的文字                                                | _string_ |
| top       | 上方的提示信息                                                | _string_ |
| bottom    | 下方的提示信息                                                | _string_ |
| className | 额外类名                                                      | _string_ |

### Events

| 事件名                       | 说明                                                                    | 回调参数                |
| ---------------------------- | ----------------------------------------------------------------------- | ----------------------- |
| onChange                     | 点击并选中任意日期时触发                                                | _value: Date \| Date[]_ |
| onConfirm                    | 日期选择完成后触发，若使用 `Calendar.Button` 组件，则点击确认按钮后触发 | _value: Date \| Date[]_ |
| onClose                      | 关闭弹层时触发                                                        | _visible: boolean_               |
| onUnselect                   | 多选模式下取消选中日期时触发                                          | _value: Date_                    |
| onMonthShow                  | 平铺模式下月份首次进入可视区域时触发                                  | _{ date: Date, title: string }_  |
| onOverRange                  | 选择数量超过 `maxRange` 时触发                                        | -                                |
| onClickSubtitle              | 点击日历副标题时触发                                                  | _event_                          |
| onClickDisabledDate          | 点击禁用日期时触发                                                    | _value: Date_                    |
| onPanelChange                | 年月面板切换时触发                                                    | _{ date: Date }_                 |

### 方法

| 方法名          | 说明                                             | 参数                         | 返回值                         |
| --------------- | ------------------------------------------------ | ---------------------------- | ------------------------------ |
| reset           | 重置到指定日期，未传参数时恢复 `defaultValue`    | _Date \| Date[] \| null_     | -                              |
| scrollToDate    | 滚动或切换到指定日期                             | _Date_                       | -                              |
| getSelectedDate | 获取当前选中的日期                               | -                            | _Date \| Date[] \| null_       |

### Calendar.Footer Props

| 参数     | 说明     | 类型       | 默认值 |
| -------- | -------- | ---------- | ------ |
| children | 底部内容 | _ReactNode_ | -      |

### Calendar.Button Props

| 参数                | 说明                         | 类型        | 默认值    |
| ------------------- | ---------------------------- | ----------- | --------- |
| children            | 按钮内容                     | _ReactNode_ | 确认      |
| type                | 按钮类型                     | _confirm_   | `confirm` |
| confirmText         | 确认按钮的文字               | _ReactNode_ | -         |
| confirmDisabledText | 确认按钮处于禁用状态时的文字 | _ReactNode_ | -         |

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称                                       | 默认值                                             | 描述 |
| ------------------------------------------ | -------------------------------------------------- | ---- |
| --calendar-active-color                    | _var(--blue, $blue)_                               | -    |
| --calendar-background-color                | _var(--white)_                                     | -    |
| --calendar-header-box-shadow               | _0 2px * $hd 10px * $hd rgba(125, 126, 128, 0.16)_ | -    |
| --calendar-header-title-height             | _44px \* $hd_                                      | -    |
| --calendar-header-title-font-size          | _var(--font-size-lg)_                              | -    |
| --calendar-header-subtitle-font-size       | _var(--font-size-md)_                              | -    |
| --calendar-header-action-width             | _28px \* $hd_                                      | -    |
| --calendar-header-action-color             | _var(--text-color)_                                | -    |
| --calendar-header-action-disabled-color    | _var(--text-color-3)_                              | -    |
| --calendar-weekdays-height                 | _30px \* $hd_                                      | -    |
| --calendar-weekdays-font-size              | _var(--font-size-sm)_                              | -    |
| --calendar-month-title-font-size           | _var(--font-size-md)_                              | -    |
| --calendar-month-watermark-color           | _rgba(242, 243, 245, 0.8)_                         | -    |
| --calendar-month-watermark-font-size       | _160px \* $hd_                                     | -    |
| --calendar-range-edge-color                | _var(--white)_                                     | -    |
| --calendar-range-edge-background-color     | _var(--calendar-active-color)_                     | -    |
| --calendar-range-middle-color              | _var(--calendar-active-color)_                     | -    |
| --calendar-range-middle-background-opacity | _0.1_                                              | -    |
| --calendar-day-height                      | _64px \* $hd_                                      | -    |
| --calendar-day-font-size                   | _var(--font-size-lg)_                              | -    |
| --calendar-day-disabled-color              | _var(--gray-5)_                                    | -    |
| --calendar-active-day-size                 | _54px \* $hd_                                      | -    |
| --calendar-active-day-color                | _var(--white)_                                     | -    |
| --calendar-active-day-background-color     | _var(--calendar-active-color)_                     | -    |
| --calendar-active-day-border-radius        | _var(--border-radius-md)_                          | -    |
| --calendar-day-info-font-size              | _var(--font-size-xs)_                              | -    |
| --calendar-day-info-line-height            | _var(--line-height-xs)_                            | -    |
| --calendar-confirm-button-height           | _36px \* $hd_                                      | -    |
| --calendar-confirm-button-margin           | _7px \* $hd 0_                                     | -    |
| --calendar-confirm-button-color            | _var(--calendar-active-color)_                     | -    |
| --calendar-footer-padding                  | _0 var(--padding-md)_                              | -    |
