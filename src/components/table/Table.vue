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
      <template v-for="(value, key) in $slots">
        <slot :name="key"></slot>
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
        <el-tooltip class="item" effect="dark" content="下载当前页数据" placement="top-start">
          <el-button icon="el-icon-download" size="small" circle></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, reactive, toRefs } from 'vue'
import { ElPagination, ElTooltip } from 'element-plus'
import { util } from '@/utils'
import variables from '@/styles/variables.scss'
import { Pagination } from '@/typings'

const PAGE_SIZE = 30 //默认查询记录数

export default defineComponent({
  name: 'XTable',
  props: {
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
      default: true
    }
  },
  components: { [ElPagination.name]: ElPagination, [ElTooltip.name]: ElTooltip },
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

    const page = reactive<Pagination>({
      pageNum: 1,
      pageSize: PAGE_SIZE,
      sort: {},
      filter: {}
    })

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

    const query = () => {
      emit('query', page)
    }

    onMounted(() => {
      if (props.initQuery) {
        query()
      }
    })

    return {
      refTable,
      tableHeight,
      ...toRefs(page),
      handleSizeChange,
      handleCurrentChange,
      handleSortChange,
      handleFilterChange
    }
  }
})
</script>

<style lang="scss" scoped>
.bbar {
  margin-top: 5px;
  padding: 0 10px 0 5px;
}
</style>
