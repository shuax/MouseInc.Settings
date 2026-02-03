export default {
  state: {
    cfg: {
    },
    gestures: {
    }
  },
  getters: {
    cfg: state => state.cfg,
    gestures: state => state.gestures
  },
  mutations: {
    setSettings (state, settings) {
      // 版本兼容
      if (settings.cfg.OcrService === undefined) {
        settings.cfg.OcrService = 0
      }
      if (!settings.cfg.HotCorner) {
        settings.cfg.HotCorner = {
          'BottomLeft': {
            'Actions': [
              ['SendKeys', 'Win']
            ],
            'Name': '开始菜单',
            'Valid': true
          },
          'BottomRight': {
            'Actions': [
              ['SendKeys', 'Win+D']
            ],
            'Name': '显示桌面',
            'Valid': true
          },
          'Open': false,
          'TopLeft': {
            'Actions': [
              ['SendKeys', 'Win+Tab']
            ],
            'Name': '切换桌面',
            'Valid': true
          },
          'TopRight': {
            'Actions': [
              ['SendKeys', 'Alt+F4']
            ],
            'Name': '关闭程序',
            'Valid': false
          }
        }
      }
      state.cfg = settings.cfg
      state.gestures = settings.gestures
      state.gestures['WheelSwitchUp'] = state.gestures['placeholder']
      state.gestures['WheelSwitchDown'] = state.gestures['placeholder']
    },
    updateConfig (state, payload) {
      if (state.cfg && typeof state.cfg === 'object') {
        state.cfg[payload.key] = payload.value
      }
    }
  }
}
