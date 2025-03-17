<template>
  <div
    class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
  >
    <div class="flex items-center justify-center">
      <div class="relative w-8 h-8">
        <div
          class="absolute top-0 left-0 w-8 h-8 border-4 border-blue-200 dark:border-blue-900 rounded-full"
        ></div>
        <div
          class="absolute top-0 left-0 w-8 h-8 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"
        ></div>
      </div>
      <div class="ml-4">
        <p class="font-medium text-blue-700 dark:text-blue-300">{{ message }}</p>
        <p v-if="subMessage" class="text-sm text-blue-600/70 dark:text-blue-400/70">
          {{ subMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoadingIndicator',
  props: {
    message: {
      type: String,
      default: 'Cargando...',
    },
    subMessage: {
      type: String,
      default: '',
    },
  },
})
</script>
