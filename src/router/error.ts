import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import(/* webpackChunkName: "404" */ '@/views/error/404.vue'),
  redirect: '/error/404'
}

export const errorRoute: RouteRecordRaw = {
  path: '/error',
  name: 'Error',
  component: Layout,
  redirect: '/error/404',
  children: [
    {
      path: '404',
      name: 'Error404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/error/404.vue'),
      meta: { title: '错误' }
    }
  ]
}

export const errorRoutes: Array<RouteRecordRaw> = [notFoundRoute, errorRoute]
