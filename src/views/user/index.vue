<template>
  <div>
    <div style="padding: 0 10px">
      <el-button-group>
        <x-button icon="el-icon-key">激活</x-button>
        <x-button icon="el-icon-lock">禁用</x-button>
        <x-button icon="el-icon-edit-outline">修改密码</x-button>
        <x-button icon="el-icon-edit">修改有效期</x-button>
        <x-button icon="el-icon-circle-plus-outline">添加虚拟账号</x-button>
        <x-button icon="el-icon-remove-outline">删除虚拟账号</x-button>
      </el-button-group>
    </div>
    <x-table
      :data="resp.list"
      :total="resp.total"
      :columns="columns"
      :top="32"
      :init-query="true"
      :loading="loading"
      @query="handleQuery"
    >
      <template #column-userStatus="scope">
        <el-tag v-if="scope.data === 0" type="info" effect="dark" size="mini">禁用</el-tag>
        <template v-else>启用</template>
      </template>
    </x-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { userApi } from '@/api/modules/user'
import { ElPopover, ElLink, ElTag } from 'element-plus'
import { Pagination } from '@/typings'
// import Search from '@/components/table/Search.vue'

export default defineComponent({
  components: { [ElPopover.name]: ElPopover, [ElLink.name]: ElLink, [ElTag.name]: ElTag },
  setup() {
    const tableData = reactive({ resp: { list: [], total: 0 } })

    const filters = {
      userType: [
        { text: '学生', value: '1' },
        { text: '教职工', value: '2' },
        { text: '虚拟账号', value: '0' }
      ],
      userStatus: [
        { text: '启用', value: '1' },
        { text: '禁用', value: '0' }
      ]
    }

    const handleFormatter = (row: any, column: any, cellValue: any) => {
      if (column.property === 'userType') {
        if (cellValue === 1) {
          return '学生'
        } else if (cellValue === 2) {
          return '教职工'
        } else {
          return '虚拟账号'
        }
      } else if (column.property === 'userStatus') {
        if (cellValue === 1) {
          return '启用'
        } else {
          return '禁用'
        }
      }
    }

    const columns = [
      { prop: 'loginName', label: '账号', fixed: true, width: 100 },
      { prop: 'userName', label: '姓名', fixed: true, width: 100 },
      { prop: 'userType', label: '类型', formatter: handleFormatter, filters: filters.userType, width: 110 },
      { prop: 'userStatus', label: '状态', formatter: handleFormatter, filters: filters.userStatus, width: 110 },
      { prop: 'expiryDate', label: '有效期', width: 110 },
      { prop: 'cellphone', label: '手机号码', width: 120 },
      { prop: 'email', label: '邮箱', width: 150 },
      { prop: 'expiryDate', label: '头像', search: false, sortable: false, width: 100 },
      { prop: 'cellphone', label: '角色', search: false, sortable: false, width: 120 },
      { prop: 'email', label: '修改', sortable: false }
    ]

    const loading = ref(false)
    const handleQuery = (page: Pagination) => {
      loading.value = true
      userApi.getUsers(page).then(resp => {
        if (resp.success) {
          tableData.resp = resp.data
        }
        loading.value = false
      })
    }

    return {
      columns,
      loading,

      ...toRefs(tableData),
      handleQuery,
      handleFormatter
    }
  }
})
</script>

<style lang="scss" scoped>
.filter-button {
  background: transparent;
  border: none;
  color: #606266;
  cursor: pointer;
  font-size: 13px;
  padding: 0 3px;
  min-height: 18px;
  &[disabled] {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  &:hover {
    color: $--color-text-link;
  }
  &[disabled]:hover {
    color: #c0c4cc;
  }

  & + .filter-button {
    margin-left: 3px;
  }
}
.split-line {
  border-top: 1px solid #ebeef5;
  padding: 8px;
}
::v-deep(.el-link) {
  &.el-link--inner:hover {
    text-decoration: none !important;
  }
}
</style>
