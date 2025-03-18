import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n/index'
import './assets/styles/main.css'

/**
 * Configuración principal de la aplicación Stock Advisor
 *
 * Inicializa y configura:
 * - Pinia para gestión de estado
 * - Persistencia de estado
 * - Enrutamiento
 * - Internacionalización
 * - Estilos globales
 */
// Crear instancia de Pinia con plugin de persistencia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Crear aplicación Vue
const app = createApp(App)

// Configurar plugins y montar aplicación
app.use(pinia) // Gestión de estado
app.use(router) // Enrutamiento
app.use(i18n) // Internacionalización
app.mount('#app') // Montar en el elemento con ID 'app'
