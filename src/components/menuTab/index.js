import events from './events'
import menuTab from './menuTab'
import './index.less'

const api = {

}

menuTab.install = function(Vue){
  if (Vue.prototype.$menuTab) {
    return
  }
  api.instance = events
  Vue.prototype.$menuTab = api
  Vue.component('menu-tab', menuTab)
}

export default menuTab