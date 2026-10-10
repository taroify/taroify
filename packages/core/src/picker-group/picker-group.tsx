import { useUncontrolled } from "@taroify/hooks"
import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
// biome-ignore lint/correctness/noUnusedImports: the classic JSX runtime requires React in scope
import * as React from "react"
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type Key,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import PickerButton from "../picker/picker-button"
import PickerTitle from "../picker/picker-title"
import PickerToolbar from "../picker/picker-toolbar"
import PickerContext from "../picker/picker.context"
import {
  DEFAULT_OPTION_HEIGHT,
  DEFAULT_SIBLING_COUNT,
  DEFAULT_SWIPE_DURATION,
} from "../picker/picker.shared"
import { prefixClassname } from "../styles"
import Tabs from "../tabs"
import PickerGroupContext, { type PickerGroupChild } from "./picker-group.context"
import type { PickerGroupConfirmEventParams } from "./picker-group.shared"

export interface PickerGroupProps extends ViewProps {
  tabs?: ReactNode[]
  title?: ReactNode
  showToolbar?: boolean
  confirmText?: ReactNode
  cancelText?: ReactNode
  nextStepText?: ReactNode
  defaultActiveTab?: number
  activeTab?: number
  children?: ReactNode
  onActiveTabChange?(activeTab: number): void
  onConfirm?(params: PickerGroupConfirmEventParams): void
  onCancel?(): void
}

// Flatten fragments while retaining their key paths, so keyed pickers keep their state on reorder.
function flattenChildren(children: ReactNode, prefix = ""): ReactElement[] {
  const elements: ReactElement[] = []
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue
    const key = `${prefix}/${child.key}`
    if (child.type === Fragment) {
      elements.push(...flattenChildren(child.props.children, key))
    } else {
      elements.push(cloneElement(child, { key }))
    }
  }
  return elements
}

type RegisterPicker = (key: Key, picker: PickerGroupChild) => () => void

function PickerGroupPanel({
  pickerKey,
  register,
  children,
}: {
  pickerKey: Key
  register: RegisterPicker
  children?: ReactNode
}) {
  const context = useMemo(
    () => ({ register: (picker: PickerGroupChild) => register(pickerKey, picker) }),
    [pickerKey, register],
  )
  return <PickerGroupContext.Provider value={context}>{children}</PickerGroupContext.Provider>
}

export default function PickerGroup(props: PickerGroupProps) {
  const {
    className,
    tabs = [],
    title,
    showToolbar = true,
    confirmText = "确认",
    cancelText = "取消",
    nextStepText,
    defaultActiveTab = 0,
    activeTab: activeTabProp,
    children,
    onActiveTabChange,
    onConfirm,
    onCancel,
    ...restProps
  } = props
  const { value: activeTab = 0, setValue: setActiveTab } = useUncontrolled({
    value: activeTabProp,
    defaultValue: defaultActiveTab,
    onChange: onActiveTabChange,
  })
  const activeIndex = Math.max(
    0,
    Math.min(Number.isFinite(activeTab) ? Math.trunc(activeTab) : 0, tabs.length - 1),
  )
  const { pickers, toolbar } = useMemo(() => {
    const elements = flattenChildren(children)
    return {
      pickers: elements.filter((element) => element.type !== PickerToolbar),
      toolbar: elements.find((element) => element.type === PickerToolbar),
    }
  }, [children])
  const pickerRefs = useRef(new Map<Key, PickerGroupChild>())
  const [confirmPending, setConfirmPending] = useState(false)
  const register = useCallback<RegisterPicker>((key, picker) => {
    pickerRefs.current.set(key, picker)
    return () => {
      if (pickerRefs.current.get(key) === picker) {
        pickerRefs.current.delete(key)
      }
    }
  }, [])
  const showNextButton = Boolean(nextStepText) && activeIndex < tabs.length - 1

  const handleConfirm = () => {
    if (showNextButton) {
      setActiveTab(activeIndex + 1)
      return
    }
    for (const picker of pickerRefs.current.values()) {
      picker.stopMomentum()
    }
    setConfirmPending(true)
  }

  // Let React commit changes from stopping momentum (including linked date bounds) first.
  // Child effects populate the final selected options before this parent effect runs.
  useEffect(() => {
    if (!confirmPending) return
    setConfirmPending(false)
    const results = tabs.map((_, index) => {
      const picker = pickerRefs.current.get(pickers[index]?.key ?? index)
      return picker?.confirm() ?? { selectedValues: [], selectedOptions: [], selectedIndexes: [] }
    })
    onConfirm?.(results)
  }, [confirmPending, onConfirm, pickers, tabs])

  return (
    <View className={classNames(prefixClassname("picker-group"), className)} {...restProps}>
      {showToolbar && (
        <PickerContext.Provider
          value={{
            siblingCount: DEFAULT_SIBLING_COUNT,
            optionHeight: DEFAULT_OPTION_HEIGHT,
            swipeDuration: DEFAULT_SWIPE_DURATION,
            onConfirm: handleConfirm,
            onCancel,
          }}
        >
          {toolbar ?? (
            <PickerToolbar>
              <PickerButton type="cancel">{cancelText}</PickerButton>
              <PickerTitle>{title}</PickerTitle>
              <PickerButton type="confirm">
                {showNextButton ? nextStepText : confirmText}
              </PickerButton>
            </PickerToolbar>
          )}
        </PickerContext.Provider>
      )}
      <Tabs
        className={prefixClassname("picker-group__tabs")}
        value={activeIndex}
        onChange={(value) => setActiveTab(value)}
        shrink
        animated
        lazyRender={false}
      >
        {tabs.map((tabTitle, index) => {
          const picker = pickers[index]
          const key = picker?.key ?? index
          return (
            <Tabs.TabPane
              key={key}
              value={index}
              title={tabTitle}
              classNames={{ title: prefixClassname("picker-group__tab-title") }}
            >
              <PickerGroupPanel pickerKey={key} register={register}>
                {picker}
              </PickerGroupPanel>
            </Tabs.TabPane>
          )
        })}
      </Tabs>
    </View>
  )
}
