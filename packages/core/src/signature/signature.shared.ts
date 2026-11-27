import type { CanvasTouchEvent } from "@tarojs/components"
import type { ReactNode } from "react"

export interface SignatureResult {
  image: string
  canvas: HTMLCanvasElement | null
}

export interface SignatureProps {
  type?: string
  penColor?: string
  lineWidth?: number
  backgroundColor?: string
  className?: string
  canvasId?: string
  historySize?: number
  showToolbar?: boolean
  clearButtonText?: string
  undoButtonText?: string
  confirmButtonText?: string
  tips?: ReactNode

  onStart?(): void
  onSigning?(event: CanvasTouchEvent): void
  onEnd?(): void
  onSubmit?(result: SignatureResult): void
  onClear?(): void
}

export interface SignatureInstance {
  getImage(): SignatureResult
  clear(): void
  undo(): void
  resize(): Promise<void>
  submit(): void
}

export type SignatureThemeVars = {
  signaturePadding?: string
  signatureContentHeight?: string
  signatureContentBackground?: string
  signatureContentBorder?: string
  signatureBorderRadius?: string
}
