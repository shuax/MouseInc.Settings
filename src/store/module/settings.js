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
      state.cfg = settings.cfg
      state.gestures = settings.gestures
      state.gestures['WheelSwitchUp'] = state.gestures['placeholder']
      state.gestures['WheelSwitchDown'] = state.gestures['placeholder']
    }
  }
}
