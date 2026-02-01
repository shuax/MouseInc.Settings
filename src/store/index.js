import { createStore } from 'vuex'
import { localSave, localRead, getBreadCrumbList, getMenuByRouter } from '@/libs/util'
import routers from '@/router/routers'

// 版本兼容处理
const handleVersionCompat = (settings) => {
  if (settings.cfg.OcrService === undefined) {
    settings.cfg.OcrService = 0
  }
  if (!settings.cfg.HotCorner) {
    settings.cfg.HotCorner = {
      'BottomLeft': {
        'Actions': [['SendKeys', 'Win']],
        'Name': '开始菜单',
        'Valid': true
      },
      'BottomRight': {
        'Actions': [['SendKeys', 'Win+D']],
        'Name': '显示桌面',
        'Valid': true
      },
      'Open': false,
      'TopLeft': {
        'Actions': [['SendKeys', 'Win+Tab']],
        'Name': '切换桌面',
        'Valid': true
      },
      'TopRight': {
        'Actions': [['SendKeys', 'Alt+F4']],
        'Name': '关闭程序',
        'Valid': false
      }
    }
  }
  return settings
}

export default createStore({
  state: {
    breadCrumbList: [],
    local: localRead('local'),
    cfg: {},
    gestures: {}
  },

  getters: {
    breadCrumbList: state => state.breadCrumbList,
    local: state => state.local,
    menuList: state => getMenuByRouter(routers),
    cfg: state => state.cfg,
    gestures: state => state.gestures
  },

  mutations: {
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route)
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    setSettings (state, settings) {
      const compatSettings = handleVersionCompat(settings)
      state.cfg = compatSettings.cfg
      state.gestures = compatSettings.gestures
      // 添加 WheelSwitch 手势
      if (state.gestures.placeholder) {
        state.gestures.WheelSwitchUp = state.gestures.placeholder
        state.gestures.WheelSwitchDown = state.gestures.placeholder
      }
    }
  },

  actions: {
    setBreadCrumb ({ commit }, route) {
      commit('setBreadCrumb', route)
    },
    setLocal ({ commit }, lang) {
      commit('setLocal', lang)
    },
    setSettings ({ commit }, settings) {
      commit('setSettings', settings)
    }
  }
})
