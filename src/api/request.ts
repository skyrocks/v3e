import { ElMessage } from 'element-plus'
import { env } from '@/utils'
import { AxiosRequest, CustomResponse } from './types'
import { localStore } from '@/utils/storage'
import instance from './intercept'
import store from '@/store'

const headersDefault: object = {
  ContentType: 'application/json;charset=UTF-8'
}

const getToken = () => {
  return `Bearer ${localStore.get('token')}`
}

const request = (
  { baseURL = env.API_BASE, headers = headersDefault, method, url, data, params, responseType }: AxiosRequest,
  alterErr = true
): Promise<CustomResponse> => {
  return new Promise((resolve, reject) => {
    Object.assign(headers, {
      Authorization: getToken()
    })
    instance({ baseURL, headers, method, url, params, data, responseType })
      .then(async resp => {
        // status >= 200 && status < 300 满足这个条件都会进入then
        if (resp.status === 200) {
          if (resp.data?.code === 499) {
            // 认证过期
            const tryResp = await tryRequest(resp)
            if (tryResp.status === 200) {
              resolve(tryResp)
            } else {
              reject(tryResp)
            }
          } else {
            // 正常返回
            const result = {
              status: resp.status,
              statusText: resp.statusText,
              origin: resp.data,
              success: resp.data.success,
              message: resp.data?.message,
              data: resp.data?.data
            }
            resolve(result)
          }
        } else {
          // 错误范围
          const msg = resp.data?.message || url + '请求失败'
          const result = {
            status: resp.status,
            statusText: resp.statusText,
            origin: resp.data,
            success: false,
            message: msg,
            data: resp.data?.data
          }
          if (alterErr) {
            console.log(0, msg)
            ElMessage.error(msg)
          }
          reject(result)
        }
      })
      .catch(err => {
        const msg = err?.data?.message || err?.message || url + '请求失败'
        reject({
          status: err.status,
          statusText: err?.data?.message || err?.message,
          origin: err?.data,
          success: false,
          message: msg,
          data: err?.data?.data
        })
        if (alterErr) {
          console.log(1, msg)
          ElMessage.error(msg)
        }
      })
  })
}

const tryRequest = async (err: any) => {
  await store.dispatch('auth/refreshToken', getToken())
  const resp = await request(err.config)
  return resp
}

const get = (
  { baseURL, headers, url, data, params, responseType }: AxiosRequest,
  alterErr = true
): Promise<CustomResponse> => {
  return request({ baseURL, headers, method: 'get', url, data, params, responseType }, alterErr)
}

const post = (
  { baseURL, headers, url, data, params, responseType }: AxiosRequest,
  alterErr = true
): Promise<CustomResponse> => {
  return request({ baseURL, headers, method: 'post', url, data, params, responseType }, alterErr)
}

export { get, post }
