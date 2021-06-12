import { getPage } from '../request'
import { Pagination } from '@/typings'

const ns = '/roles' // namespace

export const roleApi = {
  /**
   * 查询角色列表
   * @param page
   * @param params
   * @returns
   */
  getRoles: (page: Pagination, params: object = {}) => {
    return getPage({ url: `${ns}/${page.pageNum}/${page.pageSize}`, params }, page)
  }
}
