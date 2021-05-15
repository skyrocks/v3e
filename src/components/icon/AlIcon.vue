<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount } from 'vue'
import { util } from '@/utils'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    onBeforeMount(() => {
      util.createScriptUrlElement('//at.alicdn.com/t/font_2547927_vqncx89g0m.js')
    })

    const iconName = computed(() => `#${props.icon}`)
    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${props.className}`
      } else {
        return 'svg-icon'
      }
    })
    return { iconName, svgClass }
  }
})
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  text-align: center;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
