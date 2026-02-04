// import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import { forEach, objEqual } from '@/libs/tools'
import type { AppRoute, MenuItem, ShowTitleOptions } from '@/types'

const { title } = config

// export const TOKEN_KEY = 'token'

// export const setToken = (token) => {
//   Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
// }

// export const getToken = () => {
//   const token = Cookies.get(TOKEN_KEY)
//   if (token) return token
//   else return false
// }

export const hasChild = (item: MenuItem): boolean => {
  return !!(item.children && item.children.length !== 0)
}

const showThisMenuEle = (): boolean => {
  return true
  // if (item.meta && item.meta.access && item.meta.access.length) {
  //   if (hasOneOf(item.meta.access, access)) return true
  //   else return false
  // } else return true
}

export const getMenuByRouter = (list: AppRoute[], access: string[]): MenuItem[] => {
  const res: MenuItem[] = []
  forEach(list, (item: AppRoute) => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      const obj: MenuItem = {
        name: item.name || '',
        path: item.path,
        meta: item.meta
      }
      if ((hasChild(item as MenuItem) || item.meta?.showAlways) && showThisMenuEle(item as MenuItem, access)) {
        obj.children = getMenuByRouter(item.children || [], access)
      }
      if (item.meta?.href) obj.href = item.meta.href
      res.push(obj)
    }
  })
  return res
}

export const getBreadCrumbList = (route: { matched?: Array<{ name?: string; meta?: RouteMeta }> }, homeRoute?: AppRoute): MenuItem[] => {
  const routeMetched = route.matched || []
  
  // 如果没有提供 homeRoute，只返回非首页的面包屑
  if (!homeRoute) {
    const res: MenuItem[] = []
    for (const item of routeMetched) {
      if (item && item.meta && item.meta.title) {
        const meta = { ...item.meta }
        const obj: MenuItem = {
          name: item.name || '',
          meta: meta
        }
        res.push(obj)
      }
    }
    return res
  }
  
  const homeItem: MenuItem = {
    name: homeRoute.name || '',
    path: homeRoute.path,
    meta: { ...homeRoute.meta, icon: homeRoute.meta?.icon }
  }
  
  // 检查是否应该返回首页
  if (routeMetched.some((item: { name?: string }) => item && item.name === homeRoute.name)) {
    return [homeItem]
  }
  
  // 过滤和映射有效的路由项
  const res: MenuItem[] = []
  for (const item of routeMetched) {
    if (item && item.meta && item.meta.title) {
      const meta = { ...item.meta }
      const obj: MenuItem = {
        name: item.name || '',
        meta: meta
      }
      res.push(obj)
    }
  }
  
  res.unshift(homeItem)
  return res
}

