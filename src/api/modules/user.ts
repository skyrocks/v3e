import { get, getPage, post } from '../request'
import { Pagination } from '@/typings'

const ns = '/users' // namespace

export const userApi = {
  /**
   * 查询用户列表
   * @param page
   * @param params
   * @returns
   */
  getUsers: (page: Pagination, params: object = {}) => {
    return getPage({ url: `${ns}/${page.pageNum}/${page.pageSize}`, params }, page)
  },

  /**
   * 获取用户照片流
   * @param userId
   * @returns
   */
  browserPhoto: (userId: string) => {
    return get(
      {
        url: `${ns}/photo/${userId}`,
        responseType: 'blob'
      },
      false
    )
  },

  /**
   * 添加用户角色
   * @param userId
   * @param roleIds
   * @returns
   */
  addRoles: (userId: string, roleIds: string[]) => {
    return post({
      url: `${ns}/create/roles/${userId}`,
      data: { roleIds: JSON.stringify(roleIds) }
    })
  },

  /**
   * 删除用户角色
   * @param userId
   * @param roleId
   * @returns
   */
  removeRole: (userId: string, roleId: string) => {
    return post({ url: `${ns}/delete/role/${roleId}/${userId}` })
  },

  /**
   * 验证账号,邮箱,手机号码是否存在
   *
   * @param {*} field
   * @param {*} value
   * @returns
   */
  validate(field: string, value: any, excludeUserId = '') {
    return get({
      url: `${ns}/validate/${field}/${value}`,
      params: { excludeUserId }
    })
  },

  /**
   * 更新用户信息
   *
   * @param {*} data
   * @returns
   */
  update(data: any) {
    return post({
      url: `${ns}/update`,
      data
    })
  },

  /**
   * 更新用户状态
   *
   * @param {*} userIds
   * @param {*} status
   * @returns
   */
  updateStatus(userIds: string[], status: number) {
    return post({
      url: `${ns}/update/status`,
      data: { userIds: JSON.stringify(userIds), status }
    })
  },

  /**
   * 更新用户密码
   *
   * @param {*} userIds
   * @param {*} pwd
   * @returns
   */
  updatePwd(userIds: string[], pwd: string) {
    return post({
      url: `${ns}/update/pwd`,
      data: { userIds: JSON.stringify(userIds), pwd }
    })
  },

  /**
   * 更新用户有效期
   *
   * @param {*} userIds
   * @param {*} expiry
   * @returns
   */
  updateExpiry(userIds: string[], expiry: string) {
    return post({
      url: `${ns}/update/expiry`,
      data: { userIds: JSON.stringify(userIds), expiry }
    })
  }
}
