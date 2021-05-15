<template>
  <template v-if="menuInfo.hidden == 0">
    <el-submenu v-if="menuInfo.children.length > 0" :index="menuInfo.menuId">
      <template #title>
        <al-icon :icon="menuInfo.iconClass" class-name="icon" v-if="menuInfo.iconClass" />
        <span>{{ menuInfo.menuName }}</span>
      </template>
      <template v-for="item in menuInfo.children" :index="item.menuId" :key="item.menuId">
        <template v-if="item.children.length === 0 && menuInfo.hidden == 0">
          <el-menu-item :index="item.menuId">
            <span>{{ item.menuName }}</span>
          </el-menu-item>
        </template>
        <template v-else>
          <menu-item :index="item.menuId" :menu-info="item" />
        </template>
      </template>
    </el-submenu>
    <el-menu-item v-else :index="menuInfo.menuId">
      <al-icon :icon="menuInfo.iconClass" class-name="icon" v-if="menuInfo.iconClass" />
      <template #title>{{ menuInfo.menuName }}</template>
    </el-menu-item>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  props: {
    menuInfo: {
      type: Object as PropType<Object>,
      default: () => ({})
    }
  },
  setup() {
    const store = useStore()
    const iconRight = computed(() => (store.state.app.aside.opened ? '5px' : '0'))
    return {
      iconRight
    }
  }
})
</script>
<style lang="scss" scoped>
.icon {
  width: 1.5em !important;
  font-size: $--size-font-medium;
  text-align: center;
  vertical-align: middle;
}
</style>
