<template>
  <div :class="`fold-bar ${open ? 'open' : ''}`" @click="clickHanlder">
    <svg class="fold-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      <path
        d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const open = computed(() => store.state.app.aside.opened)
    const clickHanlder = () => {
      store.dispatch('app/toggleAside')
    }

    return {
      open,

      clickHanlder
    }
  }
})
</script>

<style lang="scss" scoped>
.fold-bar {
  display: inline-block;
  width: $--header-height;
  height: $--header-height;
  line-height: $--header-height;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
  .fold-icon {
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  &.open {
    .fold-icon {
      transform: rotate(180deg);
    }
  }
}
</style>
