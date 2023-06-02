// store.js

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isLoginIn: false, // 初始登录状态
  },
  getters: {
    isLoginIn(state) {
      return state.isLoginIn;
    },
  },
  mutations: {
    setLoginStatus(state, isLoginIn) {
      state.isLoginIn = isLoginIn;
    },
  },
});

export default store;