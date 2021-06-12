import { Role } from '@/views/role/type'

export interface User extends Object {
  userId: string
  userCode: string
  userName: string
  loginName: string
  userStatus: number
  userType: number
  cellphone: string
  email: string
  expiryDate: string
  roles: Role[]
  existsPhoto?: boolean
}
