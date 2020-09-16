// import Vue from "vue";

const app = {
  state: {
    device: 'desktop',
    sidebar: true
  },
  mutations: {
    SET_SIDEBAR_TYPE: (state, type) => {
      state.sidebar = type
    },
    TOGGLE_DEVICE: (state, type) => {
      state.device = type
    }
  },
  actions: {
    setSidebar({
      commit
    }, type) {
      commit('SET_SIDEBAR_TYPE', type)
    }
  },
  setDevice({
    commit
  }, type) {
    commit('TOGGLE_DEVICE', type)
  }
}

export default app