const path = require('path')

const resolve = dir => {
  console.log(path.join(__dirname, dir))
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/mouseinc'
  : '/'

let configureWebpack = {}

const externals = {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'vue-i18n': 'VueI18n',
  'axios': 'axios',
  'js-beautify': 'beautifier',
  'iview': 'iview',
  'codemirror': 'codemirror',
  'vue-codemirror': 'VueCodemirror'
}

if (process.env.NODE_ENV === 'production') {
  configureWebpack.externals = externals
}

const cdn = {
  css: [
    'https://cdn.jsdelivr.net/npm/iview/dist/styles/iview.css',
    'https://cdn.jsdelivr.net/npm/codemirror/lib/codemirror.css'
  ],
  js: [
    'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js',
    'https://cdn.jsdelivr.net/npm/vue-router/dist/vue-router.min.js',
    'https://cdn.jsdelivr.net/npm/vuex/dist/vuex.min.js',
    'https://cdn.jsdelivr.net/npm/vue-i18n/dist/vue-i18n.min.js',
    'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
    'https://cdn.jsdelivr.net/npm/js-beautify/js/lib/beautifier.min.js',
    'https://cdn.jsdelivr.net/npm/iview/dist/iview.min.js',
    'https://cdn.jsdelivr.net/npm/codemirror/lib/codemirror.js',
    'https://cdn.jsdelivr.net/npm/codemirror/mode/javascript/javascript.js',
    'https://cdn.jsdelivr.net/npm/codemirror/addon/selection/active-line.js',
    'https://cdn.jsdelivr.net/npm/vue-codemirror/dist/vue-codemirror.min.js'
  ]
}

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  configureWebpack,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        if (process.env.NODE_ENV === 'production') {
          args[0].cdn = cdn
        }
        return args
      })
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  css: {
    extract: false
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  // devServer: {
  //   proxy: 'localhost:3000'
  // }
}
