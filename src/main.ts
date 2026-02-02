import { createApp } from 'vue'
import type { App as VueApp } from 'vue'
import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'
import ClipboardJS from 'clipboard'

import App from './App.vue'
import router from './router'
import store from './store'
import { localRead } from './libs/util'
import './index.less'
import './styles/common.less'
import './scrollbar.css'
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'

import zhCN from './locale/lang/zh-CN'
import zhTW from './locale/lang/zh-TW'
import enUS from './locale/lang/en-US'

// 从 localStorage 读取用户设置的语言，如果没有则使用默认值
let savedLocale = localRead('local') || 'zh-CN'

// 修正可能的错误的语言代码
if (savedLocale === 'en') {
  savedLocale = 'en-US'
} else if (savedLocale === 'zh') {
  savedLocale = 'zh-CN'
}

// 确保语言代码在支持列表中
const supportedLocales = ['zh-CN', 'zh-TW', 'en-US']
if (!supportedLocales.includes(savedLocale)) {
  savedLocale = 'zh-CN'
}

export const i18n: I18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS
  }
})

const app: VueApp = createApp(App)

app.use(store)
app.use(router)
app.use(i18n)

app.config.globalProperties.$t = i18n.global.t
app.config.globalProperties.Clipboard = ClipboardJS

app.mount('#app')