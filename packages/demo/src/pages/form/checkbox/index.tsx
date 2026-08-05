import { Button, Cell, Checkbox, Image, Space } from "@taroify/core"
import type { CheckboxGroupInstance, CheckboxInstance } from "@taroify/core"
import { View } from "@tarojs/components"
import { useRef, useState } from "react"
import Block from "../../../components/block"
import Page from "../../../components/page"
import "./index.scss"

function CheckboxWithCustomIcon() {
  const [value, setValue] = useState(false)

  return (
    <Checkbox
      icon={
        <Image
          src={`https://img.yzcdn.cn/vant/user-${value ? "active" : "inactive"}.png`}
          style={{
            width: "25px",
            height: "20px",
          }}
        />
      }
      checked={value}
      onChange={setValue}
    >
      自定义图标
    </Checkbox>
  )
}

function CheckboxToggleAll() {
  const groupRef = useRef<CheckboxGroupInstance>(null)

  return (
    <>
      <Checkbox.Group ref={groupRef}>
        <Checkbox name="a">复选框 a</Checkbox>
        <Checkbox name="b">复选框 b</Checkbox>
        <Checkbox name="c" disabled>
          复选框 c
        </Checkbox>
      </Checkbox.Group>
      <Space className="checkbox-toggle-buttons">
        <Button size="small" color="primary" onClick={() => groupRef.current?.toggleAll(true)}>
          全选
        </Button>
        <Button size="small" onClick={() => groupRef.current?.toggleAll(false)}>
          取消全选
        </Button>
        <Button size="small" onClick={() => groupRef.current?.toggleAll()}>
          反选
        </Button>
      </Space>
    </>
  )
}

function CheckboxWithCell() {
  const checkboxRefs = useRef<Array<CheckboxInstance | null>>([])
  const options = ["a", "b"]

  return (
    <Checkbox.Group max={2}>
      <Cell.Group clickable>
        {options.map((name, index) => (
          <Cell
            key={name}
            title={`复选框 ${name}`}
            onClick={() => checkboxRefs.current[index]?.toggle()}
          >
            <View onClick={(event) => event.stopPropagation()}>
              <Checkbox
                ref={(instance) => {
                  checkboxRefs.current[index] = instance
                }}
                name={name}
              />
            </View>
          </Cell>
        ))}
      </Cell.Group>
    </Checkbox.Group>
  )
}

function CheckboxIndeterminate() {
  const options = ["a", "b", "c"]
  const [value, setValue] = useState(["a", "b"])
  const checked = value.length === options.length
  const indeterminate = value.length > 0 && !checked

  return (
    <Space direction="vertical">
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        onChange={(nextChecked) => setValue(nextChecked ? options : [])}
      >
        全选
      </Checkbox>
      <Checkbox.Group value={value} onChange={setValue}>
        {options.map((name) => (
          <Checkbox key={name} name={name}>
            复选框 {name}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Space>
  )
}

export default function CheckboxDemo() {
  return (
    <Page title="Checkbox 复选框" className="checkbox-demo">
      <Block title="基础用法">
        <Checkbox defaultChecked>复选框</Checkbox>
      </Block>
      <Block title="禁用状态">
        <Space direction="vertical">
          <Checkbox disabled checked={false}>
            复选框
          </Checkbox>
          <Checkbox disabled checked>
            复选框
          </Checkbox>
        </Space>
      </Block>
      <Block title="自定义形状">
        <Checkbox.Group shape="square" defaultValue={["a"]}>
          <Checkbox name="a">复选框 a</Checkbox>
          <Checkbox name="b">复选框 b</Checkbox>
        </Checkbox.Group>
      </Block>
      <Block title="按钮形状">
        <Checkbox.Group defaultValue={["a", "c"]} direction="horizontal">
          <Checkbox name="a" shape="button">
            复选框 a
          </Checkbox>
          <Checkbox name="b" shape="button">
            复选框 b
          </Checkbox>
          <Checkbox name="c" shape="button" disabled>
            复选框 c
          </Checkbox>
        </Checkbox.Group>
      </Block>
      <Block title="自定义颜色">
        <Checkbox defaultChecked checkedColor="#ee0a24">
          自定义颜色
        </Checkbox>
      </Block>
      <Block title="自定义大小">
        <Checkbox size={24}>自定义大小</Checkbox>
      </Block>
      <Block title="自定义图标">
        <CheckboxWithCustomIcon />
      </Block>
      <Block title="左侧文本">
        <Checkbox labelPosition="left">复选框</Checkbox>
      </Block>
      <Block title="禁用文本点击">
        <Checkbox labelDisabled>复选框</Checkbox>
      </Block>
      <Block title="复选框组">
        <Checkbox.Group>
          <Checkbox name="a">复选框 a</Checkbox>
          <Checkbox name="b">复选框 b</Checkbox>
        </Checkbox.Group>
      </Block>
      <Block title="水平排列">
        <Checkbox.Group direction="horizontal">
          <Checkbox name="a">复选框 a</Checkbox>
          <Checkbox name="b">复选框 b</Checkbox>
        </Checkbox.Group>
      </Block>
      <Block title="限制最大可选数">
        <Checkbox.Group max={4}>
          <Checkbox name="a">复选框 a</Checkbox>
          <Checkbox name="b">复选框 b</Checkbox>
          <Checkbox name="c">复选框 c</Checkbox>
          <Checkbox name="d">复选框 d</Checkbox>
          <Checkbox name="e">复选框 e</Checkbox>
          <Checkbox name="f">复选框 f</Checkbox>
          <Checkbox name="g">复选框 g</Checkbox>
        </Checkbox.Group>
      </Block>
      <Block title="全选与反选">
        <CheckboxToggleAll />
      </Block>
      <Block title="搭配单元格组件使用" className="checkbox-cell-group">
        <CheckboxWithCell />
      </Block>
      <Block title="不确定状态">
        <CheckboxIndeterminate />
      </Block>
    </Page>
  )
}
