import { authApi } from '@/api/modules/auth'
import { User } from '../type'
import { token as t } from '@/utils'
import { Commit } from 'vuex'

interface StateType {
  user: User | undefined
}

const state: StateType = {
  user: undefined
}

const actions = {
  getProfile: async (context: { commit: Commit }) => {
    await authApi
      .profile()
      .then(resp => {
        if (resp.success) {
          context.commit('getProfile', resp.data)
        }
      })
      .catch(() => {
        context.commit('getProfile')
      })
  },

  refreshToken: async (context: { commit: Commit }, token: string) => {
    t.remove()
    await authApi.refreshToken(token).then(resp => {
      if (resp.success) {
        context.commit('refreshToken', resp.data)
      }
    })
  },

  logout: async (context: { commit: Commit; state: StateType }) => {
    if (context.state.user) {
      await authApi.logout(context.state.user.loginName).then(resp => {
        if (resp.success) {
          context.commit('logout')
        }
      })
    }
  }
}

const mutations = {
  getProfile: (state: StateType, payload: User) => {
    state.user = payload
  },

  refreshToken: (state: StateType, payload: string) => {
    t.set(payload)
  },

  logout: (state: StateType) => {
    state.user = undefined
    t.remove()
  }
}

const getters = {
  user: (state: StateType) => state.user
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
