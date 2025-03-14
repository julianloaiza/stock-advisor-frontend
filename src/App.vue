<!-- src/App.vue -->
<script setup lang="ts">
// No se requiere lógica adicional por ahora
</script>

<template>
  <div id="app">
    <header>
      <h1>Stock Advisor</h1>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app {
  background-color: #121212;
  color: #e0e0e0;
  padding: 2rem;
  border-radius: 8px;
}

header {
  background-color: #1f1f1f;
  padding: 1rem;
  text-align: center;
  border-radius: 4px;
}

main {
  margin-top: 1.5rem;
  padding: 1rem;
}
</style>
