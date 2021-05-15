import { post } from '../request'

const ns = '/logs' // namespace

interface Log {
  route: string
  menu: string
  method?: string
  logType: string
}

export const logApi = {
  info: (data: Log) => {
    return post({ url: `${ns}/pc`, data })
  }
}
