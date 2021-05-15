import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()

    onMounted(async () => {
      await store.dispatch('auth/logout')
      router.push({ path: '/dashboard' })
    })

    return () => <div></div>
  }
})
