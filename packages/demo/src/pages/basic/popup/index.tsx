import { ScrollView } from "@tarojs/components"
import {
  Cell,
  Popup,
  type PopupCloseAction,
  type PopupPlacement,
} from "@taroify/core"
import { Close } from "@taroify/icons"
import { type CSSProperties, useState } from "react"
import Block from "../../../components/block"
import Page from "../../../components/page"
import "./index.scss"

function BasicPopup() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Cell clickable title="显示遮盖层" isLink onClick={() => setOpen(true)} />
      <Popup
        open={open}
        style={{
          padding: "30px 50px",
        }}
        onClose={setOpen}
      >
        内容
      </Popup>
    </>
  )
}

function CenterRoundPopup() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Cell
        clickable
        title="圆角弹窗（居中）"
        isLink
        onClick={() => setOpen(true)}
      />
      <Popup
        open={open}
        style={{
          padding: "64px",
        }}
        onClose={setOpen}
        rounded
      >
        内容
      </Popup>
    </>
  )
}

function LockPopup() {
  const [open, setOpen] = useState(false)
  const [data] = useState(new Array(30).fill(0))
  return (
    <>
      <Cell
        clickable
        title="弹窗（禁止滚动穿透）"
        isLink
        onClick={() => setOpen(true)}
      />
      <Popup
        open={open}
        style={{
          height: "30%",
        }}
        rounded
        lock
        placement="bottom"
        onClose={setOpen}
      >
        <ScrollView className="popup-demo-scroll" scrollY>
          {data.map((_, index) => (
            <Cell key={index}>内容-{index}</Cell>
          ))}
        </ScrollView>
      </Popup>
    </>
  )
}

interface OpenOptions {
  open?: boolean
  closeable?: boolean
  custom?: boolean
  intercept?: boolean
  style?: CSSProperties
  placement?: PopupPlacement
  rounded?: boolean
}

export default function PopupDemo() {
  const [options, setOptions] = useState<OpenOptions>({})

  function handleOpen({ placement, rounded, closeable, custom, intercept }: OpenOptions) {
    const openOptions: OpenOptions = {
      open: true,
      placement,
      rounded,
      closeable,
      custom,
      intercept,
    }
    if (placement === "left" || placement === "right") {
      openOptions.style = {
        height: "100%",
        width: "40%",
      }
    } else if (placement) {
      openOptions.style = { height: "30%" }
    }
    setOptions(openOptions)
  }

  function handleBeforeClose(action: PopupCloseAction) {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(action === "close"), 1000)
    })
  }

  return (
    <Page title="Popup 弹出层" className="popup-demo">
      <Block variant="card" title="基础用法">
        <BasicPopup />
      </Block>
      <Block variant="card" title="弹出位置">
        <Cell
          clickable
          title="顶部弹出"
          isLink
          onClick={() => handleOpen({ placement: "top" })}
        />
        <Cell
          clickable
          title="底部弹出"
          isLink
          onClick={() => handleOpen({ placement: "bottom" })}
        />
        <Cell
          clickable
          title="左侧弹出"
          isLink
          onClick={() => handleOpen({ placement: "left" })}
        />
        <Cell
          clickable
          title="右侧弹出"
          isLink
          onClick={() => handleOpen({ placement: "right" })}
        />
      </Block>
      <Block variant="card" title="关闭按钮">
        <Cell
          clickable
          title="顶部弹出"
          isLink
          onClick={() => handleOpen({ placement: "top", closeable: true })}
        />
        <Cell
          clickable
          title="底部弹出"
          isLink
          onClick={() => handleOpen({ placement: "bottom", closeable: true })}
        />
        <Cell
          clickable
          title="左侧弹出"
          isLink
          onClick={() => handleOpen({ placement: "left", closeable: true })}
        />
        <Cell
          clickable
          title="右侧弹出"
          isLink
          onClick={() => handleOpen({ placement: "right", closeable: true })}
        />
        <Cell
          clickable
          title="自定义图标"
          isLink
          onClick={() => handleOpen({ placement: "bottom", closeable: true, custom: true })}
        />
      </Block>
      <Block variant="card" title="关闭前回调">
        <Cell
          clickable
          title="异步关闭"
          isLink
          onClick={() =>
            handleOpen({
              placement: "bottom",
              closeable: true,
              intercept: true,
            })
          }
        />
      </Block>
      <Block variant="card" title="圆角弹窗">
        <CenterRoundPopup />
        <Cell
          clickable
          title="圆角弹窗（底部）"
          isLink
          onClick={() => handleOpen({ placement: "bottom", rounded: true })}
        />
      </Block>
      <Block variant="card" title="禁止滚动穿透">
        <LockPopup />
      </Block>
      <Popup
        open={options.open}
        placement={options.placement}
        rounded={options.rounded}
        style={options.style}
        closeable={options.closeable && !options.custom}
        beforeClose={options.intercept ? handleBeforeClose : undefined}
        onClose={() =>
          setOptions({
            ...options,
            open: false,
          })
        }
      >
        {options.closeable && options.custom && (
          <Popup.Close>
            <Close />
          </Popup.Close>
        )}
      </Popup>
    </Page>
  )
}
