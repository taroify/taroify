<div align="center">
<p align="center">
  <img alt="logo" src="https://img.yzcdn.cn/vant/logo.png" width="120" style="margin-bottom: 10px;">
</p>
  <p>
    <strong>轻量、可靠、面向多端的 Taro React UI 组件库</strong>
  </p>

  <p>
    基于 Vant 设计语言，为小程序与 H5 提供一致、类型安全且高度可定制的开发体验。
  </p>

  <p>
    <a href="https://www.npmjs.com/package/@taroify/core">
      <img src="https://img.shields.io/npm/v/@taroify/core?style=flat-square&color=2f80ed" alt="npm version" />
    </a>
    <a href="https://www.npmjs.com/package/@taroify/core">
      <img src="https://img.shields.io/npm/dm/@taroify/core?style=flat-square&color=67d5b5" alt="npm downloads" />
    </a>
    <a href="https://github.com/taroify/taroify/actions/workflows/test.yml">
      <img src="https://github.com/taroify/taroify/actions/workflows/test.yml/badge.svg" alt="CI status" />
    </a>
    <a href="https://codecov.io/gh/taroify/taroify">
      <img src="https://img.shields.io/codecov/c/github/taroify/taroify?style=flat-square&color=2f80ed" alt="coverage" />
    </a>
    <a href="./LICENSE">
      <img src="https://img.shields.io/github/license/taroify/taroify?style=flat-square&color=67d5b5" alt="license" />
    </a>
  </p>

  <p>
    <a href="https://taroify.github.io/taroify.com/"><strong>官网</strong></a>
    ·
    <a href="https://taroify.github.io/taroify.com/quickstart/"><strong>快速上手</strong></a>
    ·
    <a href="https://taroify.github.io/taroify.com/h5/index.html"><strong>在线演示</strong></a>
    ·
    <a href="https://taroify.github.io/taroify.com/cli/"><strong>CLI / MCP</strong></a>
    ·
    <a href="https://github.com/taroify/taroify/discussions"><strong>讨论区</strong></a>
  </p>
</div>

---

## Taroify 是什么

