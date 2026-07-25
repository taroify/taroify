# 更新日志

### 介绍

Taroify 遵循 [Semver](https://semver.org/lang/zh-CN/) 语义化版本规范。

**发布节奏**

- 修订号：每周发布，包含新特性和问题修复。
- 次版本号：每隔一至二个月发布，包含新特性和较大的功能更新，向下兼容。
- 主版本号：发布时间不定，包含不兼容更新。

<!-- 新版本在文档构建时从 GitHub Releases 自动追加。 -->

## 更新内容

### v1.0.1

`2026-07-25`

#### What's Changed
##### New Features 🎉
* feat(button): 完善按钮自定义、加载和无障碍能力 by [@Pilotager](https://github.com/Pilotager) in [#1032](https://github.com/taroify/taroify/pull/1032)
* feat(site): 自动同步 GitHub Release 变更日志 by [@Pilotager](https://github.com/Pilotager) in [#1028](https://github.com/taroify/taroify/pull/1028)
* feat(cell): 升级单元格组件 by [@Pilotager](https://github.com/Pilotager) in [#1036](https://github.com/taroify/taroify/pull/1036)
* feat: 新增 Taroify CLI 与 MCP 支持 by [@Pilotager](https://github.com/Pilotager) in [#1043](https://github.com/taroify/taroify/pull/1043)
* feat: 🎸 Release 1.0.1 by [@Pilotager](https://github.com/Pilotager) in [#1046](https://github.com/taroify/taroify/pull/1046)
##### Bug Fixes 🐞
* fix: 🐛 Radio 和 Checkbox 的背景色和边框区分度不够明显 by [@Pilotager](https://github.com/Pilotager) in [#1025](https://github.com/taroify/taroify/pull/1025)
##### Document 📖
* docs(site): 完善文档展示与版本标记 by [@Pilotager](https://github.com/Pilotager) in [#1023](https://github.com/taroify/taroify/pull/1023)
##### Other Changes
* test(core): 补全组件测试 by [@Pilotager](https://github.com/Pilotager) in [#1022](https://github.com/taroify/taroify/pull/1022)
* docs: ✏️ 更改地址 by [@Pilotager](https://github.com/Pilotager) in [#1026](https://github.com/taroify/taroify/pull/1026)
* chore(deps): update jamesives/github-pages-deploy-action action to v4.8.0 by [@renovate[bot]](https://github.com/apps/renovate) in [#1038](https://github.com/taroify/taroify/pull/1038)
* chore(deps): update actions/checkout action to v7 by [@renovate[bot]](https://github.com/apps/renovate) in [#1039](https://github.com/taroify/taroify/pull/1039)
* chore(deps): update actions/setup-node action to v7 by [@renovate[bot]](https://github.com/apps/renovate) in [#1040](https://github.com/taroify/taroify/pull/1040)

#### New Contributors
* [@renovate[bot]](https://github.com/apps/renovate) made their first contribution in [#1038](https://github.com/taroify/taroify/pull/1038)

**Full Changelog**: https://github.com/taroify/taroify/compare/v1.0.0...v1.0.1

### v1.0.0

`2026-07-20`

**新功能 🎉**

- Tour
  - 新增漫游式引导组件 [83027f7](https://github.com/taroify/taroify/commit/83027f755fedbf1022597081ee6267ad85ed5931) [@Pilotager](https://github.com/Pilotager)
- ConfigProvider
  - 支持暗黑模式 [7d0fcc8](https://github.com/taroify/taroify/commit/7d0fcc8cefc56208ea166cc80d6b5c5ff03d6e50) [@Pilotager](https://github.com/Pilotager)
- Checkbox / Radio
  - 增加 `shape="button"`，支持按钮式选择场景 [#1017](https://github.com/taroify/taroify/pull/1017) [@Pilotager](https://github.com/Pilotager)
- SafeArea
  - 支持自定义安全区背景 [#1016](https://github.com/taroify/taroify/pull/1016) [@Pilotager](https://github.com/Pilotager)
- 文档站
  - 从 Gatsby 迁移至 Rspress 2，新增定制主题、搜索和组件模拟器 [#1020](https://github.com/taroify/taroify/pull/1020) [@Pilotager](https://github.com/Pilotager)

**性能优化 🚀**

- Form
  - Rule 支持布尔类型表单项 [#1015](https://github.com/taroify/taroify/pull/1015) [@felix9ia](https://github.com/felix9ia)

**Bug 修复 🐞**

- ActionBar
  - 修复图标按钮 Badge 包装后缺少 React key 的警告 [#1016](https://github.com/taroify/taroify/pull/1016) [@Pilotager](https://github.com/Pilotager)
- Input
  - 修复 `type="number"` 时未过滤非数字字符的问题 [#1016](https://github.com/taroify/taroify/pull/1016) [@Pilotager](https://github.com/Pilotager)
- DropdownMenu
  - 增加 `ellipsis` 配置，支持关闭标题省略 [#1016](https://github.com/taroify/taroify/pull/1016) [@Pilotager](https://github.com/Pilotager)
- FloatingPanel / FixedView
  - 增加 `safeAreaProps`，支持独立配置安全区背景 [#1016](https://github.com/taroify/taroify/pull/1016) [@Pilotager](https://github.com/Pilotager)
- List / PullRefresh
  - 修复固定高度下拉刷新问题 [#1016](https://github.com/taroify/taroify/pull/1016) [@Pilotager](https://github.com/Pilotager)
- Transition
  - 修复微信小程序 `nodeRef` 警告 [#1016](https://github.com/taroify/taroify/pull/1016) [@Pilotager](https://github.com/Pilotager)
- Textarea
  - 修复安卓端 `limit` 字数限制失效问题 [#1016](https://github.com/taroify/taroify/pull/1016) [@Pilotager](https://github.com/Pilotager)
- Form
  - 修复嵌套字段提交结构 [#1018](https://github.com/taroify/taroify/pull/1018) [@Pilotager](https://github.com/Pilotager)

**其他变更**

- 更新 `vite-plugin-style-import` 配置 [#1011](https://github.com/taroify/taroify/pull/1011) [@xuxucode](https://github.com/xuxucode)

**Full Changelog**: [v0.9.2...v1.0.0](https://github.com/taroify/taroify/compare/v0.9.2...v1.0.0)

### v0.9.2

`2026-03-10`

**Bug Fixes**

- Cell

  - 修复 `value` 空占位问题 [1006](https://github.com/taroify/taroify/pull/1006) [@Duo-Huang](https://github.com/Duo-Huang)

- Collapse

  - 修复在小程序上表现卡顿问题 [1002](https://github.com/taroify/taroify/pull/1002) [@Pilotager](https://github.com/Pilotager)

### v0.9.1

`2026-03-08`

**Feature**

- Calendar

  - 支持配置是否显示主标题 [972](https://github.com/taroify/taroify/pull/972) [@qiuxsgit](https://github.com/qiuxsgit)

- TabPanel

  - 将TabPane重命名为TabPanel并更新相关组件和文档 [975](https://github.com/taroify/taroify/pull/975) [@Shixuebin](https://github.com/Shixuebin)

- FloatingPanel

  - 禁用内部 `ScrollView` 的在 IOS 上的 `bounces` 橡皮筋回弹效果 [988](https://github.com/taroify/taroify/pull/988) [@felix9ia](https://github.com/felix9ia)

- Cell

  - 增加 `valueClass` 属性 [994](https://github.com/taroify/taroify/pull/994) [@xuxucode](https://github.com/xuxucode)

**Bug Fixes**

- PullRefresh

  - 在 h5 环境下包裹 List 不能正常滚动的问题 [964](https://github.com/taroify/taroify/pull/964) [@felix9ia](https://github.com/felix9ia)

- Upload

  - `Uploader` 自定义预览样式异常，增加 `customUploadButton` 属性 [966](https://github.com/taroify/taroify/pull/966) [@naFeKnehC](https://github.com/naFeKnehC)
  - 增加 `itemRender` 用来修复使用react children属性时图片重复渲染 [967](https://github.com/taroify/taroify/pull/967) [@naFeKnehC](https://github.com/naFeKnehC)

- Cell

  - 修复 taroify-cell__value 为空的时候依然占位 [968](https://github.com/taroify/taroify/pull/968) [@felix9ia](https://github.com/felix9ia)

- FixedView

  - 修复切换页面高度问题 [996](https://github.com/taroify/taroify/pull/996) [@Pilotager](https://github.com/Pilotager)

- Toast

  - 修复多个 `Toast` 叠加问题 [998](https://github.com/taroify/taroify/pull/998) [@Duo-Huang](https://github.com/Duo-Huang)

- Icon

  - 修复 `color` 属性不生效问题 [999](https://github.com/taroify/taroify/pull/999) [@Pilotager](https://github.com/Pilotager)

- Radio

  - 修复 `1px` 边框问题 [1000](https://github.com/taroify/taroify/pull/1000) [@Pilotager](https://github.com/Pilotager)

**Other**

- 修正 `List` 搭配 `PullRefresh` 的使用示例 [968](https://github.com/taroify/taroify/pull/968) [@felix9ia](https://github.com/felix9ia)
- 更新 `Progress` 示例 [969](https://github.com/taroify/taroify/pull/969) [@lvqq](https://github.com/lvqq)
- 修复 `CI` 环境报错 [970](https://github.com/taroify/taroify/pull/970) [@lvqq](https://github.com/lvqq)
- 更新 `Dialog` 样式文档 [973](https://github.com/taroify/taroify/pull/973) [@lvqq](https://github.com/lvqq)
- 更新 `Cell` 测试快照 [981](https://github.com/taroify/taroify/pull/981) [@Pilotager](https://github.com/Pilotager)
- 更新 `Vite` 按需加载示例 [996](https://github.com/taroify/taroify/pull/996) [@Pilotager](https://github.com/Pilotager)
- 更新 `$hd` 注入文档 [1001](https://github.com/taroify/taroify/pull/1001) [@Pilotager](https://github.com/Pilotager)

### v0.9.0

`2025-06-15`

**Other**

- sass 里使用 @use 和 @forward 替换 @import [961](https://github.com/taroify/taroify/pull/961) [@hbztd](https://github.com/hbztd)
- 文档添加可以使用编译后的css相关说明 [961](https://github.com/taroify/taroify/pull/961) [@hbztd](https://github.com/hbztd)
- Field 文档更新 [960](https://github.com/taroify/taroify/pull/960) [@Zhengxing-Gu](https://github.com/Zhengxing-Gu)

### v0.8.1

`2025-05-25`

**Feature**

- FloatingPanel

  - 添加手动设置高度功能 [943](https://github.com/taroify/taroify/pull/944) [@HyaCiovo](https://github.com/HyaCiovo)

**Bug Fixes**

- Popup

  - Popup 组件初次挂载时会执行 onClose 事件 [943](https://github.com/taroify/taroify/pull/943) [@HyaCiovo](https://github.com/HyaCiovo)

- Transition

  - 修复 Transition 组件的 findDOMNode API报错问题 [949](https://github.com/taroify/taroify/pull/949) [@HyaCiovo](https://github.com/HyaCiovo)

- Checkbox

  - 在背景中使用正确的变量 [951](https://github.com/taroify/taroify/pull/951) [@lvqq](https://github.com/lvqq)

- Dialog

  - 未传入 title 时仍然渲染 header 的问题 [954](https://github.com/taroify/taroify/pull/954) [@twomoonbird](https://github.com/twomoonbird)

  - 支持设置 message 的 font-weight [955](https://github.com/taroify/taroify/pull/955) [@twomoonbird](https://github.com/twomoonbird)

### v0.8.0

`2025-04-20`

**Feature**

- Skeleton

  - 重构 `Skeleton`，放弃旧版本 `Skeleton` 使用方式 [925](https://github.com/taroify/taroify/pull/925) [@Pilotager](https://github.com/Pilotager)

- Cell

  - 添加 `titleStyle`、`titleClass`、`valueClass`、`briefClass` 属性 [930](https://github.com/taroify/taroify/pull/930) [@Pilotager](https://github.com/Pilotager)

**Other**

- 文档更新 `MCP` 使用方式 [939](https://github.com/taroify/taroify/pull/939) [@Pilotager](https://github.com/Pilotager)

### v0.7.0

`2025-04-06`

**Feature**

- Divider

  - 添加 `type` 属性使分割线垂直展示 [909](https://github.com/taroify/taroify/pull/909) [@Pilotager](https://github.com/Pilotager)

- TextEllipsis

  - 增加 `toggle` 方法 [915](https://github.com/taroify/taroify/pull/915) [@Pilotager](https://github.com/Pilotager)

- Toast

  - 增加 `Toast.allowMultiple()` 方法 [921](https://github.com/taroify/taroify/pull/921) [@Pilotager](https://github.com/Pilotager)

- Dialog

  - 实现多实例 [922](https://github.com/taroify/taroify/pull/922) [@Pilotager](https://github.com/Pilotager)

**Bug Fixes**

- ActionBar

  - 优化文字换行 [899](https://github.com/taroify/taroify/pull/899) [@Pilotager](https://github.com/Pilotager)

- Toast

  - 微信小程序Toast或Dialog在特定的回调里报错 [917](https://github.com/taroify/taroify/pull/917) [@Pilotager](https://github.com/Pilotager)

**Other**

- Biome 格式化 [904](https://github.com/taroify/taroify/pull/904) [@Pilotager](https://github.com/Pilotager)

### v0.6.4-alpha.0

`2025-02-23`

**Feature**

- List

  - 新增 `onScroll` 事件 [892](https://github.com/taroify/taroify/pull/892) [@hbztd](https://github.com/hbztd)

- Tabs

  - 新增 `shrink` 属性 [892](https://github.com/taroify/taroify/pull/892) [@hbztd](https://github.com/hbztd)

- Field

  - Input、Textarea 设置 `min-height` 值为 `inherit` [892](https://github.com/taroify/taroify/pull/892) [@hbztd](https://github.com/hbztd)

- Switch

  - 开关组件按有赞美化 [894](https://github.com/taroify/taroify/pull/894) [@wenqiyun](https://github.com/wenqiyun)

**Bug Fixes**

- SafeArea

  - 替换成 getWindowInfo 方法 [885](https://github.com/taroify/taroify/pull/885) [@Pilotager](https://github.com/Pilotager)

- FixedView

  - 修复设置 placheholder 后 render 过程中 children 会重建 [892](https://github.com/taroify/taroify/pull/892) [@hbztd](https://github.com/hbztd)

- Navbar

  - 修复设置 placheholder 后 render 过程中 children 会重建 [892](https://github.com/taroify/taroify/pull/892) [@hbztd](https://github.com/hbztd)

- Dialog

  - 消除节点新增删除带来的副作用 [896](https://github.com/taroify/taroify/pull/896) [@wenqiyun](https://github.com/wenqiyun)

### v0.6.3-alpha.0

`2025-01-05`

**Bug Fixes**

- Picker

  - 修复 `Picker` 中 `columns` 更新未更新选中值 [875](https://github.com/taroify/taroify/pull/875) [@Pilotager](https://github.com/Pilotager)

**Other**

- 添加 Biome [872](https://github.com/taroify/taroify/pull/872) [@ianzone](https://github.com/ianzone)
- 文档新增新特性版本号 [870](https://github.com/taroify/taroify/pull/870) [@CodeMak1r-zy](https://github.com/CodeMak1r-zy)

### v0.6.2-alpha.0

`2024-12-25`

**Bug Fixes**

- Toast

  - 修复 `close` 方法不生效问题 [865](https://github.com/taroify/taroify/pull/865) [@Pilotager](https://github.com/Pilotager)

- Notify

  - 修复 `close` 方法不生效问题 [865](https://github.com/taroify/taroify/pull/865) [@Pilotager](https://github.com/Pilotager)

**Other**

- 添加属性新特性版本号 [867](https://github.com/taroify/taroify/pull/867) [@Pilotager](https://github.com/Pilotager)

### v0.6.1-alpha.0

`2024-12-18`

**Other**

- lodash 支持 tree shaking [861](https://github.com/taroify/taroify/pull/861) [@hbztd](https://github.com/hbztd)

### v0.6.0-alpha.0

`2024-12-08`

**Feature**

- Toast

  - 支持直接函数调用 [852](https://github.com/taroify/taroify/pull/852) [@hbztd](https://github.com/hbztd)

- Notify

  - 支持直接函数调用，添加 `color` `background` 属性 [852](https://github.com/taroify/taroify/pull/852) [@hbztd](https://github.com/hbztd)

- Dialog

  - 支持直接函数调用，添加 `title` `message` `messageAlign` `theme` `confirm` `cancel` `onBeforeClose` 属性 [852](https://github.com/taroify/taroify/pull/852) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- ActionSheet

  - 为 `ActionSheet` 组件添加默认的安全区域 [840](https://github.com/taroify/taroify/pull/840) [@sweet7788](https://github.com/sweet7788)

- List

  - `scrollParentRect` 判空 [843](https://github.com/taroify/taroify/pull/843) [@Pilotager](https://github.com/Pilotager)

- Pick

  - 修复 picker 组件在快速上滑或者下滑时，执行惯性动画期间，再次滚动 picker-column 后出现的位置卡顿问题 [844](https://github.com/taroify/taroify/pull/844) [@kunkuntang](https://github.com/kunkuntang)

- Popup

  - 修复手动关闭未触发 `onClose` 事件 [852](https://github.com/taroify/taroify/pull/852) [@hbztd](https://github.com/hbztd)

- TextArea

  - 修复 `getStringLength` 在输入 emoji 时无法正确统计字符长度 [853](https://github.com/taroify/taroify/pull/853) [@CodeMak1r-zy](https://github.com/CodeMak1r-zy)

- Form

  - 修复 `validateFirst` [857](https://github.com/taroify/taroify/pull/857) [@linxianxi](https://github.com/linxianxi)

**Other**

- 完善 DateTimePicker 文档 [834](https://github.com/taroify/taroify/pull/834) [@sweet7788](https://github.com/sweet7788)
- 完善 FormItem 文档 [837](https://github.com/taroify/taroify/pull/837) [@Niubility-SunLight](https://github.com/Niubility-SunLight)
- 完善 Form 文档 [847](https://github.com/taroify/taroify/pull/847) [@lvqq](https://github.com/lvqq)
- 完善 Calendar 文档 [850](https://github.com/taroify/taroify/pull/853) [@CodeMak1r-zy](https://github.com/CodeMak1r-zy)
- lodash 支持 tree shaking [851](https://github.com/taroify/taroify/pull/851) [@hbztd](https://github.com/hbztd)

### v0.5.1-alpha.0

`2024-10-28`

**Feature**

- SafeArea

  - 新增 `nativeSafeTop` 属性，是否启用小程序顶部安全区高度 [830](https://github.com/taroify/taroify/pull/830) [@Pilotager](https://github.com/Pilotager)

**Bug Fixes**

- SafeArea

  - 修复安全区底部判断问题 [830](https://github.com/taroify/taroify/pull/830) [@Pilotager](https://github.com/Pilotager)

### v0.5.0-alpha.0

`2024-10-27`

**Feature**

- Cascader

  - 新增 `ellipsis` 属性 [817](https://github.com/taroify/taroify/pull/817) [@Pilotager](https://github.com/Pilotager)

- Form

  - `FormItem` 添加 `validateFirst` 属性， 用于只返回第一个失败校验 [818](https://github.com/taroify/taroify/pull/818) [@Niubility-SunLight](https://github.com/Niubility-SunLight)

**Bug Fixes**

- Form

  - 修复设置 `controlAlign` right 后，feedback 没有向右对齐 [820](https://github.com/taroify/taroify/pull/820) [@Niubility-SunLight](https://github.com/Niubility-SunLight)

- SafeArea

  - 优化小程序环境顶部安全区距离 [826](https://github.com/taroify/taroify/pull/826) [@CodeMak1r-zy](https://github.com/CodeMak1r-zy)

- IndexList

  - 修复异步传入数据时 `anchorRects` 报错问题 [828](https://github.com/taroify/taroify/pull/828) [@Pilotager](https://github.com/Pilotager)

**Other**

- `SafeArea` 新增单测[826](https://github.com/taroify/taroify/pull/826) [@CodeMak1r-zy](https://github.com/CodeMak1r-zy)

### v0.4.2-alpha.0

`2024-10-13`

**Bug Fixes**

- Cascader

  - 修复不能上下滑动问题 [813](https://github.com/taroify/taroify/pull/813) [@Pilotager](https://github.com/Pilotager)

- Uploader

  - 修复图片加载中或者未加载出来样式问题 [814](https://github.com/taroify/taroify/pull/814) [@Pilotager](https://github.com/Pilotager)

### v0.4.1-alpha.0

`2024-09-22`

**Bug Fixes**

- Icon

  - 修复 icon css 后加载导致 `Rate` 没有颜色 [804](https://github.com/taroify/taroify/pull/804) [@hbztd](https://github.com/hbztd)

- Tabbar

  - 修复 `Tabbar.TabItem` icon className 丢失 [804](https://github.com/taroify/taroify/pull/804) [@hbztd](https://github.com/hbztd)

- Uploader

  - 修复 `Uploader` 自定义样式，无法触发 `onUpload` [804](https://github.com/taroify/taroify/pull/804) [@hbztd](https://github.com/hbztd)

- Form

  - 修复 Form rules 某些情况下，trigger 过滤错误 [804](https://github.com/taroify/taroify/pull/804) [@hbztd](https://github.com/hbztd)
  - 修复 Form Input 输入后立即调用 reset，未清空错误显示 [804](https://github.com/taroify/taroify/pull/804) [@hbztd](https://github.com/hbztd)

**Other**

- 完善 `Cell` 单测 [805](https://github.com/taroify/taroify/pull/805) [@Pilotager](https://github.com/Pilotager)

### v0.4.0-alpha.0

`2024-08-18`

**Feature**

- Search

  - 透传 `enableNative` 属性 [790](https://github.com/taroify/taroify/pull/790) [@Pilotager](https://github.com/Pilotager)

- Toast

  - `duration` 为 `0` 时，提示不消失 [793](https://github.com/taroify/taroify/pull/793) [@Pilotager](https://github.com/Pilotager)

- Tag

  - 添加边框颜色 `css` 变量 [801](https://github.com/taroify/taroify/pull/801) [@hbztd](https://github.com/hbztd)

- Circle

  - 重构，WEB 和小程序都使用 `Canvas 2D` 接口实现 [801](https://github.com/taroify/taroify/pull/801) [@hbztd](https://github.com/hbztd)
  - 添加 `startPosition` 属性 [801](https://github.com/taroify/taroify/pull/801) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- NumberKeyboard

  - 优化按钮字体大小 [788](https://github.com/taroify/taroify/pull/788) [@Pilotager](https://github.com/Pilotager)

- Cascader

  - 修复 `Cascader` 第一次打开时动画卡顿 [801](https://github.com/taroify/taroify/pull/801) [@hbztd](https://github.com/hbztd)

- Popup

  - 修复 `duration` 属性不起作用 [801](https://github.com/taroify/taroify/pull/801) [@hbztd](https://github.com/hbztd)

- Backdrop

  - 修复 `duration` 属性不起作用 [801](https://github.com/taroify/taroify/pull/801) [@hbztd](https://github.com/hbztd)

**Other**

- 完善 `FixedNav` 文档 [789](https://github.com/taroify/taroify/pull/789) [@Pilotager](https://github.com/Pilotager)
- `Progress` 文档更新 [799](https://github.com/taroify/taroify/pull/799) [@Pilotager](https://github.com/Pilotager)
- 内置样式添加触摸反馈 [801](https://github.com/taroify/taroify/pull/801) [@hbztd](https://github.com/hbztd)

### v0.3.2-alpha.0

`2024-08-04`

**Feature**

- Image

  - 添加 `width` `height` 属性 [784](https://github.com/taroify/taroify/pull/784) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- Empty

  - 修复 `Empty` 组件图片居中问题 [779](https://github.com/taroify/taroify/pull/779) [@CodeMak1r-zy](https://github.com/CodeMak1r-zy)

- FloatingBubble

  - 修复 `sass` 变量未进行适配 [782](https://github.com/taroify/taroify/pull/782) [@Pilotager](https://github.com/Pilotager)

- Image

  - 修复加载中未显示 `placeholder` [784](https://github.com/taroify/taroify/pull/784) [@hbztd](https://github.com/hbztd)

### v0.3.1-alpha.0

`2024-07-09`

**Feature**

- Form

  - Form 添加 `disabled` 属性，实例添加 `submit` 方法 [767](https://github.com/taroify/taroify/pull/767) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- BackTop

  - Scss 添加 `$hd` 变量配置 [762](https://github.com/taroify/taroify/pull/762) [@Pilotager](https://github.com/Pilotager)

- FixedNav

  - Scss 添加 `$hd` 变量配置 [768](https://github.com/taroify/taroify/pull/768) [@Pilotager](https://github.com/Pilotager)

- Form

  - 修复 `Checkbox.Group` 设置 `disabled` 无效 [767](https://github.com/taroify/taroify/pull/767) [@hbztd](https://github.com/hbztd)

- Avatar

  - 修复 `Avatar` 里为图片时，样式不对 [777](https://github.com/taroify/taroify/pull/767) [@hbztd](https://github.com/hbztd)
  - `Image` 默认继承父元素宽高 [777](https://github.com/taroify/taroify/pull/767) [@hbztd](https://github.com/hbztd)

**Other**

- 修复 `taro` 预编译 `@taroify/core` `@taroify/icons` 失败 [763](https://github.com/taroify/taroify/pull/763) [@hbztd](https://github.com/hbztd)

- package.json 添加 `repository` 和 `bugs` [764](https://github.com/taroify/taroify/pull/764) [@Pilotager](https://github.com/Pilotager)

### v0.3.0-alpha.0

`2024-06-23`

**Feature**

- Flex

  - 为 `flex align` 添加了初始属性 [753](https://github.com/taroify/taroify/pull/753) [@sehmbimanvir](https://github.com/sehmbimanvir)

- Badge

  - 重构 `Badge` 组件，`Grid` `Sidebar` `Tabbar` `Tabs` `TreeSelect` 组件徽标相关代码调整 [754](https://github.com/taroify/taroify/pull/754) [@hbztd](https://github.com/hbztd)

- Icon

  - 支持自定义图标 [754](https://github.com/taroify/taroify/pull/754) [@hbztd](https://github.com/hbztd)

- ActionSheet

  - 添加 actions，description, cancelText 属性 [760](https://github.com/taroify/taroify/pull/760) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- CountDown

  - 修复 Countdown 组件在卸载时仍然继续执行倒计时并触发 onComplete [760](https://github.com/taroify/taroify/pull/760) [@hbztd](https://github.com/hbztd)

- ActionSheet

  - 修复 loading 和 disabled 属性不起作用 [760](https://github.com/taroify/taroify/pull/760) [@hbztd](https://github.com/hbztd)

**Other**

- 修复 `@taroify/core` `@taroify/icons`，taro 预编译失败 [755](https://github.com/taroify/taroify/pull/755) [@hbztd](https://github.com/hbztd)

- 删除 babel 转换和 sourcemap 文件[755](https://github.com/taroify/taroify/pull/755) [@hbztd](https://github.com/hbztd)

### v0.2.3-alpha.0

`2024-06-02`

**Bug Fixes**

- Cascader

  - 修复级联选择 `options` 无法设置为空 [746](https://github.com/taroify/taroify/pull/746) [@hbztd](https://github.com/hbztd)

- Calendar

  - 修复日历 `subtitle` 在手动设置 `value` 时，可能出现显示错误 [747](https://github.com/taroify/taroify/pull/747) [@hbztd](https://github.com/hbztd)

**Feature**

- DropdownMenu

  - 背景板添加类型 [748](https://github.com/taroify/taroify/pull/748) [@Pilotager](https://github.com/Pilotager)

**Other**

- 文档代码示例添加复制按钮 [746](https://github.com/taroify/taroify/pull/746) [@hbztd](https://github.com/hbztd)

- 更新文档内示例以及属性 [747](https://github.com/taroify/taroify/pull/747) [@hbztd](https://github.com/hbztd)

### v0.2.2-alpha.1

`2024-05-30`

**Bug Fixes**

- Tabbar

  - 修复 `Tabbar icon` 传递 `ReactNode` 丢失原有 `className` [736](https://github.com/taroify/taroify/pull/736) [@wenqiyun](https://github.com/wenqiyun)

- Signature

  - 修复 `getWindowInfo` 在抖音小程序报错问题 [738](https://github.com/taroify/taroify/pull/736) [@Pilotager](https://github.com/Pilotager)

- PullRefresh

  - 修复小程序环境内 `throttle` 报 `now of undefined` [743](https://github.com/taroify/taroify/pull/743) [@Pilotager](https://github.com/Pilotager)

### v0.2.2-alpha.0

`2024-05-19`

**Bug Fixes**

- Input

  - 修复 `readonly` 属性 [731](https://github.com/taroify/taroify/pull/731) [@SexySix](https://github.com/SexySix)

- Form

  - 修复 `Form.Label`设置 `className` 后，组件本身 `className` 被覆盖 [733](https://github.com/taroify/taroify/pull/733) [@hbztd](https://github.com/hbztd)

  - 修复 `Form.Item`、`isLink` 属性不起作用 [733](https://github.com/taroify/taroify/pull/733) [@hbztd](https://github.com/hbztd)

- BackTop

  - 组件默认高亮颜色应该从 `--primary-color` 取，而不是 `--blue` [734](https://github.com/taroify/taroify/pull/734) [@hbztd](https://github.com/hbztd)

- Badge

  - 组件默认高亮颜色应该从 `--primary-color` 取，而不是 `--blue` [734](https://github.com/taroify/taroify/pull/734) [@hbztd](https://github.com/hbztd)

- NavBar

  - 组件默认高亮颜色应该从 `--primary-color` 取，而不是 `--blue` [734](https://github.com/taroify/taroify/pull/734) [@hbztd](https://github.com/hbztd)

- Pagination

  - 组件默认高亮颜色应该从 `--primary-color` 取，而不是 `--blue` [734](https://github.com/taroify/taroify/pull/734) [@hbztd](https://github.com/hbztd)

- Slider

  - 组件默认高亮颜色应该从 `--primary-color` 取，而不是 `--blue` [734](https://github.com/taroify/taroify/pull/734) [@hbztd](https://github.com/hbztd)

- Swiper

  - 组件默认高亮颜色应该从 `--primary-color` 取，而不是 `--blue` [734](https://github.com/taroify/taroify/pull/734) [@hbztd](https://github.com/hbztd)

- Tabbar

  - 组件默认高亮颜色应该从 `--primary-color` 取，而不是 `--blue` [734](https://github.com/taroify/taroify/pull/734) [@hbztd](https://github.com/hbztd)

### v0.2.1-alpha.0

`2024-05-10`

**Feature**

- IndexList

  - 添加 `showSidebar` 和 `onChange` 属性 [723](https://github.com/taroify/taroify/pull/723) [@Pilotager](https://github.com/Pilotager)

  - 添加手动调用 `scrollTo` 方法 [724](https://github.com/taroify/taroify/pull/724) [@Pilotager](https://github.com/Pilotager)

### v0.2.0-alpha.0

`2024-05-09`

**Feature**

- IndexList

  - 添加底部弹窗内使用方式 [721](https://github.com/taroify/taroify/pull/721) [@Pilotager](https://github.com/Pilotager)

**Other**

- Taro 相关依赖项改为 >=3 [721](https://github.com/taroify/taroify/pull/721) [@Pilotager](https://github.com/Pilotager)

### v0.1.7-alpha.0

`2024-04-28`

**Feature**

- Dropdown

  - DropdownMenuItem: 支持 `lock` 和 `options` 属性 [718](https://github.com/taroify/taroify/pull/718) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- Flex

  - 修复 `flex` 在 `wrap` 情况下，如果设置了 `gutter`, 换行后首个元素错位 [712](https://github.com/taroify/taroify/pull/712) [@Pilotager](https://github.com/Pilotager)

- DatetimePicker

  - 修复 `DatetimePicker` 可选择月和日的情况下，由于代码中先设置月份，会导致所有最后一天小于 `minDate` 的日的月份被设置为下一个月 [714](https://github.com/taroify/taroify/pull/714) [@SexySix](https://github.com/SexySix)

- Swiper

  - 修复 `SwiperItem` 初始化后再渲染 [717](https://github.com/taroify/taroify/pull/717) [@hbztd](https://github.com/hbztd)
  - 修复在微信上 `TabsHeader` 滚动时，不应显示滚动条 [717](https://github.com/taroify/taroify/pull/717) [@hbztd](https://github.com/hbztd)

- Dropdown

  - 修复 `Search` 有两个 X [718](https://github.com/taroify/taroify/pull/718) [@hbztd](https://github.com/hbztd)

### v0.1.6-alpha.0

`2024-03-24`

**Feature**

- Form

  - Form.Item 添加 `dependencies` `shouldUpdate` `noStyle` 属性 [705](https://github.com/taroify/taroify/pull/705) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- Grid

  - 修复 `children` 为 null 引发的错误问题 [703](https://github.com/taroify/taroify/pull/703) [@Hector-Chong](https://github.com/Hector-Chong)

- Form

  - 修复 Form.Item 点击报错(taro>=3.6.23 事件绑定 undefined 触发时报错) [705](https://github.com/taroify/taroify/pull/705) [@hbztd](https://github.com/hbztd)
  - 修复 Field 未提供 FormItemInstance [705](https://github.com/taroify/taroify/pull/705) [@hbztd](https://github.com/hbztd)

- Style

  - 修复 `Radio` 和 `Checkbox` 默认字体大小比其他大，`Input` 和 `Textarea` 字体不一致问题 [706](https://github.com/taroify/taroify/pull/706) [@hbztd](https://github.com/hbztd)
  - 修复 `Form` 右对齐时，\*位置不对问题 [706](https://github.com/taroify/taroify/pull/706) [@hbztd](https://github.com/hbztd)

- FloatingPanel

  - 修复 `FloatingPanel` 无法向下滑动关闭问题 [709](https://github.com/taroify/taroify/pull/709) [@Pilotager](https://github.com/Pilotager)

**Other**

- 升级 Taro 版本为 3.6.23 [700](https://github.com/taroify/taroify/pull/700) [@Pilotager](https://github.com/Pilotager)

- Button 测试率覆盖 100% [701](https://github.com/taroify/taroify/pull/701) [@sehmbimanvir](https://github.com/sehmbimanvir)

- 修复 Form 组件文档内连接链接多了前缀 [705](https://github.com/taroify/taroify/pull/705) [@hbztd](https://github.com/hbztd)

### v0.1.5-alpha.0

`2024-02-19`

**Bug Fixes**

- Loading

  - 修复 `addUnitPx` 判断条件错误 [693](https://github.com/taroify/taroify/pull/693) [@sehmbimanvir](https://github.com/sehmbimanvir)

**Feature**

- Popup

  - `placement` 添加 `center` 选项 [690](https://github.com/taroify/taroify/pull/690) [@Hector-Chong](https://github.com/Hector-Chong)

**Other**

- 修复 `jest` 配置错误导致 `yarn test` 报错问题 [691](https://github.com/taroify/taroify/pull/691) [@sehmbimanvir](https://github.com/sehmbimanvir)

- 完善 `NavBar` 测试用例 [692](https://github.com/taroify/taroify/pull/692) [@sehmbimanvir](https://github.com/sehmbimanvir)

- 完善 `FixedNav` 测试用例 [694](https://github.com/taroify/taroify/pull/694) [@Pilotager](https://github.com/Pilotager)

- 完善 `FloatingPanel` 测试用例 [695](https://github.com/taroify/taroify/pull/695) [@Pilotager](https://github.com/Pilotager)

**Doc**

- npm 文档更新 [698](https://github.com/taroify/taroify/pull/698) [@Pilotager](https://github.com/Pilotager)

### v0.1.4-alpha.0

`2024-02-09`

**Bug Fixes**

- Input

  - 修复 Input 组件的 `font-size` 无法被正常继承问题 [680](https://github.com/taroify/taroify/pull/680) [@Hector-Chong](https://github.com/Hector-Chong)

- Radio

  - 添加泛型 [681](https://github.com/taroify/taroify/pull/681) [@Hector-Chong](https://github.com/Hector-Chong)

- Checkbox

  - 添加泛型 [681](https://github.com/taroify/taroify/pull/681) [@Hector-Chong](https://github.com/Hector-Chong)

- AreaSelector

  - 修复值未定义时异常处理 [682](https://github.com/taroify/taroify/pull/682) [@Hector-Chong](https://github.com/Hector-Chong)

- Uploader

  - `onChange` 事件添加优化类型定义 [683](https://github.com/taroify/taroify/pull/683) [@Hector-Chong](https://github.com/Hector-Chong)

- Popup

  - 去除 console [684](https://github.com/taroify/taroify/pull/684) [@Pilotager](https://github.com/Pilotager)

- FixedNav

  - 去除 console [685](https://github.com/taroify/taroify/pull/685) [@Pilotager](https://github.com/Pilotager)

**Feature**

- Popup

  - 添加 `lock` 属性以及 H5 禁止滚动穿透 [679](https://github.com/taroify/taroify/pull/679) [@Pilotager](https://github.com/Pilotager)

### v0.1.3-alpha.1

`2024-02-04`

**Bug Fixes**

- Input

  - 修复 `Input` 在只读模式下字体颜色问题 [674](https://github.com/taroify/taroify/pull/674) [@Pilotager](https://github.com/Pilotager)

- Flex
  - 修复 `Flex` 无法渲染文本节点(导致 `Timeline` 无法渲染) [676](https://github.com/taroify/taroify/pull/676) [@hbztd](https://github.com/hbztd)

**Doc**

- 优化线上打开文档页面会闪一下 [675](https://github.com/taroify/taroify/pull/675) [@hbztd](https://github.com/hbztd)
- 优化文档内跳转 [675](https://github.com/taroify/taroify/pull/675) [@hbztd](https://github.com/hbztd)
- 链接地址修复 [675](https://github.com/taroify/taroify/pull/675) [@hbztd](https://github.com/hbztd)

### v0.1.3-alpha.0

`2024-02-02`

**Bug Fixes**

- Image

  - 修复 `Image` 组件快速加载样式问题 [668](https://github.com/taroify/taroify/pull/668) [@Pilotager](https://github.com/Pilotager)

- Flex

  - 优化 `Flex` 两边间距 [669](https://github.com/taroify/taroify/pull/669) [@Pilotager](https://github.com/Pilotager)

- Watermark
  - 修复 `Watermark` 样式引入问题 [670](https://github.com/taroify/taroify/pull/670) [@sehmbimanvir](https://github.com/sehmbimanvir)

**Feature**

- Popup
  - `Popup` 居中弹出添加圆角属性 [672](https://github.com/taroify/taroify/pull/672) [@Pilotager](https://github.com/Pilotager)

**Doc**

- Popup：添加居中弹出圆角示例
- Popup：添加自定义图标示例
- Flex: 优化示例内代码

### v0.1.2-alpha.0

`2024-01-27`

**Bug Fixes**

- AreaPicker
  - 修复 AreaPicker 选中确认报错问题 [664](https://github.com/taroify/taroify/pull/664) [@Pilotager](https://github.com/Pilotager)

**Feature**

- FixedNav

  - 添加 FixedNav 组件 [662](https://github.com/taroify/taroify/pull/662) [@Pilotager](https://github.com/Pilotager)

- FloatingPanel

  - 优化反弹动画 [661](https://github.com/taroify/taroify/pull/661) [@Pilotager](https://github.com/Pilotager)

- Watermark
  - 添加 CSS Variables 类型 [665](https://github.com/taroify/taroify/pull/665) [@Pilotager](https://github.com/Pilotager)

**Doc**

- 完善 Tab 文档，添加 `dot` `badge` 属性 [660](https://github.com/taroify/taroify/pull/660) [@Pilotager](https://github.com/Pilotager)
- 添加全文搜索功能 [666](https://github.com/taroify/taroify/pull/666) [@Pilotager](https://github.com/Pilotager)

### v0.1.1-alpha.11

`2024-01-21`

**Bug Fixes**

- Popup
  - 修复滚动穿透问题 [657](https://github.com/taroify/taroify/pull/657) [@Pilotager](https://github.com/Pilotager)

**Feature**

- Tabs

  - 添加 `dot` 和 `badge` 属性 [655](https://github.com/taroify/taroify/pull/655) [@Pilotager](https://github.com/Pilotager)

- Watermark
  - 添加 Watermark 水印 [658](https://github.com/taroify/taroify/pull/658) [@hbztd](https://github.com/hbztd)

### v0.1.1-alpha.10

`2024-01-01`

**Bug Fixes**

- Form
  - 修复 CellTitle 导入问题 [651](https://github.com/taroify/taroify/pull/651) [@Pilotager](https://github.com/Pilotager)

### v0.1.1-alpha.9

`2023-12-15`

**Feature**

- TextEllipsis
  - 添加 TextEllipsis 文字省略组件 [646](https://github.com/taroify/taroify/pull/646) [@hbztd](https://github.com/hbztd)

### v0.1.1-alpha.8

`2023-12-07`

**Bug Fixes**

- DatetimePicker
  - 修复 DatetimePicker 多了一个空白 [643](https://github.com/taroify/taroify/pull/643) [@Pilotager](https://github.com/Pilotager)

### v0.1.1-alpha.7

`2023-11-28`

**Feature**

- AreaPicker
  - 添加 `areaList` `title` `confirmText` `cancelText` `optionHeight`, 支持通过属性配置 AreaPicker [639](https://github.com/taroify/taroify/pull/639) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- AreaPicker

  - 修复 AreaPicker 多了一个空白 [639](https://github.com/taroify/taroify/pull/639) [@hbztd](https://github.com/hbztd)

- Picker
  - 修复选项文字内容超长时未省略 [639](https://github.com/taroify/taroify/pull/639) [@hbztd](https://github.com/hbztd)

### v0.1.1-alpha.6

`2023-11-14`

**Feature**

- Calendar
  - 添加 `poppable` `showPopup` `onClose` 属性，支持弹框展示日历 [636](https://github.com/taroify/taroify/pull/636) [@hbztd](https://github.com/hbztd)
  - 添加 `showConfirm` `confirmText` `confirmDisabledText`，支持自定义确认按钮文案 [636](https://github.com/taroify/taroify/pull/636) [@hbztd](https://github.com/hbztd)
  - 添加 `showSubtitle`，修改 `subtitle`，支持自定义副标题 [636](https://github.com/taroify/taroify/pull/636) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- Navbar

  - 修复 `placeholder` 属性值默认为 false [634](https://github.com/taroify/taroify/pull/634) [@Pilotager](https://github.com/Pilotager)

- Tabs

  - 修复 TabPane 内容 DOM 上不该有 `title` 属性 [635](https://github.com/taroify/taroify/pull/635) [@hbztd](https://github.com/hbztd)

- Calendar
  - 修复日历在 h5 无法滑动
  - 修复设置 defaultValue，value 没有跳转到对应位置
  - 修复底部按钮在微信小程序里颜色不对

### v0.1.1-alpha.5

`2023-11-05`

**Feature**

- Picker

  - 添加 `optionHeight` 属性，支持配置选项高度 [629](https://github.com/taroify/taroify/pull/629) [@hbztd](https://github.com/hbztd)
  - 添加 `title` `confirmText` `cancelText` `columns` `columnsFieldNames`，支持通过数据配置选项 [629](https://github.com/taroify/taroify/pull/629) [@hbztd](https://github.com/hbztd)

- Cell

  - Cell(Form.Item, Field) 添加 `isLink` `arrowDirection` 属性 [630](https://github.com/taroify/taroify/pull/630) [@hbztd](https://github.com/hbztd)

- Icon [631](https://github.com/taroify/taroify/pull/631) [@Pilotager](https://github.com/Pilotager)
  - 图标：添加一个实底的 records 图标
  - 图标：添加一个实底的 contact 图标
  - 图标：添加一个实底的 discount 图标
  - 图标：添加一个实底的 completed 图标
  - 图标：添加一个实底的 description 图标
  - 图标：添加一个实底的 cash-back-record 图标
  - 图标：添加新的 user 图标
  - 图标：添加新的 notes 图标
  - 图标：添加新的 newspaper 图标
  - 图标：添加新的 list-switch 图标
  - 图标：添加新的 list-switching 图标
  - 图标：将 records 图标重命名为 records-o
  - 图标：将 contact 图标重命名为 contact-o
  - 图标：将 discount 图标重命名为 discount-o
  - 图标：将 completed 图标重命名为 completed-o
  - 图标：将 description 图标重命名为 description-o
  - 图标：将 cash-back-record 图标重命名为 cash-back-record-o

**Bug Fixes**

- Picker
  - 修复 siblingCount 属性未生效 [629](https://github.com/taroify/taroify/pull/629) [@hbztd](https://github.com/hbztd)

### v0.1.1-alpha.4

`2023-10-27`

**Feature**

- Cascader
  - 添加 `options` `fieldNames` `loadData`，支持指定数据源，自定义 options 结构中的字段，动态加载选项 [626](https://github.com/taroify/taroify/pull/626) [@hbztd](https://github.com/hbztd)
  - `useCascader` 添加缓存，提高性能 [626](https://github.com/taroify/taroify/pull/626) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- Swiper

  - 修复动态设置 SwiperItem 时可能出现页面异常 [626](https://github.com/taroify/taroify/pull/626) [@hbztd](https://github.com/hbztd)

- Filed
  - 修复单独使用 Filed 时，form 为空报错 [627](https://github.com/taroify/taroify/pull/627) [@hbztd](https://github.com/hbztd)

### v0.1.1-alpha.3

`2023-10-26`

**Feature**

- Form

  - Form 表单支持动态增减表单项 [622](https://github.com/taroify/taroify/pull/622) [@hbztd](https://github.com/hbztd)

- NoticeBar
  - 添加 `reset` 实例方法 [#623](https://github.com/taroify/taroify/pull/623) [@hbztd](https://github.com/hbztd)
  - `NoticeBarIcon` 和 `NoticeBarAction` onClick 阻止冒泡触发 NoticeBar Click 事件 [#623](https://github.com/taroify/taroify/pull/623) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- NoticeBar
  - 修复 `onReplay` 未触发 [#623](https://github.com/taroify/taroify/pull/623) [@hbztd](https://github.com/hbztd)

### v0.1.1-alpha.2

`2023-10-13`

**New Component**

- 新增 Signature 组件 [#618](https://github.com/taroify/taroify/pull/618) [@hbztd](https://github.com/hbztd)

**Feature**

- Space
  - 支持自定间距，添加 `fill` 属性 [#619](https://github.com/taroify/taroify/pull/619) [@hbztd](https://github.com/hbztd)
- List
  - 重构 List 实现。删除 `scrollTop`、`onLoading`，添加 `fixedHeight`、`immediateCheck`、`disabled`、`check` [#620](https://github.com/taroify/taroify/pull/620) [@hbztd](https://github.com/hbztd)

### v0.1.1-alpha.1

`2023-09-29`

**New Component**

- 新增 FloatingBubble 组件 [#610](https://github.com/taroify/taroify/pull/610) [@Pilotager](https://github.com/Pilotager)

**Feature**

- DropdownMenu
  - 新增 `onOpen` `onClose` `onOpened` `onClosed` 事件 [#612](https://github.com/taroify/taroify/pull/612) [@hbztd](https://github.com/hbztd)

**Bug Fixes**

- Input

  - 修复设置 readonly 属性的，原生 input dom 上是 disabled，会导致无法聚焦触发 onClick，电脑上 h5 调试打不开 Picker [#613](https://github.com/taroify/taroify/pull/613) [@hbztd](https://github.com/hbztd)

- Image

  - 修复 img onload 不一定触发问题 [#614](https://github.com/taroify/taroify/pull/614) [@hbztd](https://github.com/hbztd)

- Tabs
  - Tabs 设置 lazyRender 属性后，会加载当前，前后选项卡，和预期不符(延迟渲染未展示的选项卡) [#615](https://github.com/taroify/taroify/pull/615) [@hbztd](https://github.com/hbztd)

### v0.1.1-alpha.0

`2023-09-17`

**Feature**

- Button
  - 添加 `iconPosition` 属性 [#606](https://github.com/taroify/taroify/pull/606) [@Pilotager](https://github.com/Pilotager)
- Taro 版本升级为 v3.6.16 [#607](https://github.com/taroify/taroify/pull/607) [@Pilotager](https://github.com/Pilotager)

### v0.1.0-alpha.12

`2023-09-04`

**Bug Fixes**

- Button
  - 消除 `key` 警告 [#596](https://github.com/taroify/taroify/pull/596) [@rtmax0](https://github.com/rtmax0)
- Avatar
  - 修复群组使用 `size` 属性时最后一个元素尺寸问题 [#600](https://github.com/taroify/taroify/pull/600) [@Pilotager](https://github.com/Pilotager)
- Picker
  - 修复滚动时卡顿问题 [#601](https://github.com/taroify/taroify/pull/601) [@Pilotager](https://github.com/Pilotager)

### v0.1.0-alpha.11

`2023-08-21`

**Bug Fixes**

- IndexList
  - 修复微信小程序端点击事件报错 [#592](https://github.com/taroify/taroify/pull/592) [@450669540](https://github.com/450669540)

### v0.1.0-alpha.10

`2023-08-11`

**Feature**

- Stepper
  - 新增 `cursor` 属性 [#590](https://github.com/taroify/taroify/pull/590) [@Pilotager](https://github.com/Pilotager)

### v0.1.0-alpha.9

`2023-07-27`

**Feature**

- Pagination
  - 新增 `prevText`、`nextText`、`mode` 属性 [#588](https://github.com/taroify/taroify/pull/588) [@Pilotager](https://github.com/Pilotager)
- Navbar
  - 完善文档 [#587](https://github.com/taroify/taroify/pull/587)[@Pilotager](https://github.com/Pilotager)

### v0.1.0-alpha.8

`2023-07-19`

**Feature**

- Taro 版本升级为 v3.6.8 [#583](https://github.com/taroify/taroify/pull/583) [@Pilotager](https://github.com/Pilotager)
- Tab
  - 新增 swipeThreshold 属性 [#585](https://github.com/taroify/taroify/pull/585) [@Pilotager](https://github.com/Pilotager)

### v0.1.0-alpha.7

`2023-07-13`

**Feature**

- 统一了所有组件的主色调，所有组件均采用蓝色作为主色调 [#578](https://github.com/taroify/taroify/pull/578) [@Pilotager](https://github.com/Pilotager)
- 完善了主题变量的类型定义，`ConfigProviderThemeVars` 类型 [#579](https://github.com/taroify/taroify/pull/579) [@Pilotager](https://github.com/Pilotager)

### v0.1.0-alpha.6

`2023-07-09`

**New Component**

- 新增 RollingText 组件 [#574](https://github.com/taroify/taroify/pull/574) [@Pilotager](https://github.com/Pilotager)

**Bug Fixes**

- Tab
  - 修复 Tab 中 `ellipsis` 属性样式问题 [#576](https://github.com/taroify/taroify/pull/576)
- Collapse
  - 修复 Collapse 折叠面板无法全部关闭问题 [#576](https://github.com/taroify/taroify/pull/576)

### v0.1.0-alpha.5

`2023-07-06`

**Bug Fixes**

- Tag
  - 修复 Tag 组件圆角属性不生效问题 [#570](https://github.com/taroify/taroify/pull/570) [@Pilotager](https://github.com/Pilotager)
- NavBar
  - 修复 NavBar 层级导致的被覆盖问题 [#571](https://github.com/taroify/taroify/pull/571) [@Pilotager](https://github.com/Pilotager)
- Skeleton
  - 修改 Skeleton 文档问题 [#557](https://github.com/taroify/taroify/pull/557) [@Youmeng](https://github.com/youmengme)
- IndexList
  - 修复 IndexList 组件首次点击右侧快捷跳转问题 [#572](https://github.com/taroify/taroify/pull/572) [@Pilotager](https://github.com/Pilotager)
- Form
  - Input 校验未通过时，placeholder 颜色优化 [#503](https://github.com/taroify/taroify/issues/503)

### v0.1.0-alpha.4

`2023-06-30`

**New Component**

- 新增 BackTop 组件 [#568](https://github.com/taroify/taroify/pull/568) [@Pilotager](https://github.com/Pilotager)

### v0.1.0-alpha.3

`2023-06-26`

**New Component**

- 新增 FloatingPanel 组件 [#564](https://github.com/taroify/taroify/pull/564) [@Pilotager](https://github.com/Pilotager)

### v0.1.0-alpha.1

`2022-06-26`

**Bug Fixes**

- Icons
  - 修复在飞书小程序图标不显示的问题 [#511](https://github.com/taroify/taroify/issues/511) [#519](https://github.com/taroify/taroify/issues/519) [#520](https://github.com/taroify/taroify/pull/520)

### v0.1.0-alpha.0

`2022-06-21`

**Feature**

- 更新 @tarojs/\* 版本至 3.4.10 [#a2864f3](https://github.com/taroify/taroify/commit/a2864f319b0eddde8006444a6a41be3a0e78b07a) [#9a2d5eb](https://github.com/taroify/taroify/commit/9a2d5ebc19d466902952d98ab749eaa7613ce1ff) [#b722781](https://github.com/taroify/taroify/commit/b722781d3a58a294d43065aea8e6bf12691d1fc4)

**Bug Fixes**

- 修复 safe-area.scss 样式未导入的问题 [#493](https://github.com/taroify/taroify/pull/493) [@peng](https://github.com/pengcu)
- SwipeCell
  - 修复 catch move 的问题 [#495](https://github.com/taroify/taroify/pull/495) [@Kyle](https://github.com/jhxxs)
- Loading
  - 修复 SCSS 样式编译警告的问题 [#497](https://github.com/taroify/taroify/pull/497) [@Fen QIN](https://github.com/umcai)
- Button
  - 更新 shape 属性文档不一致的问题 [#512](https://github.com/taroify/taroify/pull/512) [@Kuntang Huang](https://github.com/kunkuntang)

### v0.0.29-alpha.9

`2022-05-30`

**Bug Fixes**

- Cascader
  - 修复没用触发 onSelect 事件的问题 [#484](https://github.com/taroify/taroify/pull/484)
- Avatar
  - 修复没用按需加载 Image 样式的问题 [#480](https://github.com/taroify/taroify/pull/480) [@ShibaPipi](https://github.com/ShibaPipi)

### v0.0.29-alpha.8

`2022-04-27`

**Feature**

- CSS Vars
  - 优化全部组件的 CSS Vars 文档 [#392](https://github.com/taroify/taroify/issues/392)

**Bug Fixes**

- Swiper
  - 修复切换存在白屏的问题 [#472](https://github.com/taroify/taroify/issues/472) [#474](https://github.com/taroify/taroify/pull/474) [@Laotree](https://github.com/Laotree)

### v0.0.29-alpha.7

`2022-04-12`

**Bug Fixes**

- Swiper
  - 修复 targetOffset 为 0 的问题 [#461](https://github.com/taroify/taroify/pull/461)
- Tabs
  - 修复开启滑动，无法滚动页面的问题 [#463](https://github.com/taroify/taroify/pull/463)

### v0.0.29-alpha.6

`2022-04-09`

**Breaking Changes**

- Search
  - 将 shape="round" 属性重命名为 shape="rounded" [#444](https://github.com/taroify/taroify/issues/444) [#458](https://github.com/taroify/taroify/pull/458)
- Dialog
  - 将 shape="round" 属性重命名为 shape="rounded" [#456](https://github.com/taroify/taroify/issues/456) [#457](https://github.com/taroify/taroify/pull/457)

### v0.0.29-alpha.5

`2022-04-06`

**Feature**

- Progress
  - 导出 ProgressProps 类型 [#437](https://github.com/taroify/taroify/pull/437) [@bingtsingw](https://github.com/bingtsingw)

**Bug Fixes**

- NoticeBar
  - 修复 rect 为 undefined [#438](https://github.com/taroify/taroify/pull/438)

**Breaking Changes**

- PasswordInput
  - 删除 error 属性 [#440](https://github.com/taroify/taroify/issues/440)
  - 将 info 属性重命名为 feedback [#440](https://github.com/taroify/taroify/issues/440)
- Search
  - 将 shape="round" 属性重命名为 shape="circular" [#444](https://github.com/taroify/taroify/issues/444)
- Stepper
  - 将 shape="round" 属性重命名为 shape="circular" [#449](https://github.com/taroify/taroify/issues/449)

### v0.0.29-alpha.4

`2022-04-01`

**Bug Fixes**

- DropdownMenu
  - 修复弹出抖动两次的问题 [#426](https://github.com/taroify/taroify/issues/426) [#436](https://github.com/taroify/taroify/pull/436)

### v0.0.29-alpha.3

`2022-03-29`

**Feature**

- Textarea
  - 导出 TextareaProps 类型 [#425](https://github.com/taroify/taroify/pull/425) [@bingtsingw](https://github.com/bingtsingw)

**Bug Fixes**

- Popup
  - 修复弹出抖动两次的问题 [#404](https://github.com/taroify/taroify/issues/404) [#431](https://github.com/taroify/taroify/pull/431)
- styles
  - 删除重复 $text-link-color 变量 [#427](https://github.com/taroify/taroify/pull/427) [@Yorksh1re](https://github.com/Yorksh1re)

### v0.0.29-alpha.2

`2022-03-23`

**Bug Fixes**

- Button
  - 修复微信端不能编译 SCSS 样式的问题 [#422](https://github.com/taroify/taroify/issues/422) [#423](https://github.com/taroify/taroify/pull/423)

### v0.0.29-alpha.1

`2022-03-22`

**Bug Fixes**

- Tabbar
  - 修复 FixedView 组件样式未导入的问题 [#419](https://github.com/taroify/taroify/pull/419)
  - 修复 placeholder={false} 无作用的问题 [#420](https://github.com/taroify/taroify/pull/420)
- Navbar
  - 修复 FixedView 组件样式未导入的问题 [#419](https://github.com/taroify/taroify/pull/419)
  - 修复 placeholder={false} 无作用的问题 [#420](https://github.com/taroify/taroify/pull/420)
- ActionBar
  - 修复 placeholder={false} 无作用的问题 [#420](https://github.com/taroify/taroify/pull/420)

### v0.0.29-alpha.0

`2022-03-22`

**New Component**

- 新增 Button.Group 组件 [#414](https://github.com/taroify/taroify/issues/414) [#416](https://github.com/taroify/taroify/pull/416)
- 新增 FixedView 组件 [#413](https://github.com/taroify/taroify/issues/413) [#417](https://github.com/taroify/taroify/pull/417)

**Feature**

- Tabbar
  - 新增 safeArea 属性 [#417](https://github.com/taroify/taroify/pull/417) [#418](https://github.com/taroify/taroify/pull/418)
- Navbar
  - 新增 safeArea 属性 [#417](https://github.com/taroify/taroify/pull/417) [#418](https://github.com/taroify/taroify/pull/418)
- ActionBar
  - 新增 safeArea 属性 [#417](https://github.com/taroify/taroify/pull/417) [#418](https://github.com/taroify/taroify/pull/418)

### v0.0.28-alpha.1

`2022-03-16`

**Bug Fixes**

- Countdown
  - 修复监听 onChange 事件时，获得 value 不正确的问题 [#403](https://github.com/taroify/taroify/pull/403)
- List
  - 修复重复加载（onLoad）的问题 [#406](https://github.com/taroify/taroify/pull/406)

### v0.0.28-alpha.0

`2022-03-11`

**New Component**

- 新增 Timeline 组件 [#395](https://github.com/taroify/taroify/pull/395) [@coderYarn](https://github.com/coderYarn)

**Bug Fixes**

- Form
  - 修复使用校验函数返回值处理错误的问题 [#400](https://github.com/taroify/taroify/pull/400)
- Picker
  - 修复滑动结束后不更新列值的问题 [#401](https://github.com/taroify/taroify/pull/401)

### v0.0.27-alpha.6

`2022-02-28`

**Feature**

- List
  - 新增 loading, hasMore 函数返回值类型 [#385](https://github.com/taroify/taroify/pull/385)

**Bug Fixes**

- @taroify/core/index.scss
  - 修复没有导入 ButtonBase 组件样式的问题 [#389](https://github.com/taroify/taroify/pull/389)
- List
  - 修复 loading 赋值的问题 [#390](https://github.com/taroify/taroify/pull/390)
- DropdownMenu
  - 修复当初始化页面滑动时，获得 rect 为 undefined 的问题 [#391](https://github.com/taroify/taroify/pull/391)

### v0.0.27-alpha.5

`2022-02-22`

**Bug Fixes**

- ancestorCustomWrapper
  - 修复嵌套在 Block 组件内不能查询元素的问题 [#370](https://github.com/taroify/taroify/pull/370) [@ThomasTrainset](https://github.com/xdoer)
- Image
  - 修复 onLoad, onError 未实现的问题 [#372](https://github.com/taroify/taroify/pull/372) [@yifeishu-com](https://github.com/yifeishu-com)
- DatetimePicker
  - 修复快速滑动时，快速点击 onConfirm 获取值不正确问题 [#373](https://github.com/taroify/taroify/issues/373) [#380](https://github.com/taroify/taroify/pull/380)
- Picker
  - 修复 options 为空时，导致 valueOptions 为 undefined 的问题 [#375](https://github.com/taroify/taroify/issues/375) [#378](https://github.com/taroify/taroify/pull/378)
- ActionBar.IconButton
  - 修复 badge 导入路径的问题 [#376](https://github.com/taroify/taroify/issues/376) [#377](https://github.com/taroify/taroify/pull/377)

### v0.0.27-alpha.4

`2022-02-18`

**Bug Fixes**

- useForm
  - 修复 defaultValues 被覆盖的问题 [#368](https://github.com/taroify/taroify/pull/368)

### v0.0.27-alpha.3

`2022-02-18`

### v0.0.27-alpha.2

`2022-02-17`

**Bug Fixes**

- useForm
  - 修复调用重置（reset）时，获取 onValuesChange 事件的 allValues 形参不正确的问题 [#367](https://github.com/taroify/taroify/pull/367)

### v0.0.27-alpha.1

`2022-02-17`

**Feature**

- ellipsis
  - 合并 multi-ellipsis 为 ellipsis [#343](https://github.com/taroify/taroify/pull/343) [@yifeishu-com](https://github.com/yifeishu-com)
- Docs
  - 完善开发指南 [#347](https://github.com/taroify/taroify/pull/347) [@Yang](https://github.com/programmer-yang)
- addUnitPx
  - 新增 rpx 转换 px 的支持 [#361](https://github.com/taroify/taroify/pull/361) [@BluesCurry](https://github.com/bluescurry)
- SwipeCell
  - 新增 beforeClose 方法 [#363](https://github.com/taroify/taroify/pull/363)

**Bug Fixes**

- useForm
  - 修复设置 values 无反应的问题 [#356](https://github.com/taroify/taroify/pull/356)
- Form
  - 修复通过 ref 调用 reset() 不能更新视图的问题 [#358](https://github.com/taroify/taroify/pull/358)
  - 修复通过 ref 调用 reset() 不能触发 onReset 事件的问题 [#358](https://github.com/taroify/taroify/pull/358)
- SwipeCell
  - 修复点击滑动按钮不能自动关闭的问题 [#363](https://github.com/taroify/taroify/pull/363)

### v0.0.27-alpha.0

`2022-02-11`

**New Component**

- 新增 @taroify/commerce 包 [#84](https://github.com/taroify/taroify/issues/84)
- 新增 ActionBar 组件 [#341](https://github.com/taroify/taroify/pull/341)

**Bug Fixes**

- Tabs
  - 修复切换标签页会触发两次 onChange 事件的问题 [#336](https://github.com/taroify/taroify/issues/336) [#339](https://github.com/taroify/taroify/pull/339)
- Skeleton
  - 修复设置动画无效果的问题 [#334](https://github.com/taroify/taroify/pull/334)

### v0.0.26-alpha.6

`2022-02-08`

**Bug Fixes**

- Badge
  - 修复独立模式 fixed 的问题 [#331](https://github.com/taroify/taroify/pull/331)
- Button
  - 修复 loading 为 false 时，不能显示图标的问题 [#332](https://github.com/taroify/taroify/pull/332) [@yifeishu-com](https://github.com/yifeishu-com)

### v0.0.26-alpha.5

`2022-01-28`

**Feature**

- ShareSheet.Option
  - 新增 value 属性 [#328](https://github.com/taroify/taroify/pull/328)

### v0.0.26-alpha.4

`2022-01-28`

**Bug Fixes**

- Stepper
  - 修复获取手动输入值不正确的问题 [#326](https://github.com/taroify/taroify/pull/326)
- Popup
  - 修复固定定位（fixed position）和动画（translate3d）联用的问题 [#327](https://github.com/taroify/taroify/pull/327)

### v0.0.26-alpha.3

`2022-01-28`

**Bug Fixes**

- Input
  - 修复字号（font-size）、行高（line-height）继承父元素样式的问题 [#325](https://github.com/taroify/taroify/pull/325)
  - 修复清除按钮点击无效果的问题 [#320](https://github.com/taroify/taroify/pull/320)
- Textarea
  - 修复字号（font-size）、行高（line-height）继承父元素样式的问题 [#324](https://github.com/taroify/taroify/pull/324)
- Form
  - 修复非表单环境下设置空字符串的问题 [#323](https://github.com/taroify/taroify/pull/323)
  - 修复嵌套 Input 组件不能自定义颜色的问题 [#323](https://github.com/taroify/taroify/pull/323)

### v0.0.26-alpha.2

`2022-01-27`

**Bug Fixes**

- ShareSheet
  - 修复 image 样式被覆盖的问题 [#316](https://github.com/taroify/taroify/pull/316)
- Textarea
  - 修复设置 value 无效的问题 [#315](https://github.com/taroify/taroify/pull/315)

### v0.0.26-alpha.1

`2022-01-26`

**Feature**

- Form
  - 补全 FormInstance 类型 [#311](https://github.com/taroify/taroify/pull/311)

**Bug Fixes**

- useHeight
  - 修复 rect 为 undefined 的问题 [#312](https://github.com/taroify/taroify/pull/312)

### v0.0.26-alpha.0

`2022-01-26`

**New Component**

- 新增 Textarea 组件 [#297](https://github.com/taroify/taroify/pull/297)

**Feature**

- Field
  - 优化 label, feedback 属性 [#310](https://github.com/taroify/taroify/issues/310) [#299](https://github.com/taroify/taroify/pull/299) [@coderYarn](https://github.com/coderYarn)

**Bug Fixes**

- Avatar
  - 修复 className 无法传入的问题 [#308](https://github.com/taroify/taroify/pull/308) [@coderYarn](https://github.com/coderYarn)
- Input
  - 修复独立于 Form 组件，无法赋值的问题 [#298](https://github.com/taroify/taroify/pull/298)
- Button
  - 修复加载（loading）状态下还可以提交表单的问题 [#306](https://github.com/taroify/taroify/pull/306)
- Grid.Item
  - 修复 badge 字号样式问题 [#309](https://github.com/taroify/taroify/pull/309)
- Tabbar.Item
  - 修复 badge 字号样式问题 [#309](https://github.com/taroify/taroify/pull/309)

### v0.0.25-alpha.1

`2022-01-24`

**Feature**

- IndexList
  - 新增 stickyOffsetTop 字符串（string）类型 [#287](https://github.com/taroify/taroify/pull/287) [@bluescurry](https://github.com/bluescurry)
- ActionSheet
  - 新增按钮（Button）相关属性 [#292](https://github.com/taroify/taroify/pull/292)

**Bug Fixes**

- Picker
  - 修复当子元素（children）改变时，索引（index）未更新的问题 [#289](https://github.com/taroify/taroify/pull/289)

### v0.0.25-alpha.0

`2022-01-20`

**New Component**

- 新增 Avatar 组件 [#233](https://github.com/taroify/taroify/issues/233) [#248](https://github.com/taroify/taroify/pull/248) [@coderYarn](https://github.com/coderYarn)
- 新增 AreaPicker 组件 [#77](https://github.com/taroify/taroify/issues/77) [#264](https://github.com/taroify/taroify/pull/272) [#264](https://github.com/taroify/taroify/pull/272)

**Feature**

- IndexList.Anchor
  - 新增全部属性 [#282](https://github.com/taroify/taroify/pull/282) [@bluescurry](https://github.com/bluescurry)
- Picker
  - 新增 onChange 事件返回 column 对象 [#269](https://github.com/taroify/taroify/blob/1b80d78ed8bd0150b83c1485a3a5b692975ce7d9/packages/core/src/picker/picker-columns.tsx#L37)
- SwipeCell
  - 优化微信小程序端的滑动动画效果 [#265](https://github.com/taroify/taroify/pull/265)

**Bug Fixes**

- Toast
  - 修复页面切换返回后不能打开的问题 [#283](https://github.com/taroify/taroify/issues/283) [#284](https://github.com/taroify/taroify/pull/284)
- Notify
  - 修复页面切换返回后不能打开的问题 [#283](https://github.com/taroify/taroify/issues/283) [#284](https://github.com/taroify/taroify/pull/284)
- Dialog
  - 修复页面切换返回后不能打开的问题 [#283](https://github.com/taroify/taroify/issues/283) [#284](https://github.com/taroify/taroify/pull/284)
- Empty
  - 修复内部图片样式被覆盖的问题 [#268](https://github.com/taroify/taroify/issues/268) [#271](https://github.com/taroify/taroify/pull/271)

### v0.0.24-alpha.1

`2022-01-13`

**Feature**

- Form
  - 新增 onValuesChange 属性 [#258](https://github.com/taroify/taroify/issues/258) [#261](https://github.com/taroify/taroify/pull/261)

**Bug Fixes**

- Toast
  - 修复通过命令式调用重复打开的问题 [#259](https://github.com/taroify/taroify/issues/259) [#260](https://github.com/taroify/taroify/pull/260)
- Notify
  - 修复通过命令式调用重复打开的问题 [#259](https://github.com/taroify/taroify/issues/259) [#260](https://github.com/taroify/taroify/pull/260)
- Dialog
  - 修复通过命令式调用重复打开的问题 [#259](https://github.com/taroify/taroify/issues/259) [#260](https://github.com/taroify/taroify/pull/260)

### v0.0.24-alpha.0

`2022-01-12`

**Feature**

- Uploader
  - 新增 removable 属性 [#243](https://github.com/taroify/taroify/issues/243) [#256](https://github.com/taroify/taroify/pull/256)
- Picker
  - 监听返回完整的选项（Option）对象 [#239](https://github.com/taroify/taroify/issues/239) [#242](https://github.com/taroify/taroify/pull/242)

**Bug Fixes**

- Style
  - 修复 multi-ellipsis 无法省略的问题 [#245](https://github.com/taroify/taroify/pull/245)
- DatetimePicker
  - 修复设置 defaultValue 无效的问题 [#238](https://github.com/taroify/taroify/pull/238) [@Brain777777](https://github.com/Brain777777)
  - 修复 2 月存在 31 天的问题 [#240](https://github.com/taroify/taroify/issues/240) [#254](https://github.com/taroify/taroify/pull/254)

### v0.0.23-alpha.1

`2022-01-04`

**Bug Fixes**

- Field
  - 修复嵌套 Input 组件不能赋值 value 的问题 [#235](https://github.com/taroify/taroify/issues/235)

### v0.0.23-alpha.0

`2022-01-04`

**New Component**

- 新增 Space 组件 [#228](https://github.com/taroify/taroify/pull/228) [@coderYarn](https://github.com/coderYarn)

**Feature**

- ActionSheet.Action
  - 新增 value 属性 [#229](https://github.com/taroify/taroify/pull/229) [@coderYarn](https://github.com/coderYarn)

**Bug Fixes**

- Checkbox.Group
  - 修复设置 value 为空数组时，Checkbox 组件的 checked 不为 false 的问题 [#231](https://github.com/taroify/taroify/pull/231)

### v0.0.22-alpha.1

`2022-01-01`

**Feature**

- DatetimePicker
  - 新增 date-minute 类型（年月日时分） [#211](https://github.com/taroify/taroify/issues/211) [#227](https://github.com/taroify/taroify/pull/227)

**Bug Fixes**

- Input
  - 修复 readonly 状态下 placeholder 颜色为 --text-color-3 的问题 [#218](https://github.com/taroify/taroify/pull/218)

### v0.0.22-alpha.0

`2022-01-01`

**New Component**

- 新增 Form 组件 [#118](https://github.com/taroify/taroify/issues/118) [#224](https://github.com/taroify/taroify/pull/224)

**Feature**

- Cell
  - 设置 icon 和 rightIcon 属性时，仅为图标组件添加单元格图标样式 [#214](https://github.com/taroify/taroify/issues/214) [#225](https://github.com/taroify/taroify/pull/225)
- Field
  - 新增 feedbackAlign 属性 [#224](https://github.com/taroify/taroify/pull/224)
  - 新增 feedbackStatus 属性 [#224](https://github.com/taroify/taroify/pull/224)
- Search
  - 新增 inputColor 属性 [#224](https://github.com/taroify/taroify/pull/224)
  - 新增 feedbackAlign 属性 [#224](https://github.com/taroify/taroify/pull/224)
  - 新增 feedbackStatus 属性 [#224](https://github.com/taroify/taroify/pull/224)

**Breaking Changes**

- Field
  - 删除 Input 属性 [#224](https://github.com/taroify/taroify/pull/224)
  - 将 message 属性重命名为 feedback [#224](https://github.com/taroify/taroify/pull/224)
- Search
  - 将 message 属性重命名为 feedback [#224](https://github.com/taroify/taroify/pull/224)

**Bug Fixes**

- Tabs
  - 修复 swipeable 不支持 lazyRender 的问题 [#218](https://github.com/taroify/taroify/pull/218)

### v0.0.21-alpha.1

`2021-12-22`

**Feature**

- Countdown
  - 新增单符号（D, H, m, s）格式 [#206](https://github.com/taroify/taroify/issues/206) [#208](https://github.com/taroify/taroify/pull/208)

**Bug Fixes**

- Countdown
  - 修复 value 无法更新的问题 [#205](https://github.com/taroify/taroify/issues/205) [#208](https://github.com/taroify/taroify/pull/208)
- SafeArea
  - 修复 ios11 兼容性 constant(safe-area-inset-\*) 的问题 [#199](https://github.com/taroify/taroify/pull/199) [@Brain777777](https://github.com/Brain777777)

### v0.0.21-alpha.0

`2021-12-16`

**New Component**

- 新增 SafeArea 组件 [#195](https://github.com/taroify/taroify/pull/195)

**Feature**

- Badge
  - 新增 position 属性 [#196](https://github.com/taroify/taroify/pull/196)
- Button
  - 新增 loading.size 属性 [#192](https://github.com/taroify/taroify/pull/192) [@zjwshisb](https://github.com/zjwshisb)
- ShareSheet.Option
  - 新增 openType 属性 [#194](https://github.com/taroify/taroify/pull/194) [@kunkuntang](https://github.com/kunkuntang)

**Bug Fixes**

- Badge
  - 修复 content toString 的问题 [#196](https://github.com/taroify/taroify/pull/196)

### v0.0.20-alpha.5

`2021-12-15`

**Bug Fixes**

- DatetimePicker
  - 修复 clampDate 和 useValue 的问题 [#190](https://github.com/taroify/taroify/pull/190)

### v0.0.20-alpha.4

`2021-12-15`

**Feature**

- SwipeCell
  - 新增 defaultOpen 和 open 属性 [#172](https://github.com/taroify/taroify/issues/172) [#186](https://github.com/taroify/taroify/pull/186)

**Bug Fixes**

- Badge
  - 修复 content={0} 时，直接渲染 0 的问题 [#184](https://github.com/taroify/taroify/pull/184) [@zjwshisb](https://github.com/zjwshisb)
- Field
  - 修复 H5 设置 inputAlign 为 right 无效的问题 [#182](https://github.com/taroify/taroify/pull/182) [@zjwshisb](https://github.com/zjwshisb)
- Picker
  - 修复监听 onChange 事件为旧值的问题 [#189](https://github.com/taroify/taroify/pull/189)
- DatetimePicker
  - 修复默认值为 undefined 的问题 [#188](https://github.com/taroify/taroify/pull/188)

**Breaking Changes**

- Countdown
  - 将 useCountDown() 和 CountDown 合并在一起 [#176](https://github.com/taroify/taroify/pull/176) [@Brain777777](https://github.com/Brain777777)
  - 将 CountDown 重命名为 Countdown [#179](https://github.com/taroify/taroify/pull/179)
  - 将 current 属性重命名为 value [#179](https://github.com/taroify/taroify/pull/179)
  - 将 millisecond 属性重命名为 interval={1} [#179](https://github.com/taroify/taroify/pull/179)
  - 将 onFinish 事件重命名为 onComplete [#179](https://github.com/taroify/taroify/pull/179)

### v0.0.20-alpha.3

`2021-12-11`

**Feature**

- Styles
  - 新增赋值 $hd 默认变量 [#173](https://github.com/taroify/taroify/issues/173) [#174](https://github.com/taroify/taroify/pull/174)

### v0.0.20-alpha.2

`2021-12-09`

**Bug Fixes**

- Pagination
  - 修复页码出现负数的问题 [#171](https://github.com/taroify/taroify/pull/171) [@zjwshisb](https://github.com/zjwshisb)

### v0.0.20-alpha.1

`2021-12-09`

**Bug Fixes**

- Dialog
  - 修复点击确认按钮导致自动关闭 [#170](https://github.com/taroify/taroify/issues/170) [#169](https://github.com/taroify/taroify/pull/169)

### v0.0.20-alpha.0

`2021-12-08`

**Feature**

- Popup
  - 新增 defaultOpen 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Toast
  - 新增 defaultOpen 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Cascader
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Calendar
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Checkbox
  - 新增 defaultChecked 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- DatetimePicker
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Picker
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Radio
  - 新增 defaultChecked 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Rate
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Slider
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Stepper
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Switch
  - 新增 defaultChecked 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Uploader
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- ActionSheet
  - 新增 defaultOpen 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Dialog
  - 新增 defaultOpen 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- DropdownMenu
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Notify
  - 新增 defaultOpen 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Backdrop
  - 新增 defaultOpen 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- ShareSheet
  - 新增 defaultOpen 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Collapse
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Collapse
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Steps
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Swiper
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Sidebar
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Tabs
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- Tabbar
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)
- TreeSelect
  - 新增 defaultValue 属性 [#86](https://github.com/taroify/taroify/issues/86) [#165](https://github.com/taroify/taroify/pull/165)

### v0.0.19-alpha.3

`2021-12-04`

**Feature**

- NavBar
  - 新增 fixed & placeholder 属性 [#159](https://github.com/taroify/taroify/pull/159)

**Bug Fixes**

- multi-ellipsis
  - 修复多行文本不省略的问题 [#160](https://github.com/taroify/taroify/pull/160)

### v0.0.19-alpha.2

`2021-12-03`

**Bug Fixes**

- PullRefresh
  - 修复嵌套在 CustomWrapper 中不能触发 onRefresh 的问题 [#156](https://github.com/taroify/taroify/pull/156)
- NumberKeyboard
  - 修复 Transition 组件未嵌套在真实元素上，而不能隐藏的的问题 [#154](https://github.com/taroify/taroify/pull/154)

**Breaking Changes**

- PasswordInput
  - 将 focused 属性重命名为 focus 属性 [#155](https://github.com/taroify/taroify/pull/155)

### v0.0.19-alpha.1

`2021-12-02`

**Feature**

- Transition
  - 新增 appear 、mountOnEnter 属性 [#148](https://github.com/taroify/taroify/pull/148)

**Bug Fixes**

- createNodesRef
  - 修复获得嵌套在 CustomWrapper 内的 NodesRef 为 undefined 的问题 [#143](https://github.com/taroify/taroify/pull/143) [@wowhy](https://github.com/wowhy)
- Circle
  - 修复重复获得 CanvasContext 导致无法初始化渲染的问题 [#145](https://github.com/taroify/taroify/issues/145) [#146](https://github.com/taroify/taroify/issues/146)
- Uploader
  - 修复在多选（multiple）模式下，不能显示上传的本地图片的问题 [#152](https://github.com/taroify/taroify/issues/152) [#151](https://github.com/taroify/taroify/pull/151)

**Performance**

- Backdrop
  - 使用 Transition 组件代替 css transition [#150](https://github.com/taroify/taroify/issues/150) [#149](https://github.com/taroify/taroify/issues/149)

### v0.0.19-alpha.0

`2021-11-26`

**Refactor**

- Swiper
  - 重构 Swiper 组件，增加 value 属性 [#120](https://github.com/taroify/taroify/issues/120) [#137](https://github.com/taroify/taroify/pull/137)

**Bug Fixes**

- Circle
  - 修复在低版本的小程序中不渲染的问题 [#139](https://github.com/taroify/taroify/issues/139) [#140](https://github.com/taroify/taroify/pull/140)

### v0.0.18-alpha.9

`2021-11-22`

**Feature**

- Icons
  - 修复在采用导入全部样式的方式时，存在图标样式被覆盖的问题 [#134](https://github.com/taroify/taroify/issues/134) [#135](https://github.com/taroify/taroify/issues/135)

### v0.0.18-alpha.8

`2021-11-19`

**Feature**

- Empty
  - 新增 children 属性 [#131](https://github.com/taroify/taroify/issues/131) [#132](https://github.com/taroify/taroify/pull/132)

### v0.0.18-alpha.7

`2021-11-19`

### v0.0.18-alpha.6

`2021-11-19`

**Bug Fixes**

- PullRefresh
  - 修复在小程序中 overflow 超出 100% 时，不能滚动下拉的问题 [#129](https://github.com/taroify/taroify/issues/129) [#130](https://github.com/taroify/taroify/issues/130)

### v0.0.18-alpha.5

`2021-11-17`

**Bug Fixes**

- Circle
  - 修复在 useReady 里获得 CanvasNode 为 undefined 的问题 [#127](https://github.com/taroify/taroify/issues/127) [#128](https://github.com/taroify/taroify/issues/128)

### v0.0.18-alpha.4

`2021-11-17`

**Bug Fixes**

- Field
  - 修复 calc(var(--padding-xs, #{$padding-xs}) \* -1) 的问题 [#121](https://github.com/taroify/taroify/issues/121) [#126](https://github.com/taroify/taroify/issues/126)
- TreeSelect
  - 修复 calc(var(--padding-xs, #{$padding-xs}) \* -1) 的问题 [#122](https://github.com/taroify/taroify/issues/122) [#124](https://github.com/taroify/taroify/issues/124)
- Slider
  - 修复 calc(var(--padding-xs, #{$padding-xs}) \* -1) 的问题 [#123](https://github.com/taroify/taroify/issues/123) [#125](https://github.com/taroify/taroify/issues/125)

### v0.0.18-alpha.3

`2021-11-15`

**Feature**

- Uploader
  - 补全 Uploader.Image 属性 [#113](https://github.com/taroify/taroify/issues/113) [#117](https://github.com/taroify/taroify/pull/117)
- Icons
  - 补全 Icons 属性 [#113](https://github.com/taroify/taroify/issues/113) [#115](https://github.com/taroify/taroify/pull/115)

**Bug Fixes**

- List
  - 修复重复执行 onLoad 事件的问题 [#112](https://github.com/taroify/taroify/issues/112) [#116](https://github.com/taroify/taroify/pull/116)

### v0.0.18-alpha.2

`2021-11-14`

**Performance**

- 优化 Demo 示例项目打包体积 [#83](https://github.com/taroify/taroify/pull/83) [@Ace Han](https://github.com/ace-han)

**Bug Fixes**

- Flex
  - 修复 Flex.Item 缺少 children 属性的问题 [#110](https://github.com/taroify/taroify/issues/110) [#111](https://github.com/taroify/taroify/pull/111)

### v0.0.18-alpha.1

`2021-11-14`

**Feature**

- 新增 @taroify/hooks 包 [#109](https://github.com/taroify/taroify/issues/109)

### v0.0.18-alpha.0

`2021-11-14`

**New Component**

- 新增 Cascader 组件 [#96](https://github.com/taroify/taroify/issues/96) [#106](https://github.com/taroify/taroify/pull/106)

**Bug Fixes**

- Transition
  - 修复设置 in 属性默认为 true 时不执行动画的问题 [#100](https://github.com/taroify/taroify/issues/100) [#101](https://github.com/taroify/taroify/issues/101)
- Field
  - 修复 maxlength 默认为 -1 时，导致数字或整数无法输入的问题 [#99](https://github.com/taroify/taroify/issues/99) [#102](https://github.com/taroify/taroify/issues/102) [#105](https://github.com/taroify/taroify/pull/105)

**Breaking Changes**

- Flex
  - 将 Row & Col 合并成 Flex 组件 [#103](https://github.com/taroify/taroify/issues/103) [#104](https://github.com/taroify/taroify/pull/104)

### v0.0.17-alpha.4

`2021-11-11`

**Bug Fixes**

- Sticky
  - 删除多余的 `console.log()` 打印 [#97](https://github.com/taroify/taroify/issues/97) [#98](https://github.com/taroify/taroify/pull/98)

### v0.0.17-alpha.3

`2021-11-11`

**Bug Fixes**

- Dialog
  - 修复在未按需加载内部使用 Button 组件样式的问题 [#90](https://github.com/taroify/taroify/issues/90) [#93](https://github.com/taroify/taroify/pull/93)
- Collapse
  - 修复因继承自 StandardProps 接口，而导致 value 为 undefined 的问题 [#89](https://github.com/taroify/taroify/issues/89) [#94](https://github.com/taroify/taroify/pull/94)

**Breaking Changes**

- PullRefresh
  - 将判断 reachTop 的逻辑移动到组件外部 [#92](https://github.com/taroify/taroify/issues/92) [#95](https://github.com/taroify/taroify/pull/95)

### v0.0.17-alpha.2

`2021-11-05`

**Feature**

- Toast
  - 新增命令式调用 `Toast.close()`、`Toast.setDefaultOptions()`、`Toast.resetDefaultOptions()` 方法 [#78](https://github.com/taroify/taroify/issues/78)
- Notify
  - 新增命令式调用 `Notify.close()`、`Notify.setDefaultOptions()`、`Notify.resetDefaultOptions()` 方法 [#71](https://github.com/taroify/taroify/issues/71)
- Dialog
  - 新增命令式调用 `Dialog.close()`、`Dialog.setDefaultOptions()`、`Dialog.resetDefaultOptions()` 方法 [#71](https://github.com/taroify/taroify/issues/71)

**Bug Fixes**

- Image
  - 修复因 `display: none` 导致重复加载的问题 [#79](https://github.com/taroify/taroify/pull/79) [@Pingren](https://github.com/Pingren)
- ShareSheet
  - 修复 ShareSheet.Option 在小程序上存在垂直展示的问题 [#82](https://github.com/taroify/taroify/issues/82)
- PullRefresh
  - 修复在小程序真机下拉刷新时存在卡帧的问题 [#74](https://github.com/taroify/taroify/issues/74)

### v0.0.17-alpha.1

`2021-11-04`

**Bug Fixes**

- Stepper
  - 修复第一次点击无反应的问题 [#76](https://github.com/taroify/taroify/issues/76)

### v0.0.17-alpha.0

`2021-11-03`

**Feature**

- Search
  - 新增 focus 属性 [#73](https://github.com/taroify/taroify/issues/73)
- Toast
  - 新增命令式调用 `Toast.open()`、`Toast.loading()`、`Toast.success()`、`Toast.fail()` 方法 [#71](https://github.com/taroify/taroify/issues/71) [#69](https://github.com/taroify/taroify/issues/69)
- Notify
  - 新增命令式调用 `Notify.open()` 方法 [#71](https://github.com/taroify/taroify/issues/71) [#69](https://github.com/taroify/taroify/issues/69)
- Dialog
  - 新增命令式调用 `Dialog.open()`、`Dialog.alert()`、`Dialog.confirm()` 方法 [#71](https://github.com/taroify/taroify/issues/71) [#69](https://github.com/taroify/taroify/issues/69)

**Bug Fixes**

- DatetimePicker
  - 修复在改变 value 导致缺少 columns 的问题 [#75](https://github.com/taroify/taroify/issues/75)
- Popup
  - 修复在编译打包后因背景板（Backdrop）叠加显示在依赖 Popup 组件之上的问题 [#72](https://github.com/taroify/taroify/issues/72)
- Search
  - 修复设置 autoFocus 属性无效的问题 [#73](https://github.com/taroify/taroify/issues/73)

### v0.0.16-alpha.3

`2021-11-01`

**Bug Fixes**

- List
  - 修复因 children 改变未触发 onLoad 事件的问题 [#70](https://github.com/taroify/taroify/issues/70)

### v0.0.16-alpha.2

`2021-11-01`

**Bug Fixes**

- Sticky
  - 修复因 offsetTop, offsetBottom 未显示解构而导致的设置属性错误的问题 [#68](https://github.com/taroify/taroify/issues/68)

### v0.0.16-alpha.1

`2021-11-01`

**Bug Fixes**

- 修复`@taroify/icons`样式问题 [#67](https://github.com/taroify/taroify/issues/67)

### v0.0.16-alpha.0

`2021-10-31`

**New Component**

- 新增 Calendar 组件 [#66](https://github.com/taroify/taroify/issues/66)

**Feature**

- 提供完全属性集，为所有组件的属性继承自 StandardProps 接口 [#65](https://github.com/taroify/taroify/issues/65)
- 使用 useMounted 代替 useReady 钩子 [#62](https://github.com/taroify/taroify/issues/62)
- @taroify/icons 增强自动导入图标样式 [#63](https://github.com/taroify/taroify/issues/63)

### v0.0.15-alpha.12

`2021-10-26`

**Breaking Changes**

- Cell.Group
  - title 属性的类型调整为 ReactNode [#60](https://github.com/taroify/taroify/issues/60)

### v0.0.15-alpha.11

`2021-10-25`

**Bug Fixes**

- Popup
  - 修复导入`@taroify/~icons`的问题 [#59](https://github.com/taroify/taroify/issues/59)

### v0.0.15-alpha.10

`2021-10-25`

**Feature**

- Tabs
  - 新增 TabsSticky 属性，用以设置 Tabs.sticky 属性 [#58](https://github.com/taroify/taroify/issues/58)

**Breaking Changes**

- Sticky
  - 使用 offsetTop, offsetBottom 属性代替 { top, bottom } 属性 [#57](https://github.com/taroify/taroify/issues/57)

### v0.0.15-alpha.9

`2021-10-25`

**Bug Fixes**

- Button
  - 修复文本按钮存在边框的问题 [#55](https://github.com/taroify/taroify/issues/55)

**Breaking Changes**

- Button
  - 删除 color 自定义属性，使用 CSS className 和 style 代替 color 属性 [#56](https://github.com/taroify/taroify/issues/56)

### v0.0.15-alpha.8

`2021-10-24`

**Feature**

- Sticky
  - 新增 onScroll 事件 [#51](https://github.com/taroify/taroify/issues/51)
- Image
  - 新增 onClick 事件 [#54](https://github.com/taroify/taroify/issues/54)

**Bug Fixes**

- Tabs
  - 修复设置 sticky 无法切换 Tab 的问题 [#52](https://github.com/taroify/taroify/issues/52)
- Styles
  - 修复 tap-highlight-color 默认为淡蓝的问题 [#54](https://github.com/taroify/taroify/issues/53)

### v0.0.15-alpha.7

`2021-10-22`

**Feature**

- 使用 esm 作为默认打包方式 [#50](https://github.com/taroify/taroify/issues/50)

### v0.0.15-alpha.6

`2021-10-22`

**Feature**

- Toast
  - 新增 position 属性 [#49](https://github.com/taroify/taroify/issues/49)

### v0.0.15-alpha.5

`2021-10-22`

**Bug Fixes**

- Transition
  - 修复 DOM 在 enter 之前已挂载的问题 [#48](https://github.com/taroify/taroify/issues/48)

### v0.0.15-alpha.4

`2021-10-21`

**Feature**

- Tag
  - 新增 onClick 事件 [#46](https://github.com/taroify/taroify/issues/46)

**Breaking Changes**

- Tag
  - 删除 textColor 属性，使用 CSS className 和 style 代替 textColor 属性 [#47](https://github.com/taroify/taroify/issues/47)

### v0.0.15-alpha.3

`2021-10-20`

**Feature**

- Uploader.Image
  - 新增 mode, alt, round 属性 [#45](https://github.com/taroify/taroify/issues/45)

### v0.0.15-alpha.2

`2021-10-19`

**Bug Fixes**

- Transition
  - 修复因设置 unmountOnExit 属性，而导致小程序渲染错乱的问题 [#42](https://github.com/taroify/taroify/issues/42)

### v0.0.15-alpha.1

`2021-10-18`

**Feature**

- Tabs
  - 新增 bottomBar 的 css 变量 [#40](https://github.com/taroify/taroify/issues/40)

### v0.0.15-alpha.0

`2021-10-16`

**New Component**

- 新增 ConfigProvider 组件 [#39](https://github.com/taroify/taroify/issues/39)

### v0.0.14-alpha.2

`2021-10-13`

**Bug Fixes**

- SwipeCell
  - 修复动画卡顿和 rightRect 为空的问题 [#37](https://github.com/taroify/taroify/issues/37)

### v0.0.14-alpha.1

`2021-10-11`

**Bug Fixes**

- Tabbar
  - 修复图标为空时，Badge 组件未清理的问题 [#35](https://github.com/taroify/taroify/issues/35)

### v0.0.14-alpha.0

`2021-10-11`

**Breaking Changes**

- DropdownMenu
  - activeKey 属性重命名为 value [#34](https://github.com/taroify/taroify/issues/34)
- Collapse
  - activeKey 属性重命名为 value [#34](https://github.com/taroify/taroify/issues/34)
- Sidebar
  - activeKey 属性重命名为 value [#34](https://github.com/taroify/taroify/issues/34)
- TreeSelect
  - activeTab 属性重命名为 tabValue [#34](https://github.com/taroify/taroify/issues/34)
  - activeValue 属性重命名为 value [#34](https://github.com/taroify/taroify/issues/34)

### v0.0.13-alpha.0

`2021-10-09`

**Feature**

- 完善 css var 自定义主题 [#23](https://github.com/taroify/taroify/issues/23)
- 新增所有的 vant 图标 [#30](https://github.com/taroify/taroify/issues/30)

### v0.0.12-alpha.18

`2021-09-30`

**Bug Fixes**

- Button
  - 修复细边框样式模糊问题 [#29](https://github.com/taroify/taroify/issues/29)

### v0.0.12-alpha.17

`2021-09-27`

**Bug Fixes**

- Tabs
  - 修复滑动切换时 Tab 没有效果的问题 [#28](https://github.com/taroify/taroify/issues/28)

### v0.0.12-alpha.16

`2021-09-27`

**Feature**

- Tabs.TabPane
  - 新增 value 属性 [#26](https://github.com/taroify/taroify/issues/26)

**Bug Fixes**

- Button
  - 修复 disabled 为 true 时，依然可以点击的问题 [#27](https://github.com/taroify/taroify/issues/27)

**Breaking Changes**

- Tabs
  - activeKey 属性重命名为 value [#26](https://github.com/taroify/taroify/issues/26)

### v0.0.12-alpha.15

`2021-09-27`

**Bug Fixes**

- Tabs
  - 修复在微信小程序获得 navRect 为空的问题 [#19](https://github.com/taroify/taroify/pull/19)

### v0.0.12-alpha.14

`2021-09-26`

**Feature**

- @taroify/icons
  - 在使用 @taroify/core 组件时，自动导入图标样式 [#24](https://github.com/taroify/taroify/issues/24)

### v0.0.12-alpha.13

`2021-09-26`

**Bug Fixes**

- NoticeBar
  - 修复动态渲染时，useReady 不执行的问题 [#20](https://github.com/taroify/taroify/pull/20)

### v0.0.12-alpha.12

`2021-09-23`

**Bug Fixes**

- Sheet
  - 修复按需导入样式的问题 [#18](https://github.com/taroify/taroify/issues/18)
- Tabs
  - 修复 navOffset 为 null 导致报错的问题 [#17](https://github.com/taroify/taroify/pull/17)

### v0.0.12-alpha.11

`2021-09-23`

**Bug Fixes**

- Divider
  - 修复 className 放置错误问题 [#16](https://github.com/taroify/taroify/pull/16)

### v0.0.12-alpha.10

`2021-09-22`

**Feature**

- 所有组件新增 className 属性 [#15](https://github.com/taroify/taroify/issues/15)

### v0.0.12-alpha.9

`2021-09-22`

### v0.0.12-alpha.8

`2021-09-22`

**Feature**

- Field
  - 新增 name 属性 [#11](https://github.com/taroify/taroify/issues/11)

**Bug Fixes**

- Import on demand
  - 修复重复导入样式的问题 [#13](https://github.com/taroify/taroify/issues/13)
- NoticeBar
  - 修复 NoticeBar 全局样式引入问题 [#14](https://github.com/taroify/taroify/issues/14)

### v0.0.12-alpha.7

`2021-09-09`

### v0.0.12-alpha.6

`2021-09-09`

**Bug Fixes**

- NumberKeyboard
  - 修复 classNames 导入方式不正确的问题 [#10](https://github.com/taroify/taroify/issues/10)

### v0.0.12-alpha.5

`2021-09-08`

**Feature**

- Navbar
  - title 提升为 ReactNode 类型 [#7](https://github.com/taroify/taroify/issues/7)
- Sticky
  - 新增 onChange 事件 [#6](https://github.com/taroify/taroify/issues/6)

**Breaking Change**

- Tabbar
  - 重命名 Tabbar.Item 为 Tabbar.TabItem [#8](https://github.com/taroify/taroify/issues/8)

### v0.0.12-alpha.4

`2021-09-04`

**Feature**

- Button
  - 新增小程序属性 [#2](https://github.com/taroify/taroify/issues/2)
- Tabbar
  - 新增 fixed 属性 [#5](https://github.com/taroify/taroify/issues/5)
  - Tabbar：新增 placeholder 属性 [#5](https://github.com/taroify/taroify/issues/5)
  - Tabbar：新增 bordered 属性 [#5](https://github.com/taroify/taroify/issues/5)
  - Tabbar.Item：新增 badge 属性 [#5](https://github.com/taroify/taroify/issues/5)

### v0.0.12-alpha.3

`2021-09-03`

### v0.0.12-alpha.2

`2021-09-03`

**Bug Fixes**

- List：修复 nextTick 在微信小程序不执行的问题 [#3](https://github.com/taroify/taroify/issues/3)

### v0.0.12-alpha.1

`2021-08-31`

**Feature**

- Search：新增 icon 属性
- Navbar：新增 NavLeft onClick 事件
- Navbar：新增 NavRight onClick 事件
- Navbar：使用 NavLeft.children 代替 NavLeft.text
- Navbar：使用 NavRight.children 代替 NavRight.text

**Bug Fixes**

- Tabs：修复 设置 sticky 时 container 为 undefined 的问题

### v0.0.12-alpha.0

`2021-08-25`

**New Component**

- 新增 Field 组件
- 新增 Search 组件

**Feature**

- Cell.Group: 新增 inset 属性

### v0.0.11-alpha.0

`2021-08-18`

**New Component**

- 新增 NumberKeyboard 组件
- 新增 Uploader 组件

**Feature**

- Tabs: 新增 animated 属性
- Tabs: 新增 swipeable 属性

### v0.0.10-alpha.0

`2021-07-30`

**New Component**

- 新增 Checkbox 组件
- 新增 Radio 组件
- 新增 PasswordInput 组件

### v0.0.9-alpha.0

`2021-07-26`

**New Component**

- 新增 Rate 组件
- 新增 Slider 组件

### v0.0.8-alpha.0

`2021-07-22`

**New Component**

- 新增 Stepper 组件
- 新增 Switch 组件

### v0.0.7-alpha.0

`2021-07-21`

**New Component**

- 新增 DropdownMenu 组件
- 新增 PullRefresh 组件
- 新增 Circle 组件
- 新增 List 组件
- 新增 IndexList 组件

### v0.0.6-alpha.0

`2021-06-21`

**New Component**

- 新增 SwipeCell 组件
- 新增 Collapse 组件
- 新增 CountDown 组件
- 新增 NoticeBar 组件
- 新增 Skeleton 组件
- 新增 Steps 组件
- 新增 TreeSelect 组件

### v0.0.5-alpha.0

`2021-05-21`

**New Component**

- 新增 Notify 组件
- 新增 Progress 组件
- 新增 Sticky 组件
- 新增 Swiper 组件
- 新增 Pagination 组件

**Breaking Changes**

- Cell：重命名 subtitle 属性为 brief
- Toast：重命名 placement 属性为 position

### v0.0.4-alpha.0

`2021-05-07`

**New Component**

- 新增 ActionSheet 组件
- 新增 Dialog 组件
- 新增 ShareSheet 组件

**Breaking Changes**

- Cell.Group：重命名 CellGroup 组件为 Cell.Group
- Popup：去除 backdrop 属性，将 backdrop 属性设计为 Popup.Backdrop 组件

**Bug Fixes**

- Popup：修复点击关闭图标无反应的问题

### v0.0.3-alpha.0

`2021-04-30`

**New Component**

- 新增 Badge 组件
- 新增 Tag 组件
- 新增 Grid 组件
- 新增 Navbar 组件
- 新增 Sidebar 组件
- 新增 Tabs 组件
- 新增 Tabbar 组件

**Breaking Changes**

- Cell：label 属性重命名为 title
- Cell：description 属性重命名为 subtitle

**Bug Fixes**

- 修复使用 babel-plugin-import 无法导入依赖组件样式问题

### v0.0.1-alpha.0

`2021-04-19`

**New Component**

- 新增 Backdrop 组件
- 新增 Button 组件
- 新增 Cell 组件
- 新增 CellGroup 组件
- 新增 Col 组件
- 新增 Image 组件
- 新增 Loading 组件
- 新增 Popup 组件
- 新增 Row 组件
- 新增 Toast 组件
- 新增 Transition 组件
