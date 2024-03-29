// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import i18n from '@/locale'
import config from '@/config'
// import importDirective from '@/directive'
// import { directive as clickOutside } from 'v-click-outside-x'
// import installPlugin from '@/plugin'
import './index.less'
import './scrollbar.css'
// require('babel-polyfill')
// import '@/assets/icons/iconfont.css'
// import TreeTable from 'tree-table-vue'
// import VOrgTree from 'v-org-tree'
// import 'v-org-tree/dist/v-org-tree.css'
// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

import clipboard from 'clipboard'

Vue.prototype.Clipboard = clipboard

import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

import 'codemirror/mode/javascript/javascript.js'
// theme css
// active-line.js
import 'codemirror/addon/selection/active-line.js'
// styleSelectedText
// import 'codemirror/addon/selection/mark-selection.js'
// import 'codemirror/keymap/sublime.js'
Vue.use(VueCodemirror, /* {
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */)

Vue.use(ViewUI, {
  i18n: (key, value) => i18n.t(key, value)
})
// Vue.use(TreeTable)
// Vue.use(VOrgTree)
/**
 * @description 注册admin内置插件
 */
// installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/**
 * 注册指令
 */
// importDirective(Vue)
// Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
