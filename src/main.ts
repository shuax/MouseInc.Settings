import { createApp } from 'vue'
import type { App as VueApp } from 'vue'
import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ClipboardJS from 'clipboard'

import App from './App.vue'
import router from './router'
import store from './store'
import { localRead } from './libs/util'
import './index.less'
import './styles/common.less'
import './scrollbar.css'

import zhCN from './locale/lang/zh-CN'
import zhTW from './locale/lang/zh-TW'
import enUS from './locale/lang/en-US'

import VueCodemirror from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

// 从 localStorage 读取用户设置的语言，如果没有则使用默认值
const savedLocale = localRead('local') || 'zh-CN'

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
