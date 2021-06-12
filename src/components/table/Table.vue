<template>
  <div>
    <el-table
      ref="table"
      v-bind="$attrs"
      :height="tableHeight"
      stripe
      style="width: 100%"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <el-table-column v-if="selection" type="selection" :with="55" />
      <template v-for="(col, key) in tableColumns" :key="key">
        <el-table-column
          v-if="col.isShow"
          :width="col.width"
          :label="col.label"
          :column-key="col.prop"
          :prop="col.prop"
          :sortable="col.sortable"
          :show-overflow-tooltip="col.showOverflowTooltip"
          :formatter="col.formatter"
          :filters="col.filters"
          :fixed="col.fixed"
        >
          <template v-if="col.search === 'text'" #header>
            <span :class="searchClass[col.prop]">{{ col.label }}</span>
            <Search
              v-model:value="searchValue[col.prop]"
              :prop="col.prop"
              :placement="key === 0 ? 'bottom-start' : key === tableColumns.length - 1 ? 'bottom-end' : 'bottom'"
              @search="handleSearch"
            ></Search>
          </template>
          <template v-if="$slots[`column-${col.scope}`]" #default="scope">
            <slot
              :name="`column-${col.scope}`"
              :row="scope.row"
              :column="scope.column"
              :$index="scope.$index"
              :data="scope.row[col.prop]"
            />
          </template>
        </el-table-column>
      </template>
      <template v-if="$slots.append">
        <slot name="append"></slot>
      </template>
      <template #empty>
        <span v-if="loading">
          <i class="el-icon-loading"></i>
          数据加载中...
        </span>
        <el-empty v-else></el-empty>
      </template>
    </el-table>
    <el-row v-if="pagination" class="bbar">
      <el-col :span="16">
        <el-pagination
          :current-page="pageNum"
          :page-sizes="[15, 30, 50, 100, 200, 300, 500]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-col>
      <el-col :span="8" style="text-align: right">
        <el-popover placement="top-end" :width="100" trigger="hover">
          <template #reference>
            <el-button icon="el-icon-c-scale-to-original" size="small" circle></el-button>
          </template>
          <div>
            <span>显示隐藏列</span>
            <ul class="list-unstyled columns-list">
              <li v-for="(col, key) in tableColumns" :key="key">
                <el-checkbox v-model="col.isShow">{{ col.label }}</el-checkbox>
              </li>
            </ul>
          </div>
        </el-popover>
        <el-tooltip class="item" effect="dark" content="下载当前页数据" placement="top">
          <el-button icon="el-icon-download" size="small" circle @click="handleDownload"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="清除所有过滤条件" placement="top-end">
          <el-button icon="el-icon-refresh" size="small" circle @click="handleClearFilters"></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs } from 'vue'
import { ElPagination, ElTooltip, ElEmpty, ElPopover, ElCheckbox } from 'element-plus'
import { util } from '@/utils'
import variables from '@/styles/variables.scss'
import { Pagination } from '@/typings'
import { Column } from './types'
import Search from './Search.vue'

const PAGE_SIZE = 30 //默认查询记录数

const COLUMN_DEFAULT: Column = {
  label: '',
  prop: '',
  columnKey: '',
  sortable: 'custom',
  showOverflowTooltip: true,
  formatter: undefined,
  filters: undefined,
  width: undefined,
  fixed: undefined,

  search: 'text',
  scope: '',
  isShow: true,
  isExport: true
}

