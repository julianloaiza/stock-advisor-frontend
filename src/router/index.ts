import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import StocksView from '../views/StocksView.vue'
import SyncView from '../views/SyncView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Stocks',
    component: StocksView,
  },
  {
    path: '/sync',
    name: 'Sync',
    component: SyncView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
