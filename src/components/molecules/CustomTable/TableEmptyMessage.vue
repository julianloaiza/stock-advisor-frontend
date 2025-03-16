<template>
  <tr>
    <td :colspan="colSpan" class="px-6 py-10 text-center">
      <!-- Spinner de carga -->
      <div v-if="loading" class="flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mb-3"></div>
        <p class="text-gray-500 dark:text-gray-400">{{ loadingMessage }}</p>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="flex flex-col items-center justify-center text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>{{ error || errorMessage }}</p>
      </div>

      <!-- Mensaje de no resultados -->
      <div
        v-else
        class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>{{ emptyMessage }}</p>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'TableEmptyMessage',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String as PropType<string | null | undefined>,
      default: '',
    },
    colSpan: {
      type: Number,
      required: true,
    },
    loadingMessage: {
      type: String,
      default: 'Cargando datos...',
    },
    emptyMessage: {
      type: String,
      default: 'No se encontraron resultados',
    },
    errorMessage: {
      type: String,
      default: 'Se produjo un error al cargar los datos',
    },
  },
})
</script>
