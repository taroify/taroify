import { fireEvent, render } from "@testing-library/react"
import * as React from "react"
import { prefixClassname } from "../../styles"
import NumberKeyboard from "../index"
import NumberKeyboardButton from "../number-keyboard-button"
import NumberKeyboardContext from "../number-keyboard.context"
import NumberKeyboardHeader from "../number-keyboard-header"
import NumberKeyboardKey from "../number-keyboard-key"
import { isNumberKeyboardKeyElement } from "../number-keyboard-key.shared"
import NumberKeyboardKeys from "../number-keyboard-keys"
import NumberKeyboardSidebar from "../number-keyboard-sidebar"
import NumberKeyboardElement, {
  createExtraNumberKeyboardKey,
  shuffleNumberKeyboardKeys,
} from "../number-keyboard"

let transitionProps: Record<string, any> = {}

jest.mock("../../transition", () => ({
  __esModule: true,
  default: (props: Record<string, any>) => {
    transitionProps = props
    return props.children
  },
}))

function getKeys(container: HTMLElement) {
  return Array.from(container.querySelectorAll(`.${prefixClassname("key")}`)) as HTMLElement[]
}

function getKey(container: HTMLElement, text: string) {
  return getKeys(container).find((key) => key.textContent === text) as HTMLElement
}

function press(key: HTMLElement, eventName: "touchEnd" | "touchCancel" = "touchEnd") {
  const wrapper = key.parentElement as HTMLElement
  fireEvent.touchStart(wrapper, {
    touches: [{ clientX: 0, clientY: 0 }],
  })
  fireEvent[eventName](wrapper)
}

