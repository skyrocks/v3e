import type { App } from 'vue'
import XButton from '@/components/button/index.vue'
import AlIcon from '@/components/icon/AlIcon.vue'

export function setupCustomComponents(app: App) {
  app.component('alIcon', AlIcon)
  app.component('XButton', XButton)
}
