<template>
  <el-container class="layout">
    <el-aside :width="asideWidth">
      <LayoutAside />
    </el-aside>
    <el-container :class="centerClass">
      <el-header :height="headerHeight" style="padding: 0">
        <LayoutHeader />
        <template v-if="isTagsMode">
          <LayoutTags />
        </template>
      </el-header>
      <el-main class="content">
        <LayoutContent />
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import LayoutAside from './aside/index.vue'
import LayoutHeader from './header/index.vue'
import LayoutTags from './tags/index.vue'
import LayoutContent from './content/index.vue'
import { useStore } from 'vuex'
import variables from '@/styles/variables.scss'
import { util } from '@/utils'

export default defineComponent({
  components: {
    LayoutAside,
    LayoutHeader,
    LayoutTags,
    LayoutContent
  },
  setup() {
    const store = useStore()

    const centerClass = computed(() => `center ${store.state.app.aside.opened ? '' : 'small'}`)

    const asideWidth = computed(() => (store.state.app.aside.opened ? variables.asideWidth : variables.asideWidthSmall))

    const isTagsMode = computed(() => util.isTagsMode())

    const headerHeight = computed(() => `${util.getHeaderHeight()}px`)

    return {
      isTagsMode,
      headerHeight,
      centerClass,
      asideWidth,
      variables
    }
  }
})
</script>
<style lang="scss" scoped>
.layout {
  display: flex;
  overflow: hidden;
  height: 100vh;

  ::v-deep(.el-aside) {
    transition: width 0.28s;
  }

  .center {
    transition: margin-left 0.28s;
  }

  .content {
    padding: $--content-top $--content-right $--content-bottom $--content-left;
  }
}
</style>
