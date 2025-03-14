<!-- src/views/StocksView.vue -->
<script setup lang="ts">
import BaseFilter from '@/components/common/BaseFilter.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import BasePaginator from '@/components/common/BasePaginator.vue'
</script>

<template>
  <section class="stocks-view">
    <h2>Stocks View</h2>
    <BaseFilter />
    <BaseTable />
    <BasePaginator />
  </section>
</template>

<style scoped>
.stocks-view {
  background-color: #1e1e1e;
  color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
}

h2 {
  margin-bottom: 1rem;
}
</style>
