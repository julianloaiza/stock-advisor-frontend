<template>
  <div
    v-if="show"
    class="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800"
  >
    <p class="text-blue-800 dark:text-blue-200 font-medium text-sm">
      <span class="mr-2">{{ icon }}</span>
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AlertBanner',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: 'Este es un mensaje informativo',
    },
    icon: {
      type: String,
      default: 'ℹ️',
    },
  },
})
</script>
