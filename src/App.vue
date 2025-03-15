<script setup lang="ts">
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import AppNavBar from './components/layout/AppNavBar.vue'
import AppContent from './components/layout/AppContent.vue'
import AppFooter from './components/layout/AppFooter.vue'

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite()
})
</script>

<template>
  <div
    id="app"
    class="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <AppNavBar />
    <AppContent class="flex-grow">
      <router-view />
    </AppContent>
    <AppFooter />
  </div>
</template>
