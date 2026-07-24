import { Cell, Switch } from "@taroify/core"
import * as React from "react"
import Block from "../../../components/block"
import Page from "../../../components/page"
import "./index.scss"

interface SwitchListProps {
  checked?: boolean

  onChange?(checked: boolean): void
}

function BasicSwitch({ checked, onChange }: SwitchListProps) {
  return <Switch checked={checked} onChange={onChange} />
}

function DisabledSwitch({ checked }: SwitchListProps) {
  return <Switch checked={checked} disabled />
}

function LoadingSwitch({ checked }: SwitchListProps) {
  return <Switch checked={checked} loading />
}

function SwitchList() {
  const [checked, setChecked] = React.useState(false)
  return (
    <>
      <Block title="基础用法">
        <BasicSwitch checked={checked} onChange={setChecked} />
      </Block>
      <Block title="禁用状态">
        <DisabledSwitch checked={checked} />
      </Block>
      <Block title="加载状态">
        <LoadingSwitch checked={checked} />
      </Block>
    </>
  )
}

export default function SwitchDemo() {
  return (
    <Page title="Switch 开关" className="switch-demo">
      <SwitchList />
      <Block title="自定义大小">
        <Switch size="24" />
      </Block>
      <Block title="自定义颜色">
        <Switch className="custom-color" defaultChecked />
      </Block>
      <Block title="搭配单元格使用" className="switch-with-cell">
        <Cell align="center" title="标题" extra={<Switch size="24" />} />
      </Block>
    </Page>
  )
}
