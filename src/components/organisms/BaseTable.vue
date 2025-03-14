<!-- src/components/common/BaseTable.vue -->
<script setup lang="ts">
import BaseRow from '../molecules/BaseRow.vue'
</script>

<template>
  <div class="base-table">
    <p>Base Table Component</p>
    <!-- Ejemplo: renderizamos una fila -->
    <BaseRow />
  </div>
</template>

<style scoped>
.base-table {
  background-color: #2c2c2c;
  color: #f0f0f0;
  border: 1px solid #444;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}
</style>
