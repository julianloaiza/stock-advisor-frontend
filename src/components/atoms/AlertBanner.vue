<template>
  <div
    v-if="show"
    class="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800"
    :class="typeClass"
  >
    <p class="text-blue-800 dark:text-blue-200 font-medium text-sm" :class="textClass">
      <span class="mr-2">{{ icon }}</span>
      {{ message ? $t(message) : $t(`t_alertBanner_messages_${type}`) }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

/**
 * Banner informativo con soporte para diferentes tipos de alertas y temas claro/oscuro
 */
export default defineComponent({
  name: 'AlertBanner',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'ℹ️',
    },
    type: {
      type: String,
      default: 'info',
      validator: (value: string) => ['info', 'success', 'warning', 'error'].includes(value),
    },
  },
  setup(props) {
    const typeClass = computed(() => {
      switch (props.type) {
        case 'success':
          return 'from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 border-green-100 dark:border-green-800'
        case 'warning':
          return 'from-yellow-50 to-amber-50 dark:from-yellow-900/40 dark:to-amber-900/40 border-yellow-100 dark:border-yellow-800'
        case 'error':
          return 'from-red-50 to-rose-50 dark:from-red-900/40 dark:to-rose-900/40 border-red-100 dark:border-red-800'
        case 'info':
        default:
          return 'from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 border-blue-100 dark:border-blue-800'
      }
    })

    const textClass = computed(() => {
      switch (props.type) {
        case 'success':
          return 'text-green-800 dark:text-green-200'
        case 'warning':
          return 'text-yellow-800 dark:text-yellow-200'
        case 'error':
          return 'text-red-800 dark:text-red-200'
        case 'info':
        default:
          return 'text-blue-800 dark:text-blue-200'
      }
    })

    return {
      typeClass,
      textClass,
    }
  },
})
</script>
