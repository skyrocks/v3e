export interface Pagination {
  pageNum: Number
  pageSize: Number
  sort: { [key: string]: string }
  filter: { [key: string]: string[] }
}
