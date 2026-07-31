import { Cross } from "@taroify/icons"
import { useUncontrolled, useCascader } from "@taroify/hooks"
import { type ITouchEvent, View, ScrollView } from "@tarojs/components"
import { nextTick } from "@tarojs/taro"
import classNames from "classnames"
import * as _ from "lodash"
// biome-ignore lint/correctness/noUnusedImports: The classic JSX transform requires React in scope.
import * as React from "react"
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useReducer,
  useMemo,
  useRef,
  useState,
} from "react"
import { prefixClassname } from "../styles"
import Tabs from "../tabs"
import { useMemoizedFn } from "../hooks"
import { inBrowser } from "../utils/base"
import CascaderHeader from "./cascader-header"
import CascaderOption from "./cascader-option"
import CascaderOptionBase from "./cascader-option-base"
import CascaderTab from "./cascader-tab"
import {
  type CascaderOptionObject,
  type CascaderEventOption,
  type CascaderTabObject,
  isActiveOption,
  type CascaderDataOption,
  type CascaderFieldNames,
  type CascaderOptionRenderProps,
  type CascaderOptionsRenderProps,
} from "./cascader.shared"
import CascaderContext from "./cascader.context"

function getCascaderOptions(children: ReactNode, tabIndex: number): CascaderOptionObject[] {
  const options: CascaderOptionObject[] = []
  Children.forEach(children, (child: ReactNode) => {
    if (isValidElement(child)) {
      const element = child as ReactElement
      const { key, props, type } = element
      const { value, ...restProps } = props
      if (type === CascaderOption) {
        const index = _.size(options)
        options.push({
          key: key ?? index,
          tabIndex,
          value: value ?? index,
          ...restProps,
        })
      }
    }
  })

  return options
}

interface CascaderChildren {
  header?: ReactNode
  tabs: CascaderTabObject[]
}

interface CascaderOptionsProps {
  scrollTarget?: string
  children?: ReactNode
}

function CascaderOptions(props: CascaderOptionsProps) {
  const { scrollTarget, children } = props
  const rootRef = useRef<HTMLElement>(null)
  const [scrollIntoView, setScrollIntoView] = useState<string>()

  // Lazy tab panes need one committed render before Taro can resolve the target element.
  useEffect(() => {
    const root = rootRef.current!

    nextTick(() => {
      if (!inBrowser) {
        setScrollIntoView(scrollTarget)
        return
      }

      const target = scrollTarget && root.querySelector<HTMLElement>(`#${scrollTarget}`)
      if (target) {
        const offsetTop =
          target.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop
        root.scrollTop = offsetTop
      }
    })
  }, [scrollTarget])

  return (
    <ScrollView
      ref={rootRef}
      scrollY
      scrollIntoView={scrollIntoView}
      className={prefixClassname("cascader__options")}
      children={children}
    />
  )
}

function useCascaderChildren(children?: ReactNode): CascaderChildren {
  return useMemo(() => {
    const __children__: CascaderChildren = {
      header: undefined,
      tabs: [],
    }

    Children.forEach(children, (child: ReactNode) => {
      if (isValidElement(child)) {
        const element = child as ReactElement
        const { props, type } = element
        if (type === CascaderHeader) {
          __children__.header = element
        } else if (type === CascaderTab) {
          const { children } = props
          __children__.tabs.push({
            options: getCascaderOptions(children, _.size(__children__.tabs)),
          })
        }
      }
    })

    return __children__
  }, [children])
}

export interface CascaderProps {
  className?: string
  defaultValue?: string[]
  value?: string[]
  title?: ReactNode
  showHeader?: boolean
  closeable?: boolean
  closeIcon?: ReactNode
  swipeable?: boolean
  animated?: boolean
  placeholder?: ReactNode
  loadData?(values: string[], options: CascaderEventOption[]): Promise<any[]>
  fieldNames?: CascaderFieldNames
  children?: ReactNode
  ellipsis?: boolean
  options?: CascaderDataOption[]
  autoScrollToSelected?: boolean

  renderOption?(props: CascaderOptionRenderProps): ReactNode

