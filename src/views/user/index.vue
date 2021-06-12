<template>
  <div>
    <el-button-group>
      <x-button icon="el-icon-key" @click="() => modifyStatus(1)">激活</x-button>
      <x-button icon="el-icon-lock" @click="() => modifyStatus(0)">禁用</x-button>
      <x-button icon="el-icon-edit-outline" @click="handleEditPwd">修改密码</x-button>
      <x-button icon="el-icon-edit" @click="handleEditExpiry">修改有效期</x-button>
      <!-- <x-button icon="el-icon-circle-plus-outline">添加虚拟账号</x-button>
      <x-button icon="el-icon-remove-outline">删除虚拟账号</x-button> -->
    </el-button-group>
    <x-table
      :data="resp.list"
      :total="resp.total"
      :columns="columns"
      :top="32"
      :init-query="true"
      :loading="loading"
      @query="handleQuery"
      @selection-change="handleSelectionChange"
    >
      <template #column-userStatus="scope">
        <el-tag v-if="scope.data === 0" type="info" effect="dark" size="mini">禁用</el-tag>
        <template v-else>启用</template>
      </template>
      <template #column-photo="scope">
        <el-upload
          v-if="!scope.row.existsPhoto"
          :action="`${photoUploadParams.action}/${scope.row.userId}`"
          :headers="photoUploadParams.header"
          :show-file-list="false"
          :before-upload="file => handleBeforeUpPhoto(file)"
          :on-success="(res, file, fileList) => handleSuccessUpPhoto(file, scope.row)"
          accept="image/png,image/jpg,image/jpeg"
        >
          <el-tooltip content="上传头像" placement="top">
            <el-button icon="el-icon-upload2" circle size="mini"></el-button>
          </el-tooltip>
        </el-upload>
        <el-image
          v-else
          class="photo"
          :src="photoUrls[scope.data]"
          fit="cover"
          :lazy="true"
          :preview-src-list="[photoUrls[scope.data]]"
          :hide-on-click-modal="true"
        >
          <template #error>
            <el-upload
              :action="`${photoUploadParams.action}/${scope.row.userId}`"
              :headers="photoUploadParams.header"
              :show-file-list="false"
              :before-upload="file => handleBeforeUpPhoto(file)"
              :on-success="(res, file, fileList) => handleSuccessUpPhoto(file, scope.row)"
              accept="image/png,image/jpg,image/jpeg"
            >
              <el-tooltip content="上传头像" placement="top">
                <el-button icon="el-icon-upload2" circle size="mini"></el-button>
              </el-tooltip>
            </el-upload>
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
              @close="handleRemoveRole(scope.row, r.roleId, r.roleName, i)"
            >
              {{ r.roleName }}
            </el-tag>
            <x-button
              v-if="allow.edit"
              size="mini"
              x-type="white"
              icon="el-icon-plus"
              @click="handleAddRole(scope.row)"
            >
              添加角色
            </x-button>
          </el-space>
          <template #reference>
            <span v-if="scope.row.roles.length > 0">{{ scope.row.roles.length }} 个角色</span>
            <template v-else></template>
          </template>
        </el-popover>
        <x-button
          v-else-if="scope.row.roles.length === 0 && allow.edit"
          x-type="white"
          size="mini"
          icon="el-icon-plus"
          @click="handleAddRole(scope.row)"
        >
          添加角色
        </x-button>
        <template v-else></template>
      </template>
      <!-- <template #column-edit="scope">
        <x-button size="mini" x-type="white" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</x-button>
      </template> -->
    </x-table>
    <RoleGrid v-model:visible="roleGridVisible" @ok="handleSelectedRoles"></RoleGrid>
    <!-- <Form v-model:visible="fromVisible" :form-data="currentUser?.data" @save="handleSave"></Form> -->
    <FormPwd v-model:visible="fromPwdVisible" :users="currentUser?.list"></FormPwd>
    <FormExpiry v-model:visible="fromExpiryVisible" :users="currentUser?.list" @save="handleUpdateExpiry"></FormExpiry>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, computed } from 'vue'
import { userApi } from '@/api/modules/user'
import { ElPopover, ElLink, ElTag, ElImage, ElSpace, ElMessage, ElTooltip, ElUpload } from 'element-plus'
import { Pagination } from '@/typings'
import { log, permission, util, env, header } from '@/utils'
import { User } from './type'
import { Role } from '@/views/role/type'
import RoleGrid from '@/views/role/Dialog.vue'
// import Form from './Form.vue'
import { userHooks } from './hooks'
import FormPwd from './Pwd.vue'
import FormExpiry from './Expiry.vue'

