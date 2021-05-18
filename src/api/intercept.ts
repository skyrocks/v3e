import axios, { AxiosRequestConfig, Method } from 'axios'

// 定义挂起请求结构
interface PendingType {
  url: string | undefined
  method: Method | undefined
  params: object
  data: object
  cancel: Function
}

// 定义挂起的请求数组
const pending: Array<PendingType> = []

// 检查并移除重复请求
const removePending = (req: AxiosRequestConfig) => {
  for (const key in pending) {
    const item: PendingType = pending[key]
    // 当前请求在数组中存在时执行函数体
    if (
      item.url === req.url &&
      item.method === req.method &&
      JSON.stringify(item.params) === JSON.stringify(req.params) &&
      JSON.stringify(item.data) === JSON.stringify(req.data)
    ) {
      // 执行取消操作, 取消的是前一次的请求
      item.cancel('操作太频繁，请稍后再试')
      // 从数组中移除记录
      pending.splice(+key, 1)
    }
  }
}

// axios 实例
const instance = axios.create({
  timeout: 180000,
  responseType: 'json'
})

// 添加请求拦截器
instance.interceptors.request.use(
  request => {
    removePending(request)

    request.cancelToken = new axios.CancelToken(c => {
      pending.push({ url: request.url, method: request.method, params: request.params, data: request.data, cancel: c })
    })

    if (request.params) {
      /**
       * axios会对get请求的整个url进行encodeURI，导致有些get方法不能传[]，
       * 所以在此拦截器中抢先进行encodeURIComponent处理，避开axios的encodeURI
       * qs.stringify(config.params, {indices: false}) 等方法都不好用,不利用后台参数接收
       */
      let url = `${request.url}?`
      const keys = Object.keys(request.params)
      for (const key of keys) {
        let val = request.params[key]
        if (typeof val === 'object') {
          val = JSON.stringify(val)
        }
        url += `${key}=${encodeURIComponent(val)}&`
      }
      request.url = url.substring(0, url.length - 1)
      request.params = {}
    }

    return request
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    removePending(response.config)

    return response
  },
  error => {
    const response = error.response
    // 超时重新请求
    const config = error.config
    // 全局的请求次数,请求的间隙
    const [RETRY_COUNT, RETRY_DELAY] = [0, 1000]

    if (config && RETRY_COUNT) {
      // 设置用于跟踪重试计数的变量
      config.__retryCount = config.__retryCount || 3
      // 检查是否已经把重试的总数用完
      if (config.__retryCount >= RETRY_COUNT) {
        return Promise.reject(response || { message: error.message })
      }
      // 增加重试计数
      config.__retryCount++
      // 创造新的Promise来处理指数后退
      const backOff = new Promise<void>(resolve => {
        setTimeout(() => {
          resolve()
        }, RETRY_DELAY || 1)
      })

      // instance重试请求的Promise
      return backOff.then(() => {
        return instance(config)
      })
    }

    return Promise.reject(response || { message: error.message })
  }
)

export default instance
