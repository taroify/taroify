import type { TaroNode } from "@tarojs/runtime"
import { createRoot } from "react-dom/client"
import { getPagePath, mountPortal, unmountPortal } from "../portal"

let mockGetCurrentPages: (() => Array<{ $taroPath?: string; route?: string }>) | undefined
let mockGetCurrentInstance: (() => { router?: { path?: string } } | undefined) | undefined

jest.mock("@tarojs/taro", () => ({
  get getCurrentPages() {
    return mockGetCurrentPages
  },
  get getCurrentInstance() {
    return mockGetCurrentInstance
  },
}))

jest.mock("@tarojs/runtime", () => ({
  document: global.document,
}))

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
    unmount: jest.fn(),
  })),
}))

const createRootMock = createRoot as jest.MockedFunction<typeof createRoot>

describe("portal", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCurrentPages = () => [{ route: "pages/index/index" }]
    mockGetCurrentInstance = () => undefined
    document.body.innerHTML = '<div id="pages/index/index"></div>'
  })

  it("should resolve page paths from the page stack", () => {
    const getCurrentInstance = jest.fn(() => ({ router: { path: "pages/fallback/index" } }))
    mockGetCurrentPages = () => [
      { route: "pages/previous/index" },
      { $taroPath: "pages/current/index", route: "pages/fallback/index" },
    ]
    mockGetCurrentInstance = getCurrentInstance

    expect(getPagePath()).toBe("pages/current/index")
    expect(getCurrentInstance).not.toHaveBeenCalled()
  })

  it("should fall back to the current instance when getCurrentPages is unavailable", () => {
    mockGetCurrentPages = undefined
    mockGetCurrentInstance = () => ({ router: { path: "pages/h5/index" } })

    expect(getPagePath()).toBe("pages/h5/index")
  })

  it("should return an empty path when platform routing APIs are unavailable", () => {
    mockGetCurrentPages = undefined
    mockGetCurrentInstance = undefined

    expect(getPagePath()).toBe("")
  })

  it("should mount with the platform ReactDOM renderer", () => {
    const children = {} as TaroNode
    const view = document.createElement("div") as unknown as TaroNode

    mountPortal(children, view)

    expect(createRoot).toHaveBeenCalledWith(view)
    expect(createRootMock.mock.results[0].value.render).toHaveBeenCalledWith(children)
    expect(document.getElementById("pages/index/index")?.contains(view as unknown as Node)).toBe(
      true,
    )
  })

  it("should mount to the app root when no page path is available", () => {
    mockGetCurrentPages = undefined
    mockGetCurrentInstance = undefined
    const children = {} as TaroNode

    const view = mountPortal(children)

    expect(createRoot).toHaveBeenCalledWith(view)
    expect(document.body.contains(view as unknown as Node)).toBe(true)
  })

  it("should reuse a React root for the same portal node", () => {
    const view = document.createElement("div") as unknown as TaroNode

    mountPortal({} as TaroNode, view)
    mountPortal({} as TaroNode, view)

    expect(createRoot).toHaveBeenCalledTimes(1)
    expect(createRootMock.mock.results[0].value.render).toHaveBeenCalledTimes(2)
  })

  it("should report when neither a page element nor the app root exists", () => {
    const body = document.body
    const consoleError = jest.spyOn(console, "error").mockImplementation()
    body.remove()

    try {
      mountPortal({} as TaroNode)
      expect(consoleError).toHaveBeenCalledWith(
        "[Taroify] cannot find page element or app root element",
      )
    } finally {
      document.documentElement.appendChild(body)
      consoleError.mockRestore()
    }
  })

  it("should unmount and remove the portal view", () => {
    const view = document.createElement("div") as unknown as TaroNode
    mountPortal({} as TaroNode, view)
    const root = createRootMock.mock.results[0].value

    unmountPortal(view)

    expect(root.unmount).toHaveBeenCalled()
    expect(document.body.contains(view as unknown as Node)).toBe(false)
  })

  it("should safely unmount a node that was not mounted as a portal", () => {
    const view = document.createElement("div") as unknown as TaroNode

    expect(() => unmountPortal(view)).not.toThrow()
  })
})
