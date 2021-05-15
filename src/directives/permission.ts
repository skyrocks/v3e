import { ObjectDirective } from 'vue'
import { permission as p } from '@/utils'

export const permission: ObjectDirective = {
  mounted(el: HTMLButtonElement, binding) {
    if (binding.value == undefined) return

    const val = binding.value
    let { action, effect } = { action: '', effect: '' }
    if (typeof val === 'string') {
      action = val
    } else {
      action = val.action
      effect = val.effect
    }

    // 如果action不传，则认为不需要授权认证
    if (action == undefined) {
      return
    }
    if (!p.has(action)) {
      if (effect == 'disabled') {
        el.disabled = true
        el.setAttribute('title', '没有权限')
      } else {
        el.remove()
      }
    }
  }
}
