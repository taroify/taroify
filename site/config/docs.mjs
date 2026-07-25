export const authoredPages = [
  {
    source: "index.mdx",
    title: "Taroify",
    description: "轻量、可靠的小程序端 Taro React UI 组件库。",
    pageType: "home",
  },
  {
    source: "introduce/index.md",
    title: "介绍",
    description: "了解 Taroify 的设计目标、核心特性、生态与社区。",
  },
  {
    source: "quickstart/index.md",
    title: "快速上手",
    description: "安装 Taroify，并在 Taro 项目中按需引入组件和样式。",
  },
  {
    source: "contribution/index.md",
    title: "开发指南",
    description: "在本地开发、调试、测试并参与 Taroify 项目贡献。",
  },
  {
    source: "changelog/index.md",
    title: "更新日志",
    description: "查看 Taroify 各版本的新特性、问题修复与变更记录。",
  },
  {
    source: "cli/index.md",
    title: "CLI",
    description: "使用 Taroify CLI 离线查询组件、API、示例与主题变量。",
  },
  {
    source: "mcp/index.md",
    title: "MCP",
    description: "通过 Taroify MCP 为 AI 工具提供只读组件知识、资源与提示词。",
  },
  {
    source: "hooks/index.md",
    title: "Hooks",
    description: "了解 @taroify/hooks 提供的通用 React Hooks。",
  },
]

export const primaryNavigation = [
  {
    text: "指南",
    link: "/introduce/",
    activeMatch: "^/(introduce|quickstart|contribution|changelog)/",
  },
  {
    text: "组件",
    link: "/components/button/",
    activeMatch: "^/components/",
  },
  {
    text: "Hooks",
    link: "/hooks/",
    activeMatch: "^/hooks/",
  },
  {
    text: "AI 工具",
    link: "/cli/",
    activeMatch: "^/(cli|mcp)/",
  },
  {
    text: "React Vant",
    link: "https://react-vant.3lang.dev/",
  },
  {
    text: "Vant",
    link: "https://vant.pro/vant",
  },
]

export const guideSidebarItems = [
  { label: "介绍", link: "/introduce/" },
  { label: "快速上手", link: "/quickstart/" },
  { label: "开发指南", link: "/contribution/" },
  { label: "更新日志", link: "/changelog/" },
]

export const componentSidebarTags = {
  tour: "v1.0.0",
}
