import {
  asyncRouterMap,
  constantRouterMap
} from '@/config/router.config'

function filterAsyncRouter(routerMap, roles) {
  const accessedRouters = routerMap.filter(route => {
    let hasPermission = true
    if (route.meta && route.meta.permission) {
      hasPermission = roles.permissionList.includes(route.meta.permission)
    }
    if (hasPermission) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        const {
          roles
        } = data
        const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  },

}

export default permission