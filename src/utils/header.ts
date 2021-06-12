import { token } from '@/utils'

export const header = {
  getAuthorization() {
    return {
      Authorization: token.getBearer()
    }
  }
}
