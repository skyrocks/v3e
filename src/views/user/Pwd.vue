<template>
  <el-dialog :model-value="dialogVisible" :title="form.title" width="35%" @closed="handleCancel">
    <el-form ref="refForm" :model="form" :rules="form.rules">
      <el-form-item prop="pwd">
        <el-input v-model="form.pwd" autocomplete="off" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCancel">取 消</el-button>
        <x-button size="large" @click="handleSave">保 存</x-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, reactive, watch, ref } from 'vue'
import { ElDialog, ElMessage } from 'element-plus'
import { User } from './type'
import { userApi } from '@/api/modules/user'

export default defineComponent({
  components: {
    [ElDialog.name]: ElDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    users: {
      type: Array as PropType<User[]>,
      default: () => []
    }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const dialogVisible = computed(() => props.visible)

    const refForm = ref()
    const form = reactive<{ pwd: string; title: string; rules: any }>({
      pwd: '',
      title: '',
      rules: {
        pwd: [
          { required: true, message: '请输入密码' },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)(?![A-Z\W_]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/,
            message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为8 - 30位'
          }
        ]
      }
    })
    watch(
      () => props.users,
      value => {
        if (value) {
          if (props.users.length > 1) {
            form.title = `修改 ${props.users.length} 个用户的密码`
          } else if (props.users.length === 1) {
            form.title = `修改用户 ( ${props.users[0].userName} ) 的密码`
          }
        }
      },
      {
        deep: true
      }
    )

    const handleSave = () => {
      const userIds = props.users.map(user => {
        return user.userId
      })
      userApi.updatePwd(userIds, form.pwd).then(resp => {
        if (resp.success) {
          emit('update:visible', false)
          refForm.value.resetFields()
          refForm.value.clearValidate()
          ElMessage.success('账号密码已经修改成功')
        } else {
          ElMessage.error(resp.message)
        }
      })
    }
    const handleCancel = () => {
      emit('update:visible', false)
      refForm.value.resetFields()
      refForm.value.clearValidate()
    }

    return { dialogVisible, refForm, form, handleSave, handleCancel }
  }
})
</script>

<style lang="scss" scoped></style>
