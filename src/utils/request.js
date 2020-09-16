import axios from "axios";
import store from "@/store";
import Vue from "vue";
import {
  VueAxios
} from "./axios";
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000
});

const err = error => {
  if (error.response) {
    const data = error.response.data;
    const token = store.state.user.token || Vue.ls.get(ACCESS_TOKEN);
    if (error.response.status === 403) {
      console.log(data.message);
    }
    if (
      error.response.status === 401 &&
      !(data.resule && data.result.isLogin)
    ) {
      console.log("Authorization failed");
    }
    if (token) {
      console.log(token);
    }
  }
};

service.interceptors.request.use(config => {
  const token = store.state.user.token || Vue.ls.get(ACCESS_TOKEN);
  config.headers["platform"] = "jy";
  config.headers["version"] = process.env.VUE_APP_API_VERSION;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // 让每个请求携带自定义 token 请根据实际情况自行修改
    const userInfo = store.getters.userInfo;
    if (userInfo.id !== undefined) {
      if (config.data === undefined || !config.data) {
        config.data = {
          current_uid: userInfo.id
        };
      } else {
        config.data.current_uid = userInfo.id;
      }
    }
  }
  if (config.data) {
    // 处理请求
    if (config.data.pageNo) {
      config.data.pages = config.data.pageNo + ":" + config.data.pageSize;
    }
    if (config.data.sortField && config.data.orderby === undefined) {
      config.data.orderby =
        config.data.sortField +
        ":" +
        (config.data.sortOrder === "ascend" ? 0 : 1);
    }
    for (const key in config.data) {
      if (typeof config.data[key] === "string") {
        config.data[key] = config.data[key].trim();
      }
    }
  }
  console.log(config)
  return config;
}, err);

service.interceptors.response.use(response => {
  return response.data;
}, err);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service);
  }
};

function baseRequest(params) {
  return new Promise((resolve, reject) => {
    service(params)
      .then(res => {
        if (
          res.resule === true ||
          res.resule === "true" ||
          res.resule === "TRUE"
        ) {
          resolve(res);
        } else {
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

function request(params) {
  return baseRequest(params);
}

request.post = function (getParams) {
  return baseRequest({
    ...getParams,
    method: "post"
  });
};
request.get = function (getParams) {
  return baseRequest({
    ...getParams,
    method: "get"
  });
};

export {
  installer as VueAxios, service as axios, request
};