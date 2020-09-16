const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const prodExternals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios'
}

function isProd() {
  return process.env.NODE_ENV === 'production'
}

const vueConfig = {
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    // if prod is on, add externals
    externals: isProd() ? prodExternals : {}
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => { //匹配到所有需要导入的文件
      config.module.rule('sass').oneOf(type).use('style-resource')
        .loader('style-resources-loader')
        .options({
          patterns: [
            path.resolve(__dirname, 'src/css/base.scss')
          ]
        })
    })

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('transform-loader')
      .loader('transform-loader')
      .end()
      .end()
      .oneOf('external')
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },

  css: {
    loaderOptions: {
      sass: {
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: process.env.VUE_APP_PORT,
    proxy: {
      [process.env.VUE_APP_API_BASE_URL]: {
        target: process.env.VUE_APP_API_HOST,
        ws: false,
        changeOrigin: true
      }
    }
  },

}

module.exports = vueConfig