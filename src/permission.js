import Vue from 'vue'
import router from './router'
import store from './store'

import {
  ACCESS_TOKEN
} from '@/store/mutation-types'

const defaultRoutePath = '/dashboard'

const whiteList = ['login', 'register', 'registerResult'] // 跳转白名单

router.beforeEach((to, from, next) => {
  const token = store.state.user.token || Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    if (to.path === '/user/login') {
      next({
        path: defaultRoutePath
      })
    } else {
      if (store.getters.roles.length === 0) {
        store
          .dispatch('GetRoutesInfo')
          .then(res => {
            const roles = res.data.role
            store.dispatch('GenerateRoutes', {
              roles
            }).then(() => {
              router.options.routes = store.getters.addRouters;
              router.addRoutes(store.getters.addRouters)
              // router.options.routes = store.getters.routers
              const redirect = decodeURIComponent(from.params.redirect || to.path)
              if (to.path === redirect) {
                next({
                  ...to,
                  replace: true
                })
              } else {
                next({
                  path: redirect
                })
              }
            })
          })
      } else {
        next()
      }
    }
  } else {
    console.log(to)
    if (whiteList.includes(to.name)) {
      next()
    } else {
      next({
        path: '/user/login'
      })
    }
  }
})

router.afterEach(() => {
  console.log('22222222222')
})