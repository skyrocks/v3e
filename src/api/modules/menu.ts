import { get } from '../request'

const ns = '/menus' // namespace

export const menuApi = {
  getAuthMenu: () => {
    return get({ url: `${ns}/current` })
  }
}
