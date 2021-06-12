<template>
  <el-dialog :model-value="dialogVisible" :title="form.title" width="35%" @closed="handleCancel">
    <el-form ref="refForm" :model="form">
      <el-form-item prop="expiryDate">
        <el-date-picker
          v-model="form.expiryDate"
          type="date"
          placeholder="选择有效期"
          format="YYYY 年 MM 月 DD 日"
          style="width: 100%"
        ></el-date-picker>
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
import { ElDialog, ElMessage, ElDatePicker } from 'element-plus'
import { User } from './type'
import { userApi } from '@/api/modules/user'
import dayjs from 'dayjs'

export default defineComponent({
  components: {
    [ElDialog.name]: ElDialog,
    [ElDatePicker.name]: ElDatePicker
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
  emits: ['save', 'update:visible'],
  setup(props, { emit }) {
    const dialogVisible = computed(() => props.visible)

    const refForm = ref()
    const form = reactive<{ expiryDate: string; title: string }>({
      expiryDate: '',
      title: ''
    })
    watch(
      () => props.users,
      value => {
        if (value) {
          if (props.users.length > 1) {
            form.title = `修改 ${props.users.length} 个用户的账号有效期`
            form.expiryDate = ''
          } else if (props.users.length === 1) {
            form.title = `修改用户 ( ${props.users[0].userName} ) 的账号有效期`
            form.expiryDate = props.users[0].expiryDate
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
      const expiryDate = dayjs(form.expiryDate).format('YYYY-MM-DD')
      userApi.updateExpiry(userIds, expiryDate).then(resp => {
        if (resp.success) {
          emit('update:visible', false)
          emit('save', expiryDate)
          refForm.value.resetFields()
          refForm.value.clearValidate()
          ElMessage.success('账号有效期已经修改成功')
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
