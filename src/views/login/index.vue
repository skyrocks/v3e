<template>
  <div class="bg">
    <el-row>
      <el-col :span="6" :offset="14">
        <div class="login-container">
          <div class="login-type-container">
            <el-button type="text" size="large" @click="state.loginType = 0">
              <span :class="`login-type ${state.loginType === 0 ? 'active' : ''}`">密码登录</span>
            </el-button>
            <el-button type="text" size="large" @click="state.loginType = 1">
              <span :class="`login-type ${state.loginType === 1 ? 'active' : ''}`">短信登录</span>
            </el-button>
          </div>
          <div v-show="state.loginType === 0" class="login-pwd-container">
            <el-form>
              <el-form-item>
                <el-input v-model="state.form.loginName" size="large" placeholder="请输入账号">
                  <template #prepend><i class="el-icon-user icon-style"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="state.form.password" size="large" placeholder="请输入密码" type="password">
                  <template #prepend><i class="el-icon-lock icon-style"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="state.form.captcha"
                  size="large"
                  placeholder="请输入验证码"
                  style="width: 65%"
                  @keyup.enter="handlePwdLogin"
                >
                  <template #prepend><i class="el-icon-c-scale-to-original icon-style"></i></template>
                </el-input>
                <div style="width: 34%; display: inline-block">
                  <el-tooltip effect="dark" content="点击刷新" placement="bottom" :open-delay="500">
                    <el-image class="captcha-img" :src="state.captchaUrl" @click="handleRefreshCaptcha">
                      <template #placeholder>
                        <div class="image-slot"> 加载中 <i class="el-icon-loading"></i> </div>
                      </template>
                      <template #error>
                        <div class="image-slot" @click="handleRefreshCaptcha"> 失败重试 </div>
                      </template>
                    </el-image>
                  </el-tooltip>
                </div>
              </el-form-item>
              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :disabled="disabledLoginPwdBtn"
                :loading="state.loading"
                @click="handlePwdLogin"
              >
                <span class="submit-text">登录</span>
              </el-button>
            </el-form>
            <!-- <div class="tbar">
              <el-button type="text"><span class="forget-pwd">忘记密码</span></el-button>
            </div> -->
          </div>
          <div v-show="state.loginType === 1" class="login-sms-container">
            <el-form layout="vertical">
              <el-form-item>
                <el-input
                  v-model="state.sms.cellphone"
                  size="large"
                  placeholder="请输入手机号码"
                  @keydown="handleInputCellphone($event)"
                >
                  <template #prepend><i class="el-icon-mobile-phone icon-style"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="state.sms.code"
                  size="large"
                  placeholder="请输入短信验证码"
                  @keyup.enter="handleSmsLogin"
                >
                  <template #prepend><i class="el-icon-c-scale-to-original icon-style"></i></template>
                  <template #suffix>
                    <el-button type="text" size="large" :disabled="disabledSendSmsCodeBtn" @click="handleSendSmsCode">
                      <span :class="`get-smsCode ${state.waiting ? 'waiting' : ''}`">
                        {{ state.waiting ? state.waitText : '发送验证码' }}
                      </span>
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :disabled="disabledLoginSmsBtn"
                :loading="state.loading"
                @click="handleSmsLogin"
              >
                <span class="submit-text">登录</span>
              </el-button>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElTooltip, ElImage } from 'element-plus'
import { env, token, util } from '@/utils'
import { authApi } from '@/api/modules/auth'
import { CustomResponse } from '@/api/types'

