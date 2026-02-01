// 注意：Vue 3 项目中 i18n 配置已迁移到 main.js
// 此文件保留用于兼容，但实际配置在 main.js 中使用 createI18n
// view-design 已被移除，语言包仅使用自定义的

import { localRead } from '@/libs/util'
import customZhCn from './lang/zh-CN'
import customZhTw from './lang/zh-TW'
import customEnUs from './lang/en-US'

// 自动根据浏览器系统语言设置语言
const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US' || navLang === 'zh-TW') ? navLang : false
const lang = localRead('local') || localLang || 'zh-CN'

// 仅使用自定义语言包
const messages = {
  'zh-CN': customZhCn,
  'zh-TW': customZhTw,
  'en-US': customEnUs
}

// 导出配置供其他模块使用
export const i18nConfig = {
  locale: lang,
  messages
}

export default i18nConfig
