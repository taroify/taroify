// eslint-disable-next-line import/no-commonjs
const path = require("node:path")

const workspaceSourceDirs = ["commerce", "core", "hooks", "icons"].map((name) =>
  path.resolve(__dirname, `../../${name}/src`),
)

const taroRouterPath = path.resolve(
  __dirname,
  "../node_modules/@tarojs/router/dist/index.esm.js",
)

const config = {
  compiler: "webpack5",
  projectName: "@taroify/demo",
  date: "2021-3-9",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: `dist/${process.env.TARO_ENV}`,
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: "react",
  mini: {
    compile: {
      include: workspaceSourceDirs,
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  h5: {
    webpackChain(chain) {
      chain.resolve.alias.set("@tarojs/router$", taroRouterPath)
    },
    compile: {
      include: workspaceSourceDirs,
    },
    esnextModules: ["@taroify"],
    publicPath: process.env.NODE_ENV === "development" ? "/" : "/taroify.com/h5",
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    devServer: {
      open: false
    },
    output: {
      filename: "js/[name].[hash:8].js",
      chunkFilename: "chunk/[name].[chunkhash:8].js",
    },
    miniCssExtractPluginOption: {
      filename: "css/[name].[hash:8].css",
      chunkFilename: "chunk/[name].[chunkhash:8].css",
    },
  },
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"))
  }
  return merge({}, config, require("./prod"))
}
