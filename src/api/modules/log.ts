import { post } from '../request'

const ns = '/logs' // namespace

interface Log {
  route: string
  menu: string
  method?: string
  logType: string
}

export const logApi = {
  /**
   * 记录客户端访问及操作日志
   * @param data
   * @returns
   */
  info: (data: Log) => {
    return post({ url: `${ns}/pc`, data })
  }
}
