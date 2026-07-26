import { Button, Space } from "@taroify/core"
import Block from "../../../components/block"
import Page from "../../../components/page"
import "./index.scss"

export default function SpaceDemo() {
  return (
    <Page title="Space 间距" className="space-demo">
      <Block title="基础用法">
        <Space>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
      </Block>
      <Block title="垂直">
        <Space direction="vertical" fill>
          <Button color="primary" block>主要按钮</Button>
          <Button color="primary" block>主要按钮</Button>
          <Button color="primary" block>主要按钮</Button>
        </Space>
      </Block>
      <Block title="间距">
        <Space size="mini">
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
        <Space size="small">
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
        <Space size="medium">
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
        <Space size="large">
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
      </Block>
      <Block title="自定义间隔">
        <Space size={16}>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
        <Space size="32px">
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
        <Space size="var(--space-demo-gap)">
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
        <Space size={[16, "32px"]}>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
      </Block>
      <Block title="分隔符">
        <Space separator="|">
          <Button variant="text" color="primary">编辑</Button>
          <Button variant="text" color="primary">删除</Button>
          <Button variant="text" color="primary">更多</Button>
        </Space>
      </Block>
      <Block title="靠右">
        <Space justify="space-around">
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
      </Block>
      <Block title="居中">
        <Space justify="center">
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
      </Block>
      <Block title="环绕">
        <Space justify="space-around">
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
      </Block>
      <Block title="两端对齐">
        <Space justify="space-between">
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
      </Block>
      <Block title="不换行">
        <Space wrap="nowrap">
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
          <Button color="primary">主要按钮</Button>
        </Space>
      </Block>
    </Page>
  )
}
