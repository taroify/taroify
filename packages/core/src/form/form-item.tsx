import { cloneIconElement } from "@taroify/icons/utils"
import { View } from "@tarojs/components"
import classNames from "classnames"
import * as _ from "lodash"
import * as React from "react"
import {
  Children,
  cloneElement,
  isValidElement,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  type ForwardedRef,
  type ForwardRefExoticComponent,
  type ReactElement,
  type ReactNode,
} from "react"
import { CellBase, type CellProps, CellValue } from "../cell"
import { iconMap } from "../cell/cell-base"
import Form, { useFormField, useFormValue } from "../form"
import FormContext from "../form/form.context"
import { prefixClassname } from "../styles"
import { fulfillPromise } from "../utils/promisify"
import { useToRef } from "../utils/state"
import { isElementOf } from "../utils/validate"
import FormFeedback from "./form-feedback"
import FormItemContext from "./form-item.context"
import { validateRules } from "./form.rule"
import type { FormItemInstance, FormRule, FormValidateTrigger } from "./form.shared"
import useFormError from "./use-form-error"
import useFormFieldValueEffect from "./use-form-field-value-effect"
import { useDependenciesChange, useShouldUpdateSignal } from "./use-form-item"

interface FormItemChildren {
  label?: ReactElement
  control?: ReactElement
  feedbacks?: ReactElement[]
  children?: ReactElement
}

function useFormItemChildren(
  childrenProps: FormItemProps["children"],
  shouldUpdateSignal: number,
  noStyle?: boolean,
): FormItemChildren {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  return useMemo<FormItemChildren>(() => {
    if (noStyle) {
      if (_.isFunction(childrenProps)) {
        const children = childrenProps()
        return {
          children: isValidElement(children) ? children : undefined,
        }
        // biome-ignore lint/style/noUselessElse: <explanation>
      } else {
        console.warn('[Taroify] FormItem(noStyle): "children" should be function')
        return {}
      }
    }
    const __children__: FormItemChildren = {
      feedbacks: [],
    }
    const children = _.isFunction(childrenProps) ? childrenProps() : childrenProps
    Children.forEach(children, (child: ReactNode) => {
      if (!isValidElement(child)) {
        return
      }
      if (isElementOf(child, Form.Label)) {
        __children__.label = child
      } else if (isElementOf(child, Form.Control)) {
        __children__.control = child
      } else if (isElementOf(child, Form.Feedback)) {
        __children__.feedbacks?.push(child)
      }
    })
    return __children__
  }, [childrenProps, shouldUpdateSignal, noStyle])
}

export interface FormItemProps extends Omit<CellProps, "children"> {
  name?: string
  defaultValue?: any
  required?: boolean
  rules?: FormRule[]
  dependencies?: string[]
  shouldUpdate?: boolean | ((prev, next) => boolean)
  noStyle?: boolean
  disabled?: boolean
  validateFirst?: boolean
  children?: (() => ReactNode) | ReactNode
}

const FormItem = forwardRef<FormItemInstance, FormItemProps>(
  (props: FormItemProps, ref: ForwardedRef<FormItemInstance>) => {
    const {
      className,
      style,
      name,
      defaultValue,
      align,
      bordered,
      icon,
      rightIcon: rightIconProp,
      extra,
      size,
      isLink = false,
      arrowDirection = "right",
      clickable,
      required,
      children: childrenProp,
      rules: rulesProp,
      dependencies,
      shouldUpdate,
      noStyle,
      disabled: disabledProp,
      validateFirst = false,
      onClick,
    } = props
    const shouldUpdateSignal = useShouldUpdateSignal(shouldUpdate)

    const { label, control, feedbacks, children } = useFormItemChildren(
      childrenProp,
      shouldUpdateSignal,
      noStyle,
    )
    const rightIcon = useMemo(() => {
      if (rightIconProp) {
        return cloneIconElement(rightIconProp, {
          className: prefixClassname("form-item__right-icon"),
        })
        // biome-ignore lint/style/noUselessElse: <explanation>
      } else if (isLink && iconMap[arrowDirection]) {
        const Icon = iconMap[arrowDirection]
        return <Icon className={prefixClassname("form-item__right-icon")} />
      }
      return null
    }, [rightIconProp, isLink, arrowDirection])

    const rulesRef = useToRef(rulesProp)

    const { validateTrigger, disabled: disabledContext } = useContext(FormContext)

    const disabled = disabledProp ?? disabledContext

    const { validateStatus, error, setError, resetError } = useFormError(name)

    const { value, getValue, setValue } = useFormValue(name, { defaultValue })

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const validate = useCallback(
      (rules = rulesRef.current) => {
        return new Promise<void>((resolve, reject) => {
          if (rules) {
            resetError()
            validateRules(getValue(), rules, validateFirst) //
              .then((errors) => {
                if (_.isEmpty(errors)) {
                  resetError()
                  resolve()
                } else {
                  setError({ errors })
                  reject({
                    name,
                    errors,
                  })
                }
              })
          } else {
            resolve()
          }
        })
      },
      [getValue, name, resetError, rulesRef, setError],
    )

    const validateWithTrigger = useCallback(
      (trigger: FormValidateTrigger) => {
        if (validateTrigger && rulesProp) {
          const defaultTrigger = validateTrigger === trigger
          const rules = rulesProp.filter((rule) => {
            if (rule.trigger) {
              return rule.trigger === trigger
            }

            return defaultTrigger
          })

          if (rules.length) {
            fulfillPromise(validate(rules))
          } else if (defaultTrigger) {
            resetError()
          }
        }
      },
      [resetError, rulesProp, validate, validateTrigger],
    )

    const instance = useMemo<FormItemInstance>(
      () => ({
        name,
        validate,
        getValue,
        setValue,
      }),
      [getValue, name, setValue, validate],
    )

    useImperativeHandle(ref, () => instance, [instance])

    useFormField(name, instance)

    useFormFieldValueEffect(() => validateWithTrigger("onChange"), [value])

    useDependenciesChange(dependencies, () => fulfillPromise(validate()))

    const explain = useMemo(
      () => !_.isEmpty(feedbacks) || !_.isEmpty(error?.errors),
      //
      [error?.errors, feedbacks],
    )

    const Control = useMemo(
      () =>
        control &&
        cloneElement(control, {
          name,
          value,
          disabled,
          onBlur: () => validateWithTrigger("onBlur"),
          onChange: setValue,
        }),
      [control, name, setValue, validateWithTrigger, value, disabled],
    )

    if (noStyle) {
      return (
        <FormItemContext.Provider
          value={{
            validateStatus,
          }}
        >
          {children}
        </FormItemContext.Provider>
      )
    }

    return (
      <FormItemContext.Provider
        value={{
          validateStatus,
        }}
      >
        <CellBase
          className={classNames(prefixClassname("form-item"), className)}
          style={style}
          bordered={bordered}
          align={align}
          clickable={clickable}
          size={size}
          icon={cloneIconElement(icon, { className: prefixClassname("form-item__icon") })}
          rightIcon={rightIcon}
          extra={extra}
          required={required}
          {...(onClick && { onClick })}
        >
          {label}
          <CellValue alone={false}>
            {Control}
            {explain && (
              <View className={classNames(prefixClassname("form__feedbacks"))}>
                {feedbacks}
                {_.map(error?.errors, (message, messageKey) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <FormFeedback key={messageKey} status="invalid" children={message} />
                ))}
              </View>
            )}
          </CellValue>
        </CellBase>
      </FormItemContext.Provider>
    )
  },
)

export default FormItem as ForwardRefExoticComponent<FormItemProps>
