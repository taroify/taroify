# DatetimePicker 时间选择

### 介绍

时间选择器，支持日期、年月、时分秒等维度，通常与[弹出层](/components/popup)组件配合使用。

### 引入

```tsx
import { DatetimePicker } from "@taroify/core"
```

## 代码演示

### 选择年月日

DatetimePicker 通过 type 属性来定义需要选择的时间类型，type 为 `date` 表示选择年月日。通过 min 和 max 属性可以确定可选的时间范围。

```tsx
function DatePicker() {
  const [minDate] = useState(new Date(2021, 9, 14))
  const [maxDate] = useState(new Date(2023, 11, 12))
  const [defaultValue] = useState(new Date(2021, 9, 14))
  const [value, setValue] = useState(new Date(2022, 10, 14))
  return (
    <DatetimePicker
      type="date"
      min={minDate}
      max={maxDate}
      defaultValue={defaultValue}
      value={value}
      onChange={setValue}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年月日</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}
```

### 选择年月

将 type 设置为 `year-month` 即可选择年份和月份。通过传入 `formatter` 函数，可以对选项文字进行格式化处理。

```tsx
function YearMonthPicker() {
  const [minDate] = useState(new Date(2020, 0, 1))
  const [maxDate] = useState(new Date(2025, 10, 1))
  const [defaultValue] = useState(new Date(2021, 0, 17))

  return (
    <DatetimePicker
      type="year-month"
      min={minDate}
      max={maxDate}
      defaultValue={defaultValue}
      formatter={(type, val) => {
        if (type === "year") {
          return `${val}年`
        }
        if (type === "month") {
          return `${val}月`
        }
        return val
      }}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年月</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}
```

### 选择月日

将 type 设置为 `month-day` 即可选择月份和日期。

```tsx
function MonthDayPicker() {
  const [minDate] = useState(new Date(2020, 0, 1))
  const [maxDate] = useState(new Date(2025, 10, 1))
  const [defaultValue] = useState(new Date(2021, 0, 17))

  return (
    <DatetimePicker
      type="month-day"
      min={minDate}
      max={maxDate}
      defaultValue={defaultValue}
      formatter={(type, val) => {
        if (type === "month") {
          return `${val}月`
        }
        if (type === "day") {
          return `${val}日`
        }
        return val
      }}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年月</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}
```

### 选择时间

将 type 设置为 `time` 即可选择时间（时、分、秒）。

```tsx
function TimePicker() {
  const [minDate] = useState(new Date(2020, 0, 1, 10, 0, 0))
  const [maxDate] = useState(new Date(2020, 0, 1, 20, 59, 59))
  const [defaultValue] = useState(new Date(2020, 0, 1, 12, 0, 0))

  return (
    <DatetimePicker type="time" min={minDate} max={maxDate} defaultValue={defaultValue}>
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择时间</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}
```

### 选择完整时间

将 type 设置为 `datetime` 即可选择完整时间，包括年月日时分秒。

```tsx
function DateTimePicker() {
  const [minDate] = useState(new Date(2020, 0, 1, 10, 0, 0))
  const [maxDate] = useState(new Date(2025, 10, 1, 20, 59, 59))
  const [defaultValue] = useState(new Date(2021, 2, 3, 12, 12, 12))

  return (
    <DatetimePicker type="datetime" min={minDate} max={maxDate} defaultValue={defaultValue}>
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择完整时间</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}
```

### 选择年月日小时

将 type 设置为 `date-hour` 即可选择日期和小时，包括年月日和小时。

```tsx
function DateHourPicker() {
  const [minDate] = useState(new Date(2020, 0, 1, 0))
  const [maxDate] = useState(new Date(2025, 10, 1, 23))
  const [defaultValue] = useState(new Date())

  return (
    <DatetimePicker type="date-hour" min={minDate} max={maxDate} defaultValue={defaultValue}>
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年月日小时</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}
```

### 选择年月日时分

将 type 设置为 `date-minute` 即可选择日期和时分，包括年月日时分。

```tsx
function DateMinutePicker() {
  const [minDate] = useState(new Date(2020, 0, 1, 0, 0))
  const [maxDate] = useState(new Date(2025, 10, 1, 23, 59))
  const [defaultValue] = useState(new Date())

  return (
    <DatetimePicker type="date-minute" min={minDate} max={maxDate} defaultValue={defaultValue}>
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年月日时分</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}
```

### 选项过滤器

通过传入 `filter` 函数，可以对选项数组进行过滤，实现自定义时间间隔。

```tsx
function TimePickerWithFilter() {
  const [minDate] = useState(new Date(2020, 0, 1, 0, 0, 0))
  const [maxDate] = useState(new Date(2020, 0, 1, 23, 59, 59))
  const [defaultValue] = useState(new Date(2020, 0, 1, 12, 0, 0))

  return (
    <DatetimePicker
      type="time"
      min={minDate}
      max={maxDate}
      defaultValue={defaultValue}
      filter={(type, options) => {
        if (type === "minute") {
          return options.filter((option) => Number(option) % 5 === 0)
        }
        return options
      }}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选项过滤器</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}
```

### 自定义列排序

