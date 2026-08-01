import { getCurrentPages, getCurrentInstance } from "@tarojs/taro"
import { document, type TaroNode } from "@tarojs/runtime"
import type { ReactElement } from "react"
import { createRoot, type Root } from "react-dom/client"

export function getPagePath() {
  const currentPages = typeof getCurrentPages === "function" ? getCurrentPages() : []
  const currentPage = currentPages[currentPages.length - 1]
  return (
    currentPage?.$taroPath ||
    currentPage?.route ||
    (typeof getCurrentInstance === "function" ? getCurrentInstance()?.router?.path : "") ||
    ""
  )
}

const portalViewMap: Map<string, TaroNode> = new Map()
const portalRootMap: Map<TaroNode, Root> = new Map()

export function mountPortal(children: TaroNode, dom?: TaroNode) {
  const view = dom || document.createElement("view")
  const path = getPagePath()
  const portalKey = path || "__app__"
  const pageElement = (path && document.getElementById(path)) || document.body
  if (pageElement) {
    if (!portalViewMap.has(portalKey)) {
      const portalView = document.createElement("view")
      pageElement.appendChild(portalView)
      portalViewMap.set(portalKey, portalView)
    }
    let root = portalRootMap.get(view)
    if (!root) {
      root = createRoot(view as unknown as Element)
      portalRootMap.set(view, root)
    }
    root.render(children as unknown as ReactElement)
    portalViewMap.get(portalKey)?.appendChild(view)
  } else {
    console.error("[Taroify] cannot find page element or app root element")
  }
  return view
}

export function unmountPortal(dom: TaroNode) {
  portalRootMap.get(dom)?.unmount()
  portalRootMap.delete(dom)
  dom.parentElement?.removeChild(dom)
}
