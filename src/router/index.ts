import { createRouter, createWebHistory } from 'vue-router'
import { staticRoutes } from './static'
import { createGuard } from './guard'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: staticRoutes
})

createGuard(router)

export default router
