import { useForceUpdate } from "@taroify/hooks"
import { Form as TaroForm } from "@tarojs/components"
import type { BaseEventOrig } from "@tarojs/components/types/common"
import type { FormProps as TaroFormProps } from "@tarojs/components/types/Form"
import * as React from "react"
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  type ForwardedRef,
  type ReactNode,
} from "react"
import { nextTick } from "@tarojs/taro"
import { useUniqueId } from "../hooks"
import { preventDefault } from "../utils/dom/event"
import FormContext from "./form.context"
import type {
  FormControlAlign,
  FormInstance,
  FormLabelAlign,
  FormRequired,
  FormValidateTrigger,
  FormValidError,
} from "./form.shared"
import useForm from "./use-form"

export interface FormProps extends TaroFormProps {
  name?: string
  defaultValues?: any
  values?: any
  labelAlign?: FormLabelAlign
  controlAlign?: FormControlAlign
  validateTrigger?: FormValidateTrigger
  colon?: boolean
  required?: FormRequired
  disabled?: boolean

  children?: ReactNode

  onValidate?(errors: FormValidError[]): void

  onValuesChange?(changedValues: any, allValues: any): void
}

const Form = forwardRef<FormInstance, FormProps>(
  (props: FormProps, ref: ForwardedRef<FormInstance>) => {
    const {
      name: nameProp,
      defaultValues,
      values,
      labelAlign,
      controlAlign,
      validateTrigger = "onBlur",
      colon,
      required,
      disabled,
      children: childrenProp,
      onValidate,
      onValuesChange,
      onSubmit,
      onReset,
      ...restProps
    } = props

    const forceUpdate = useForceUpdate()

    const nameId = useUniqueId()
    const name = nameProp ?? nameId

    const {
      getErrors,
      setErrors,
      setValues,
      getValues,
      validate,
      reset,
      setFieldsValue,
      getFieldsValue,
      validateFields,
      addEventListener,
      removeEventListener,
    } = useForm<any>(name, {
      defaultValues,
      values,
    })!

    const delegatingReset = useCallback(
      (e?: BaseEventOrig) => {
        // await onBlur event trigger
        nextTick(() => {
          reset()
          onReset?.(e as BaseEventOrig)
        })
      },
      [onReset, reset],
    )

    const handleSubmit = useCallback(
      (e: BaseEventOrig<TaroFormProps.onSubmitEventDetail>) => {
        validate()
          .then((values) => {
            const event = Object.assign({}, e, {
              detail: {
                ...e.detail,
                value: values,
              },
            })
            onSubmit?.(event)
          })
          .catch((errors) => onValidate?.(errors))
      },
      [onSubmit, onValidate, validate],
    )

    const handleReset = useCallback(
      (e: BaseEventOrig) => {
        preventDefault(e)
        delegatingReset(e)
      },
      [delegatingReset],
    )

    useImperativeHandle(
      ref,
      () => ({
        submit: () => handleSubmit({} as any),
        getErrors,
        setErrors,
        getValues,
        setValues,
        validate,
        reset: () => delegatingReset(),
        /**
         * @deprecated
         */
        setFieldsValue,
        /**
         * @deprecated
         */
        getFieldsValue,
        /**
         * @deprecated
         */
        validateFields,
      }),
      [
        handleSubmit,
        delegatingReset,
        getErrors,
        getFieldsValue,
        getValues,
        setErrors,
        setFieldsValue,
        setValues,
        validate,
        validateFields,
      ],
    )

    useEffect(() => {
      if (onValuesChange) {
        addEventListener("change", onValuesChange)
      }
      return () => {
        if (onValuesChange) {
          removeEventListener("change", onValuesChange)
        }
      }
    }, [addEventListener, onValuesChange, removeEventListener])

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      addEventListener("reset", forceUpdate)
      return () => removeEventListener("reset", forceUpdate)
    }, [addEventListener, forceUpdate, onValuesChange, removeEventListener])

    return (
      <FormContext.Provider
        value={{
          name,
          colon,
          required,
          disabled,
          labelAlign,
          controlAlign,
          validateTrigger,
        }}
      >
        <TaroForm
          onSubmit={handleSubmit}
          onReset={handleReset}
          children={childrenProp}
          {...restProps}
        />
      </FormContext.Provider>
    )
  },
)

export default Form
