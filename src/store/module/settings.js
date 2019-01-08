export default {
  state: {
    data: {
    }
  },
  getters: {
    settings: state => state.data
  },
  mutations: {
    setSettings (state, settings) {
      state.data = settings
    }
  }
}
