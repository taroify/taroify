import {
  Input as TaroInput,
  Switch as TaroSwitch,
  Textarea as TaroTextarea,
} from "@tarojs/components"
import type { SwitchProps as TaroSwitchProps } from "@tarojs/components/types/Switch"
import { cloneElement, type ReactElement, type ReactNode } from "react"
import Checkbox, { type CheckboxGroupProps, type CheckboxProps } from "../../checkbox"
import Input, { type InputProps } from "../../input"
import Radio, { type RadioGroupProps } from "../../radio"
import Rate, { type RateProps } from "../../rate"
import Slider, { type SliderProps } from "../../slider"
import Stepper, { type StepperProps } from "../../stepper"
import Switch, { type SwitchProps } from "../../switch"
import Textarea from "../../textarea"
import Uploader, { type UploaderProps } from "../../uploader"
import type { FormController } from "../form.shared"
import type FormControlHandler from "./form-control-handler"
import { registerFormControlHandler } from "./form-control-handler"

registerFormControlHandler(
  new (class implements FormControlHandler<InputProps> {
    doControlRender(element: ReactElement<InputProps>, controller: FormController<any>): ReactNode {
      const {
        name,
        value,
        validateStatus,
        disabled: disabledProp,
        onBlur: onDelegatingBlur,
        onChange: onDelegatingChange,
      } = controller
      const { props: elementProps } = element
      const {
        name: nameProp,
        value: valueProp,
        color,
        onBlur,
        onInput,
        onChange,
        disabled,
      } = elementProps
      const isTaroifyInput = element.type === Input || element.type === Textarea
      return cloneElement<InputProps>(element, {
        name: nameProp ?? name,
        value: valueProp ?? value,
        color: color ?? (validateStatus === "invalid" ? "danger" : undefined),
        disabled: disabled ?? disabledProp,
        onInput: (e) => {
          onInput?.(e)
          onDelegatingChange?.(e.detail.value)
        },
        ...(isTaroifyInput && {
          onChange: (e) => {
            onChange?.(e)
            if (e.type === "blur") {
              onDelegatingChange?.(e.detail.value)
            }
          },
        }),
        onBlur: (e) => {
          onBlur?.(e)
          onDelegatingBlur?.(e.detail.value)
        },
      })
    }

    supportsControlType(elementType: any): boolean {
      return (
        elementType === TaroInput ||
        elementType === TaroTextarea ||
        elementType === Input ||
        elementType === Textarea
      )
    }
  })(),
)

registerFormControlHandler(
  new (class implements FormControlHandler<TaroSwitchProps> {
    doControlRender(
      element: ReactElement<TaroSwitchProps>,
      controller: FormController<any>,
    ): ReactNode {
      const { name, value, onChange: onDelegatingChange, disabled: disabledProp } = controller
      const { props: elementProps } = element
      const { name: nameProp, checked: checkedProp, onChange, disabled } = elementProps
      return cloneElement<TaroSwitchProps>(element, {
        name: nameProp ?? name,
        checked: checkedProp ?? value,
        disabled: disabled ?? disabledProp,
        onChange: (e) => {
          onChange?.(e)
          onDelegatingChange?.(e.detail.value)
        },
      })
    }

    supportsControlType(elementType: any): boolean {
      return elementType === TaroSwitch
    }
  })(),
)

registerFormControlHandler(
  new (class implements FormControlHandler<CheckboxProps | SwitchProps> {
    doControlRender(
      element: ReactElement<CheckboxProps | SwitchProps>,
      controller: FormController<any>,
    ): ReactNode {
      const { value, onChange: onDelegatingChange, disabled: disabledProp } = controller
      const { props: elementProps } = element
      const { checked: checkedProp, onChange, disabled } = elementProps
      return cloneElement<CheckboxProps | SwitchProps>(element, {
        checked: checkedProp ?? value,
        disabled: disabled ?? disabledProp,
        onChange: (checked) => {
          onChange?.(checked)
          onDelegatingChange?.(checked)
        },
      })
    }

    supportsControlType(elementType: any): boolean {
      return elementType === Checkbox || elementType === Switch
    }
  })(),
)

registerFormControlHandler(
  new (class
    implements
      FormControlHandler<
        | CheckboxGroupProps
        | RadioGroupProps
        | RateProps
        | SliderProps
        | StepperProps
        | UploaderProps
      >
  {
    doControlRender(
      element: ReactElement<
        | CheckboxGroupProps
        | RadioGroupProps
        | RateProps
        | SliderProps
        | StepperProps
        | UploaderProps
      >,
      controller: FormController<any>,
    ): ReactNode {
      const { value, onChange: onDelegatingChange, disabled: disabledProp } = controller
      const { props: elementProps } = element
      const { value: valueProp, onChange, disabled } = elementProps
      return cloneElement<
        | CheckboxGroupProps
        | RadioGroupProps
        | RateProps
        | SliderProps
        | StepperProps
        | UploaderProps
      >(element, {
        value: valueProp ?? value,
        disabled: disabled ?? disabledProp,
        onChange: (nextValue: any) => {
          // @ts-ignore
          onChange?.(nextValue)
          onDelegatingChange?.(nextValue)
        },
      })
    }

    supportsControlType(elementType: any): boolean {
      return (
        elementType === Checkbox.Group ||
        elementType === Radio.Group ||
        elementType === Rate ||
        elementType === Slider ||
        elementType === Stepper ||
        elementType === Uploader
      )
    }
  })(),
)
