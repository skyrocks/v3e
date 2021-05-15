import { get, post } from '../request'
interface Pwd {
  loginName: string
  password: string
  captcha: string
  captchaId: string
}
interface Sms {
  id: string
  code?: string
  cellphone: string
}

const ns = '/auth' // namespace

export const authApi = {
  login: (data: Pwd) => {
    return post({ url: `${ns}/login`, data })
  },
  profile: () => {
    return get({ url: `${ns}/profile` }, false)
  },
  sendSmsCode: (data: Sms) => {
    return post({ url: `${ns}/sms/code`, data })
  },
  loginSms: (data: Sms) => {
    return post({ url: `${ns}/sms/login`, data })
  },
  logout: (loginName: string) => {
    return post({ url: `${ns}/logout`, data: { loginName } })
  },
  refreshToken: (token: string) => {
    return post({ url: `${ns}/refresh/token`, data: { token } })
  }
}