export const getHomeRoute = (routers: AppRoute[], homeName = 'home'): AppRoute | undefined => {
  let i = -1
  const len = routers.length
  let homeRoute: AppRoute | undefined
  while (++i < len) {
    const item = routers[i]
    if (item.children && item.children.length) {
      const res = getHomeRoute(item.children, homeName)
      if (res) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

export const showTitle = (item: MenuItem, vm?: ShowTitleOptions): string => {
  const { title } = item.meta || {}
  if (!title) return ''
  
  // 启用多语言支持
  if (title.includes('{{') && title.includes('}}')) {
    return title.replace(/({{[\s\S]+?}})/, (m, str) => str.split(/[{}]/)[1].trim().replace(/\./g, '-'))
  } else if (item.meta?.__titleIsFunction__) {
    return (item as MenuItem & { __titleIsFunction__: (_vm?: ShowTitleOptions) => string }).__titleIsFunction__(vm)
  } else {
    // 使用 i18n 翻译
    return (vm && (vm as ShowTitleOptions).$t) ? (vm as ShowTitleOptions).$t(title) : title
  }
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list: MenuItem[], route: AppRoute): AppRoute => {
  let res = {} as AppRoute
  if (list.length === 2) {
    res = getHomeRoute([route]) || {} as AppRoute
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2] as unknown as AppRoute
    else res = list[index + 1] as unknown as AppRoute
  }
  return res
}

export const routeEqual = (route1: MenuItem, route2: AppRoute): boolean => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

export const localSave = (key: string, value: string): void => {
  localStorage.setItem(key, value)
}

export const localRead = (key: string): string => {
  return localStorage.getItem(key) || ''
}

// scrollTop animation
export const scrollTop = (el: HTMLElement | Window, from = 0, to: number, duration = 500, endCallback?: () => void): void => {
  if (!window.requestAnimationFrame) {
    (window as Window & typeof globalThis & { webkitRequestAnimationFrame?: FrameRequestCallback, mozRequestAnimationFrame?: FrameRequestCallback, msRequestAnimationFrame?: FrameRequestCallback }).requestAnimationFrame = (
      (window as Window & typeof globalThis & { webkitRequestAnimationFrame?: FrameRequestCallback, mozRequestAnimationFrame?: FrameRequestCallback, msRequestAnimationFrame?: FrameRequestCallback }).webkitRequestAnimationFrame ||
      (window as Window & typeof globalThis & { webkitRequestAnimationFrame?: FrameRequestCallback, mozRequestAnimationFrame?: FrameRequestCallback, msRequestAnimationFrame?: FrameRequestCallback }).mozRequestAnimationFrame ||
      (window as Window & typeof globalThis & { webkitRequestAnimationFrame?: FrameRequestCallback, mozRequestAnimationFrame?: FrameRequestCallback, msRequestAnimationFrame?: FrameRequestCallback }).msRequestAnimationFrame ||
      function (callback: () => void) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  const scroll = (start: number, end: number, stepNum: number): void => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + stepNum > end) ? end : start + stepNum
    if (start > end) {
      d = (start - stepNum < end) ? end : start - stepNum
    }

    if (el === window) {
      (el as Window).scrollTo(d, d)
    } else {
      (el as HTMLElement).scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, stepNum))
  }
  scroll(from, to, step)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = (url: string): Record<string, string> => {
  const keyValueArr = url.split('?')[1]?.split('&') || []
  const paramObj: Record<string, string> = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextName = (list: MenuItem[], name: string): string => {
  let res = ''
  if (list.length === 2) {
    res = 'home'
  } else {
    const index = list.findIndex(item => item.name === name)
    if (index === list.length - 1) res = list[list.length - 2].name
    else res = list[index + 1].name
  }
  return res
}

export const findNodeUpper = (ele: HTMLElement, tag: string): HTMLElement | null => {
  if (ele.parentNode) {
    if ((ele.parentNode as HTMLElement).tagName === tag.toUpperCase()) {
      return ele.parentNode as HTMLElement
    } else {
      return findNodeUpper(ele.parentNode as HTMLElement, tag)
    }
  }
  return null
}

export const findNodeUpperByClasses = (ele: HTMLElement, classes: string[]): HTMLElement | null => {
  const parentNode = ele.parentNode as HTMLElement
  if (parentNode) {
    const classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
  return null
}

export const findNodeDownward = (ele: HTMLElement, tag: string): HTMLElement | null => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes && ele.childNodes.length) {
    let i = -1
    const len = ele.childNodes.length
    while (++i < len) {
      const child = ele.childNodes[i] as HTMLElement
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
  return null
}

export const showByAccess = (): boolean => {
  return true // hasOneOf(canAccess, access)
}

export const getRouteTitleHandled = (route: AppRoute): AppRoute => {
  const router = { ...route }
  const meta: AppRoute['meta'] = { ...(route.meta || {}) }
  let title = ''
  if (meta?.title) {
    if (typeof meta.title === 'function') {
      ;(meta as RouteMeta & { __titleIsFunction__?: boolean }).__titleIsFunction__ = true
      title = (meta.title as (_r: AppRoute) => string)(router)
    } else title = meta.title as string
  }
  if (meta) {
    meta.title = title
    router.meta = meta
  }
  return router
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem: AppRoute, vm?: ShowTitleOptions): void => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const menuItem: MenuItem = {
    name: handledRoute.name || '',
    path: handledRoute.path,
    meta: handledRoute.meta
  }
  const pageTitle = showTitle(menuItem, vm)
  const resTitle = pageTitle ? `${pageTitle} - ${title}` : title

  window.document.title = resTitle
}

/**
 * 轻量级 JSON 语法高亮 - 单次分词扫描版
 */
export const highlightJSON = (json: string | object): string => {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2)
  }
  
  // 1. 先进行基础 HTML 转义
  const escaped = (json as string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 2. 使用单次正则匹配所有 JSON 标记 (字符串/Key, 布尔/Null, 数字, 标点)
  // 这个正则保证了匹配的唯一性，字符串内部的内容不会被再次匹配
  const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|([\{\}\[\]]|[,:]))/g

  return escaped.replace(regex, (match) => {
    let cls = 'hl-punc'
    if (match.startsWith('"')) {
      if (match.endsWith(':')) {
        return `<span class="hl-key">${match.slice(0, -1)}</span><span class="hl-punc">:</span>`
      }
      cls = 'hl-val'
    } else if (/true|false/.test(match)) {
      cls = 'hl-bool'
    } else if (match === 'null') {
      cls = 'hl-null'
    } else if (/[0-9]/.test(match)) {
      cls = 'hl-num'
    } else if (/[\[\]\{\}]/.test(match)) {
      cls = 'hl-bracket'
    }
    return `<span class="${cls}">${match}</span>`
  })
}