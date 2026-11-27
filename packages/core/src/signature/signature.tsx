import { Canvas, type CanvasTouchEvent, View } from "@tarojs/components"
import { getEnv } from "@tarojs/taro"
import cls from "classnames"
import * as React from "react"
import { type ForwardedRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import Button from "../button"
import useCanvas, { sizeCanvas } from "../hooks/use-canvas"
import { prefixClassname } from "../styles"
import { preventDefault } from "../utils/dom/event"
import { getRect, type Rect } from "../utils/dom/rect"
import type { SignatureInstance, SignatureProps } from "./signature.shared"

export type { SignatureInstance }

type Point = { x: number; y: number }
type Size = Pick<Rect, "width" | "height">

interface Stroke {
  color: string
  width: number
  points: Point[]
}

function drawSegment(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  scale: number,
  from: Point,
  to: Point,
) {
  ctx.beginPath()
  ctx.strokeStyle = stroke.color
  ctx.lineWidth = stroke.width * scale
  ctx.lineCap = "round"
  ctx.moveTo(from.x * scale, from.y * scale)
  ctx.lineTo(to.x * scale, to.y * scale)
  ctx.stroke()
}

let canvasIndex = 0
const Signature = React.forwardRef(function Signature(
  props: SignatureProps,
  ref: ForwardedRef<SignatureInstance>,
): JSX.Element {
  const {
    type = "png",
    lineWidth = 3,
    penColor = "#000",
    backgroundColor,
    className,
    canvasId: canvasIdProp,
    historySize = 20,
    showToolbar = false,
    clearButtonText = "清空",
    undoButtonText = "撤销",
    confirmButtonText = "确认",
    tips = "当前环境不支持签名",
    onStart,
    onSigning,
    onEnd,
    onSubmit,
    onClear,
    ...rest
  } = props
  const canvasRef = useRef<HTMLElement>(null)
  const [canvasId] = useState(() => canvasIdProp || `taroify-canvas${canvasIndex++}`)
  const size = useRef<Size>({ width: 0, height: 0 })
  // All strokes share a coordinate system, including strokes added after resizing.
  const drawing = useRef({ width: 0, height: 0, scale: 1 })
  const strokes = useRef<Stroke[]>([])
  const active = useRef<Stroke | null>(null)
  const resizeRequest = useRef(0)
  // Older strokes stay visible and can be replayed on resize, even after they leave undo history.
  const undoFloor = useRef(0)
  const limit = Math.max(0, Math.floor(historySize)) || 0
  useEffect(() => {
    undoFloor.current = Math.max(undoFloor.current, strokes.current.length - limit)
  }, [limit])

  function redraw(context: CanvasRenderingContext2D) {
    const { width, height } = size.current
    context.clearRect(0, 0, width, height)
    if (backgroundColor) {
      context.fillStyle = backgroundColor
      context.fillRect(0, 0, width, height)
    }
    for (const stroke of strokes.current) {
      for (let i = 1; i < stroke.points.length; i++) {
        drawSegment(context, stroke, drawing.current.scale, stroke.points[i - 1], stroke.points[i])
      }
    }
  }

  const [canvas, ctx, , failed] = useCanvas(canvasId, canvasRef, {
    onLoaded(_, context, initialSize) {
      size.current = initialSize
      redraw(context)
    },
  })

  function pointFrom(event: CanvasTouchEvent): Point {
    const touch = event.touches[0]
    let { x, y } = touch
    if (getEnv() === "WEB") {
      const { left, top } = canvas!.getBoundingClientRect()
      const { clientX, clientY } = touch as unknown as Touch
      x = clientX - left
      y = clientY - top
    }
    return { x: x / drawing.current.scale, y: y / drawing.current.scale }
  }

  function start(event: CanvasTouchEvent) {
    if (ctx && event.touches.length) {
      if (!strokes.current.length) drawing.current = { ...size.current, scale: 1 }
      active.current = {
        color: penColor,
        width: lineWidth / drawing.current.scale,
        points: [pointFrom(event)],
      }
      onStart?.()
    }
  }

  function move(event: CanvasTouchEvent) {
    const stroke = active.current
    if (!ctx || !stroke || !event.touches.length) return
    preventDefault(event)
    if (stroke.points.length === 1) {
      strokes.current.push(stroke)
      undoFloor.current = Math.max(undoFloor.current, strokes.current.length - limit)
    }
    const point = pointFrom(event)
    const from = stroke.points[stroke.points.length - 1]
    const bounds = drawing.current
    bounds.width = Math.max(bounds.width, from.x, point.x)
    bounds.height = Math.max(bounds.height, from.y, point.y)
    drawSegment(ctx, stroke, bounds.scale, from, point)
    stroke.points.push(point)
    onSigning?.(event)
  }

  function end(event: CanvasTouchEvent) {
    if (active.current) {
      preventDefault(event)
      active.current = null
      onEnd?.()
    }
  }

  function getImage() {
    let image = ""
    if (canvas && strokes.current.length) {
      image =
        type === "jpg" || type === "jpeg"
          ? canvas.toDataURL("image/jpeg", 0.8)
          : canvas.toDataURL(`image/${type}`)
    }
    return { image, canvas }
  }

  function undo() {
    if (ctx && strokes.current.length > undoFloor.current) {
      active.current = null
      strokes.current.pop()
      redraw(ctx)
    }
  }

  function clear() {
    if (ctx) {
      active.current = null
      strokes.current = []
      undoFloor.current = 0
      redraw(ctx)
      onClear?.()
    }
  }

  function submit() {
    if (canvas) onSubmit?.(getImage())
  }

  async function resize() {
    if (!canvas || !ctx) return
    const request = ++resizeRequest.current
    const rect = await getRect(canvasRef)
    if (!canvasRef.current || request !== resizeRequest.current || !rect?.width || !rect.height)
      return
    if (active.current || strokes.current.length) {
      const bounds = drawing.current
      bounds.scale = Math.min(rect.width / bounds.width, rect.height / bounds.height)
    }
    size.current = rect
    sizeCanvas(canvas, ctx, rect)
    redraw(ctx)
  }

  useImperativeHandle(ref, () => ({ getImage, clear, undo, resize, submit }))

  return (
    <View className={cls(prefixClassname("signature"), className)} {...rest}>
      <View className={prefixClassname("signature__content")}>
        {failed ? (
          tips
        ) : (
          <Canvas
            id={canvasId}
            canvasId={canvasId}
            className={prefixClassname("signature__canvas")}
            ref={canvasRef}
            disableScroll
            type="2d"
            onTouchStart={start}
            onTouchMove={move}
            onTouchEnd={end}
            onTouchCancel={end}
          />
        )}
      </View>
      {showToolbar && (
        <View className={prefixClassname("signature__toolbar")}>
          <Button size="small" disabled={!canvas} onClick={clear}>
            {clearButtonText}
          </Button>
          <Button size="small" disabled={!canvas} onClick={undo}>
            {undoButtonText}
          </Button>
          <Button size="small" disabled={!canvas} color="primary" onClick={submit}>
            {confirmButtonText}
          </Button>
        </View>
      )}
    </View>
  )
})

export default Signature
