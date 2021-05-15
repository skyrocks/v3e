/**
 * 存储分装对外提供统一的方法及接口使用
 * SessionStore 存储到客户端
 */
class SessionStore {
  set(key: string, value: string): void {
    return sessionStorage.setItem(key, value)
  }

  get(key: string): string | null {
    return sessionStorage.getItem(key)
  }

  remove(key: string): void {
    return sessionStorage.removeItem(key)
  }
}

// 单列模式返回对象
let instance
const sessionStore = (() => {
  if (instance) return instance
  instance = new SessionStore()
  return instance
})()

export { sessionStore }
