import { localStore } from '@/utils'

const key = 'aside'

const state = {
  aside: {
    opened: localStore.get(key) ? !!+localStore.get(key) : true
  }
}

const mutations = {
  TOGGLE_ASIDE: (state: any) => {
    state.aside.opened = !state.aside.opened
    if (state.aside.opened) {
      localStore.set(key, '1')
    } else {
      localStore.set(key, '0')
    }
  },
  CLOSE_ASIDE: (state: any) => {
    state.aside.opened = false
    localStore.set(key, '0')
  }
}

const actions = {
  toggleAside({ commit }: any) {
    commit('TOGGLE_ASIDE')
  },
  closeAside({ commit }: any) {
    commit('CLOSE_ASIDE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