export default defineComponent({
  components: {
    [ElPopover.name]: ElPopover,
    [ElLink.name]: ElLink,
    [ElTag.name]: ElTag,
    [ElImage.name]: ElImage,
    [ElSpace.name]: ElSpace,
    [ElTooltip.name]: ElTooltip,
    [ElUpload.name]: ElUpload,
    RoleGrid,
    // Form
    FormPwd,
    FormExpiry
  },
  setup() {
    const allow = computed(() => {
      return {
        edit: permission.has('EditRole')
      }
    })

    const tableData = reactive({ resp: { list: [], total: 0 } })

    const { filters, formatUserType, formatUserStatus, emptyUser } = userHooks()

    const handleFormatter = (row: any, column: any, cellValue: any) => {
      if (column.property === 'userType') {
        return formatUserType(cellValue)
      } else if (column.property === 'userStatus') {
        return formatUserStatus(cellValue)
      }
    }

    const columns = [
      { prop: 'loginName', label: '账号', fixed: true, width: 120 },
      { prop: 'userName', label: '姓名', fixed: true, width: 120 },
      { prop: 'userType', label: '类型', formatter: handleFormatter, filters: filters.userType, width: 110 },
      { prop: 'userStatus', label: '状态', formatter: handleFormatter, filters: filters.userStatus, width: 110 },
      { prop: 'expiryDate', label: '有效期', width: 120 },
      { prop: 'cellphone', label: '手机号码', width: 120 },
      { prop: 'email', label: '邮箱', width: 180 },
      {
        prop: 'userId',
        scope: 'role',
        label: '角色',
        search: false,
        sortable: false,
        showOverflowTooltip: false,
        width: 150,
        isExport: false
      },
      { prop: 'userId', scope: 'photo', label: '头像', search: false, sortable: false, isExport: false }
      // { prop: 'userId', scope: 'edit', label: '修改', search: false, sortable: false, isExport: false }
    ]

    const loading = ref(false)
    const handleQuery = (page: Pagination) => {
      loading.value = true
      userApi.getUsers(page).then(resp => {
        if (resp.success) {
          tableData.resp = resp.data
        }
        loading.value = false

        resp.data.list.forEach((user: User) => {
          if (user.existsPhoto) {
            getPhoto(user.userId)
          }
        })
      })
    }

    const photoUrls = reactive<{ [key: string]: string }>({})
    const getPhoto = (userId: string) => {
      if (!photoUrls[userId]) {
        userApi.browserPhoto(userId).then(res => {
          photoUrls[userId] = URL.createObjectURL(new Blob([res.origin]))
        })
      }
    }

    const currentUser = reactive<{ data: User; list: User[] }>({ data: emptyUser(), list: [] })

    const handleSelectionChange = (selection: User[]) => {
      currentUser.list = selection
    }

    // 角色增加删除
    const handleRemoveRole = (user: User, roleId: string, roleName: string, index: number) => {
      log.action('删除角色')
      userApi.removeRole(user.userId, roleId).then(resp => {
        if (resp.success) {
          user.roles.splice(index, 1)
          ElMessage.success(`角色 [ ${roleName} ] 已删除`)
        } else {
          ElMessage.error(resp.message)
        }
      })
    }
    const roleGridVisible = ref(false)
    const handleAddRole = (user: User) => {
      roleGridVisible.value = true
      currentUser.data = user
    }
    const handleSelectedRoles = ({ roles }: any) => {
      log.action('添加角色')
      const roleIds: string[] = []
      roles.forEach((r: Role) => {
        roleIds.push(r.roleId)
      })
      const user: User = currentUser.data as User
      userApi.addRoles(user.userId, roleIds).then(resp => {
        if (resp.success) {
          user.roles = util.concatUnique(user.roles, roles, 'roleId')
          ElMessage.success(`${roles.length} 个角色已添加`)
        } else {
          ElMessage.error(resp.message)
        }
      })
    }

    // 照片上传
    const photoUploadParams = {
      action: `${env.API_BASE}/users/photo`,
      header: header.getAuthorization()
    }
    const handleBeforeUpPhoto = (file: any) => {
      const isPicture = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 5
      if (!isPicture) {
        ElMessage.error('上传头像图片只能是 JPG, JPEG, PNG 格式!')
      }
      if (!isLt1M) {
        ElMessage.error('上传头像图片大小不能超过 1MB!')
      }
      return isPicture && isLt1M
    }
    const handleSuccessUpPhoto = (file: any, user: User) => {
      log.action('上传照片')
      photoUrls[user.userId] = URL.createObjectURL(file.raw)
      user.existsPhoto = true
    }

    // 编辑窗口
    // const fromVisible = ref(false)
    // const handleEdit = (user: User) => {
    //   currentUser.data = user
    //   fromVisible.value = true
    // }
    // const handleSave = ({ form }: any) => {
    //   console.log(form)
    // }

    // 用户激活禁用
    const modifyStatus = (status: number) => {
      if (currentUser.list.length === 0) {
        return
      }
      const userIds = currentUser.list.map(user => {
        return user.userId
      })
      userApi.updateStatus(userIds, status).then(resp => {
        if (resp.success) {
          currentUser.list.forEach(user => {
            user.userStatus = status
          })
          ElMessage.success(status === 1 ? '用户账号已激活' : '用户账号已禁用')
        } else {
          ElMessage.error(resp.message)
        }
      })
    }

    // 修改密码
    const fromPwdVisible = ref(false)
    const handleEditPwd = () => {
      if (currentUser.list.length === 0) {
        return
      }
      fromPwdVisible.value = true
    }

    // 修改有效期
    const fromExpiryVisible = ref(false)
    const handleEditExpiry = () => {
      if (currentUser.list.length === 0) {
        return
      }
      fromExpiryVisible.value = true
    }
    const handleUpdateExpiry = (expiryDate: string) => {
      currentUser.list.forEach(user => {
        user.expiryDate = expiryDate
      })
    }

    return {
      columns,
      loading,

      ...toRefs(tableData),
      handleQuery,
      handleFormatter,
      handleSelectionChange,

      photoUrls,
      currentUser,

      allow,
      roleGridVisible,
      handleRemoveRole,
      handleAddRole,
      handleSelectedRoles,

      photoUploadParams,
      handleBeforeUpPhoto,
      handleSuccessUpPhoto,

      // fromVisible,
      // handleEdit,
      // handleSave,

      modifyStatus,

      fromPwdVisible,
      handleEditPwd,

      fromExpiryVisible,
      handleEditExpiry,
      handleUpdateExpiry
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
  &:hover {
    box-shadow: $--box-shadow-light;
  }
}
.image-slot {
  cursor: pointer;
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
