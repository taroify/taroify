import path from "node:path"
import { defineConfig } from "@rspress/core"
import { pluginAlgolia } from "@rspress/plugin-algolia"
import { pluginSitemap } from "@rspress/plugin-sitemap"

const base = process.env.TAROIFY_SITE_BASE || "/"

export default defineConfig({
  root: path.join(__dirname, ".generated/docs"),
  outDir: path.join(__dirname, "doc_build"),
  title: "Taroify",
  description: "轻量、可靠的小程序端 Taro React UI 组件库",
  lang: "zh",
  base,
  siteOrigin: "https://taroify.com",
  llms: true,
  icon: "/favicon.svg",
  logo: "/logo.svg",
  logoText: "Taroify",
  mediumZoom: {
    selector: ".rspress-doc img:not(.taroify-no-zoom)",
  },
  search: {
    codeBlocks: true,
  },
  markdown: {
    defaultCodeOverflow: {
      height: 420,
      behavior: "fold",
    },
  },
  plugins: [
    pluginAlgolia(),
    pluginSitemap({
      defaultChangeFreq: "weekly",
    }),
  ],
  head: [
    ["meta", { name: "theme-color", content: "#0c1713" }],
    ["meta", { name: "color-scheme", content: "light dark" }],
    ["link", { rel: "manifest", href: `${base}manifest.webmanifest` }],
    [
      "script",
      {
        defer: "",
        src: "https://hm.baidu.com/hm.js?53df1d7fd1cfda80d49b45121c1c939c",
      },
    ],
  ],
  themeConfig: {
    darkMode: "auto",
    enableContentAnimation: true,
    enableAppearanceAnimation: false,
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/taroify/taroify",
      },
    ],
  },
})
