<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
    <div class="space-y-5 text-gray-700 dark:text-gray-300">
      <div class="border-l-4 border-gray-200 dark:border-gray-700 pl-4">
        <h3 v-if="title" class="font-semibold text-gray-800 dark:text-gray-200">
          {{ $t(title) }}
        </h3>

        <ul v-if="items && items.length" class="list-disc pl-5 mt-2 space-y-2">
          <li v-for="(item, index) in items" :key="index">
            {{ $t(item) }}
          </li>
        </ul>

        <p v-if="note" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ $t(note) }}
        </p>
      </div>

      <!-- Slot para contenido adicional -->
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InfoPanel',
  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array as () => string[],
      default: () => [],
    },
    note: {
      type: String,
      default: '',
    },
  },
})
</script>
