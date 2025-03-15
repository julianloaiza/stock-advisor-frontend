<template>
  <div>
    <h2 class="text-lg font-semibold mb-3 dark:text-white">Resultados</h2>

    <!-- Spinner de carga -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="text-red-500 p-4 text-center">
      {{ error }}
    </div>

    <!-- Mensaje de no resultados -->
    <div v-else-if="!stocks.length" class="text-gray-500 p-4 text-center dark:text-gray-400">
      No se encontraron resultados
    </div>

    <!-- Tabla de resultados (por ahora solo JSON) -->
    <div v-else class="overflow-x-auto">
      <pre class="text-sm dark:text-gray-300">{{ JSON.stringify(stocks, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { Stock } from '@/interfaces/Stock.interface'

export default defineComponent({
  name: 'StockTable',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    stocks: {
      type: Array as PropType<Stock[]>,
      default: () => [],
    },
    error: {
      type: String as PropType<string | null>,
      default: null,
    },
  },
})
</script>
