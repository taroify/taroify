import * as React from "react"
import { getWindowInfo } from "@tarojs/taro"
import { render } from "@testing-library/react"
import FloatingPanel from "../index"
import { prefixClassname } from "../../styles"
import { touchEvent, sleep } from "../../../test"

describe("<FloatingPanel />", () => {
  it("should minHeight 100 and maxHeight 0.6 innerHeight when anchors props do not", async () => {
    const { asFragment, container } = render(<FloatingPanel>内容</FloatingPanel>)

    expect(asFragment()).toMatchSnapshot()

    const el = container.querySelector(`.${prefixClassname("floating-panel")}`) as HTMLDivElement

    const height = Math.round(getWindowInfo().windowHeight * 0.6)

    expect(el.style.height).toBe(`${height}px`)

    expect(el.style.transform).toContain(`${height}px`)
  })

  it("should drag adsorption effect when anchors props is [100, 200, 400]", async () => {
    const { container, asFragment } = render(
      <FloatingPanel anchors={[100, 200, 400]}>内容</FloatingPanel>,
    )

    const el = container.querySelector(`.${prefixClassname("floating-panel")}`) as HTMLDivElement

    expect(asFragment()).toMatchSnapshot()

    expect(el.style.height).toBe("400px")

    // drag 10
    touchEvent(el, 0, 10)
    await sleep(0)
    expect(el.style.transform).toContain("-100px")

    // drag -49
    touchEvent(el, 0, -49)
    await sleep(0)
    expect(el.style.transform).toContain("-100px")

    // drag -199
    touchEvent(el, 0, -199)
    await sleep(0)
    expect(el.style.transform).toContain("-200px")

    // drag -200
    touchEvent(el, 0, -200)
    await sleep(0)
    expect(el.style.transform).toContain("-400px")

    // drag -500
    touchEvent(el, 0, -500)
    await sleep(0)
    expect(el.style.transform).toContain("-400px")
  })

  it("should emit height-change when height change in anchors", async () => {
    const onChange = jest.fn()
    const { container } = render(
      <FloatingPanel anchors={[100, 200, 400]} handleChange={onChange}>
        内容
      </FloatingPanel>,
    )
    const el = container.querySelector(`.${prefixClassname("floating-panel")}`) as HTMLDivElement
    touchEvent(el, 0, -199)
    await sleep(0)
    expect(el.style.transform).toContain("-200px")
    expect(onChange).toHaveBeenCalledWith(299)
  })

  it("should emit drag lifecycle events with the current panel height", async () => {
    const calls: string[] = []
    const { container } = render(
      <FloatingPanel
        anchors={[100, 200, 400]}
        onDragStart={({ height }) => calls.push(`start:${height}`)}
        onDragging={({ height }) => calls.push(`dragging:${height}`)}
        onDragEnd={({ height }) => calls.push(`end:${height}`)}
      >
        内容
      </FloatingPanel>,
    )
    const el = container.querySelector(`.${prefixClassname("floating-panel")}`) as HTMLDivElement

    touchEvent(el, 0, -199)
    await sleep(0)

    expect(calls).toEqual(["start:100", "dragging:299", "end:200"])
  })

  it("should not emit drag lifecycle events when the panel does not move", () => {
    const onDragStart = jest.fn()
    const onDragging = jest.fn()
    const onDragEnd = jest.fn()
    const { container } = render(
      <FloatingPanel onDragStart={onDragStart} onDragging={onDragging} onDragEnd={onDragEnd}>
        内容
      </FloatingPanel>,
    )
    const el = container.querySelector(`.${prefixClassname("floating-panel")}`) as HTMLDivElement

    touchEvent(el)

    expect(onDragStart).not.toHaveBeenCalled()
    expect(onDragging).not.toHaveBeenCalled()
    expect(onDragEnd).not.toHaveBeenCalled()
  })

  it("should only drag header when allowDraggingContent is false", async () => {
    const onChange = jest.fn()
    const { container } = render(
      <FloatingPanel anchors={[100, 200, 400]} contentDraggable={false} handleChange={onChange}>
        内容
      </FloatingPanel>,
    )
    const el = container.querySelector(
      `.${prefixClassname("floating-panel__content")}`,
    ) as HTMLDivElement
    touchEvent(el, 0, -199)
    await sleep(0)
    expect(onChange).not.toHaveBeenCalled()

    const elHeader = container.querySelector(
      `.${prefixClassname("floating-panel__header")}`,
    ) as HTMLDivElement
    touchEvent(elHeader, 0, -199)
    await sleep(0)
    expect(onChange).toBeTruthy()
  })

  it("should render the safe area outside content and pass safeAreaProps", () => {
    const { container } = render(
      <FloatingPanel
        safeAreaProps={{
          className: "custom-safe-area",
          style: { backgroundColor: "transparent" },
        }}
      >
        内容
      </FloatingPanel>,
    )

    const content = container.querySelector(
      `.${prefixClassname("floating-panel__content")}`,
    ) as HTMLElement
    const safeArea = container.querySelector(
      `.${prefixClassname("floating-panel__safe-area")}`,
    ) as HTMLElement

    expect(content.contains(safeArea)).toBe(false)
    expect(content.nextElementSibling).toBe(safeArea)
    expect(safeArea).toHaveClass("custom-safe-area")
    expect(safeArea).toHaveStyle({ backgroundColor: "rgba(0, 0, 0, 0)" })
  })

  it("should hide the safe area when safeAreaInsetBottom is false", () => {
    const { container } = render(<FloatingPanel safeAreaInsetBottom={false}>内容</FloatingPanel>)

    expect(
      container.querySelector(`.${prefixClassname("floating-panel__safe-area")}`),
    ).not.toBeInTheDocument()
  })
})
