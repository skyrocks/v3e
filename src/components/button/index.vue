<template>
  <el-button ref="btn" v-bind="$attrs">
    <template v-for="(value, key) in $slots">
      <slot :name="key"></slot>
    </template>
  </el-button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { log } from '@/utils'

export default defineComponent({
  name: 'XButton',
  props: {
    log: {
      type: String,
      default: undefined
    }
  },
  setup(props) {
    const btn = ref()
    let $el: any

    const clickHandler = () => {
      if (typeof props.log === 'string') {
        let text = btn.value.$el.innerText
        if (props.log !== '') {
          text = props.log
        }
        log.action(text)
      }
    }

    onMounted(() => {
      if (typeof props.log === 'string') {
        $el = btn.value.$el
        $el.addEventListener('click', clickHandler)
      }
    })
    onUnmounted(() => {
      if (typeof props.log === 'string') {
        $el.removeEventListener('click', clickHandler)
      }
    })

    return {
      btn
    }
  }
})
</script>

<style lang="scss" scoped></style>
