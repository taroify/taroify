import {
  Cell,
  NumberKeyboard,
  Toast,
  type NumberKeyboardKeyCode,
} from "@taroify/core"
import { useState } from "react"
import BlockCard from "../../../components/block-card"
import Page from "../../../components/page"
import "./index.scss"

interface KeyboardProps {
  keyboard?: string

  onKeyboard?(keyboard: string): void

  onKeyPress?(value: string | number, code: NumberKeyboardKeyCode): void
}

function BasicNumberKeyboard(props: KeyboardProps) {
  const { keyboard, onKeyboard, onKeyPress } = props
  return (
    <>
      <Cell
        clickable
        title="弹出默认键盘"
        isLink
        onClick={() => onKeyboard?.("basic")}
      />
      <NumberKeyboard
        open={keyboard === "basic"}
        hideOnClickOutside
        onKeyPress={onKeyPress}
        onBlur={() => onKeyboard?.("")}
      />
    </>
  )
}

function SidebarNumberKeyboard(props: KeyboardProps) {
  const { keyboard, onKeyboard, onKeyPress } = props
  return (
    <>
      <Cell
        clickable
        title="弹出带右侧栏的键盘"
        isLink
        onClick={() => onKeyboard?.("sidebar")}
      />
      <NumberKeyboard
        open={keyboard === "sidebar"}
        extraKey={[undefined, "."]}
        onKeyPress={onKeyPress}
        onClose={() => onKeyboard?.("")}
      >
        <NumberKeyboard.Sidebar>
          <NumberKeyboard.Key size="large" code="backspace" />
          <NumberKeyboard.Key size="large" code="keyboard-hide" color="blue">
            完成
          </NumberKeyboard.Key>
        </NumberKeyboard.Sidebar>
      </NumberKeyboard>
    </>
  )
}

function IdCardNumberKeyboard(props: KeyboardProps) {
  const { keyboard, onKeyboard, onKeyPress } = props
  return (
    <>
      <Cell
        clickable
        title="弹出身份证号键盘"
        isLink
        onClick={() => onKeyboard?.("idCard")}
      />
      <NumberKeyboard
        open={keyboard === "idCard"}
        extraKey="X"
        onKeyPress={onKeyPress}
        onClose={() => onKeyboard?.("")}
      >
        <NumberKeyboard.Header>
          <NumberKeyboard.Button>完成</NumberKeyboard.Button>
        </NumberKeyboard.Header>
      </NumberKeyboard>
    </>
  )
}

function TitleNumberKeyboard(props: KeyboardProps) {
  const { keyboard, onKeyboard, onKeyPress } = props
  return (
    <>
      <Cell
        clickable
        title="弹出带标题的键盘"
        isLink
        onClick={() => onKeyboard?.("title")}
      />
      <NumberKeyboard
        open={keyboard === "title"}
        title="键盘标题"
        extraKey="."
        onKeyPress={onKeyPress}
        onClose={() => onKeyboard?.("")}
      >
        <NumberKeyboard.Header>
          <NumberKeyboard.Button>完成</NumberKeyboard.Button>
        </NumberKeyboard.Header>
      </NumberKeyboard>
    </>
  )
}

function NumberKeyboardWithKeys(props: KeyboardProps) {
  const { keyboard, onKeyboard, onKeyPress } = props
  return (
    <>
      <Cell
        clickable
        title="弹出配置多个按键的键盘"
        isLink
        onClick={() => onKeyboard?.("keys")}
      />
      <NumberKeyboard
        open={keyboard === "keys"}
        extraKey={["00", "."]}
        onKeyPress={onKeyPress}
        onClose={() => onKeyboard?.("")}
      >
        <NumberKeyboard.Sidebar>
          <NumberKeyboard.Key size="large" code="backspace" />
          <NumberKeyboard.Key size="large" code="keyboard-hide" color="blue">
            完成
          </NumberKeyboard.Key>
        </NumberKeyboard.Sidebar>
      </NumberKeyboard>
    </>
  )
}

function RandomNumberKeyboard(props: KeyboardProps) {
  const { keyboard, onKeyboard, onKeyPress } = props
  return (
    <>
      <Cell
        clickable
        title="弹出配置随机数字的键盘"
        isLink
        onClick={() => onKeyboard?.("random")}
      />
      <NumberKeyboard
        open={keyboard === "random"}
        random
        onKeyPress={onKeyPress}
        onClose={() => onKeyboard?.("")}
      />
    </>
  )
}

function ControlledNumberKeyboard(props: KeyboardProps) {
  const { keyboard, onKeyboard } = props
  const [value, setValue] = useState("")
  return (
    <>
      <Cell
        clickable
        title="双向绑定"
        brief={value || "最多输入 6 位数字"}
        isLink
        onClick={() => onKeyboard?.("controlled")}
      />
      <NumberKeyboard
        open={keyboard === "controlled"}
        value={value}
        maxlength={6}
        onChange={setValue}
        onClose={() => onKeyboard?.("")}
      />
    </>
  )
}

export default function NumberKeyboardDemo() {
  const [keyboard, setKeyboard] = useState("basic")
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<any>()

  const onKeyPress = (aValue: string | number, code: NumberKeyboardKeyCode) => {
    setOpen(code !== "keyboard-hide")
    if (code === "backspace") {
      setValue("backspace")
    } else if (code === "extra") {
      setValue(`输入：${aValue}`)
    }
  }

  return (
    <Page title="NumberKeyboard 数字键盘" className="number-keyboard-demo">
      <BlockCard>
        <BasicNumberKeyboard keyboard={keyboard} onKeyboard={setKeyboard} onKeyPress={onKeyPress} />
        <SidebarNumberKeyboard
          keyboard={keyboard}
          onKeyboard={setKeyboard}
          onKeyPress={onKeyPress}
        />
        <IdCardNumberKeyboard
          keyboard={keyboard}
          onKeyboard={setKeyboard}
          onKeyPress={onKeyPress}
        />
        <TitleNumberKeyboard keyboard={keyboard} onKeyboard={setKeyboard} onKeyPress={onKeyPress} />
        <NumberKeyboardWithKeys
          keyboard={keyboard}
          onKeyboard={setKeyboard}
          onKeyPress={onKeyPress}
        />
        <RandomNumberKeyboard
          keyboard={keyboard}
          onKeyboard={setKeyboard}
          onKeyPress={onKeyPress}
        />
        <ControlledNumberKeyboard keyboard={keyboard} onKeyboard={setKeyboard} />
      </BlockCard>
      <Toast open={open} duration={800} onClose={() => setOpen(false)} children={value} />
    </Page>
  )
}
