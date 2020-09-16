import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import permission from './modules/permission'
import app from './modules/app'



Vue.use(Vuex);

import getters from "./getters";

export default new Vuex.Store({
  modules: {
    user,
    permission,
    app
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})