import { Calendar, Cell } from "@taroify/core"
import type { CalendarInstance } from "@taroify/core/calendar"
import { useRef, useState } from "react"
import Block from "../../../components/block"
import CustomWrapper from "../../../components/custom-wrapper"
import Page from "../../../components/page"
import "./index.scss"

const longRangeMin = new Date(2020, 0, 1)
const longRangeMax = new Date(2030, 11, 31)

const formatDate = (date: Date) => {
  if (date) {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

const formatFullDate = (date: Date) => {
  if (date) {
    return `${date.getFullYear()}/${formatDate(date)}`
  }
}

const formatMultiple = (dates: Date[]) => {
  if (dates.length) {
    return `选择了 ${dates.length} 个日期`
  }
}

const formatRange = (dateRange: Date[]) => {
  if (dateRange.length) {
    const [start, end] = dateRange
    return `${formatDate(start)} - ${formatDate(end)}`
  }
}

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

function SingleCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell
        title="选择单个日期"
        isLink
        children={formatValue}
        onClick={() => setOpen(true)}
      />
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
      >
      </Calendar>
    </>
  )
}

function MultipleCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell
        title="选择多个日期"
        isLink
        children={formatValue}
        onClick={() => setOpen(true)}
      />
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
      >
      </Calendar>
    </>
  )
}

function RangeCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell
        title="选择日期区间"
        isLink
        children={formatValue}
        onClick={() => setOpen(true)}
      />
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
      >
      </Calendar>
    </>
  )
}

function SwitchModeCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="年月切换" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        min={longRangeMin}
        max={longRangeMax}
        switchMode="year-month"
        value={value}
        onChange={setValue}
        poppable
        showPopup={open}
        onClose={setOpen}
        onConfirm={(newValue) => {
          setFormatValue(formatFullDate(newValue))
          setOpen(false)
        }}
      />
    </>
  )
}

function LimitedRangeCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell title="最多选择 5 天" isLink children={formatValue} onClick={() => setOpen(true)} />
      <Calendar
        type="range"
        maxRange={5}
        allowSameDay={false}
        value={value}
        onChange={setValue}
        poppable
        showPopup={open}
        onClose={setOpen}
        onConfirm={(newValue) => {
          setFormatValue(formatRange(newValue))
          setOpen(false)
        }}
      />
    </>
  )
}

function SingleQuicklyCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell
        title="选择单个日期"
        isLink
        children={formatValue}
        onClick={() => setOpen(true)}
      />
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

function RangeQuicklyCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell
        title="选择日期区间"
        isLink
        children={formatValue}
        onClick={() => setOpen(true)}
      />
      <Calendar
        type="range"
        value={value}
        onChange={setValue}
        poppable
        showPopup={open}
        onClose={setOpen}
        showConfirm={false}
        onConfirm={(newValue) => {
          setFormatValue(formatRange(newValue))
          setOpen(false)
        }}
      />
    </>
  )
}

function CustomColorCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell
        title="自定义颜色"
        isLink
        children={formatValue}
        onClick={() => setOpen(true)}
      />
      <Calendar
        style={{
          // @ts-ignore
          "--calendar-active-color": "red",
        }}
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
      />
    </>
  )
}

function CustomRangeCalendar() {
  const [minDate] = useState(new Date(2010, 0, 1))
  const [maxDate] = useState(new Date(2010, 0, 31))
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell
        title="自定义日期范围"
        isLink
        children={formatValue}
        onClick={() => setOpen(true)}
      />
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
      >
      </Calendar>
    </>
  )
}

function CustomConfirmCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell
        title="自定义按钮"
        isLink
        children={formatValue}
        onClick={() => setOpen(true)}
      />
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
      >
      </Calendar>
    </>
  )
}

