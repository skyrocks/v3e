<template>
  <el-button ref="btn" v-bind="$attrs" :size="btnSize" :type="btnType">
    <template v-for="(value, key) in $slots">
      <slot :name="key"></slot>
    </template>
  </el-button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed, PropType } from 'vue'
import { log } from '@/utils'
import { Size, Type } from './types'

export default defineComponent({
  name: 'XButton',
  props: {
    log: {
      type: String,
      default: undefined
    },
    xSize: {
      type: String as PropType<Size>,
      default: 'small'
    },
    xType: {
      type: String as PropType<Type>,
      default: 'primary'
    }
  },
  setup(props) {
    const btn = ref()
    let $el: any

    const btnType = computed(() => (props.xType === 'white' ? undefined : props.xType))
    const btnSize = computed(() => (props.xSize === 'large' ? undefined : props.xSize))

    const handleClick = () => {
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
        $el.addEventListener('click', handleClick)
      }
    })
    onUnmounted(() => {
      if (typeof props.log === 'string') {
        $el.removeEventListener('click', handleClick)
      }
    })

    return {
      btn,

      btnType,
      btnSize
    }
  }
})
</script>

<style lang="scss" scoped></style>
