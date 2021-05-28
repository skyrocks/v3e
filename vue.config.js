// const path = require('path')
// const resolve = dir => path.join(__dirname, dir)

const CompressionPlugin = require('compression-webpack-plugin')

const title = 'Vue3 Element Plus'

module.exports = {
  publicPath: process.env.BASE_URL,
  outputDir: process.env.VUE_OUTPUT_DIR,
  assetsDir: 'static',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/styles/variables.scss"; @import "@/styles/index.scss";'
      },
      less: {
        javascriptEnabled: true
      }
    }
  },

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = title
      return args
    })
  },

  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionPlugin({
            test: /\.js$|\.css$/,
            threshold: 0,
            deleteOriginalAssets: true
          })
        ]
      }
    }
  },

  devServer: {
    port: 8888,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  }
}