function CustomDayCalendar() {
  const [open, setOpen] = useState(false)
  const [minDate] = useState(new Date(2010, 4, 1))
  const [maxDate] = useState(new Date(2010, 4, 31))
  const [value, setValue] = useState<Date[]>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell
        title="自定义日期文案"
        isLink
        children={formatValue}
        onClick={() => setOpen(true)}
      />
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
      >
      </Calendar>
    </>
  )
}

function CustomPositionCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell
        title="自定义弹出位置"
        isLink
        children={formatValue}
        onClick={() => setOpen(true)}
      />
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
      >
      </Calendar>
    </>
  )
}

function CustomFirstDayOfWeekCalendar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<Date>()
  const [formatValue, setFormatValue] = useState<string>()

  return (
    <>
      <Cell
        title="自定义周起始日"
        isLink
        children={formatValue}
        onClick={() => setOpen(true)}
      />
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
      >
      </Calendar>
    </>
  )
}


function CustomWithoutTitleCalendar() {
  const [minDate] = useState(new Date(2025, 6, 1))
  const [maxDate] = useState(new Date(2025, 6, 30))
  const [value, setValue] = useState<Date>()
  return (
    <Calendar
      style={{ height: "500px" }}
      showTitle={false}
      showSubtitle={false}
      min={minDate}
      max={maxDate}
      value={value}
      onChange={setValue}
    />
  )
}

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

function LazyRenderCalendar() {
  const calendarRef = useRef<CalendarInstance>(null)
  const [value, setValue] = useState(new Date(2025, 0, 1))

  return (
    <>
      <Cell.Group clickable>
        <Cell
          title="滚动到 2028 年 6 月"
          isLink
          onClick={() => calendarRef.current?.scrollToDate(new Date(2028, 5, 1))}
        />
        <Cell title="重置日期" isLink onClick={() => calendarRef.current?.reset()} />
      </Cell.Group>
      <Calendar
        ref={calendarRef}
        style={{ height: "500px" }}
        min={longRangeMin}
        max={longRangeMax}
        defaultValue={new Date(2025, 0, 1)}
        value={value}
        onChange={setValue}
        lazyRender
      />
    </>
  )
}

export default function CalendarDemo() {
  return (
    <Page title="Calendar 日历" className="calendar-demo">
      <Block title="基础用法">
        <Cell.Group clickable inset>
          <CustomWrapper>
            <SingleCalendar />
          </CustomWrapper>
          <CustomWrapper>
            <MultipleCalendar />
          </CustomWrapper>
          <CustomWrapper>
            <RangeCalendar />
          </CustomWrapper>
          <CustomWrapper>
            <SwitchModeCalendar />
          </CustomWrapper>
          <CustomWrapper>
            <LimitedRangeCalendar />
          </CustomWrapper>
        </Cell.Group>
      </Block>
      <Block title="快捷选择">
        <Cell.Group clickable inset>
          <CustomWrapper>
            <SingleQuicklyCalendar />
          </CustomWrapper>
          <CustomWrapper>
            <RangeQuicklyCalendar />
          </CustomWrapper>
        </Cell.Group>
      </Block>
      <Block title="自定义日历">
        <Cell.Group clickable inset>
          <CustomWrapper>
            <CustomColorCalendar />
          </CustomWrapper>
          <CustomWrapper>
            <CustomRangeCalendar />
          </CustomWrapper>
          <CustomWrapper>
            <CustomConfirmCalendar />
          </CustomWrapper>
          <CustomWrapper>
            <CustomDayCalendar />
          </CustomWrapper>
          <CustomWrapper>
            <CustomPositionCalendar />
          </CustomWrapper>
          <CustomWrapper>
            <CustomFirstDayOfWeekCalendar />
          </CustomWrapper>
        </Cell.Group>
      </Block>
      <Block variant="card" title="平铺展示">
        <TiledCalendar />
      </Block>
      <Block variant="card" title="隐藏标题">
        <CustomWithoutTitleCalendar />
      </Block>
      <Block variant="card" title="惰性渲染与实例方法">
        <LazyRenderCalendar />
      </Block>
    </Page>
  )
}
