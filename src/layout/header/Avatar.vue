<template>
  <el-dropdown @command="commandHanlder">
    <el-image class="avatar" :src="photoUrl" fit="cover">
      <template #error>
        <el-avatar size="medium" fit="cover">
          {{ name }}
        </el-avatar>
      </template>
    </el-image>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="Me"><i class="el-icon-user"></i> 个人中心</el-dropdown-item>
        <el-dropdown-item command="Logout"><i class="el-icon-switch-button"></i> 退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { userApi } from '@/api/modules/user'
import { ElImage, ElAvatar, ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import { confirm } from '@/plugins'

export default defineComponent({
  components: {
    [ElImage.name]: ElImage,
    [ElAvatar.name]: ElAvatar,
    [ElDropdown.name]: ElDropdown,
    [ElDropdownItem.name]: ElDropdownItem,
    [ElDropdownMenu.name]: ElDropdownMenu
  },
  setup() {
    const photoUrl = ref('')
    const store = useStore()
    const name = computed(() => {
      const userName = store.getters.user.userName
      return userName && userName.length > 0 ? userName.substr(userName.length - 1, 1) : ''
    })

    const getPhoto = () => {
      userApi.browserPhoto(store.getters.user.userId).then(resp => {
        photoUrl.value = URL.createObjectURL(new Blob([resp.origin]))
      })
    }
    onMounted(getPhoto)

    const router = useRouter()
    const commandHanlder = (command: string) => {
      if (command === 'Logout') {
        confirm('确定要退出系统吗?', () => {
          // 增加一个中级路由页面, 避免直接使用router.push({ path: '/' }) 而出现同一个路由无法触发调整的情况
          router.push({ name: 'Logout' })
        })
      } else {
        router.push({ name: command })
      }
    }

    return { name, photoUrl, commandHanlder }
  }
})
</script>

<style lang="scss" scoped>
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
}
::v-deep(.el-dropdown) {
  &:hover {
    border: none;
  }
}
</style>
