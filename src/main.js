import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import VueStorage from 'vue-ls'
import defaultSettings from './config/defaultSetting'
import {
  VueAxios,
  request
} from './utils/request'

import './permission'
import './element'
import './global.less'
import menuTab from '@/components/menuTab'

Vue.config.productionTip = false
Vue.prototype.$request = request

Vue.use(VueAxios)
Vue.use(menuTab)
Vue.use(VueStorage, defaultSettings.storageOptions)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')