<template>
  <tr>
    <td :colspan="columnsCount" class="pt-10 pb-4 text-center">
      <!-- Estado de carga -->
      <div v-if="type === 'loading'" class="flex flex-col justify-center items-center">
        <div
          class="w-7 h-7 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-2"
        ></div>
        <span class="text-gray-600 dark:text-gray-300 font-medium text-sm">
          {{ $t('t_components_tableState_loading') }}
        </span>
      </div>

      <!-- Estado de error -->
      <div v-else-if="type === 'error'" class="flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-gray-600 dark:text-gray-300 font-medium text-sm">
          {{ message || $t('t_components_tableState_error_message') }}
        </p>
      </div>

      <!-- Estado vacío -->
      <div v-else class="flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-gray-600 dark:text-gray-300 font-medium text-sm">
          {{ message || $t('t_components_tableState_empty_message') }}
        </p>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableState',
  props: {
    type: {
      type: String,
      required: true,
      validator: (value: string) => ['loading', 'error', 'empty'].includes(value),
    },
    columnsCount: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
  },
})
</script>