```tsx
function DatePickerWithFields() {
  const [minDate] = useState(new Date(2020, 0, 1))
  const [maxDate] = useState(new Date(2025, 10, 1))
  const [defaultValue] = useState(new Date(2021, 0, 17))
  return (
    <DatetimePicker
      type="date"
      fields={["month", "day", "year"]}
      defaultValue={defaultValue}
      min={minDate}
      max={maxDate}
      formatter={(type, val) => {
        if (type === "year") {
          return val + "年"
        }
        if (type === "month") {
          return val + "月"
        }
        if (type === "day") {
          return val + "日"
        }
        return val
      }}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>自定义列排序</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}
```

### 选项类型 <Tag tag="v1.0.5" />

通过 `columnsType` 属性可以控制选项的类型，并支持以任意顺序对 `year`、`month`、`day`、`hour`、`minute` 和 `second` 进行排列组合。`columnsType` 的优先级高于 `type` 和 `fields`。

例如，传入 `['year']` 可以单独选择年份：

```tsx
function DatePickerWithColumnsType() {
  const [minDate] = useState(new Date(2020, 0, 1))
  const [maxDate] = useState(new Date(2025, 11, 31))
  const [defaultValue] = useState(new Date(2024, 0, 1))

  return (
    <DatetimePicker
      columnsType={["year"]}
      defaultValue={defaultValue}
      min={minDate}
      max={maxDate}
      formatter={(type, val) => (type === "year" ? `${val}年` : val)}
    >
      <DatetimePicker.Toolbar>
        <DatetimePicker.Button>取消</DatetimePicker.Button>
        <DatetimePicker.Title>选择年份</DatetimePicker.Title>
        <DatetimePicker.Button>确认</DatetimePicker.Button>
      </DatetimePicker.Toolbar>
    </DatetimePicker>
  )
}
```

## API

### Props

| 参数         | 说明                                                                                                               | 类型                                           | 默认值     |
| ------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ---------- |
| type         | 时间类型，可选值为 `date` `time` <br /> `year-month` `month-day` `date-hour` `date-minute` `hour-minute`           | _string_                                       | `datetime` |
| columnsType <Tag tag="v1.0.5" /> | 选项类型及顺序，由 `year` `month` `day` `hour` `minute` `second` 组成；设置后优先于 `type` 和 `fields` | _string[]_ | - |
| defaultValue | 默认选中的时间                                                                                                     | _Date_                                         | -          |
| value        | 选中的时间                                                                                                         | _Date_                                         | -          |
| min          | 可选的最小时间，精确到秒                                                                                           | _Date_                                         | 十年前     |
| max          | 可选的最大时间，精确到秒                                                                                           | _Date_                                         | 十年后     |
| filter       | 选项过滤函数                                                                                                       | _(type: string, values: string[]) => string[]_ | -          |
| formatter    | 选项格式化函数                                                                                                     | _(type: string, value: string) => string_      | -          |
| fields       | 自定义列排序数组，子项可选值为<br /> `year` `month` `day` `hour` `minute` `second`                                 | _string[]_                                     | -          |
| loading      | 是否显示加载状态                                                                                                   | _boolean_                                      | `false`    |
| readonly     | 是否为只读状态，只读状态下无法切换选项                                                                             | _boolean_                                      | `false`    |
| siblingCount | 可见的选项相邻个数                                                                                                 | _number_                                       | `3`        |

### Events

| 事件名    | 说明                     | 回调参数    |
| --------- | ------------------------ | ----------- |
| onChange  | 当值变化时触发的事件     | value: Date |
| onConfirm | 点击完成按钮时触发的事件 | value: Date |
| onCancel  | 点击取消按钮时触发的事件 | value: Date |

### 方法 <Tag tag="v1.0.5" />

通过 ref 可以获取 DatetimePicker 实例并调用实例方法。

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| confirm <Tag tag="v1.0.5" /> | 停止惯性滚动并触发 `onConfirm` 事件 | - | - |
| getSelectedDate <Tag tag="v1.0.5" /> | 获取当前选中的时间 | - | _Date_ |

```tsx
import { useRef } from "react"
import type { DatetimePickerInstance } from "@taroify/core"

const datetimePickerRef = useRef<DatetimePickerInstance>(null)

datetimePickerRef.current?.confirm()
const selectedDate = datetimePickerRef.current?.getSelectedDate()
```

### 类型定义 <Tag tag="v1.0.5" />

组件导出以下类型定义：

```tsx
import type {
  DatetimePickerColumnType,
  DatetimePickerInstance,
  DatetimePickerProps,
  DatetimePickerType,
} from "@taroify/core"
```

## 常见问题

### 设置 min 或 max 后出现页面卡死的情况？

请注意不要在模板中直接使用类似`min="new Date()"`的写法，这样会导致每次渲染组件时传入一个新的 Date 对象，而传入新的数据会触发下一次渲染，从而陷入死循环。

正确的做法是将`date`作为一个数据定义在`useState`或者`useRef`函数中。

### 在 iOS 系统上初始化组件失败？

如果你遇到了在 iOS 上无法渲染组件的问题，请确认在创建 Date 对象时没有使用`new Date('2020-01-01')`这样的写法，iOS 不支持以中划线分隔的日期格式，正确写法是`new Date('2020/01/01')`
。

对此问题的详细解释：[stackoverflow](https://stackoverflow.com/questions/13363673/javascript-date-is-invalid-on-ios)。

### 是否有年份或月份选择器？

如果仅需要选择年份或者月份，建议直接使用 [Picker](/components/picker) 组件。
