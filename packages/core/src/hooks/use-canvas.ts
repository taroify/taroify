import { createSelectorQuery, getEnv, getWindowInfo, nextTick } from "@tarojs/taro"
import { type RefObject, useEffect, useState } from "react"
import { getRect, type Rect } from "../utils/dom/rect"
import useMemoizedFn from "./use-memoized-fn"

type CanvasSize = Pick<Rect, "width" | "height">

interface UseCanvasOptions {
  onLoaded?(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, size: CanvasSize): void
}

export function sizeCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  size: CanvasSize,
) {
  const ratio = getWindowInfo().pixelRatio || 1
  canvas.width = Math.floor(size.width * ratio)
  canvas.height = Math.floor(size.height * ratio)
  ctx.scale(ratio, ratio)
}

async function findCanvas(canvasId: string, canvasRef: RefObject<any>) {
  if (getEnv() === "WEB") {
    return canvasRef.current?.firstElementChild as HTMLCanvasElement | undefined
  }

  await new Promise<void>((resolve) => nextTick(resolve))
  return new Promise<HTMLCanvasElement | undefined>((resolve) =>
    createSelectorQuery()
      .select(`#${canvasId}`)
      .fields({ node: true })
      .exec(([result]) => resolve(result?.node)),
  )
}

interface CanvasState {
  canvas: HTMLCanvasElement | null
  ctx: CanvasRenderingContext2D | null
  failed: boolean
}

const initialState: CanvasState = { canvas: null, ctx: null, failed: false }

function useCanvas(canvasId: string, canvasRef: RefObject<any>, options?: UseCanvasOptions) {
  const [{ canvas, ctx, failed }, setState] = useState(initialState)
  const onLoaded = useMemoizedFn(
    (node: HTMLCanvasElement, context: CanvasRenderingContext2D, size: CanvasSize) =>
      options?.onLoaded?.(node, context, size),
  )

  useEffect(() => {
    let cancelled = false
    let retry = 0
    let timer: ReturnType<typeof setTimeout>
    setState(initialState)

    async function init() {
      try {
        const node = await findCanvas(canvasId, canvasRef)
        const context = node?.getContext?.("2d")
        if (node && context) {
          const rect = await getRect(canvasRef)
          if (cancelled) return
          const size = { width: rect.width || node.width, height: rect.height || node.height }
          sizeCanvas(node, context, size)
          setState({ canvas: node, ctx: context, failed: false })
          onLoaded(node, context, size)
          return
        }
      } catch {
        // A platform can throw while the native canvas is still being attached.
      }
      if (cancelled) return
      if (retry < 5) {
        timer = setTimeout(init, 100 * 2 ** retry++)
      } else {
        setState({ ...initialState, failed: true })
      }
    }

    init()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [canvasId, canvasRef, onLoaded])

  return [canvas, ctx, canvas !== null, failed] as const
}

export default useCanvas
