<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
    <div class="space-y-5 text-gray-700 dark:text-gray-300">
      <div class="border-l-4 border-gray-200 dark:border-gray-700 pl-4">
        <h3 v-if="title" class="font-semibold text-gray-800 dark:text-gray-200">
          {{ title }}
        </h3>

        <ul v-if="items && items.length" class="list-disc pl-5 mt-2 space-y-2">
          <li v-for="(item, index) in items" :key="index">
            {{ item }}
          </li>
        </ul>

        <p v-if="note" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ note }}
        </p>

        <!-- Información adicional con marca de tiempo -->
        <div v-if="timestamp" class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p class="text-sm">
            <span class="font-medium">{{ timeLabel }}:</span>
            {{ formattedTime }}
          </p>
        </div>
      </div>

      <!-- Slot para contenido adicional -->
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

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
    timestamp: {
      type: Number,
      default: undefined,
      required: false,
    },
    timeLabel: {
      type: String,
      default: 'Última actualización',
    },
  },
  setup(props) {
    // Formatear la fecha según el formato requerido
    const formattedTime = computed(() => {
      if (!props.timestamp) return ''

      try {
        return new Date(props.timestamp).toLocaleString()
      } catch (e) {
        console.error('Error formateando fecha:', e)
        return 'Fecha no disponible'
      }
    })

    return {
      formattedTime,
    }
  },
})
</script>