export default defineComponent({
  components: {
    [ElTooltip.name]: ElTooltip,
    [ElImage.name]: ElImage
  },
  setup() {
    // 定义所有响应式变量
    const state = reactive({
      loginType: 0,
      form: {
        loginName: '',
        password: '',
        captcha: '',
        captchaId: ''
      },
      captchaUrl: '',
      sms: {
        id: '',
        code: '',
        cellphone: ''
      },
      loading: false,
      waiting: false,
      waitText: ''
    })

    // 定义页面按照状态变量
    const disabledLoginPwdBtn = computed(
      () => !(state.form.loginName !== '' && state.form.password !== '' && state.form.captcha !== '')
    )
    const disabledLoginSmsBtn = computed(() => !(state.sms.cellphone !== '' && state.sms.code !== ''))
    const disabledSendSmsCodeBtn = computed(() => !(state.sms.cellphone !== '' && !state.waiting))

    const router = useRouter()
    const route = useRoute()

    const handleRefreshCaptcha = () => {
      state.form.captchaId = util.uuid()
      state.captchaUrl = `${env.API_BASE}/auth/captcha/${state.form.captchaId}`
    }
    const handlePwdLogin = () => {
      if (state.form.loginName !== '' && state.form.password != '' && state.form.captcha != '') {
        state.loading = true
        authApi.login(state.form).then(loginCallback)
      }
    }

    const handleSmsLogin = () => {
      if (state.sms.cellphone !== '' && state.sms.code != '' && state.sms.id != '') {
        if (state.sms.cellphone.length !== 11) {
          ElMessage.error('手机号码不合法')
        } else {
          state.loading = true
          authApi.loginSms(state.sms).then(loginCallback)
        }
      }
    }
    const handleSendSmsCode = () => {
      if (state.sms.cellphone !== '') {
        if (state.sms.cellphone.length !== 11) {
          ElMessage.error('手机号码不合法')
        } else {
          state.sms.id = util.uuid()
          authApi.sendSmsCode(state.sms).then(resp => {
            if (!resp.success) {
              ElMessage.error(resp.message)
            } else {
              waitSmsCode()
            }
          })
        }
      }
    }

    // 登录成功后的反馈函数
    const loginCallback = (resp: CustomResponse) => {
      state.loading = false
      if (resp.success) {
        token.set(resp.data)
        router.push({ path: (route.query.redirect || '/') as string })
      } else {
        ElMessage.error(resp.message)
      }
    }

    const stateTime = reactive<{ intervalId: any; lastTime: number }>({ intervalId: '', lastTime: 60 })
    const waitSmsCode = () => {
      state.waiting = true
      state.waitText = '60s后获取'
      stateTime.intervalId = setInterval(() => {
        state.waitText = `${stateTime.lastTime}s后获取`
        stateTime.lastTime--
        if (stateTime.lastTime <= 0) {
          clearInterval(stateTime.intervalId) // 清除计时器
          stateTime.intervalId = 0 // 设置为null
          stateTime.lastTime = 60
          state.waiting = false
        }
      }, 1000)
    }

    const handleInputCellphone = () => {
      //区分不同浏览器,不同操作系统,大键盘小键盘
      //console.log(e)
    }

    onMounted(handleRefreshCaptcha)

    return {
      state,

      disabledLoginPwdBtn,
      disabledLoginSmsBtn,
      disabledSendSmsCodeBtn,

      handleRefreshCaptcha,
      handlePwdLogin,
      handleSmsLogin,
      handleSendSmsCode,

      handleInputCellphone
    }
  }
})
</script>
<style lang="scss" scoped>
.bg {
  min-height: 100%;
  background-image: url('../../assets/images/login-bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}
.login-container {
  background-color: #fafafa66;
  border-radius: 1rem;
  height: 42rem;
  margin-top: 40%;
  box-shadow: $--box-shadow-base;
  padding: 1.5rem;
  .login-type-container {
    padding: 1.5rem;
    .login-type {
      font-size: $--size-font-medium;
      font-weight: 400;
      color: $--color-text-base;
      opacity: 0.7;
      &.active {
        border-bottom: 1px solid $--color-border-1level;
        padding-bottom: 1rem;
        font-weight: bold;
        opacity: 1;
      }
    }
  }

  .login-pwd-container,
  .login-sms-container {
    padding: 1.5rem;
    .captcha-img {
      padding: 2px 1px 2px 10px;
      width: 100%;
      height: 40px;
      cursor: pointer;
    }
    .get-smsCode {
      padding-right: 1rem;
      &.waiting {
        color: $--color-text-secondary;
      }
    }
    .icon-style {
      font-size: $--size-font-x-large;
    }
    .submit-text {
      font-size: $--size-font-x-large;
      letter-spacing: 0.5rem;
    }
    .submit-text {
      font-size: $--size-font-x-large;
      letter-spacing: 0.5rem;
    }
    .tbar {
      text-align: right;
      .forget-pwd {
        color: $--color-text-base;
      }
    }
  }

  .image-slot {
    padding: 0 15px;
    background-color: $--color-bg-base;
    color: $--color-text-secondary;
  }
}
</style>
