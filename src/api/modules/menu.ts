import { get } from '../request'

const ns = '/menus' // namespace

export const menuApi = {
  /**
   * 查询当前登录用户的授权菜单
   * @returns
   */
  getAuthMenu: () => {
    return get({ url: `${ns}/current` })
  }
}
