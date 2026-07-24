import { Cell, Switch } from "@taroify/core"
import { LocationOutlined } from "@taroify/icons"
import Block from "../../../components/block"
import Page from "../../../components/page"
import "./index.scss"

export default function CellDemo() {
  return (
    <Page title="Cell 单元格" className="cell-demo">
      <Block title="基础用法">
        <Cell title="单元格">内容</Cell>
        <Cell title="单元格" brief="描述信息" children="内容" />
      </Block>
      <Block title="卡片风格">
        <Cell.Group inset>
          <Cell title="单元格">内容</Cell>
          <Cell title="单元格">内容</Cell>
        </Cell.Group>
      </Block>
      <Block title="单元格大小">
        <Cell title="单元格">内容</Cell>
        <Cell title="单元格" brief="描述信息" size="large" children="内容" />
      </Block>
      <Block title="展示图标">
        <Cell icon={<LocationOutlined />} title="单元格" children="内容" />
      </Block>
      <Block title="只设置内容">
        <Cell>内容</Cell>
      </Block>
      <Block title="展示箭头">
        <Cell title="单元格" isLink />
        <Cell title="单元格" isLink children="内容" />
        <Cell title="单元格" isLink arrowDirection="down" children="内容" />
      </Block>
      <Block title="页面导航">
        <Cell.Link title="返回首页" url="/pages/home/index" />
      </Block>
      <Block title="额外内容">
        <Cell title="消息通知" extra={<Switch size="24" defaultChecked />}>
          已开启
        </Cell>
      </Block>
      <Block title="分组标题">
        <Cell.Group title="分组 1">
          <Cell title="单元格">内容</Cell>
        </Cell.Group>
        <Cell.Group title="分组 2">
          <Cell title="单元格">内容</Cell>
        </Cell.Group>
      </Block>
      <Block title="对齐方式">
        <Cell title="单元格" brief="align start" size="large" align="start" children="内容" />
        <Cell title="单元格" brief="align center" size="large" align="center" children="内容" />
        <Cell title="单元格" brief="align end" size="large" align="end" children="内容" />
      </Block>
    </Page>
  )
}
