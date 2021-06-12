<template>
  <el-dialog :model-value="dialogVisible" :title="form.title" @closed="handleCancel">
    <el-form :model="form.data" :rules="form.rules" label-width="80px" style="margin-right: 30px">
      <el-form-item label="账号" prop="loginName">
        <el-input v-model="form.data.loginName" autocomplete="off" :disabled="form.data.userType !== 0"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="form.data.userName" autocomplete="off" :disabled="form.data.userType !== 0"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="cellphone">
        <el-input v-model="form.data.cellphone" autocomplete="off" :disabled="form.data.userType !== 0"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="form.data.email" autocomplete="off" :disabled="form.data.userType !== 0"></el-input>
      </el-form-item>
      <el-form-item label="有效期" prop="expiryDate">
        <el-date-picker v-model="form.data.expiryDate" type="date"></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="userStatus">
        <el-switch v-model="form.data.userStatus" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCancel">取 消</el-button>
        <x-button size="large" @click="handleSave">保 存</x-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch, PropType } from 'vue'
import { ElDialog, ElTag, ElDatePicker, ElSwitch, ElMessage } from 'element-plus'
import { util } from '@/utils'
import { User } from './type'
import { userHooks } from './hooks'
import { userApi } from '@/api/modules/user'

export default defineComponent({
  components: {
    [ElDialog.name]: ElDialog,
    [ElTag.name]: ElTag,
    [ElDatePicker.name]: ElDatePicker,
    [ElSwitch.name]: ElSwitch
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object as PropType<User>,
      default: () => {}
    }
  },
  emits: ['save', 'update:visible'],
  setup(props, { emit }) {
    const { emptyUser, formatUserType, validate, setUser } = userHooks()

    const dialogVisible = computed(() => props.visible)

    const form = reactive<{ data: User; title: string; rules: any }>({
      data: emptyUser(),
      title: '',
      rules: {
        userName: [{ required: true, message: '请输入姓名' }],
        loginName: [{ required: true, validator: validate.loginNameExists }],
        password: [
          { required: true, message: '请输入密码' },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)(?![A-Z\W_]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/,
            message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为8 - 30位'
          }
        ],
        cellphone: [{ validator: validate.cellphoneExists }],
        email: [{ validator: validate.emailExists }]
      }
    })
    watch(
      () => props.formData.userId,
      value => {
        if (value) {
          form.data = util.cloneObject(props.formData)
          form.title = `修改用户 ( ${formatUserType(props.formData.userType)} )`
          setUser(form.data)
        }
      }
    )

    const handleSave = () => {
      userApi.update(form.data).then(resp => {
        if (resp.success) {
          emit('update:visible', false)
          emit('save', { form: form.data })
          ElMessage.success('账号信息已经修改成功')
        } else {
          ElMessage.error(resp.message)
        }
      })
    }
    const handleCancel = () => {
      emit('update:visible', false)
    }

    return { dialogVisible, form, handleSave, handleCancel }
  }
})
</script>

<style lang="scss" scoped></style>
