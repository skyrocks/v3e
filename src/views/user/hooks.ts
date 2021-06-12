import { User } from './type'
import { validator } from '@/utils'
import { userApi } from '@/api/modules/user'

export function userHooks() {
  let currentUser: User
  const setUser = (user: User) => {
    currentUser = user
  }

  const emptyUser = () => {
    const user: User = {
      userId: '',
      userCode: '',
      userName: '',
      loginName: '',
      userStatus: 1,
      userType: 0,
      cellphone: '',
      email: '',
      expiryDate: '',
      roles: [],
      existsPhoto: false
    }
    return user
  }

  const filters = {
    userType: [
      { text: '学生', value: '1' },
      { text: '教职工', value: '2' },
      { text: '虚拟账号', value: '0' }
    ],
    userStatus: [
      { text: '启用', value: '1' },
      { text: '禁用', value: '0' }
    ]
  }

  const formatUserType = (val: number) => {
    if (val === 1) {
      return '学生'
    } else if (val === 2) {
      return '教职工'
    } else {
      return '虚拟账号'
    }
  }

  const formatUserStatus = (val: number) => {
    if (val === 1) {
      return '启用'
    } else {
      return '禁用'
    }
  }

  const validate = {
    loginNameExists: (rule: any, value: string, callback: (err?: Error) => void) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        userApi.validate('loginName', value, currentUser?.userId).then(res => {
          if (res.success) {
            if (res.data) {
              callback(new Error('账号已存在'))
            } else {
              callback()
            }
          }
        })
      }
    },
    cellphoneExists: (rule: any, value: string, callback: (err?: Error) => void) => {
      if (value !== '') {
        if (!validator.isCellphone(value)) {
          callback(new Error('请输入有效手机号码'))
        } else {
          userApi.validate('cellphone', value, currentUser?.userId).then(res => {
            if (res.success) {
              if (res.data) {
                callback(new Error('手机号码已存在'))
              } else {
                callback()
              }
            }
          })
        }
      } else {
        callback()
      }
    },
    emailExists: (rule: any, value: string, callback: (err?: Error) => void) => {
      if (value !== '') {
        if (!validator.isEmail(value)) {
          callback(new Error('请输入邮箱地址'))
        } else {
          userApi.validate('email', value, currentUser?.userId).then(res => {
            if (res.success) {
              if (res.data) {
                callback(new Error('邮箱地址已存在'))
              } else {
                callback()
              }
            }
          })
        }
      } else {
        callback()
      }
    }
  }

  return { emptyUser, filters, formatUserType, formatUserStatus, validate, setUser }
}
