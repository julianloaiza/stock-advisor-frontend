<template>
  <div>
    <h2 class="text-lg font-semibold mb-3 dark:text-white">{{ title }}</h2>

    <!-- Spinner de carga -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="text-red-500 p-4 text-center">
      {{ error }}
    </div>

    <!-- Mensaje de no resultados -->
    <div v-else-if="!data || !data.length" class="text-gray-500 p-4 text-center dark:text-gray-400">
      No se encontraron resultados
    </div>

    <!-- Tabla de resultados (por ahora solo JSON) -->
    <div v-else class="overflow-x-auto">
      <pre class="text-sm dark:text-gray-300">{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

// Tipo genérico para tabla de datos
interface TableItem {
  [key: string]: unknown
}

export default defineComponent({
  name: 'CustomTable',
  props: {
    title: {
      type: String,
      default: 'Resultados',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array as PropType<TableItem[]>,
      default: () => [],
    },
    error: {
      type: String as PropType<string | null>,
      default: null,
    },
    // Aquí podrías agregar más props para configurar la tabla:
    // columns: {
    //   type: Array as PropType<Column[]>,
    //   default: () => [],
    // },
    // enablePagination: {
    //   type: Boolean,
    //   default: false,
    // },
  },
})
</script>
