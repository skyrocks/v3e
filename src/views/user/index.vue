<template>
  <div>
    <el-button-group>
      <x-button icon="el-icon-key">激活</x-button>
      <x-button icon="el-icon-lock">禁用</x-button>
      <x-button icon="el-icon-edit-outline">修改密码</x-button>
      <x-button icon="el-icon-edit">修改有效期</x-button>
      <x-button icon="el-icon-circle-plus-outline">添加虚拟账号</x-button>
      <x-button icon="el-icon-remove-outline">删除虚拟账号</x-button>
    </el-button-group>
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
      <template #column-photo="scope">
        <el-image class="photo" :src="`${photoUrls[scope.data]}`" fit="cover">
          <template #error>
            <div class="image-slot">
              <i class="el-icon-user"></i>
            </div>
          </template>
        </el-image>
      </template>
      <template #column-role="scope">
        <el-popover v-if="scope.row.roles.length > 0" trigger="hover" placement="left" :width="300">
          <el-space wrap>
            <el-tag
              v-for="(r, i) in scope.row.roles"
              :key="i"
              :closable="allow.edit"
              :disable-transitions="true"
              @close="onRemoveRole(scope.row, r.roleId, i)"
            >
              {{ r.roleName }}
            </el-tag>
            <x-button v-if="allow.edit" size="mini" x-type="white" icon="el-icon-plus">添加角色</x-button>
          </el-space>
          <template #reference>
            <span v-if="scope.row.roles.length > 1">{{ scope.row.roles.length }} 个角色</span>
            <span v-else-if="scope.row.roles.length === 1">{{ scope.row.roles[0].roleName }}</span>
            <template v-else></template>
          </template>
        </el-popover>
        <x-button v-else-if="scope.row.roles.length === 0 && allow.edit" x-type="white" size="mini" icon="el-icon-plus"
          >添加角色</x-button
        >
        <template v-else></template>
      </template>
      <template #column-edit>
        <x-button size="mini" x-type="white" icon="el-icon-edit">修改</x-button>
      </template>
    </x-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, computed } from 'vue'
import { userApi } from '@/api/modules/user'
import { ElPopover, ElLink, ElTag, ElImage, ElSpace } from 'element-plus'
import { Pagination } from '@/typings'
import { permission } from '@/utils/index'

export default defineComponent({
  components: {
    [ElPopover.name]: ElPopover,
    [ElLink.name]: ElLink,
    [ElTag.name]: ElTag,
    [ElImage.name]: ElImage,
    [ElSpace.name]: ElSpace
  },
  setup() {
    const allow = computed(() => {
      return {
        edit: permission.has('EditRole')
      }
    })

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
      { prop: 'userId', scope: 'photo', label: '头像', search: false, sortable: false, width: 100, isExport: false },
      {
        prop: 'userId',
        scope: 'role',
        label: '角色',
        search: false,
        sortable: false,
        showOverflowTooltip: false,
        width: 125,
        isExport: false
      },
      { prop: 'userId', scope: 'edit', label: '修改', search: false, sortable: false, isExport: false }
    ]

    const loading = ref(false)
    const handleQuery = (page: Pagination) => {
      loading.value = true
      userApi.getUsers(page).then(resp => {
        if (resp.success) {
          tableData.resp = resp.data
        }
        loading.value = false

        resp.data.list.forEach((user: any) => {
          if (user.existsPhoto) {
            getPhoto(user.userId)
          }
        })
      })
    }

    const photoUrls = reactive<{ [key: string]: any }>({})
    const getPhoto = (userId: string) => {
      if (!photoUrls[userId]) {
        userApi.browserPhoto(userId).then(res => {
          photoUrls[userId] = URL.createObjectURL(new Blob([res.origin]))
          //const { index, row } = this.$refs.grid.getRow('userId', userId)
          // table刷新字段
          //this.$refs.grid.updateRow(index, row)
        })
      }
    }

    const onRemoveRole = () => {
      // console.log('onRemoveRole')
    }

    return {
      columns,
      loading,

      photoUrls,

      ...toRefs(tableData),
      handleQuery,
      handleFormatter,

      allow,
      onRemoveRole
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
.photo {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: $--size-font-medium;
  color: $--color-text-placeholder;
  background-color: $--color-bg-base;
  vertical-align: middle;
  width: 28px;
  height: 28px;
  line-height: 28px;
  border-radius: 50%;
}
</style>
