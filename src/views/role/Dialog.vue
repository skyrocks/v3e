<template>
  <el-dialog :model-value="dialogVisible" title="选择角色" top="5vh" width="65%" @closed="handleCancel">
    <x-table
      ref="refTable"
      :data="resp.list"
      :total="resp.total"
      :columns="columns"
      :init-query="true"
      :loading="loading"
      :height="tableHeight"
      @query="handleQuery"
      @selection-change="handleSelectionChange"
    >
      <template #column-roleStatus="scope">
        <el-tag v-if="scope.data === 0" type="info" effect="dark" size="mini">禁用</el-tag>
        <template v-else>启用</template>
      </template>
    </x-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :disabled="roles.selected.length === 0" @click="handleOk">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
import { ElDialog, ElTag } from 'element-plus'
import { roleApi } from '@/api/modules/role'
import { Pagination } from '@/typings'
import { util } from '@/utils'
import { Role } from './type'

export default defineComponent({
  components: { [ElDialog.name]: ElDialog, [ElTag.name]: ElTag },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['ok', 'update:visible'],
  setup(props, { emit }) {
    const dialogVisible = computed(() => props.visible)

    const refTable = ref()
    const tableHeight = computed(() => util.getContentHeight() * 0.65)

    const tableData = reactive({ resp: { list: [], total: 0 } })
    const filters = {
      roleType: [
        { text: '自定义角色', value: '1' },
        { text: '系统定义角色', value: '0' }
      ],
      roleStatus: [
        { text: '启用', value: '1' },
        { text: '禁用', value: '0' }
      ]
    }

    const handleFormatter = (row: any, column: any, cellValue: any) => {
      if (column.property === 'roleType') {
        if (cellValue === 1) {
          return '自定义角色'
        } else {
          return '系统定义角色'
        }
      } else if (column.property === 'roleStatus') {
        if (cellValue === 1) {
          return '启用'
        } else {
          return '禁用'
        }
      }
    }
    const columns = [
      { prop: 'roleName', label: '角色名称', width: 300 },
      { prop: 'roleType', label: '类型', formatter: handleFormatter, filters: filters.roleType, width: 150 },
      { prop: 'roleStatus', label: '状态', formatter: handleFormatter, filters: filters.roleType }
    ]

    const loading = ref(false)
    const handleQuery = (page: Pagination) => {
      loading.value = true
      roleApi.getRoles(page).then(resp => {
        if (resp.success) {
          tableData.resp = resp.data
        }
        loading.value = false
      })
    }

    const roles = reactive<{ selected: Role[] }>({ selected: [] })
    const handleSelectionChange = (selection: Role[]) => {
      roles.selected = selection
    }

    const handleOk = () => {
      const selectedRoles: Role[] = []
      roles.selected.forEach((role: Role) => {
        selectedRoles.push(Object.assign({}, role))
      })
      refTable.value.table.clearSelection()
      emit('update:visible', false)
      emit('ok', { roles: selectedRoles })
    }
    const handleCancel = () => {
      refTable.value.table.clearSelection()
      emit('update:visible', false)
    }

    return {
      dialogVisible,

      refTable,
      handleQuery,
      loading,
      columns,
      tableHeight,
      ...toRefs(tableData),

      roles,
      handleSelectionChange,
      handleOk,
      handleCancel
    }
  }
})
</script>

<style lang="scss" scoped></style>
