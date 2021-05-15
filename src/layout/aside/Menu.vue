<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="isCollapse"
    :background-color="variables.menuBg"
    :text-color="variables.menuText"
    :active-text-color="variables.menuActiveText"
    :unique-opened="false"
    :collapse-transition="false"
    mode="vertical"
    style="border: none"
    @select="selectHandler"
  >
    <MenuItem v-for="menu in menus" :key="menu.menuId" :menu-info="menu" />
  </el-menu>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import variables from '@/styles/variables.scss'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import MenuItem from './MenuItem.vue'

export default defineComponent({
  components: { MenuItem },
  setup() {
    const store = useStore()
    const isCollapse = computed(() => !store.state.app.aside.opened)
    const menus = computed(() => store.getters['menu/menus'])

    const currentRoute = useRoute()
    const activeMenu = computed(() => currentRoute.name)

    const router = useRouter()
    const selectHandler = (index: string) => {
      router.push({ name: index })
    }

    return {
      variables,
      isCollapse,
      activeMenu,
      menus,

      selectHandler
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep(.el-submenu__title) {
  &:hover {
    background-color: $--color-menuHover !important;
  }
}
::v-deep(.is-active > .el-submenu__title) {
  color: $--color-subMenuActiveText !important;
}

::v-deep(.el-submenu .el-submenu > .el-submenu__title) {
  background-color: $--color-subMenuBg !important;
  &:hover {
    background-color: $--color-subMenuHover !important;
  }
}
::v-deep(.el-submenu .el-menu-item) {
  background-color: $--color-subMenuBg !important;
  &:hover {
    background-color: $--color-subMenuHover !important;
  }
}
</style>
