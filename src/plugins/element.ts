import type { App } from 'vue'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale'

import {
  ElRow,
  ElCol,
  ElIcon,
  ElButton,
  ElButtonGroup,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElSubmenu,
  ElMenuItem
} from 'element-plus'

export function setupElement(app: App<Element>) {
  // 设置语言
  locale.use(lang)

  app
    .use(ElRow)
    .use(ElCol)
    .use(ElIcon)
    .use(ElButton)
    .use(ElButtonGroup)
    .use(ElForm)
    .use(ElFormItem)
    .use(ElInput)
    .use(ElSelect)
    .use(ElTable)
    .use(ElTableColumn)
    .use(ElContainer)
    .use(ElHeader)
    .use(ElAside)
    .use(ElMain)
    .use(ElMenu)
    .use(ElSubmenu)
    .use(ElMenuItem)
}
