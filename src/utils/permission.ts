import router from '@/router'
import store from '@/store'

export const permission = {
  /**
   * 判断是否具有权限
   * @param action 权限标识
   * @param menuId 可选参数, 可以指定menuId, 如果不指定获取当前页面路由
   * @returns boolean
   */
  has(action: string, menuId?: string) {
    if (!action) {
      return true
    }

    const currentRoute = router.currentRoute.value

    let currentFuncKeys: string[] = []
    if (menuId) {
      currentFuncKeys = store.getters['menu/menuIndex'][menuId]?.funcKeys
    } else {
      currentFuncKeys = currentRoute.meta?.funcKeys as string[]
    }

    const has = currentFuncKeys.includes(action)

    return has
  }
}