describe("<NumberKeyboard />", () => {
  beforeEach(() => {
    transitionProps = {}
  })

  it("exposes its compound components", () => {
    expect(NumberKeyboard).toBe(NumberKeyboardElement)
    expect(NumberKeyboard.Key).toBe(NumberKeyboardKey)
    expect(NumberKeyboard.Button).toBe(NumberKeyboardButton)
    expect(NumberKeyboard.Header).toBe(NumberKeyboardHeader)
    expect(NumberKeyboard.Sidebar).toBe(NumberKeyboardSidebar)
  })

  it("renders the default keyboard and transition options", () => {
    const onShow = jest.fn()
    const { container } = render(
      <NumberKeyboard
        open
        id="payment-keyboard"
        className="custom-keyboard"
        data-testid="number-keyboard"
        onShow={onShow}
      />,
    )
    const keyboard = container.querySelector(
      `.${prefixClassname("number-keyboard")}`,
    ) as HTMLElement

    expect(keyboard).toHaveClass("custom-keyboard")
    expect(keyboard).toHaveAttribute("id", "payment-keyboard")
    expect(keyboard).toHaveAttribute("data-testid", "number-keyboard")
    expect(keyboard).not.toHaveClass(prefixClassname("number-keyboard--unfit"))
    expect(getKeys(container)).toHaveLength(12)
    expect(transitionProps).toEqual(
      expect.objectContaining({
        in: true,
        appear: true,
        name: "slide-up",
        timeout: undefined,
      }),
    )

    transitionProps.onEntered()
    expect(onShow).toHaveBeenCalledTimes(1)
  })

  it("supports disabling transitions and bottom safe-area spacing", () => {
    const { container } = render(
      <NumberKeyboard open transition={false} safeAreaInsetBottom={false} />,
    )

    expect(transitionProps.name).toBeUndefined()
    expect(transitionProps.timeout).toBe(0)
    expect(container.querySelector(`.${prefixClassname("number-keyboard")}`)).toHaveClass(
      prefixClassname("number-keyboard--unfit"),
    )
  })

  it("creates a header from title and preserves custom header and sidebar children", () => {
    const { container, rerender } = render(<NumberKeyboard title="支付金额" />)

    expect(
      container.querySelector(`.${prefixClassname("number-keyboard__header")}`),
    ).toHaveTextContent("支付金额")
    expect(container.querySelector(`.${prefixClassname("number-keyboard")}`)).toHaveClass(
      prefixClassname("number-keyboard--with-title"),
    )

    rerender(
      <NumberKeyboard title="支付金额">
        文本节点
        <NumberKeyboard.Header className="custom-header">
          <NumberKeyboard.Button>确定</NumberKeyboard.Button>
        </NumberKeyboard.Header>
        <NumberKeyboard.Sidebar className="custom-sidebar">侧栏</NumberKeyboard.Sidebar>
        <span>忽略的元素</span>
      </NumberKeyboard>,
    )

    expect(
      container.querySelectorAll(`.${prefixClassname("number-keyboard__header")}`),
    ).toHaveLength(1)
    expect(container.querySelector(".custom-header")).toHaveTextContent("支付金额确定")
    expect(container.querySelector(".custom-sidebar")).toHaveTextContent("侧栏")
    expect(container).not.toHaveTextContent("文本节点")
    expect(container).not.toHaveTextContent("忽略的元素")
  })

  it("emits controlled value changes and keeps legacy key events", () => {
    const onKeyPress = jest.fn()
    const onChange = jest.fn()
    const onBackspace = jest.fn()
    const onClose = jest.fn()
    const onBlur = jest.fn()
    const onHide = jest.fn()
    const { container, rerender } = render(
      <NumberKeyboard
        value="12"
        maxlength="3"
        onKeyPress={onKeyPress}
        onChange={onChange}
        onBackspace={onBackspace}
        onClose={onClose}
        onBlur={onBlur}
        onHide={onHide}
      />,
    )

    press(getKey(container, "3"))
    expect(onKeyPress).toHaveBeenLastCalledWith(3, "extra")
    expect(onChange).toHaveBeenLastCalledWith("123")

    rerender(
      <NumberKeyboard
        value="123"
        maxlength={3}
        onKeyPress={onKeyPress}
        onChange={onChange}
        onBackspace={onBackspace}
        onClose={onClose}
        onBlur={onBlur}
        onHide={onHide}
      />,
    )
    onChange.mockClear()
    press(getKey(container, "4"))
    expect(onKeyPress).toHaveBeenLastCalledWith(4, "extra")
    expect(onChange).not.toHaveBeenCalled()

    press(getKeys(container).at(-1) as HTMLElement)
    expect(onKeyPress).toHaveBeenLastCalledWith("", "backspace")
    expect(onBackspace).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith("12")

    press(getKeys(container).at(-3) as HTMLElement)
    expect(onKeyPress).toHaveBeenLastCalledWith("", "keyboard-hide")
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(onHide).toHaveBeenCalledTimes(1)
  })

  it("uses an empty value by default", () => {
    const onChange = jest.fn()
    const { container } = render(<NumberKeyboard onChange={onChange} />)

    press(getKey(container, "1"))
    expect(onChange).toHaveBeenLastCalledWith("1")

    press(getKeys(container).at(-1) as HTMLElement)
    expect(onChange).toHaveBeenLastCalledWith("")
  })

  it("emits blur only for outside touches when enabled", () => {
    const onBlur = jest.fn()
    const { container, rerender } = render(
      <NumberKeyboard open hideOnClickOutside onBlur={onBlur} />,
    )
    const clickAway = container.querySelector(
      `.${prefixClassname("number-keyboard__click-away")}`,
    ) as HTMLElement

    fireEvent.touchStart(clickAway)
    expect(onBlur).toHaveBeenCalledTimes(1)

    rerender(<NumberKeyboard open={false} hideOnClickOutside onBlur={onBlur} />)
    expect(
      container.querySelector(`.${prefixClassname("number-keyboard__click-away")}`),
    ).not.toBeInTheDocument()

    rerender(<NumberKeyboard open hideOnClickOutside={false} onBlur={onBlur} />)
    expect(
      container.querySelector(`.${prefixClassname("number-keyboard__click-away")}`),
    ).not.toBeInTheDocument()
  })

  it("supports every extra-key layout", () => {
    const { container, rerender } = render(<NumberKeyboard extraKey="X" />)
    expect(getKeys(container)).toHaveLength(12)
    expect(getKey(container, "X")).toBeInTheDocument()

    rerender(<NumberKeyboard extraKey={<NumberKeyboard.Key code="extra">Y</NumberKeyboard.Key>} />)
    expect(getKey(container, "Y")).toBeInTheDocument()

    rerender(<NumberKeyboard extraKey={["."]} />)
    expect(getKeys(container)).toHaveLength(11)
    expect(getKey(container, "0").parentElement).toHaveClass(prefixClassname("key__wrapper--wider"))

    rerender(<NumberKeyboard extraKey={["00", "."]} />)
    expect(getKeys(container)).toHaveLength(12)
    expect(getKey(container, "0").parentElement).not.toHaveClass(
      prefixClassname("key__wrapper--wider"),
    )

    rerender(<NumberKeyboard extraKey={[undefined, "."]} />)
    expect(getKeys(container)).toHaveLength(11)
    expect(getKey(container, "0").parentElement).toHaveClass(prefixClassname("key__wrapper--wider"))

    rerender(<NumberKeyboard extraKey={<span>无效额外按键</span>} />)
    expect(getKeys(container)).toHaveLength(9)
  })

  it("uses Fisher-Yates for random key order", () => {
    const random = jest.spyOn(Math, "random").mockReturnValue(0)
    const keys = [1, 2, 3]

    expect(shuffleNumberKeyboardKeys(keys)).toBe(keys)
    expect(keys).toEqual([2, 3, 1])

    const { container } = render(<NumberKeyboard random />)
    expect(
      getKeys(container)
        .slice(0, 9)
        .map((key) => key.textContent),
    ).not.toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9"])
    random.mockRestore()
  })
})

