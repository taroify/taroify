import { Search as SearchIcon } from "@taroify/icons"
import { type ITouchEvent, View } from "@tarojs/components"
import type { BaseEventOrig } from "@tarojs/components/types/common"
import type { InputProps } from "@tarojs/components/types/Input"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as React from "react"
import {
  type ReactElement,
  type ReactNode,
  type ReactText,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import Field from "../field"
import type { FormFeedbackProps } from "../form"
import Input, {
  type InputAlign,
  type InputClearTrigger,
  type InputColor,
  type InputFormatter,
  type InputFormatTrigger,
} from "../input"
import type { InputClear } from "../input/input"
import { prefixClassname } from "../styles"
import { inBrowser } from "../utils/base"
import { preventDefault } from "../utils/dom/event"
import { getLogger } from "../utils/logger"
import type { SearchInstance, SearchShape } from "./search.shared"

const { deprecated } = getLogger("Search")

export interface SearchProps extends Omit<ViewProps, "ref"> {
  className?: string
  value?: string
  icon?: ReactNode
  rightIcon?: ReactNode
  label?: ReactNode
  left?: ReactNode
  shape?: SearchShape
  maxlength?: number
  autoFocus?: boolean
  focus?: boolean
  disabled?: boolean
  readonly?: boolean
  enableNative?: boolean

  inputId?: string
  name?: string
  autoComplete?: string
  placeholder?: string
  placeholderClassName?: string
  formatter?: InputFormatter
  formatTrigger?: InputFormatTrigger

  inputAlign?: InputAlign
  inputColor?: InputColor

  clearable?: boolean
  clearIcon?: ReactNode
  clearTrigger?: InputClearTrigger

  feedback?: ReactText | FormFeedbackProps | ReactElement
  action?: boolean | ReactNode
  actionText?: string
  clearOnCancel?: boolean

  onClear?(event: ITouchEvent): void

  onCancel?(event: ITouchEvent): void

  onSearch?(event: BaseEventOrig<InputProps.inputValueEventDetail>): void

  onChange?(event: BaseEventOrig<InputProps.inputEventDetail>): void

  onFocus?(event: BaseEventOrig<InputProps.inputForceEventDetail>): void

  onBlur?(event: BaseEventOrig<InputProps.inputValueEventDetail>): void

  onClickInput?(event: ITouchEvent): void
  onClickLeftIcon?(event: ITouchEvent): void
  onClickRightIcon?(event: ITouchEvent): void
}

function renderIcon(icon: ReactNode, onClick?: (event: ITouchEvent) => void) {
  return icon && onClick ? <View onClick={onClick}>{icon}</View> : icon
}

const isH5 = inBrowser || process.env.TARO_ENV === "h5"

const Search = React.forwardRef<SearchInstance, SearchProps>(function Search(props, ref) {
  const {
    className,
    value,
    icon = <SearchIcon />,
    rightIcon,
    label,
    left,
    shape,
    maxlength,
    autoFocus,
    focus,
    disabled,
    readonly,
    enableNative = true,
    inputId,
    name,
    autoComplete,
    placeholder,
    placeholderClassName,
    formatter,
    formatTrigger,
    clearable = true,
    clearIcon,
    clearTrigger,
    inputAlign,
    inputColor,
    feedback,
    action,
    actionText = "取消",
    clearOnCancel,
    onClear,
    onCancel,
    onSearch,
    onChange,
    onFocus,
    onBlur,
    onClickInput,
    onClickLeftIcon,
    onClickRightIcon,
    ...restProps
  } = props

  const contentRef = useRef<HTMLElement>(null)
  const inputClearRef = useRef<InputClear>(null)
  const [nativeFocus, setNativeFocus] = useState<boolean>()
  const manageNativeFocus = !isH5 && ref !== null && focus === undefined

  function setFocus(focused: boolean) {
    if (isH5) {
      const input = contentRef.current?.querySelector<HTMLInputElement>(
        `.${prefixClassname("search__input")} > input`,
      )
      if (focused) {
        input?.focus()
      } else {
        input?.blur()
      }
    } else if (manageNativeFocus) {
      setNativeFocus(focused)
    }
  }

  useImperativeHandle(ref, () => ({ focus: () => setFocus(true), blur: () => setFocus(false) }))

  if (shape === "round") {
    deprecated('Use the shape="rounded" prop instead of the shape="round" prop')
  }

  function handleSearch(event: BaseEventOrig<InputProps.inputValueEventDetail>) {
    preventDefault(event)
    onSearch?.(event)
  }

  function handleCancel(event: ITouchEvent) {
    inputClearRef.current?.(event)
    onCancel?.(event)
  }

  function handleFocus(event: BaseEventOrig<InputProps.inputForceEventDetail>) {
    setNativeFocus(true)
    onFocus?.(event)
  }

  function handleBlur(event: BaseEventOrig<InputProps.inputValueEventDetail>) {
    setNativeFocus(false)
    onBlur?.(event)
  }

  const labelClassName = prefixClassname("search__label")
  const defaultAction = action === true
  const onActionClick = defaultAction ? (clearOnCancel ? handleCancel : onCancel) : undefined
  const inputIdProps = inputId ? { id: inputId } : {}

  return (
    <View
      className={classNames(
        prefixClassname("search"),
        {
          [prefixClassname("search--action")]: action,
        },
        className,
      )}
      {...restProps}
    >
      {left}
      <View
        ref={isH5 ? contentRef : undefined}
        className={classNames(prefixClassname("search__content"), {
          [prefixClassname("search__content--square")]: shape === "square",
          [prefixClassname("search__content--rounded")]: shape === "rounded" || shape === "round",
        })}
      >
        {label &&
          (isH5 && inputId ? (
            <label className={labelClassName} htmlFor={inputId}>
              {label}
            </label>
          ) : (
            <View className={labelClassName} children={label} />
          ))}
        <Field
          className={prefixClassname("search__field")}
          icon={renderIcon(icon, onClickLeftIcon)}
          rightIcon={renderIcon(rightIcon, onClickRightIcon)}
          feedback={feedback}
        >
          <Input
            clearRef={clearOnCancel ? inputClearRef : undefined}
            className={prefixClassname("search__input")}
            {...(isH5
              ? { nativeProps: { ...inputIdProps, autocomplete: autoComplete } }
              : inputIdProps)}
            name={name}
            placeholderClassName={placeholderClassName}
            value={value}
            maxlength={maxlength}
            placeholder={placeholder}
            clearable={clearable}
            clearIcon={clearIcon}
            clearTrigger={clearTrigger}
            formatter={formatter}
            formatTrigger={formatTrigger}
            align={inputAlign}
            color={inputColor}
            autoFocus={autoFocus}
            focus={manageNativeFocus ? nativeFocus : focus}
            disabled={disabled}
            readonly={readonly}
            confirmType="search"
            enableNative={enableNative}
            onConfirm={handleSearch}
            onClear={onClear}
            onChange={onChange}
            onFocus={manageNativeFocus ? handleFocus : onFocus}
            onBlur={manageNativeFocus ? handleBlur : onBlur}
            {...(onClickInput && { onClick: onClickInput })}
          />
        </Field>
      </View>
      {action && (
        <View
          className={prefixClassname("search__action")}
          children={defaultAction ? actionText : action}
          {...(onActionClick && { onClick: onActionClick })}
        />
      )}
    </View>
  )
})

export default Search
