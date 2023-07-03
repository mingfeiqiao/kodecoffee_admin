// store.js

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isLoginIn: false, // 初始登录状态
    guide_step:0,
  },
  getters: {
    isLoginIn(state) {
      return state.isLoginIn;
    },
    guide_step(state){
      return state.guide_step;
    }
  },
  mutations: {
    setLoginStatus(state, isLoginIn) {
      state.isLoginIn = isLoginIn;
    },
    setGuideStep(state, step) {
      state.guide_step = step;
    }
  },
});

export default store;