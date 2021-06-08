import variables from '@/styles/variables.scss'
export { cookie } from './storage/cookie'
export { localStore } from './storage/localStore'
export { sessionStore } from './storage/sessionStore'
import { env } from './env'
export { log } from './log'
export { permission } from './permission'
export { token } from './token'
import { export2Excel } from './excel'

export { default as _ } from 'lodash'
export { env }

const customCache = new Set()

export const util = {
  export2Excel: export2Excel,
  /**
   * 数字转换成英文字母
   * @param num
   * @returns
   */
  num2col(num: number): string {
    return String.fromCharCode(64 + num)
  },

  /**
   * 多页签模式
   * @returns
   */
  isTagsMode(): boolean {
    return env.VUE_APP_TAGS === '1'
  },

  /**
   * 获取App高度
   * @returns
   */
  getAppHeight(): number {
    return document.documentElement.clientHeight
  },

  /**
   * 获取Header高度
   * @returns
   */
  getHeaderHeight(): number {
    const header = +variables.headerHeight.substring(0, variables.headerHeight.length - 2)
    const tags = util.isTagsMode() ? +variables.tagsHeight.substring(0, variables.tagsHeight.length - 2) : 0
    return header + tags
  },

  /**
   * 获取Content高度
   * @returns
   */
  getContentHeight(): number {
    return util.getAppHeight() - util.getHeaderHeight()
  },

  /**
   * list重新排序
   * @param list
   * @param originIndex 源索引位置
   * @param targetIndex 目标索引位置
   */
  listSore(list: any[], originIndex: number, targetIndex: number) {
    if (targetIndex >= 0 && targetIndex <= list.length) {
      if (originIndex < targetIndex) {
        //向下移动, originIndex = targetIndex, 并且把区间内元素全部减1
        list[originIndex].seq = targetIndex
        for (let i = targetIndex; i > originIndex; i--) {
          list[i].seq = list[i].seq - 1
        }
      } else if (originIndex > targetIndex) {
        //向上移动 originIndex = targetIndex, 并且把区间内元素全部加1
        list[originIndex].seq = targetIndex
        for (let i = targetIndex; i < originIndex; i++) {
          list[i].seq = list[i].seq + 1
        }
      }
      // 重新排序
      list.sort((obj1, obj2) => {
        const val1 = obj1.seq
        const val2 = obj2.seq
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
      })

      //重新修复,避免seq断档
      for (let i = 0; i < list.length; i++) {
        list[i].seq = i
      }
    }
  },

  /**
   * 深度克隆对象
   * @param obj
   * @returns
   */
  cloneObject(obj: any) {
    return JSON.parse(JSON.stringify(obj))
  },

  /**
   * 向上递归所有父级
   * @param tree 数据数组
   * @param func 满足条件的函数
   * @param label 输出的值标签
   * @param path 输入集合
   * @returns
   */
  treeFindParent(tree: any[], func: (data: any) => boolean, label: string, path: any[] = []) {
    if (!tree) return []
    for (const data of tree) {
      // 这里按照你的需求来存放最后返回的内容吧
      path.push(data[label])
      if (func(data)) return path
      if (data.children) {
        const findChildren: any[] = util.treeFindParent(data.children, func, label, path)
        if (findChildren.length) return findChildren
      }
      path.pop()
    }
    return []
  },

  /**
   * 移动版模式
   * @returns
   */
  isMobile() {
    const WIDTH = 992 // refer to Bootstrap's responsive design
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  },

  isValidCustomScriptUrl(scriptUrl: string) {
    return scriptUrl && !customCache.has(scriptUrl)
  },

  createScriptUrlElement(scriptUrl: string) {
    if (util.isValidCustomScriptUrl(scriptUrl)) {
      const script = document.createElement('script')
      script.setAttribute('src', scriptUrl)
      script.setAttribute('data-namespace', scriptUrl)

      customCache.add(scriptUrl)
      document.body.appendChild(script)
    }
  },

  /**
   * 判断JSON是否空
   * @param obj
   * @returns
   */
  isEmptyObject(obj: any) {
    return JSON.stringify(obj) === '{}'
  }
}
