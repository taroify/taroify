import { Signature } from "@taroify/core"
import { Image } from "@tarojs/components"
import * as React from "react"
import Block from "../../../components/block"
import Page from "../../../components/page"
import "./index.scss"

export default function SignatureDemo() {
  const [image, setImage] = React.useState("")
  return (
    <Page title="Signature 签名" className="signature-demo">
      <Block title="基础用法">
        <Signature
          showToolbar
          onSubmit={(result) => setImage(result.image)}
          onClear={() => setImage("")}
        />
        {image && <Image src={image} mode="widthFix" />}
      </Block>
      <Block title="自定义颜色">
        <Signature penColor="#ff0000" />
      </Block>
      <Block title="自定义线宽">
        <Signature lineWidth={6} />
      </Block>
      <Block title="自定义背景颜色">
        <Signature backgroundColor="#eee" showToolbar />
      </Block>
    </Page>
  )
}
