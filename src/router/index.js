import Vue from 'vue'
import Router from 'vue-router'
import {
  constantRouterMap
} from '@/config/router.config'

Vue.use(Router)

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

console.log(constantRouterMap)
export default new Router({
  mode: 'history', // url模式（History, Hash, abstract）
  base: process.env.BASE_URL, // 应用的基路径
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})