Taroify 是移动端组件库 [Vant](https://github.com/youzan/vant) 的 Taro React 版本，两者基于相同的视觉规范，提供近似一致的 API 接口，助力开发者快速搭建小程序应用。

## ✨ 特性

- 🚀 性能极佳，组件平均体积小于 1KB（min+gzip）
- 💎 70+ 个高质量组件，覆盖移动端主流场景
- 💪 使用 TypeScript 编写，提供完整的类型定义
- 💪 单元测试覆盖率超过 90%，提供稳定性保障
- 📖 提供完善的中文文档和组件示例
- 🍭 支持 React
- 🍭 支持主题定制，内置 700+ 个主题变量
- 🍭 支持按需引入和 Tree Shaking

## 浏览器支持

支持现代浏览器以及 Chrome >= 51、iOS >= 10.0。

## 安装

在现有项目中使用 Taroify 时，可以通过 `npm` 进行安装

## 快速开始

### 安装

```bash
npm install @taroify/core
```

也可以使用 Yarn 或 pnpm：

```bash
yarn add @taroify/core

pnpm add @taroify/core
```

### 使用组件

```tsx
import { Button } from "@taroify/core"
import "@taroify/core/button/style"

export default function Index() {
  return <Button color="primary">开始使用 Taroify</Button>
}
```

推荐配置自动按需引入，以获得更简洁的源码和更小的构建产物。完整配置请查看
[快速上手](https://taroify.github.io/taroify.com/quickstart/)。

## Packages

Taroify 采用 Monorepo 组织，各能力可以独立安装和组合：

| Package                                                                | 说明                                 |
| :--------------------------------------------------------------------- | :----------------------------------- |
| [`@taroify/core`](https://www.npmjs.com/package/@taroify/core)         | 核心 UI 组件与主题系统               |
| [`@taroify/icons`](https://www.npmjs.com/package/@taroify/icons)       | Taro React 图标组件                  |
| [`@taroify/hooks`](https://www.npmjs.com/package/@taroify/hooks)       | 面向组件与业务场景的 React Hooks     |
| [`@taroify/commerce`](https://www.npmjs.com/package/@taroify/commerce) | 电商场景扩展组件                     |
| [`@taroify/cli`](https://www.npmjs.com/package/@taroify/cli)           | 离线组件知识 CLI、MCP 与 Agent Skill |
| [`@taroify/mcp`](https://www.npmjs.com/package/@taroify/mcp)           | 现有独立 MCP 服务                    |

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/taroify/taroify.git
cd taroify

# 安装根目录、工作区和官网依赖
pnpm run install:node_modules

# 启动 H5 组件示例与文档站点
pnpm develop
```

更多仓库结构、组件开发与提交规范，请阅读
[贡献指南](https://taroify.github.io/taroify.com/contribution/)。

## 社区

如果你发现问题、希望增加组件，或对 API 设计有建议，欢迎通过以下方式参与：

- [提交 Issue](https://github.com/mallftaroifyoundry/taroify/issues)
- [发起 Pull Request](https://github.com/taroify/taroify/pulls)
- [参与 Discussions](https://github.com/taroify/taroify/discussions)
- [查看更新日志](https://taroify.github.io/taroify.com/changelog/)

<details>
  <summary><strong>加入微信交流群</strong></summary>

  <br />

  <img src="./wechat-qrcode.jpg" alt="Taroify 微信交流群" width="240" />

  <p>添加好友时请备注「taroify」，通过后邀请进群。</p>
</details>

## 贡献者

感谢每一位为 Taroify 提交代码、文档、设计、Issue 与建议的贡献者。

<a href="https://github.com/taroify/taroify/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=taroify/taroify" alt="contributors"/>
</a>

部分图形设计来自 [@BiscuitCoder](https://uyyu.xyz/)。

## 生态与致谢

Taroify 的设计规范与大量组件经验来自 Vant。感谢
[Vant 团队](https://github.com/youzan/vant) 多年来对移动端组件生态的持续投入，也感谢
[JetBrains](https://www.jetbrains.com/) 为开源项目提供开发工具支持。

<details>
  <summary><strong>Vant 官方生态</strong></summary>

  <br />

| 项目                                                                                        | 描述                     |
| :------------------------------------------------------------------------------------------ | :----------------------- |
| [Vant](https://github.com/youzan/vant)                                                      | Vant Vue 版              |
| [Vant Weapp](https://github.com/youzan/vant-weapp)                                          | Vant 微信小程序版        |
| [Vant Demo](https://github.com/youzan/vant-demo)                                            | Vant 官方示例合集        |
| [Vant CLI](https://github.com/youzan/vant/tree/dev/packages/vant-cli)                       | 开箱即用的组件库搭建工具 |
| [Vant Icons](https://github.com/youzan/vant/tree/dev/packages/vant-icons)                   | Vant 图标库              |
| [Vant Touch Emulator](https://github.com/youzan/vant/tree/dev/packages/vant-touch-emulator) | 桌面端触摸事件模拟工具   |

</details>

<details>
  <summary><strong>社区生态与友情推荐</strong></summary>

  <br />

| 项目                                                                 | 描述                                 |
| :------------------------------------------------------------------- | :----------------------------------- |
| [React Vant](https://github.com/3lang3/react-vant)                   | 参照 Vant 打造的 React 移动端组件库  |
| [mockm](https://github.com/wll8/mockm)                               | 面向前端开发的接口模拟工具           |
| [taro-hooks](https://github.com/innocces/taro-hooks)                 | 为 Taro 设计的 Hooks Library         |
| [tarojs-router-next](https://github.com/lblblong/tarojs-router-next) | 提供类型提示与参数能力的 Taro 路由库 |

</details>

### 支持者

感谢
[@Yorksh1re](https://github.com/Yorksh1re)、
[@akazwz](https://github.com/akazwz)、
[@Yang](https://github.com/programmer-yang)、
[@coderYarn](https://github.com/coderYarn)、
[@蔡包](https://github.com/shaolongcai)、
[@王昆](https://github.com/lifeneedspassion)
以及所有支持 Taroify 的开发者。

## License

[MIT](./LICENSE) © Taroify Contributors
