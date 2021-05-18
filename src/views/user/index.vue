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
    <x-table :data="resp.list" :total="resp.total" :top="32" @query="handleQuery">
      <el-table-column prop="loginName" label="账号" />
      <el-table-column prop="userName" label="姓名" />
      <el-table-column
        column-key="userType"
        label="类型"
        prop="userType"
        :formatter="handleFormatter"
        :filters="[
          { text: '学生', value: '1' },
          { text: '教职工', value: '2' },
          { text: '虚拟账号', value: '0' }
        ]"
      ></el-table-column>
      <el-table-column
        column-key="userStatus"
        prop="userStatus"
        label="状态"
        :formatter="handleFormatter"
        :filters="[
          { text: '启用', value: '1' },
          { text: '禁用', value: '0' }
        ]"
      />
      <el-table-column prop="expiryDate" label="有效期" />
      <el-table-column prop="cellphone" label="手机号码" />
      <el-table-column prop="email" label="邮箱" show-overflow-tooltip />
      <el-table-column prop="cellphone" label="头像" :sortable="false" />
      <el-table-column prop="cellphone" label="角色" :sortable="false" />
      <el-table-column prop="cellphone" label="修改" :sortable="false" />
    </x-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { userApi } from '@/api/modules/user'
import { Pagination } from '@/typings'

export default defineComponent({
  setup() {
    const state = reactive({ resp: { list: [], total: 0 } })

    const handleQuery = (page: Pagination) => {
      userApi.getUsers(page).then(resp => {
        if (resp.success) {
          state.resp = resp.data
        }
      })
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

    return {
      ...toRefs(state),
      handleQuery,
      handleFormatter
    }
  }
})
</script>

<style lang="scss" scoped></style>
