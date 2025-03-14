<!-- src/App.vue -->
<script setup lang="ts">
// Sin lógica extra por ahora
</script>

<template>
  <div id="app" class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <header class="bg-gray-100 dark:bg-gray-800 p-4 text-center">
      <h1 class="text-2xl font-bold">Stock Advisor</h1>
    </header>
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>
