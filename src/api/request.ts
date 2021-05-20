import { ElMessage } from 'element-plus'
import { env } from '@/utils'
import { AxiosRequest, CustomResponse } from './types'
import { localStore, _ } from '@/utils'
import instance from './intercept'
import store from '@/store'
import { confirm } from '@/plugins'
import { useRouter } from 'vue-router'
import { Pagination } from '@/typings'

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
            resolve({
              status: resp.status,
              statusText: resp.statusText,
              origin: resp.data,
              success: resp.data.success,
              message: resp.data?.message,
              data: resp.data?.data
            })
          }
        } else {
          // 错误范围
          const msg = resp.data?.message || url + '请求失败'
          if (alterErr) {
            if (resp.status === 401) {
              // 认证失败, 重新登录
              confirm(`${msg}, 是否重新登录`, () => {
                const router = useRouter()
                router.push({ name: 'Logout' })
              })
            } else {
              ElMessage.error(msg)
            }
          }
          reject({
            status: resp.status,
            statusText: resp.statusText,
            origin: resp.data,
            success: false,
            message: msg,
            data: resp.data?.data
          })
        }
      })
      .catch(err => {
        const msg = err?.data?.message || err?.message || url + '请求失败'
        if (alterErr) {
          if (err.status === 401) {
            // 认证失败, 重新登录
            confirm(`${msg}, 是否重新登录`, () => {
              const router = useRouter()
              router.push({ name: 'Logout' })
            })
          } else {
            ElMessage.error(msg)
          }
        }
        reject({
          status: err.status,
          statusText: err?.data?.message || err?.message,
          origin: err?.data,
          success: false,
          message: msg,
          data: err?.data?.data
        })
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

const getPage = (
  { baseURL, headers, url, data, params, responseType }: AxiosRequest,
  page: Pagination,
  alterErr = true
): Promise<CustomResponse> => {
  if (!_.isEmpty(page.filter) || !_.isEmpty(page.sort)) {
    const newParams = params ? <{ [key: string]: object }>params : {}
    if (!_.isEmpty(page.filter)) {
      newParams['filter'] = page.filter
    }
    if (!_.isEmpty(page.sort)) {
      let sortText = ','
      for (const col in page.sort) {
        sortText += `${col} ${page.sort[col] === 'descending' ? 'desc' : 'asc'}`
      }
      newParams['sort'] = (sortText.substr(1) as unknown) as object
    }
    params = newParams
  }
  return request({ baseURL, headers, method: 'get', url, data, params, responseType }, alterErr)
}

const post = (
  { baseURL, headers, url, data, params, responseType }: AxiosRequest,
  alterErr = true
): Promise<CustomResponse> => {
  return request({ baseURL, headers, method: 'post', url, data, params, responseType }, alterErr)
}

export { get, getPage, post }
