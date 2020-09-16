import {
  basic,
  view,
  user
} from '@/layouts'
export const asyncRouterMap = [{
    path: '/',
    name: 'index',
    redirect: '/dashboard',
    component: basic,
    meta: {
      title: '首页'
    },
    children: [{
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/home/Index'),
        hidden: false,
        meta: {
          title: '首页',
          icon: 'home',
          permission: 'dashboard_index'
        }
      },
      {
        path: '/pageOne',
        name: 'pageOne',
        component: view,
        hidden: false,
        meta: {
          title: '第一页',
          icon: 'home',
          permission: 'dashboard_index'
        },
        children: [{
          path: '/pageOne/one',
          name: 'pageOne_one',
          component: () => import('@/views/pageOne/one'),
          meta: {
            title: '第一页_01',
            keepAlive: false,
            hiddenHeaderContent: true,
            permission: 'dashboard_index'
          }
        }]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export const constantRouterMap = [{
    path: '/user',
    component: user,
    redirect: '/user/login',
    hidden: true,
    children: [{
      path: 'login',
      name: 'login',
      component: () => import( /* webpackChunkName: "user" */ '@/views/user/Login')
    }, ]
  },
  {
    path: '/404',
    component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]