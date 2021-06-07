<template>
  <div ref="refTag" class="tags-container">
    <el-scrollbar class="scroll-container tags-wrapper">
      <router-link
        v-for="tag in tags"
        ref="tag"
        :key="tag.path"
        active-class="active"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-item"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span v-if="!tag.meta.affix" class="el-icon-close" @click.prevent.stop="handleCloseTag(tag)" />
      </router-link>
    </el-scrollbar>
    <ul v-show="menu.visible" :style="{ left: menu.left + 'px', top: menu.top + 'px' }" class="contextmenu">
      <li @click="handleRefreshTag(menu.currentTag)">重新加载</li>
      <li v-if="menu.currentTag.meta && !menu.currentTag.meta.affix" @click="handleCloseTag(menu.currentTag)">
        关闭当前页签
      </li>
      <li @click="handleCloseOthersTags(menu.currentTag)">关闭其他页签</li>
      <li @click="handleCloseAllTags(menu.currentTag)">关闭全部页签</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, watch, ref, nextTick } from 'vue'
import { ElScrollbar, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import path from 'path'

export default defineComponent({
  components: {
    [ElScrollbar.name]: ElScrollbar,
    [ElDropdown.name]: ElDropdown,
    [ElDropdownItem.name]: ElDropdownItem,
    [ElDropdownMenu.name]: ElDropdownMenu
  },
  setup() {
    const refTag = ref()

    const store = useStore()

    const router = useRouter()
    const currentRoute = useRoute()

    const tags = computed(() => store.getters['tag/visitedTags'])

    let affixTags: any[] = []
    const initTags = () => {
      affixTags = filterAffixTags(router.getRoutes())
      for (const tag of affixTags) {
        if (tag.name) {
          store.dispatch('tag/addVisitedTag', tag)
        }
      }
    }

    const filterAffixTags = (routes: any[], basePath = '/') => {
      let tags: any[] = []
      routes.forEach((route: any) => {
        if ((!route.children || route.children.length == 0) && route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
      })
      return tags
    }

    const addTags = (basePath = '/') => {
      const { name } = currentRoute
      if (name) {
        const fullPath = path.resolve(basePath, currentRoute.path)
        const tag = {
          fullPath,
          path: fullPath,
          name: name,
          meta: { ...currentRoute.meta }
        }
        store.dispatch('tag/addTag', tag)
      }
    }

    onMounted(() => {
      initTags()
      addTags()
    })

    watch(currentRoute, () => {
      addTags()
      moveToCurrentTag()
    })

    const isActive = (tag: any) => {
      return tag.path === currentRoute.path
    }
    const toLastTag = (visitedTags: any, tag: any) => {
      const latestTag = visitedTags.slice(-1)[0]
      if (latestTag) {
        router.push(latestTag.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (tag.name === 'Dashboard') {
          // to reload home page
          router.replace({ path: '/redirect' + tag.fullPath })
        } else {
          router.push('/')
        }
      }
    }

    const moveToCurrentTag = () => {
      // const tags = this.$refs.tag
      // this.$nextTick(() => {
      //   for (const tag of tags) {
      //     if (tag.to.path === this.$route.path) {
      //       this.$refs.scrollPane.moveToTarget(tag)
      //       // when query is different then update
      //       if (tag.to.fullPath !== this.$route.fullPath) {
      //         this.$store.dispatch('tagsView/updateVisitedView', this.$route)
      //       }
      //       break
      //     }
      //   }
      // })
    }

    const menu = reactive({ currentTag: {}, visible: false, left: 0, top: 0 })
    watch(
      () => menu.visible,
      value => {
        if (value) {
          document.body.addEventListener('click', closeMenu)
        } else {
          document.body.removeEventListener('click', closeMenu)
        }
      }
    )
    const closeMenu = () => {
      menu.visible = false
    }

    const handleCloseTag = (tag: any) => {
      store.dispatch('tag/delTag', tag).then(({ visitedTags }) => {
        if (isActive(tag)) {
          // 如果是关闭当前的Tag,打开最后一个Tag
          toLastTag(visitedTags, tag)
        }
      })
    }
    const handleRefreshTag = (tag: any) => {
      store.dispatch('tag/delCachedTag', tag).then(() => {
        const { fullPath } = tag
        nextTick(() => {
          router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    }
    const handleCloseOthersTags = (tag: any) => {
      router.push(tag)
      store.dispatch('tag/delOthersTags', tag).then(() => {
        moveToCurrentTag()
      })
    }
    const handleCloseAllTags = (tag: any) => {
      store.dispatch('tag/delAllTags').then(({ visitedTags }) => {
        if (affixTags.some(v => v.path === tag.path)) {
          return
        }
        // 全部关闭时,因为还有AffixTag, 所以需要执行toLastTag,打开最后一个Tag
        toLastTag(visitedTags, tag)
      })
    }

    const openMenu = (tag: any, e: any) => {
      // console.log(e)
      // const menuMinWidth = 105
      // const offsetLeft = refTag.value.$el.getBoundingClientRect().left // container margin left
      // const offsetWidth = refTag.value.$el.offsetWidth // container width
      // const maxLeft = offsetWidth - menuMinWidth // left boundary
      // const left = e.clientX - offsetLeft + 15 // 15: margin right

      // if (left > maxLeft) {
      //   menu.left = maxLeft
      // } else {
      //   menu.left = left
      // }
      menu.left = e.clientX
      menu.top = e.clientY

      menu.currentTag = tag
      menu.visible = true
    }

    return { refTag, tags, handleCloseTag, handleRefreshTag, handleCloseOthersTags, handleCloseAllTags, openMenu, menu }
  }
})
</script>

<style lang="scss" scoped>
.tags-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    ::v-deep {
      .el-scrollbar__bar {
        bottom: 0px;
      }
      .el-scrollbar__wrap {
        height: 49px;
      }
    }
  }

  .tags-wrapper {
    .tags-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #5bc0de;
        color: #fff;
        border-color: #46b8da;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 5px;
        }
      }

      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;
        &:before {
          transform: scale(0.6);
          display: inline-block;
          vertical-align: -2.5px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
