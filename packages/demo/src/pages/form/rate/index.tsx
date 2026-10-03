import { Field, Form, Rate, type RateProps, Toast } from "@taroify/core"
import { Like, LikeOutlined, Star } from "@taroify/icons"
import { View } from "@tarojs/components"
import * as React from "react"
import { useState } from "react"
import Block from "../../../components/block"
import Page from "../../../components/page"
import "./index.scss"

function InteractiveRate({ defaultValue = 3, ...props }: RateProps) {
  const [value, setValue] = useState(defaultValue)
  return (
    <>
      <Rate {...props} value={value} onChange={setValue} />
      <View className="rate-demo__value">当前评分：{value}</View>
    </>
  )
}

function EventRate() {
  const [clicks, setClicks] = useState(0)
  const [changes, setChanges] = useState(0)
  return (
    <>
      <Rate
        id="rate-events"
        defaultValue={3}
        onClick={() => setClicks((count) => count + 1)}
        onChange={() => setChanges((count) => count + 1)}
      />
      <View className="rate-demo__value">
        点击次数：{clicks}，评分变化：{changes}
      </View>
    </>
  )
}

export default function RateDemo() {
  return (
    <Page title="Rate 评分" className="rate-demo">
      <Toast id="toast" />
      <Block title="基础用法">
        <InteractiveRate id="rate-basic" />
      </Block>
      <Block title="自定义图标">
        <Rate defaultValue={3} icon={<Like />} emptyIcon={<LikeOutlined />} />
      </Block>
      <Block title="自定义样式">
        <Rate className="custom-color" defaultValue={3} allowHalf size={25} emptyIcon={<Star />} />
      </Block>
      <Block title="便捷颜色属性">
        <Rate id="rate-colors" defaultValue={3} color="#ffd21e" emptyColor="#eee" />
      </Block>
      <Block title="半星">
        <InteractiveRate id="rate-half" defaultValue={2.5} allowHalf />
      </Block>
      <Block title="自定义数量与字符串尺寸">
        <Rate defaultValue={3} count="6" size="48rpx" gutter="12rpx" />
      </Block>
      <Block title="可清空">
        <InteractiveRate id="rate-clearable" defaultValue={2.5} allowHalf clearable />
      </Block>
      <Block title="禁用滑动，保留点击">
        <InteractiveRate id="rate-click-only" touchable={false} />
      </Block>
      <Block title="多行布局">
        <InteractiveRate
          id="rate-wrap"
          count={10}
          defaultValue={3.5}
          wrap
          allowHalf
          style={{ width: "150px" }}
        />
      </Block>
      <Block title="点击与滑动事件">
        <EventRate />
      </Block>
      <Block title="禁用状态">
        <Rate defaultValue={3} disabled disabledColor="#c8c9cc" />
      </Block>
      <Block title="只读状态">
        <Rate defaultValue={3} readonly />
      </Block>
      <Block title="只读状态显示小数">
        <Rate value={3.3} readonly allowHalf />
      </Block>
      <Block title="搭配表单使用">
        <Form defaultValues={{ score: 3 }}>
          <Field label="评分" name="score">
            <Rate clearable />
          </Field>
        </Form>
      </Block>
    </Page>
  )
}
