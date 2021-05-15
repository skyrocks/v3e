<template>
  <div :class="asideClass">
    <Logo :collapse="collapse" />
    <el-scrollbar :height="menuHight">
      <Menu />
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { util } from '@/utils'
import Logo from './Logo.vue'
import Menu from './Menu.vue'
import { ElScrollbar } from 'element-plus'

export default defineComponent({
  components: { [ElScrollbar.name]: ElScrollbar, Logo, Menu },
  setup() {
    const store = useStore()

    const asideClass = computed(() => `aside ${store.state.app.aside.opened ? '' : 'hidden'}`)
    const collapse = computed(() => !store.state.app.aside.opened)
    const menuHight = computed(() => util.getContentHeight())
    return {
      asideClass,
      menuHight,
      collapse
    }
  }
})
</script>

<style lang="scss" scoped>
.aside {
  transition: width 0.28s;
  width: $--aside-width !important;
  background-color: #304156;
  border-right: 1px solid #304156;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;

  &.hidden {
    width: $--aside-width-small !important;
  }
}
</style>
