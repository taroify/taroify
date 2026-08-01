import { useUncontrolled } from "@taroify/hooks"
import { ScrollView, View, type ITouchEvent } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import { nextTick, getEnv } from "@tarojs/taro"
import classNames from "classnames"
import * as _ from "lodash"
// biome-ignore lint/correctness/noUnusedImports: the package Babel preset uses the classic JSX runtime
import * as React from "react"
import {
  Children,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type FC,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import Popup from "../popup"
import Toast from "../toast"
import type { PopupPlacement } from "../popup"
import type { PopupProps } from "../popup/popup"
import { prefixClassname } from "../styles"
import { getRect } from "../utils/dom/rect"
import { getScrollTop } from "../utils/dom/scroll"
import { useRefs } from "../utils/state"
import raf from "../utils/raf"
import { useMemoizedFn } from "../hooks"
import CalendarFooter from "./calendar-footer"
import CalendarButton from "./calendar-button"
import CalendarHeader from "./calendar-header"
import CalendarMonth, { type CalendarMonthInstance } from "./calendar-month"
import CalendarContext from "./calendar.context"
import {
  type CalendarDayObject,
  type CalendarInstance,
  type CalendarMonthShowEvent,
  type CalendarMonthTitle,
  type CalendarPanelChangeEvent,
  type CalendarSubtitle,
  type CalendarSwitchMode,
  type CalendarType,
  type CalendarValueType,
  compareDate,
  compareYearMonth,
  createDayByOffset,
  createNextDay,
  createPreviousDay,
  createToday,
  getDateCount,
  MAX_DATE,
  MIN_DATE,
  genMonthId,
} from "./calendar.shared"

function defaultSubtitleRender(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}

function defaultFormatter(day: CalendarDayObject) {
  return day
}

function normalizeCalendarValue(
  dateValue: CalendarValueType | undefined,
  type: CalendarType,
  min: Date,
  max: Date,
): CalendarValueType | undefined {
  if (dateValue === null || dateValue === undefined) {
    return dateValue
  }

  const limitDateRange = (date: Date, minDate = min, maxDate = max) => {
    if (compareDate(date, minDate) === -1) {
      return minDate
    }
    if (compareDate(date, maxDate) === 1) {
      return maxDate
    }
    return date
  }
  const dates = Array.isArray(dateValue) ? dateValue : [dateValue]

  if (type === "range") {
    const [start, end] = dates
    if (!start) {
      return []
    }

    const normalizedStart = limitDateRange(start, min, createPreviousDay(max))
    return end ? [normalizedStart, limitDateRange(end, createNextDay(min))] : [normalizedStart]
  }

  if (type === "multiple") {
    return dates.map((date) => limitDateRange(date))
  }

  return dates[0] ? limitDateRange(dates[0]) : null
}

export interface CalendarProps extends ViewProps {
  type?: CalendarType
  switchMode?: CalendarSwitchMode
  showTitle?: boolean
  title?: ReactNode
  subtitle?: CalendarSubtitle
  showSubtitle?: boolean
  monthTitle?: CalendarMonthTitle
  defaultValue?: CalendarValueType
  value?: CalendarValueType
  min?: Date
  max?: Date
  poppable?: boolean
  showPopup?: boolean
  popupPlacement?: PopupPlacement
  popupRounded?: boolean
  popupCloseIcon?: boolean
  showConfirm?: boolean
  confirmText?: ReactNode
  confirmDisabledText?: ReactNode
  firstDayOfWeek?: number
  watermark?: boolean
  lazyRender?: boolean
  readonly?: boolean
  maxRange?: number
  rangePrompt?: ReactNode
  showRangePrompt?: boolean
  allowSameDay?: boolean
  children?: ReactNode

  formatter?(day: CalendarDayObject): CalendarDayObject

  onChange?(value: any): void

  onConfirm?(value: any): void

  onClose?(val: boolean): void

  onUnselect?(value: Date): void

  onMonthShow?(event: CalendarMonthShowEvent): void

  onOverRange?(): void

  onClickSubtitle?(event: ITouchEvent): void

  onClickDisabledDate?(value: Date): void

  onPanelChange?(event: CalendarPanelChangeEvent): void
}

const Calendar = forwardRef<CalendarInstance, CalendarProps>((props, ref) => {
  const {
    className,
    style,
    showTitle = true,
    title = "日期选择",
    subtitle = defaultSubtitleRender,
    showSubtitle = true,
    type = "single",
    switchMode = "none",
    // set false to be compatible with lower versions
    poppable = false,
    showPopup = false,
    popupPlacement = "bottom",
    popupRounded = true,
    popupCloseIcon = true,
    showConfirm = true,
    confirmText = "确认",
    confirmDisabledText = "确认",
    defaultValue: defaultValueProp,
    value: valueProp,
    min: minValue = MIN_DATE,
    max: maxValue = MAX_DATE,
    firstDayOfWeek,
    readonly = false,
    watermark = true,
    lazyRender = false,
    formatter = defaultFormatter,
    monthTitle,
    maxRange,
    rangePrompt,
    showRangePrompt = true,
    allowSameDay = true,
    children: childrenProp,
    onChange: onChangeProp,
    onConfirm,
    onClose,
    onUnselect,
    onMonthShow,
    onOverRange,
    onClickSubtitle,
    onClickDisabledDate,
    onPanelChange,
  } = props
  const canSwitch = switchMode !== "none"
  const scrollToDateLoadingRef = useRef(false)
  const Wrapper = useMemo<FC<PopupProps>>(
    () => (poppable ? Popup : ({ children }) => <>{children}</>),
    [poppable],
  )
  // biome-ignore lint/correctness/useExhaustiveDependencies: defaultValue only initializes uncontrolled state
  const defaultValue = useMemo(() => getInitialDate(defaultValueProp), [])
  const { value: currentValue, setValue } = useUncontrolled({
    defaultValue,
    value: valueProp,
    onChange: onChangeProp,
  })
  const minTime = minValue.getTime()
  const maxTime = maxValue.getTime()
  const calendarOptionsRef = useRef({ type, min: minTime, max: maxTime })
  const [shouldNormalizeValue, setShouldNormalizeValue] = useState(false)
  const value = useMemo(
    () =>
      shouldNormalizeValue
        ? normalizeCalendarValue(currentValue, type, minValue, maxValue)
        : currentValue,
    [currentValue, type, minValue, maxValue, shouldNormalizeValue],
  )
  const [currentPanelDate, setCurrentPanelDate] = useState(() => getInitialPanelDate(value))

  const renderFooter = () => {
    let _footer: ReactNode = null
    Children.forEach(childrenProp, (child: ReactNode) => {
      if (isValidElement(child)) {
        const element = child as ReactElement
        const { type: elementType } = element
        if (elementType === CalendarFooter) {
          _footer = element
        }
      }
    })
    if (!_footer && showConfirm) {
      _footer = (
        <CalendarFooter>
          <CalendarButton
            type="confirm"
            confirmText={confirmText}
            confirmDisabledText={confirmDisabledText}
          />
        </CalendarFooter>
      )
    }
    return _footer
  }

  const scrollViewRef = useRef<HTMLDivElement>()
  const scrollViewHeightRef = useRef(0)

  const hasConfirmRef = useRef(false)

  const [currentMonth, setCurrentMonth] = useState<Date>()
  const shownMonthsRef = useRef(new Set<number>())

  const changeValueRef = useRef<CalendarValueType>()

  const [scrollIntoView, setScrollIntoView] = useState("")

  const {
    getRef: getMonthRef,
    getRefs: getMonthRefs,
    setRefs: setMonthRefs,
    clearRefs: clearMonthRefs,
  } = useRefs<CalendarMonthInstance>()

  const dayOffset = useMemo(() => (firstDayOfWeek ? +firstDayOfWeek % 7 : 0), [firstDayOfWeek])

  const months = useMemo<Date[]>(() => {
    if (canSwitch) {
      return [currentPanelDate]
    }
    const months: Date[] = []
    const cursor = new Date(minValue)

    cursor.setDate(1)

    do {
      months.push(new Date(cursor))
      cursor.setMonth(cursor.getMonth() + 1)
    } while (compareYearMonth(cursor, maxValue) !== 1)

    return months
  }, [canSwitch, currentPanelDate, maxValue, minValue])

  function limitDateRange(date: Date, minDate = minValue, maxDate = maxValue) {
    if (compareDate(date, minDate) === -1) {
      return minDate
    }
    if (compareDate(date, maxDate) === 1) {
      return maxDate
    }
    return date
  }

  function getInitialDate(defaultDate?: CalendarValueType) {
    if (defaultDate === null) {
      return defaultDate
    }

    const now = createToday()
    let defaultDateCache = defaultDate
    if (type === "range") {
      if (!Array.isArray(defaultDateCache)) {
        defaultDateCache = []
      }
      const start = limitDateRange(
        defaultDateCache[0] || now,
        minValue,
        createPreviousDay(maxValue),
      )
      const endDefault = defaultDateCache[1] || (allowSameDay ? now : createNextDay(now))
      const end = limitDateRange(endDefault, createNextDay(minValue))
      if (!allowSameDay && compareDate(start, end) === 0) {
        return [start, limitDateRange(createNextDay(start), createNextDay(minValue))]
      }
      return [start, end]
    }

    if (type === "multiple") {
      if (Array.isArray(defaultDateCache)) {
        return defaultDateCache.map((date) => limitDateRange(date))
      }
      return [limitDateRange(now)]
    }

    if (!defaultDateCache || Array.isArray(defaultDateCache)) {
      defaultDateCache = now
    }
    return limitDateRange(defaultDateCache)
  }

  function getInitialPanelDate(dateValue?: CalendarValueType) {
    const date = Array.isArray(dateValue) ? dateValue[0] : dateValue
    return limitDateRange(date || createToday())
  }

  // get first disabled calendarDay between date range
  function getDisabledDate(
    disabledDays: CalendarDayObject[],
    startDay: Date,
    date: Date,
  ): Date | undefined {
    return disabledDays.find(
      (day) => compareDate(startDay, day.value!) === -1 && compareDate(day.value!, date) === -1,
    )?.value
  }

  // disabled calendarDay
  function getDisabledDays() {
    return getMonthRefs().reduce((arr, ref) => {
      arr.push(...(ref.current?.getDisabledDays() ?? []))
      return arr
    }, [] as CalendarDayObject[])
  }

  function notifyOverRange() {
    if (showRangePrompt) {
      Toast.open(rangePrompt ?? `最多选择 ${maxRange} 天`)
    }
    onOverRange?.()
  }

  function checkRange(dateRange: [Date, Date]) {
    if (maxRange && maxRange > 0 && getDateCount(dateRange) > maxRange) {
      notifyOverRange()
      return false
    }
    return true
  }

  function change(dateValue: CalendarValueType, complete?: boolean) {
    changeValueRef.current = dateValue
    setValue?.(dateValue)

    if (complete && !hasConfirmRef.current) {
      onConfirm?.(dateValue)
    }
  }

  function onDayClick(day: CalendarDayObject) {
    const { value: date } = day
    if (readonly || !date) {
      return
    }

    if (type === "range") {
      const disabledDays = getDisabledDays()

      if (!value) {
        change([date])
        return
      }

      const [startDay, endDay] = value as [Date, Date]

      if (startDay && !endDay) {
        const compareToStart = compareDate(date, startDay)

        if (compareToStart === 1) {
          const disabledDay = getDisabledDate(disabledDays, startDay, date)

          const endDay = disabledDay ? createPreviousDay(disabledDay) : date
          if (!checkRange([startDay, endDay])) {
            change([startDay, createDayByOffset(startDay, maxRange! - 1)])
          } else {
            change([startDay, endDay], true)
          }
        } else if (compareToStart === -1) {
          change([date])
        } else if (allowSameDay) {
          change([date, date], true)
        }
      } else {
        change([date])
      }
    } else if (type === "multiple") {
      if (!value) {
        change([date])
        return
      }
      const dates = value as Date[]

      const newDates = _.filter(dates, (dateItem) => compareDate(dateItem, date) !== 0)
      if (_.size(newDates) !== _.size(dates)) {
        change(newDates)
        onUnselect?.(date)
      } else if (maxRange && maxRange > 0 && dates.length >= maxRange) {
        notifyOverRange()
      } else {
        change([...dates, date])
      }
    } else {
      change(date, true)
    }
  }

  async function onScroll() {
    if (scrollToDateLoadingRef.current) {
      return
    }
    const top = await getScrollTop(scrollViewRef)
    const bottom = top + scrollViewHeightRef.current
    const monthRefs = months.map((_, index) => getMonthRef(index).current)
    const heights = monthRefs.map((monthRef) => monthRef?.getHeight() ?? 0)
    const heightSum = heights.reduce((a, b) => a + b, 0)

    // iOS scroll bounce may exceed the range
    if (bottom > heightSum && top > 0) {
      return
    }

    let height = 0
    let currentMonthRef: CalendarMonthInstance | undefined
    const visibleRange = [-1, -1]

    for (let i = 0; i < months.length; i++) {
      const month = monthRefs[i]
      const visible = height <= bottom && height + heights[i] >= top

      if (visible && month) {
        visibleRange[1] = i
        if (!currentMonthRef) {
          currentMonthRef = month
          visibleRange[0] = i
        }
        const monthValue = month.getValue()
        const monthTime = monthValue.getTime()
        if (!shownMonthsRef.current.has(monthTime)) {
          shownMonthsRef.current.add(monthTime)
          onMonthShow?.({ date: monthValue, title: month.getTitle() })
        }
      }

      height += heights[i]
    }

    if (lazyRender) {
      monthRefs.forEach((month, index) => {
        month?.setVisible(index >= visibleRange[0] - 1 && index <= visibleRange[1] + 1)
      })
    }

    if (currentMonthRef) {
      setCurrentMonth(currentMonthRef.getValue())
    }
  }

  async function scrollToDate(targetDate: Date) {
    if (canSwitch) {
      setCurrentPanelDate(limitDateRange(targetDate))
      return
    }
    months.some((month, index) => {
      if (compareYearMonth(month, targetDate) === 0) {
        scrollToDateLoadingRef.current = true
        const currentMonthRef = getMonthRef(index)
        const currentMonth = currentMonthRef.current
        if (!currentMonth) {
          scrollToDateLoadingRef.current = false
          return false
        }
        if (lazyRender) {
          currentMonth.setVisible(true)
        }
        const month = currentMonth.getValue()
        setCurrentMonth(month)
        if (getEnv() === "WEB") {
          nextTick(() => {
            const scrollView = scrollViewRef.current!
            const resetScrollToDateLoading = () => {
              nextTick(() => {
                scrollToDateLoadingRef.current = false
                void onScroll()
              })
            }
            Promise.all([
              getRect(scrollView),
              getScrollTop(scrollView),
              currentMonth.getRectTop(),
            ]).then(([{ top: scrollViewRectTop }, currentScrollTop, currentMonthRectTop]) => {
              const newBodyScrollTop = currentMonthRectTop - scrollViewRectTop + currentScrollTop
              scrollView.scrollTop = newBodyScrollTop
              resetScrollToDateLoading()
            }, resetScrollToDateLoading)
          })
        } else {
          setScrollIntoView(genMonthId(month))
          nextTick(() => {
            scrollToDateLoadingRef.current = false
            void onScroll()
          })
        }

        return true
      }
      return false
    })
  }

  // scroll to current month
  async function scrollToCurrentDate(newValue?: CalendarValueType) {
    if (poppable && !showPopup) {
      return
    }
    if (newValue) {
      const targetDate = type === "single" ? (newValue as Date) : (newValue as Date[])[0]
      scrollToDate(targetDate)
    } else {
      void onScroll()
    }
  }

  const resetScroll = (date?: CalendarValueType) => nextTick(() => scrollToCurrentDate(date).then())

  const init = useMemoizedFn(() => {
    if (poppable && !showPopup) {
      setScrollIntoView("")
      return
    }

    if (canSwitch) {
      resetScroll(getInitialDate(value))
      return
    }

    raf(async () => {
      // add Math.floor to avoid decimal height issues
      // https://github.com/vant-ui/vant/issues/5640
      const bodyHeight = (await getRect(scrollViewRef)).height
      scrollViewHeightRef.current = Math.floor(bodyHeight)
      resetScroll(getInitialDate(value))
    })
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: value changes only need to reset scrolling
  useEffect(() => {
    if (value !== changeValueRef.current) {
      resetScroll(getInitialDate(value))
    }
  }, [value])

  useEffect(() => {
    const previousOptions = calendarOptionsRef.current
    const changed =
      previousOptions.type !== type ||
      previousOptions.min !== minTime ||
      previousOptions.max !== maxTime

    calendarOptionsRef.current = { type, min: minTime, max: maxTime }
    if (changed) {
      setShouldNormalizeValue(true)
    }
  }, [type, minTime, maxTime])

  // biome-ignore lint/correctness/useExhaustiveDependencies: option changes intentionally reset normalized state
  useEffect(() => {
    const initialDate = getInitialDate(value)
    setCurrentPanelDate(getInitialPanelDate(initialDate))
    resetScroll(initialDate)
  }, [type, minValue, maxValue, switchMode])

  // biome-ignore lint/correctness/useExhaustiveDependencies: popup visibility controls initialization
  useEffect(() => {
    init()
  }, [showPopup])

  const monthsRender = useMemo(() => {
    // When rerender, clear columns refs
    // Prevent leakage and contamination
    clearMonthRefs?.()
    //
    return _.map(months, (month, index) => (
      <CalendarMonth
        ref={setMonthRefs(index)}
        key={month.getTime()}
        value={month}
        showMonthTitle={index !== 0 || !showSubtitle}
        watermark={watermark}
        lazyRender={lazyRender && !canSwitch}
        monthTitle={monthTitle}
      />
    ))
  }, [
    canSwitch,
    clearMonthRefs,
    lazyRender,
    monthTitle,
    months,
    setMonthRefs,
    watermark,
    showSubtitle,
  ])

  function notifyConfirm(hasConfirm: boolean) {
    hasConfirmRef.current = hasConfirm
  }

  function handleConfirm() {
    onConfirm?.(value as CalendarValueType)
  }

  function handlePanelChange(date: Date) {
    const panelDate = limitDateRange(date)
    setCurrentPanelDate(panelDate)
    onPanelChange?.({ date: panelDate })
  }

  function reset(date?: CalendarValueType) {
    const newValue = getInitialDate(date === undefined ? defaultValueProp : date)
    changeValueRef.current = newValue
    setValue?.(newValue)
    setCurrentPanelDate(getInitialPanelDate(newValue))
    resetScroll(newValue)
  }

  useImperativeHandle(ref, () => ({
    reset,
    scrollToDate,
    getSelectedDate: () => value ?? null,
  }))

  return (
    <CalendarContext.Provider
      value={{
        type,
        firstDayOfWeek: dayOffset,
        min: minValue,
        max: maxValue,
        value,
        formatter,
        onDayClick,
        onClickDisabledDate: (day) => onClickDisabledDate?.(day.value),
        notifyConfirm,
        onConfirm: handleConfirm,
      }}
    >
      <Wrapper
        rounded={popupRounded}
        placement={popupPlacement}
        open={showPopup}
        onClose={onClose}
        className={classNames(prefixClassname("calendar--popup"))}
      >
        {poppable && showPopup && popupCloseIcon && <Popup.Close />}
        <View
          className={classNames(
            prefixClassname("calendar"),
            prefixClassname(`calendar--${type}`),
            className,
          )}
          style={style}
        >
          <CalendarHeader
            showTitle={showTitle}
            title={title}
            subtitle={subtitle}
            switchMode={switchMode}
            date={canSwitch ? currentPanelDate : currentMonth}
            min={minValue}
            max={maxValue}
            showSubtitle={showSubtitle}
            onClickSubtitle={onClickSubtitle}
            onPanelChange={handlePanelChange}
          />
          <ScrollView
            ref={scrollViewRef}
            className={prefixClassname("calendar__body")}
            scrollY
            scrollIntoView={scrollIntoView}
            onScroll={canSwitch ? undefined : onScroll}
          >
            {monthsRender}
          </ScrollView>
          {renderFooter()}
        </View>
      </Wrapper>
    </CalendarContext.Provider>
  )
})

export default Calendar
