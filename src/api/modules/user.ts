import { get } from '../request'

const ns = '/users' // namespace

export const userApi = {
  getUser: (params: {}) => {
    return get({ url: `${ns}/0/50`, params })
  },

  browserPhoto: (userId: string) => {
    return get({
      url: `${ns}/photo/${userId}`,
      responseType: 'blob'
    })
  }
}
