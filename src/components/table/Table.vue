<template>
  <div>
    <el-table
      ref="refTable"
      v-bind="$attrs"
      :height="tableHeight"
      stripe
      style="width: 100%"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <template v-for="(col, key) in tableColumns" :key="key">
        <el-table-column
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
          <template #header v-if="col.search === 'text'">
            <span :class="searchClass[col.prop]">{{ col.label }}</span>
            <Search
              v-model:value="searchValue[col.prop]"
              :prop="col.prop"
              :placement="key === 0 ? 'bottom-start' : key === tableColumns.length - 1 ? 'bottom-end' : 'bottom'"
              @search="handleSearch"
            ></Search>
          </template>
          <template #default="scope" v-if="$slots[`column-${col.prop}`]">
            <slot
              :name="`column-${col.prop}`"
              v-bind:row="scope.row"
              v-bind:column="scope.column"
              v-bind:$index="scope.$index"
              v-bind:data="scope.row[col.prop]"
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :currentPage="pageNum"
          :page-sizes="[15, 30, 50, 100, 200, 300, 500]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
      <el-col :span="8" style="text-align: right">
        <el-tooltip class="item" effect="dark" content="显示隐藏列" placement="top-start">
          <el-button icon="el-icon-c-scale-to-original" size="small" circle @click="handleTriggerColumns"></el-button>
        </el-tooltip>
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
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElPagination, ElTooltip, ElEmpty } from 'element-plus'
import { util } from '@/utils'
import variables from '@/styles/variables.scss'
import { Pagination } from '@/typings'
import Search from './Search.vue'

const PAGE_SIZE = 30 //默认查询记录数

const COLUMN_DEFAULT = {
  label: '',
  prop: '',
  columnKey: '',
  sortable: 'custom',
  showOverflowTooltip: true,
  formatter: undefined,
  filters: undefined,
  width: undefined,
  fixed: undefined,

  search: 'text'
}

export default defineComponent({
  name: 'XTable',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      required: true
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
  components: { [ElPagination.name]: ElPagination, [ElTooltip.name]: ElTooltip, [ElEmpty.name]: ElEmpty, Search },
  emits: ['query'],
  setup(props, { emit }) {
    const refTable = ref()

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
      const cols: any[] = []
      props.columns.forEach((col: any) => {
        const newCol = Object.assign({}, COLUMN_DEFAULT, col)
        if (!col.columnKey) newCol.columnKey = col.prop
        if (col.filters) newCol.search = ''
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
      const cls: any = {}
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

    const handleFilterChange = (filters: any) => {
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

    const handleTriggerColumns = () => {
      //
    }

    const handleDownload = () => {
      //
    }

    const handleClearFilters = () => {
      for (const prop in searchValue) {
        delete searchValue[prop]
      }
      refTable.value.clearFilter()
      for (const col in page.filter) {
        delete page.filter[col]
      }
      query()
    }

    return {
      refTable,
      tableHeight,
      tableColumns,
      ...toRefs(page),

      searchValue,
      searchClass,

      handleSizeChange,
      handleCurrentChange,
      handleSortChange,
      handleFilterChange,

      handleTriggerColumns,
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
</style>
