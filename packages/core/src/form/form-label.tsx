import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as React from "react"
import { type ReactNode, useContext } from "react"
import CellTitle from "../cell/cell-title"
import { prefixClassname } from "../styles"
import FormContext from "./form.context"
import type { FormLabelAlign } from "./form.shared"

export interface FormLabelProps extends ViewProps {
  align?: FormLabelAlign
  colon?: boolean
  children?: ReactNode
}

function FormLabel(props: FormLabelProps) {
  const { align: alignProp, colon: colonProp, children, className, ...restProps } = props
  const { colon: ctxColon, labelAlign } = useContext(FormContext)
  const align = alignProp ?? labelAlign
  const colon = colonProp ?? ctxColon

  return (
    <CellTitle
      className={classNames(
        prefixClassname("form-label"),
        {
          [prefixClassname("form-label--left")]: align === "left",
          [prefixClassname("form-label--center")]: align === "center",
          [prefixClassname("form-label--right")]: align === "right",
          [prefixClassname("form-label--top")]: align === "top",
        },
        className,
      )}
      {...restProps}
    >
      {children}
      {colon ? ":" : undefined}
    </CellTitle>
  )
}

FormLabel.displayName = "FormLabel"

export default FormLabel
