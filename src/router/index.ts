import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import StocksView from '../views/StocksView.vue'
import SyncView from '../views/SyncView.vue'
import NotFoundView from '../views/NotFoundView.vue'

/**
 * Definición de rutas para la aplicación Stock Advisor
 * Incluye vistas principales y manejo de rutas no encontradas
 */
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
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
]

/**
 * Configuración del enrutador de la aplicación
 * Utiliza history mode para URLs limpias y sin hash
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