export default defineComponent({
  name: 'XTable',
  components: {
    [ElPagination.name]: ElPagination,
    [ElTooltip.name]: ElTooltip,
    [ElEmpty.name]: ElEmpty,
    [ElPopover.name]: ElPopover,
    [ElCheckbox.name]: ElCheckbox,
    Search
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array as PropType<Column[]>,
      required: true
    },
    selection: {
      type: Boolean,
      default: true
    },
    pagination: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    initQuery: {
      type: Boolean,
      default: false
    }
  },
  emits: ['query'],
  setup(props, { emit }) {
    const table = ref()

    const tableHeight = computed(() => {
      if (props.height > 0) {
        return props.height
      } else {
        //content区域高度 - content区域padding-top - props.top - table与pagination间距(5) - pagination高度(32) - content区域padding-bottom
        const contentTop = Number(variables.contentTop.slice(0, -2))
        const contentBottom = Number(variables.contentBottom.slice(0, -2))
        const height = util.getContentHeight() - contentTop - props.top - 5 - 32 - contentBottom
        return height
      }
    })

    const tableColumns = computed(() => {
      const cols = reactive<Column[]>([])
      props.columns.forEach((col: Column) => {
        const newCol = Object.assign({}, COLUMN_DEFAULT, col)
        if (!col.columnKey) newCol.columnKey = col.prop
        if (col.filters) newCol.search = ''
        if (!col.scope) newCol.scope = col.prop
        cols.push(newCol)
      })
      return cols
    })

    const page = reactive<Pagination>({
      pageNum: 1,
      pageSize: PAGE_SIZE,
      sort: {},
      filter: {}
    })

    const searchClass = computed(() => {
      const cls: { [key: string]: string } = {}
      for (const col in page.filter) {
        cls[col] = 'highlight'
      }
      return cls
    })
    const searchValue = reactive<{ [key: string]: string }>({})

    onMounted(() => {
      if (props.initQuery) {
        query()
      }
    })

    const query = () => {
      emit('query', page)
    }

    const handleSizeChange = (ps: number) => {
      page.pageSize = ps
      page.pageNum = 1
      query()
    }
    const handleCurrentChange = (pn: number) => {
      page.pageNum = pn
      query()
    }

    const handleSortChange = (column: any) => {
      page.sort = {}
      if (column.prop) {
        page.sort[column.prop] = column.order
      }
      query()
    }

    const handleFilterChange = (filters: string[]) => {
      for (const col in filters) {
        const val = filters[col]
        if (val.length > 0) {
          page.filter[col] = val
        } else {
          delete page.filter[col]
        }
      }
      query()
    }

    const handleSearch = ({ prop }: any) => {
      if (searchValue[prop] && searchValue[prop] !== '') {
        page.filter[prop] = searchValue[prop]
      } else {
        delete page.filter[prop]
      }
      query()
    }

    const handleDownload = () => {
      const cols = tableColumns.value.filter(col => col.isShow)

      const tableChildren = table.value.$el.children
      let list: any
      tableChildren.forEach((ele: any) => {
        if (ele.classList.contains('el-table__body-wrapper')) {
          list = ele.children[0].children[1].children
        }
      })

      const dataList: any[] = []
      if (list) {
        list.forEach((tr: any) => {
          const tds = tr.children
          const data: { [key: string]: string } = {}
          for (let i = props.selection ? 1 : 0; i < tds.length; i++) {
            const col = cols[props.selection ? i - 1 : i]
            if (col.isExport) {
              if (tds[i].classList.contains('is-hidden')) {
                // fixed列
                data[col.prop] = tds[i].innerHTML.replace(/<.*?>/g, '')
              } else {
                data[col.prop] = tds[i].innerText
              }
            }
          }
          dataList.push(data)
        })
      }
      util.export2Excel(
        cols.filter(col => col.isExport),
        dataList,
        '导出数据'
      )
    }

    const handleClearFilters = () => {
      for (const prop in searchValue) {
        delete searchValue[prop]
      }
      table.value.clearFilter()
      for (const col in page.filter) {
        delete page.filter[col]
      }
      query()
    }

    return {
      table,

      tableHeight,
      tableColumns,
      ...toRefs(page),

      searchValue,
      searchClass,

      handleSizeChange,
      handleCurrentChange,
      handleSortChange,
      handleFilterChange,

      handleDownload,
      handleClearFilters,

      query,
      handleSearch
    }
  }
})
</script>

<style lang="scss" scoped>
.bbar {
  margin-top: 5px;
  padding: 0 10px 0 5px;
}
.highlight {
  color: $--color-text-link;
}
.columns-list {
  margin: 0;
  padding-top: 6px;
}
</style>