describe("NumberKeyboard key factories", () => {
  it("creates primitive and cloned key elements", () => {
    const stringKey = createExtraNumberKeyboardKey("X") as React.ReactElement
    const numberKey = createExtraNumberKeyboardKey(0) as React.ReactElement
    const explicitKey = createExtraNumberKeyboardKey(
      <NumberKeyboardKey key="explicit">A</NumberKeyboardKey>,
    ) as React.ReactElement
    const childrenKey = createExtraNumberKeyboardKey(
      <NumberKeyboardKey>B</NumberKeyboardKey>,
    ) as React.ReactElement
    const codeKey = createExtraNumberKeyboardKey(
      <NumberKeyboardKey code="backspace" />,
    ) as React.ReactElement

    expect(stringKey.props.children).toBe("X")
    expect(numberKey.props.children).toBe(0)
    expect(explicitKey.key).toBe("explicit")
    expect(childrenKey.key).toBe("B")
    expect(codeKey.key).toBe("backspace")
    expect(createExtraNumberKeyboardKey(<span>invalid</span>)).toBeUndefined()
  })

  it("recognizes only NumberKeyboardKey elements", () => {
    expect(React.isValidElement(<NumberKeyboardKey />)).toBe(true)
    expect(isNumberKeyboardKeyElement(<NumberKeyboardKey />)).toBe(true)
    expect(isNumberKeyboardKeyElement(<span />)).toBe(false)
    expect(isNumberKeyboardKeyElement("key")).toBe(false)
  })
})

describe("<NumberKeyboardKey />", () => {
  it("handles taps, movement, cancellation, context and custom classes", () => {
    const onPress = jest.fn()
    const onKeyPress = jest.fn()
    const { container, rerender } = render(
      <NumberKeyboardContext.Provider value={{ onKeyPress }}>
        <NumberKeyboardKey wider size="large" color="blue" onPress={onPress}>
          8
        </NumberKeyboardKey>
      </NumberKeyboardContext.Provider>,
    )
    const key = getKey(container, "8")
    const wrapper = key.parentElement as HTMLElement

    fireEvent.touchStart(wrapper, { touches: [{ clientX: 0, clientY: 0 }] })
    expect(key).toHaveClass(
      prefixClassname("key--active"),
      prefixClassname("key--large"),
      prefixClassname("key--blue"),
    )
    expect(wrapper).toHaveClass(prefixClassname("key__wrapper--wider"))
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 1, clientY: 1 }] })
    expect(key).toHaveClass(prefixClassname("key--active"))
    fireEvent.touchMove(wrapper, { touches: [{ clientX: 20, clientY: 0 }] })
    expect(key).not.toHaveClass(prefixClassname("key--active"))
    fireEvent.touchEnd(wrapper)
    expect(onPress).not.toHaveBeenCalled()

    press(key, "touchCancel")
    expect(onPress).toHaveBeenLastCalledWith("8", "extra")
    expect(onKeyPress).toHaveBeenLastCalledWith("8", "extra")

    rerender(
      <NumberKeyboardContext.Provider value={{ onKeyPress }}>
        <NumberKeyboardKey code={null as any} onPress={onPress}>
          自定义
        </NumberKeyboardKey>
      </NumberKeyboardContext.Provider>,
    )
    press(getKey(container, "自定义"))
    expect(onPress).toHaveBeenLastCalledWith("自定义", "自定义")
    expect(onKeyPress).toHaveBeenLastCalledWith("自定义", "自定义")
  })

  it("renders default and custom action-key content", () => {
    const { container, rerender } = render(<NumberKeyboardKey code="backspace" />)
    expect(container.querySelector(".taroify-backspace")).toBeInTheDocument()

    rerender(<NumberKeyboardKey code="backspace">删除</NumberKeyboardKey>)
    expect(container).toHaveTextContent("删除")

    rerender(<NumberKeyboardKey code="keyboard-hide" />)
    expect(container.querySelector(".taroify-keyboard-hide")).toBeInTheDocument()

    rerender(<NumberKeyboardKey code="keyboard-hide">收起</NumberKeyboardKey>)
    expect(container).toHaveTextContent("收起")
  })
})

