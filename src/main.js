import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ClipboardJS from 'clipboard'

import App from './App.vue'
import router from './router'
import store from './store'
import './index.less'
import './scrollbar.css'

import zhCN from './locale/lang/zh-CN'
import zhTW from './locale/lang/zh-TW'
import enUS from './locale/lang/en-US'

import VueCodemirror from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS
  }
})

const app = createApp(App)

// 注册所有图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)
app.use(router)
app.use(i18n)

app.use(VueCodemirror, {
  placeholder: '',
  extensions: [javascript(), oneDark]
})

app.config.globalProperties.$t = i18n.global.t
app.config.globalProperties.Clipboard = ClipboardJS

app.mount('#app')
