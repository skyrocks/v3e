import { localStore } from '@/utils/storage'

export const token = {
  get() {
    return localStore.get('token')
  },

  set(token: string) {
    localStore.set('token', token)
  },

  remove() {
    localStore.remove('token')
  }
}