describe("NumberKeyboard layout components", () => {
  it("renders keys and sidebar view props", () => {
    const { container } = render(
      <>
        <NumberKeyboardKeys className="custom-keys" data-testid="keys">
          按键区
        </NumberKeyboardKeys>
        <NumberKeyboardSidebar className="custom-sidebar" data-testid="sidebar">
          侧栏
        </NumberKeyboardSidebar>
      </>,
    )

    expect(container.querySelector(".custom-keys")).toHaveClass(
      prefixClassname("number-keyboard__keys"),
    )
    expect(container.querySelector(".custom-keys")).toHaveTextContent("按键区")
    expect(container.querySelector(".custom-keys")).toHaveAttribute("data-testid", "keys")
    expect(container.querySelector(".custom-sidebar")).toHaveClass(
      prefixClassname("number-keyboard__sidebar"),
    )
    expect(container.querySelector(".custom-sidebar")).toHaveTextContent("侧栏")
    expect(container.querySelector(".custom-sidebar")).toHaveAttribute("data-testid", "sidebar")
  })

  it("renders header title and only supported button children", () => {
    const { container } = render(
      <NumberKeyboardContext.Provider value={{ title: "标题" }}>
        <NumberKeyboardHeader className="custom-header" data-testid="header">
          文本
          <NumberKeyboardButton>完成</NumberKeyboardButton>
          <NumberKeyboardButton type="hide">关闭</NumberKeyboardButton>
          <NumberKeyboardButton type={"unsupported" as any}>忽略</NumberKeyboardButton>
          <span>元素</span>
        </NumberKeyboardHeader>
      </NumberKeyboardContext.Provider>,
    )

    expect(container.querySelector(".custom-header")).toHaveTextContent("标题关闭")
    expect(container.querySelector(".custom-header")).not.toHaveTextContent("完成")
    expect(container.querySelector(".custom-header")).not.toHaveTextContent("忽略")
    expect(container.querySelector(".custom-header")).not.toHaveTextContent("元素")
    expect(container.querySelector(".custom-header")).toHaveAttribute("data-testid", "header")
  })

  it("handles hide and unsupported buttons", () => {
    const onClick = jest.fn()
    const onKeyPress = jest.fn()
    const { getByText, rerender } = render(
      <NumberKeyboardContext.Provider value={{ onKeyPress }}>
        <NumberKeyboardButton className="custom-button" onClick={onClick}>
          完成
        </NumberKeyboardButton>
      </NumberKeyboardContext.Provider>,
    )

    fireEvent.click(getByText("完成"))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onKeyPress).toHaveBeenCalledWith("完成", "keyboard-hide")
    expect(getByText("完成")).toHaveClass("custom-button", prefixClassname("number-keyboard__hide"))

    rerender(<NumberKeyboardButton type={"unsupported" as any}>普通按钮</NumberKeyboardButton>)
    fireEvent.click(getByText("普通按钮"))
    expect(onKeyPress).toHaveBeenCalledTimes(1)
    expect(getByText("普通按钮")).not.toHaveClass(prefixClassname("number-keyboard__hide"))
  })
})
