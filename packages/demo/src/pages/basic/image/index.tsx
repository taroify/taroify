import { Flex, Image } from "@taroify/core"
import type { ImageMode } from "@taroify/core/image"
import { Text } from "@tarojs/components"
import Block from "../../../components/block"
import Page from "../../../components/page"
import "./index.scss"

export default function ImageDemo() {
  const imageUrl = "https://img01.yzcdn.cn/vant/cat.jpeg"

  const modes: ImageMode[] = ["scaleToFill", "aspectFit", "aspectFill"]

  return (
    <Page title="Image 图片" className="image-demo">
      <Block title="基础用法">
        <Image width={200} height={200} src={imageUrl} />
      </Block>
      <Block title="填充模式">
        <Flex wrap="wrap" gutter={20}>
          {modes.map((mode) => (
            <Flex.Item span={8} key={mode}>
              <Image width={200} height={200} mode={mode} src={imageUrl} />
              <Text className="text">{mode}</Text>
            </Flex.Item>
          ))}
        </Flex>
      </Block>
      <Block title="圆形图片">
        <Flex wrap="wrap" gutter={20}>
          {modes.map((mode) => (
            <Flex.Item span={8} key={mode}>
              <Image
                width={200}
                height={200}
                mode={mode}
                src={imageUrl}
                shape="circle"
              />
              <Text className="text">{mode}</Text>
            </Flex.Item>
          ))}
        </Flex>
      </Block>
      <Block title="圆角图片">
        <Flex wrap="wrap" gutter={20}>
          <Flex.Item span={8}>
            <Image
              width={200}
              height={200}
              mode="aspectFill"
              src={imageUrl}
              shape="rounded"
            />
            <Text className="text">默认圆角</Text>
          </Flex.Item>
          <Flex.Item span={8}>
            <Image width={200} height={200} mode="aspectFill" src={imageUrl} radius={24} />
            <Text className="text">自定义圆角</Text>
          </Flex.Item>
        </Flex>
      </Block>
      <Block title="加载中提示">
        <Flex wrap="wrap" gutter={20}>
          <Flex.Item span={8}>
            <Image width={200} height={200} placeholder />
            <Text className="text">默认提示</Text>
          </Flex.Item>
          <Flex.Item span={8}>
            <Image width={200} height={200} placeholder="加载中..." />
            <Text className="text">文字提示</Text>
          </Flex.Item>
        </Flex>
      </Block>
      <Block title="加载失败提示">
        <Flex wrap="wrap" gutter={20}>
          <Flex.Item span={8}>
            <Image width={200} height={200} src="error" fallback />
            <Text className="text">默认提示</Text>
          </Flex.Item>
          <Flex.Item span={8}>
            <Image width={200} height={200} src="error" fallback="加载失败" />
            <Text className="text">文字提示</Text>
          </Flex.Item>
        </Flex>
      </Block>
    </Page>
  )
}
