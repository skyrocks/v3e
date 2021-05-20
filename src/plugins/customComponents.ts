import type { App } from 'vue'
import AlIcon from '@/components/icon/AlIcon.vue'
import XButton from '@/components/button/index.vue'
import { XTable } from '@/components/table'

export function setupCustomComponents(app: App) {
  app.component('AlIcon', AlIcon)
  app.component('XButton', XButton)
  app.component('XTable', XTable)
  // app.component('XTableColumn', XTableColumn)
}
