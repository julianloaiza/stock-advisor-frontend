<template>
  <div class="flex flex-wrap justify-between items-center mb-4">
    <h2 class="text-lg font-semibold dark:text-white mb-2 md:mb-0">{{ title }}</h2>
    <div class="flex items-center space-x-2">
      <div class="text-sm text-gray-700 dark:text-gray-400">Entradas por página</div>
      <select
        :value="pageSize"
        @change="handlePageSizeChange"
        class="w-16 px-2 py-1 text-sm bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableHeader',
  props: {
    title: {
      type: String,
      default: 'Resultados',
    },
    pageSize: {
      type: Number,
      required: true,
    },
    pageSizeOptions: {
      type: Array as () => number[],
      default: () => [10, 25, 50, 100],
    },
  },
  emits: ['update:page-size'],
  setup(props, { emit }) {
    // Manejar cambio de tamaño de página con seguridad de tipo
    const handlePageSizeChange = (event: Event) => {
      const target = event.target as HTMLSelectElement
      if (target && target.value) {
        emit('update:page-size', parseInt(target.value))
      }
    }

    return {
      handlePageSizeChange,
    }
  },
})
</script>
