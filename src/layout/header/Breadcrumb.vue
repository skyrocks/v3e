<template>
  <transition name="logo-fade">
    <el-breadcrumb :class="breadcrumbClass" separator="/">
      <template v-for="item in state.breadcrumb" :key="item">
        <el-breadcrumb-item>{{ item }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, onMounted } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'
import { util } from '@/utils'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Menu } from '@/store/type'

export default defineComponent({
  components: { [ElBreadcrumb.name]: ElBreadcrumb, [ElBreadcrumbItem.name]: ElBreadcrumbItem },
  setup() {
    const store = useStore()
    const currentRoute = useRoute()

    const breadcrumbClass = ref('breadcrumb')

    const state = reactive<{
      breadcrumb: string[]
    }>({
      breadcrumb: []
    })
    watch(
      // 跟随页面路由变化，设置面包屑
      () => currentRoute.fullPath,
      () => transition()
    )

    onMounted(() => transition())

    const transition = () => {
      breadcrumbClass.value = 'breadcrumb hidden'
      setTimeout(() => {
        state.breadcrumb = util.treeFindParent(
          store.getters['menu/menus'],
          (data: Menu) => data.menuId === currentRoute.name,
          'menuName'
        )
        breadcrumbClass.value = 'breadcrumb'
      }, 280)
    }

    return { state, breadcrumbClass }
  }
})
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: inline-block;
  height: $--header-height;
  line-height: $--header-height;
  transition: opacity 0.28s;
  &.hidden {
    opacity: 0;
  }
}
::v-deep(.el-breadcrumb__item) {
  cursor: text;
  &:not(:last-child) {
    .el-breadcrumb__inner {
      color: $--color-breadcrumb;
    }
  }
}

.logo-fade-enter-active {
  transition: opacity 1.8s;
}

.logo-fade-enter-from,
.logo-fade-leave-to {
  opacity: 0;
}
</style>
