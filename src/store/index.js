import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VuexPersistence from "vuex-persist";
import Cookies from "js-cookie";
Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage,
});

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  state: {
    token: null,
    role: "",
    name:''
  },
  mutations: {
    setLogin(state, payload) {
      state.token = payload.token;
      state.role = payload.role;
      state.name = payload.name
    },
    setLogout(state) {
      state.token = null;
      state.role = "";
    },
  },
  actions: {
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        try {
          axios.defaults.headers.common.Authorization =
            "Bearer" + " " + payload.token;
          Cookies.set("token", "Bearer" + " " + payload.token);
          commit("setLogin", payload);
          resolve("done");
        } catch (error) {
          reject(error);
        }
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          axios.defaults.headers.common.Authorization = null;
          Cookies.remove("token");
          commit("setLogout");
          resolve("done");
        } catch (error) {
          reject(error);
        }
      });
    },
  },
  modules: {},
});
