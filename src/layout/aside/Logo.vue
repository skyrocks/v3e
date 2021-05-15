<template>
  <div class="logo-container" :class="{ collapse: collapse }">
    <transition name="logo-fade">
      <router-link v-if="collapse" key="collapse" class="logo-link" to="/">
        <img v-if="logo" :src="logo" class="logo" />
        <h1 v-else class="title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="logo-link" to="/">
        <img v-if="logo" :src="logo" class="logo" />
        <h1 class="title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    collapse: {
      type: Boolean as PropType<Boolean>,
      required: true
    }
  },
  setup() {
    return {
      title: 'Vue3 Element',
      logo: require('@/assets/images/logo.png')
    }
  }
})
</script>

<style lang="scss" scoped>
.logo-fade-enter-active {
  transition: opacity 1.8s;
}

.logo-fade-enter-from,
.logo-fade-leave-to {
  opacity: 0;
}

.logo-container {
  position: relative;
  width: 100%;
  height: $--header-height;
  line-height: $--header-height;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .logo-link {
    height: 100%;
    width: 100%;

    & .logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: $--header-height;
      font-size: $--size-font-large;
      vertical-align: middle;
    }
  }

  &.collapse {
    .logo {
      margin-right: 0px;
    }
  }
}
</style>
