<script setup lang="ts">
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import AppNavBar from './components/layout/AppNavBar.vue'
import AppContent from './components/layout/AppContent.vue'
import AppFooter from './components/layout/AppFooter.vue'

/**
 * Inicializa componentes de Flowbite al montar la aplicación
 * Permite la activación de componentes interactivos basados en selectores de datos
 */
onMounted(() => {
  initFlowbite()
})
</script>

<template>
  <!-- 
    Contenedor principal de la aplicación
    Utiliza flexbox para un diseño responsive con altura mínima de pantalla
    Soporta modo claro y oscuro mediante clases de Tailwind
  -->
  <div
    id="app"
    class="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <!-- Barra de navegación superior -->
    <AppNavBar />

    <!-- Contenido principal de la aplicación con crecimiento flexible -->
    <AppContent class="flex-grow">
      <router-view />
    </AppContent>

    <!-- Pie de página -->
    <AppFooter />
  </div>
</template>
