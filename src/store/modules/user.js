import Vue from "vue";
import {
  login,
  getRoutesInfo
} from "../../api/login";
import {
  ACCESS_TOKEN
} from "@/store/mutation-types";

// import vue from 'vue'

const user = {
  state: {
    token: "",
    roles: [],
    info: {}
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_INFO: (state, info) => {
      state.info = info;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    }
  },

  actions: {
    Login({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(res => {
            if (res.result) {
              const result = res.data;
              Vue.ls.set(ACCESS_TOKEN, result.token, 24 * 60 * 60 * 1000);
              commit("SET_TOKEN", res.token);
              resolve(result);
            } else {
              reject(res.msg);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    GetRoutesInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getRoutesInfo()
          .then(res => {
            if (res.result) {
              const result = res.data;
              if (result.role && result.role.permissions.length > 0) {
                const roles = result.role;
                roles.permissions = result.role.permissions;
                roles.permissions.map(per => {
                  per.actionList = per.button_list.split(",");
                });
                roles.permissionList = roles.permissions.map(permission => {
                  return permission.permissionId;
                });
                console.log(result.role);
                commit("SET_ROLES", result.role);
                commit("SET_INFO", result);
              }
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};

export default user;