// eslint-disable-next-line import/no-commonjs
module.exports = (ctx) => {
  ctx.modifyComponentConfig(({ componentConfig }) => {
    if (process.env.TARO_ENV !== "h5") {
      componentConfig.includeAll = true
    }
  })
}
