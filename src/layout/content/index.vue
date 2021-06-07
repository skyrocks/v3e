<template>
  <section>
    <router-view v-slot="{ Component }">
      <transition name="zoom-fade" mode="out-in">
        <keep-alive :include="cachedTags">
          <component :is="Component" :key="key" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const currentRoute = useRoute()

    const cachedTags = computed(() => store.getters['tag/cachedTags'])
    const key = computed(() => currentRoute.path)

    return { cachedTags, key }
  }
})
</script>
