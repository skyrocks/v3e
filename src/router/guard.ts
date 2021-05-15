import { Router } from 'vue-router'
import store from '@/store'
import { token as t, log } from '@/utils'
import { addDynamicRoute } from './dynamic'
import 'nprogress/css/nprogress.css' // 进度条样式
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const loginPath = '/login' // 登录页面路由地址
const homePath = '/dashboard' // 主页页面路由地址
const whiteList = ['/login', '/404'] // 不需要token的白名单

export const createGuard = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const token = t.get()
    if (token) {
      if (to.path === loginPath) {
        // 有token, 不可重复登录，跳回主页
        next({ path: homePath })
        NProgress.done()
      } else {
        if (store.getters.user || whiteList.includes(to.path)) {
          // 有token, 已获得登录用户或者在免登录名单白名单, 直接进入目标页
          next()
        } else {
          // 有token, 未获得登录用户, 先获取登录用户
          await store.dispatch('auth/getProfile')

          if (store.getters.user) {
            // 有token, 获取菜单数据
            await store.dispatch('menu/findAuthMenu')

            // 创建动态路由,首页的菜单也是基于此路由构建
            addDynamicRoute()

            // 重定向到当前地址
            next({ ...to, replace: true })
          } else {
            // 有token, 获取登录用户失败, 可能是token失效, 跳回登录页
            t.remove()
            next({ path: loginPath, query: { redirect: to.fullPath }, replace: true })
            NProgress.done()
          }
        }
      }
    } else {
      if (whiteList.includes(to.path)) {
        // 没有token, 在免登录名单白名单，直接进入
        next()
      } else {
        // 没有token, 不在免登录名单白名单, 跳回登录页
        next({ path: loginPath, query: { redirect: to.fullPath }, replace: true })
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  })

  router.afterEach(to => {
    if (!whiteList.includes(to.path)) {
      log.route(to)
    }
    NProgress.done()
  })
}
