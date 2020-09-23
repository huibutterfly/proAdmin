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
        path: '/purchase',
        name: 'purchase',
        component: view,
        meta: { title: '采购管理', keepAlive: true, icon: 'bxAnaalyse', permission: 'purchase' },
        children: [
          {
            path: '/purchase/supplier',
            name: 'purchase_supplierDetail',
            component: () => import('@/views/purchase/supplier/Supplier'),
            meta: { title: '供应商档案', keepAlive: false, hiddenHeaderContent: true, permission: 'purchase_supplierDetail' }
          }
        ]
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