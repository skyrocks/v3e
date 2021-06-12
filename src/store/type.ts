export const newId = 'newId'

export interface User {
  userStatus: number
  loginName: string
  cellphone: string
  photo: string
  userType: number
  userName: string
  userId: string
  userCode: string
  email: string
}
export interface Menu {
  menuId: string
  menuName: string
  path: string
  component: string
  parentId: string
  iconClass: string
  hidden: number
  funcKeys: string
  children: Menu[]
  affix: boolean
}

export interface RouteMeta {
  title: string
  affix: boolean
  noCache: boolean
}

export interface Tag {
  fullPath: string
  path: string
  name: string
  meta: RouteMeta
}
