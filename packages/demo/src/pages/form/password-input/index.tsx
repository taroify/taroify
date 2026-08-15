import { NumberKeyboard, PasswordInput } from "@taroify/core"
import { useState } from "react"
import Block from "../../../components/block"
import Page from "../../../components/page"
import "./index.scss"

interface OpenKeyboardProps {
  open?: string

  onOpen?(open: string): void
}

function BasicPasswordInput(props: OpenKeyboardProps) {
  const { open, onOpen } = props
  const [value, setValue] = useState("123")

  return (
    <>
      <PasswordInput
        focus={open === "basic"}
        value={value}
        onFocus={() => onOpen?.("basic")}
      />
      <NumberKeyboard
        open={open === "basic"}
        value={value}
        maxlength={6}
        onChange={setValue}
        onClose={() => onOpen?.("")}
      />
    </>
  )
}

function CustomLengthPasswordInput(props: OpenKeyboardProps) {
  const { open, onOpen } = props
  const [value, setValue] = useState("123")

  return (
    <>
      <PasswordInput
        focus={open === "length"}
        length={4}
        value={value}
        onFocus={() => onOpen?.("length")}
      />
      <NumberKeyboard
        open={open === "length"}
        value={value}
        maxlength={4}
        onChange={setValue}
        onClose={() => onOpen?.("")}
      />
    </>
  )
}

function GutterPasswordInput(props: OpenKeyboardProps) {
  const { open, onOpen } = props
  const [value, setValue] = useState("123")

  return (
    <>
      <PasswordInput
        focus={open === "gutter"}
        gutter={10}
        value={value}
        onFocus={() => onOpen?.("gutter")}
      />
      <NumberKeyboard
        open={open === "gutter"}
        value={value}
        maxlength={6}
        onChange={setValue}
        onClose={() => onOpen?.("")}
      />
    </>
  )
}

function NoMaskPasswordInput(props: OpenKeyboardProps) {
  const { open, onOpen } = props
  const [value, setValue] = useState("123")

  return (
    <>
      <PasswordInput
        focus={open === "mask"}
        mask={false}
        value={value}
        onFocus={() => onOpen?.("mask")}
      />
      <NumberKeyboard
        open={open === "mask"}
        value={value}
        maxlength={6}
        onChange={setValue}
        onClose={() => onOpen?.("")}
      />
    </>
  )
}

function PasswordInputWithFeedback(props: OpenKeyboardProps) {
  const { open, onOpen } = props
  const [value, setValue] = useState("123")

  return (
    <>
      <PasswordInput
        focus={open === "feedback"}
        feedback="密码为 6 位数字"
        value={value}
        onFocus={() => onOpen?.("feedback")}
      />
      <NumberKeyboard
        open={open === "feedback"}
        value={value}
        maxlength={6}
        onChange={setValue}
        onClose={() => onOpen?.("")}
      />
    </>
  )
}

export default function PasswordInputDemo() {
  const [open, setOpen] = useState("")
  return (
    <Page title="PasswordInput 密码输入框" className="password-input-demo">
      <Block title="基础用法">
        <BasicPasswordInput open={open} onOpen={setOpen} />
      </Block>
      <Block title="自定义长度">
        <CustomLengthPasswordInput open={open} onOpen={setOpen} />
      </Block>
      <Block title="格子间距">
        <GutterPasswordInput open={open} onOpen={setOpen} />
      </Block>
      <Block title="明文展示">
        <NoMaskPasswordInput open={open} onOpen={setOpen} />
      </Block>
      <Block title="提示信息">
        <PasswordInputWithFeedback open={open} onOpen={setOpen} />
      </Block>
    </Page>
  )
}
