export interface Column {
  label: string
  prop: string
  columnKey?: string
  sortable?: string | boolean
  showOverflowTooltip?: boolean
  formatter?: (row, column, cellValue, index) => void
  filters?: { text: string; value: string }[]
  width?: string
  fixed?: string | boolean

  search?: string
  scope?: string
  isShow?: boolean
  isExport?: boolean
}
