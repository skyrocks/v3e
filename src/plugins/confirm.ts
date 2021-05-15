import { ElMessageBox } from 'element-plus'

export function confirm(title: string, ok: () => void, cancel?: () => void) {
  ElMessageBox.confirm(title, '提示', {
    type: 'warning'
  })
    .then(ok)
    .catch(cancel)
}
