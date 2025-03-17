import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import StocksView from '../views/StocksView.vue'
import SyncView from '../views/SyncView.vue'
import NotFoundView from '../views/NotFoundView.vue'

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
  // 404 Page - Debe estar al final
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
