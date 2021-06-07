const state = {
  visitedTags: [],
  cachedTags: []
}

const mutations = {
  ADD_VISITED_TAG: (state: any, tag: any) => {
    if (state.visitedTags.some((t: any) => t.path === tag.path)) return
    state.visitedTags.push(
      Object.assign({}, tag, {
        title: tag.meta.title || 'no-name'
      })
    )
  },
  ADD_CACHED_TAG: (state: any, tag: any) => {
    if (state.cachedTags.includes(tag.name)) return
    if (!tag.meta.noCache) {
      state.cachedTags.push(tag.name)
    }
  },

  DEL_VISITED_TAG: (state: any, tag: any) => {
    for (const [i, v] of state.visitedTags.entries()) {
      if (v.path === tag.path) {
        state.visitedTags.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_TAG: (state: any, tag: any) => {
    const index = state.cachedTags.indexOf(tag.name)
    index > -1 && state.cachedTags.splice(index, 1)
  },
  DEL_OTHERS_VISITED_TAGS: (state: any, tag: any) => {
    state.visitedTags = state.visitedTags.filter((v: any) => {
      return v.meta.affix || v.path === tag.path
    })
  },
  DEL_OTHERS_CACHED_TAGS: (state: any, tag: any) => {
    const index = state.cachedTags.indexOf(tag.name)
    if (index > -1) {
      state.cachedTags = state.cachedTags.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedTags = []
    }
  },
  DEL_ALL_VISITED_TAGS: (state: any) => {
    // keep affix tags
    const affixTags = state.visitedTags.filter((tag: any) => tag.meta.affix)
    state.visitedTags = affixTags
  },
  DEL_ALL_CACHED_TAGS: (state: any) => {
    state.cachedTags = []
  },

  UPDATE_VISITED_TAG: (state: any, tag: any) => {
    for (let v of state.visitedTags) {
      if (v.path === tag.path) {
        v = Object.assign(v, tag)
        break
      }
    }
  }
}

const actions = {
  addTag({ dispatch }: any, tag: any) {
    dispatch('addVisitedTag', tag)
    dispatch('addCachedTag', tag)
  },
  addVisitedTag({ commit }: any, tag: any) {
    commit('ADD_VISITED_TAG', tag)
  },
  addCachedTag({ commit }: any, tag: any) {
    commit('ADD_CACHED_TAG', tag)
  },

  delTag({ dispatch, state }: any, tag: any) {
    return new Promise(resolve => {
      dispatch('delVisitedTag', tag)
      dispatch('delCachedTag', tag)
      resolve({
        visitedTags: [...state.visitedTags],
        cachedTags: [...state.cachedTags]
      })
    })
  },
  delVisitedTag({ commit, state }: any, tag: any) {
    return new Promise(resolve => {
      commit('DEL_VISITED_TAG', tag)
      resolve([...state.visitedTags])
    })
  },
  delCachedTag({ commit, state }: any, tag: any) {
    return new Promise(resolve => {
      commit('DEL_CACHED_TAG', tag)
      resolve([...state.cachedTags])
    })
  },

  delOthersTags({ dispatch, state }: any, tag: any) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedTags', tag)
      dispatch('delOthersCachedTags', tag)
      resolve({
        visitedTags: [...state.visitedTags],
        cachedTags: [...state.cachedTags]
      })
    })
  },
  delOthersVisitedTags({ commit, state }: any, tag: any) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_TAGS', tag)
      resolve([...state.visitedTags])
    })
  },
  delOthersCachedTags({ commit, state }: any, tag: any) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_TAGS', tag)
      resolve([...state.cachedTags])
    })
  },

  delAllTags({ dispatch, state }: any) {
    return new Promise(resolve => {
      dispatch('delAllVisitedTags')
      dispatch('delAllCachedTags')
      resolve({
        visitedTags: [...state.visitedTags],
        cachedTags: [...state.cachedTags]
      })
    })
  },
  delAllVisitedTags({ commit, state }: any) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_TAGS')
      resolve([...state.visitedTags])
    })
  },
  delAllCachedTags({ commit, state }: any) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_TAGS')
      resolve([...state.cachedTags])
    })
  },

  updateVisitedView({ commit }: any, tag: any) {
    commit('UPDATE_VISITED_TAG', tag)
  }
}

const getters = {
  visitedTags: (state: any) => state.visitedTags,
  cachedTags: (state: any) => state.cachedTags
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
