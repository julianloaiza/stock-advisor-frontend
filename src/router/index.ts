import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import StocksView from '@/views/StocksView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Stocks',
    component: StocksView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
