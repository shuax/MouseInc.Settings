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
    }
  }
}
