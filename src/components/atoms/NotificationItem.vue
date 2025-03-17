<template>
  <div
    class="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
    @click="$emit('click', notification)"
  >
    <div class="shrink-0">
      <!-- Iconos según el tipo de notificación -->
      <div class="flex items-center justify-center w-8 h-8 rounded-full" :class="getIconClass">
        <!-- Success -->
        <svg
          v-if="notification.type === 'success'"
          class="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>

        <!-- Error -->
        <svg
          v-else-if="notification.type === 'error'"
          class="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>

        <!-- Warning -->
        <svg
          v-else-if="notification.type === 'warning'"
          class="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <!-- Info -->
        <svg
          v-else
          class="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>

    <div class="w-full ps-3">
      <div
        :class="
          notification.read ? 'text-gray-500' : 'text-gray-700 font-medium dark:text-gray-300'
        "
        class="text-sm mb-1.5 dark:text-gray-400"
      >
        {{ notification.message }}
      </div>
      <time
        :datetime="new Date(notification.timestamp).toISOString()"
        class="text-xs text-blue-600 dark:text-blue-500"
      >
        {{ formatRelativeTime(notification.timestamp) }}
      </time>
    </div>

    <!-- Botón para eliminar notificación -->
    <button
      @click.stop="$emit('remove', notification.id)"
      class="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
      aria-label="Eliminar notificación"
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

export default defineComponent({
  name: 'NotificationItem',
  props: {
    notification: {
      type: Object as () => Notification,
      required: true,
    },
  },
  emits: ['click', 'remove'],
  setup(props) {
    // Obtener clase CSS para el ícono según tipo de notificación
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
