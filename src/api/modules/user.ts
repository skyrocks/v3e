import { get, getPage } from '../request'
import { Pagination } from '@/typings'

const ns = '/users' // namespace

export const userApi = {
  getUsers: (page: Pagination, params: any = {}) => {
    return getPage({ url: `${ns}/${page.pageNum}/${page.pageSize}`, params }, page)
  },

  browserPhoto: (userId: string) => {
    return get({
      url: `${ns}/photo/${userId}`,
      responseType: 'blob'
    })
  }
}
