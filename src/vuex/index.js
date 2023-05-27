import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const stateModule = {
  state: {
    mode: 'sandbox' // 默认为沙盒模式
  },
  mutations: {
    setMode(state, mode) {
      state.mode = mode;
    }
  },
  actions: {
    setMode({ commit }, mode) {
      commit('setMode', mode);
    }
  }
};

export default new Vuex.Store({
  modules: {
    state: stateModule
  }
});