  renderOptionsTop?(props: CascaderOptionsRenderProps): ReactNode

  renderOptionsBottom?(props: CascaderOptionsRenderProps): ReactNode

  onChange?(values: string[], options: CascaderEventOption[]): void

  onSelect?(values: string[], options: CascaderEventOption[]): void

  onTabClick?(event: Tabs.TabEvent): void

  onClose?(event: ITouchEvent): void
}

const defaultFieldNames: CascaderFieldNames = {
  label: "label",
  value: "value",
  children: "children",
}

function Cascader(props: CascaderProps) {
  const {
    className,
    defaultValue,
    value: valueProp,
    placeholder = "请选择",
    title,
    showHeader,
    closeable = false,
    closeIcon = <Cross />,
    loadData,
    fieldNames: _fieldNames,
    animated = true,
    swipeable = false,
    ellipsis = true,
    children: childrenProp,
    options,
    autoScrollToSelected = false,
    renderOption,
    renderOptionsTop,
    renderOptionsBottom,
    onChange,
    onSelect,
    onTabClick,
    onClose,
  } = props
  const optionIdPrefix = `${prefixClassname("cascader-option")}-${useId().replace(/:/g, "")}`
  const [colRefreshKey, refreshKey] = useReducer((state) => state + 1, 0)
  const { value: values = [], setValue: setValues } = useUncontrolled({
    defaultValue,
    value: valueProp,
  })
  const fieldNames: CascaderFieldNames = useMemo(() => {
    if (!_.isEmpty(_fieldNames) && _.isObject(_fieldNames)) {
      return Object.assign({ ...defaultFieldNames }, _fieldNames)
    }
    return defaultFieldNames
  }, [_fieldNames])
  const { columns } = useCascader({
    options: options,
    value: values,
    fieldNames,
    refreshKey: colRefreshKey,
  })
  const { header: _header, tabs: _tab } = useCascaderChildren(childrenProp)
  const header = useMemo(
    () => (title ? <CascaderHeader>{title}</CascaderHeader> : _header),
    [title, _header],
  )
  const [tabs, tabsMap, dataOptionsMap] = useMemo(() => {
    let ret: CascaderTabObject[]
    const cache = new Map<string, CascaderOptionObject>()
    const dataCache = new Map<CascaderOptionObject, CascaderDataOption>()
    if (columns.length > 0) {
      ret = columns.map((column, idx) => ({
        options: column.map((item) => {
          const option = {
            children: item[fieldNames.label!],
            key: item[fieldNames.value!],
            value: item[fieldNames.value!],
            disabled: item.disabled,
            tabIndex: idx,
          } as CascaderOptionObject
          dataCache.set(option, item)
          return option
        }),
      }))
    } else {
      ret = _tab
    }
    for (const tab of ret) {
      for (const option of tab.options) {
        cache.set(option.value, option)
      }
    }
    return [ret, cache, dataCache] as const
  }, [columns, _tab, fieldNames])
  const [activeTab, setActiveTab] = useState(0)

  const renderedTabs = useMemo(() => _.slice(tabs, 0, _.size(values) + 1), [tabs, values])

  const renderedOptions = useMemo(() => values.map((item) => tabsMap.get(item)), [tabsMap, values])

  const emitChange = useMemoizedFn(async (newValues: any[]) => {
    const newActiveOptions = newValues.map((item) => tabsMap.get(item)!)
    onSelect?.(newValues, newActiveOptions)
    if (!_.isEqual(newValues, valueProp)) {
      if (columns.length > 0) {
        let children: any[] | undefined
        if (loadData) {
          children = await loadData(newValues.slice(), newActiveOptions.slice())
          const level = newValues.length - 1
          const selected = columns[level].find(
            (item) => item[fieldNames.value!] === newValues[level],
          )
          if (selected) {
            selected[fieldNames.children!] = children
          }
        } else {
          const last = columns[newValues.length - 1].find(
            (item) => item[fieldNames.value!] === newValues[newValues.length - 1],
          )
          children = last?.[fieldNames.children!]
        }
        if (!children || children.length === 0) {
          onChange?.(newValues, newActiveOptions)
        } else {
          nextTick(() => {
            refreshKey()
            setActiveTab((prev) => prev + 1)
          })
        }
      } else {
        if (_.size(tabs) === _.size(newValues)) {
          onChange?.(newValues, newActiveOptions)
        } else {
          nextTick(() => {
            setActiveTab((prev) => prev + 1)
          })
        }
      }
    }
  })

  const handleSelect = useMemoizedFn((option: CascaderOptionObject) => {
    const { disabled, tabIndex, value } = option
    if (disabled) {
      return
    }
    const newValues = _.slice(values, 0, tabIndex + 1)
    newValues[tabIndex] = value
    setValues(newValues)
    emitChange(newValues.slice())
  })

  const panes = useMemo(
    () =>
      _.map(renderedTabs, (tab, index) => {
        const dataOptions = _.compact(_.map(tab.options, (option) => dataOptionsMap.get(option)))
        const selectedOptionIndex = autoScrollToSelected
          ? _.findIndex(tab.options, (option) => isActiveOption(option, values))
          : -1
        const scrollIntoView =
          activeTab === index && selectedOptionIndex >= 0
            ? `${optionIdPrefix}-${index}-${selectedOptionIndex}`
            : undefined

        return (
          <Tabs.TabPane
            key={index}
            value={index}
            title={_.get(renderedOptions, index)?.children ?? placeholder}
            classNames={{
              title: classNames(prefixClassname("cascader__tab"), {
                [prefixClassname("cascader__tab--inactive")]: _.isEmpty(
                  _.get(renderedOptions, index)?.children,
                ),
              }),
            }}
          >
            <CascaderOptions scrollTarget={scrollIntoView}>
              {renderOptionsTop?.({ options: dataOptions, tabIndex: index })}
              {_.map(tab.options, (option, optionIndex) => {
                const { onClick, value, children, ...restProps } = option
                const selected = isActiveOption(option, values)
                const dataOption = dataOptionsMap.get(option)
                const content =
                  dataOption && renderOption
                    ? renderOption({ option: dataOption, selected, tabIndex: index })
                    : (children ?? value)
                return (
                  <CascaderOptionBase
                    {...restProps}
                    {...(autoScrollToSelected
                      ? { id: `${optionIdPrefix}-${index}-${optionIndex}` }
                      : {})}
                    children={content}
                    onClick={(event) => {
                      onClick?.(event)
                      handleSelect(option)
                    }}
                    active={selected}
                  />
                )
              })}
              {renderOptionsBottom?.({ options: dataOptions, tabIndex: index })}
            </CascaderOptions>
          </Tabs.TabPane>
        )
      }),
    [
      activeTab,
      autoScrollToSelected,
      dataOptionsMap,
      handleSelect,
      optionIdPrefix,
      placeholder,
      renderedOptions,
      renderedTabs,
      renderOption,
      renderOptionsBottom,
      renderOptionsTop,
      values,
    ],
  )

  const renderedHeader = showHeader === false ? undefined : header
  const shouldRenderHeader =
    showHeader !== false && (showHeader === true || closeable || renderedHeader !== undefined)

  return (
    <CascaderContext.Provider value={{ title, closeable, closeIcon, onClose }}>
      <View
        className={classNames(
          prefixClassname("cascader"),
          {
            [prefixClassname("cascader--h5")]: inBrowser,
            [prefixClassname("cascader--headerless")]:
              showHeader === false || (inBrowser && !shouldRenderHeader),
          },
          className,
        )}
      >
        {shouldRenderHeader && (renderedHeader ?? <CascaderHeader />)}
        <Tabs
          className={prefixClassname("cascader__tabs")}
          value={activeTab}
          animated={animated}
          swipeable={swipeable}
          onChange={(value) => setActiveTab(value)}
          onTabClick={onTabClick}
          children={panes}
          ellipsis={ellipsis}
        />
      </View>
    </CascaderContext.Provider>
  )
}

export default Cascader
