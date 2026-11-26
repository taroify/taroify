import { Slider } from "@taroify/core"
import { View } from "@tarojs/components"
import Block from "../../../components/block"
import Page from "../../../components/page"
import "./index.scss"

function StyledThumbSlider() {
  return (
    <Slider className="custom-color" defaultValue={50}>
      <Slider.Thumb>
        {({ value, dragging }) => (
          <View className="custom-thumb">{dragging ? `${value}%` : value}</View>
        )}
      </Slider.Thumb>
    </Slider>
  )
}

export default function SliderDemo() {
  return (
    <Page title="Slider 滑块" className="slider-demo">
      <Block title="基础用法">
        <Slider defaultValue={50} />
      </Block>
      <Block title="双滑块">
        <Slider range defaultValue={[20, 60]} />
      </Block>
      <Block title="指定选择范围">
        <Slider min={-50} max={50} defaultValue={0} />
      </Block>
      <Block title="禁用">
        <Slider disabled defaultValue={50} />
      </Block>
      <Block title="只读">
        <Slider readonly defaultValue={50} />
      </Block>
      <Block title="反向">
        <Slider reverse defaultValue={50} />
      </Block>
      <Block title="指定步长">
        <Slider step={10} defaultValue={50} />
      </Block>
      <Block title="自定义样式">
        <Slider className="custom-color" size={4} defaultValue={50} />
      </Block>
      <Block title="自定义按钮">
        <StyledThumbSlider />
      </Block>
      <Block title="垂直方向" className="vertical-slider">
        <Slider orientation="vertical" defaultValue={50} />
        <Slider
          style={{ marginLeft: "100px" }}
          range
          orientation="vertical"
          defaultValue={[20, 60]}
        />
      </Block>
    </Page>
  )
}
