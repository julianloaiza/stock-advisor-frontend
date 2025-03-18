<template>
  <div class="relative flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
    <div
      class="shrink-0 flex items-center justify-center w-8 h-8 rounded-full"
      :class="getIconClass"
    >
      <svg
        class="w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path
          v-if="notification.type === 'success'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 13l4 4L19 7"
        />
        <path
          v-else-if="notification.type === 'error'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
        <path
          v-else-if="notification.type === 'warning'"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v2m0 4h.01M6 18h12M3 3h18"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>

    <div class="w-full ps-3 text-sm text-gray-700 dark:text-gray-300">
      {{ $t(notification.message) }}
      <time class="block text-xs text-blue-600 dark:text-blue-500">
        {{ $t(formatRelativeTime(notification.timestamp)) }}
      </time>
    </div>

    <button
      @click.stop="$emit('remove', notification.id)"
      class="absolute top-2 right-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
      :aria-label="$t('t_components_notificationItem_remove_label')"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { Notification } from '@/stores/notificationStore'
import { formatRelativeTime } from '@/utils/formatterUtils'

/**
 * Componente para mostrar notificaciones individuales con diferentes
 * estilos según su tipo (success, error, warning, info)
 */
export default defineComponent({
  name: 'NotificationItem',
  props: {
    notification: {
      type: Object as () => Notification,
      required: true,
    },
  },
  emits: ['remove'],
  setup(props) {
    /**
     * Determina la clase CSS para el icono según el tipo de notificación
     */
    const getIconClass = computed((): string => {
      switch (props.notification.type) {
        case 'success':
          return 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200'
        case 'error':
          return 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200'
        case 'warning':
          return 'bg-orange-100 text-orange-600 dark:bg-orange-700 dark:text-orange-200'
        case 'info':
        default:
          return 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200'
      }
    })

    return {
      formatRelativeTime,
      getIconClass,
    }
  },
})
</script>
