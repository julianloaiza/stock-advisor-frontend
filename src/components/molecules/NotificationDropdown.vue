<template>
  <div class="relative">
    <!-- Botón de notificaciones -->
    <button
      :id="`${componentId}-button`"
      @click="toggleDropdown"
      class="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
      type="button"
    >
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 14 20"
      >
        <path
          d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"
        />
      </svg>

      <!-- Indicador de notificaciones no leídas -->
      <div
        v-if="notificationStore.unreadCount > 0"
        class="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-0.5 start-2.5 dark:border-gray-900"
      ></div>
    </button>

    <!-- Dropdown menu - Centrado debajo del botón -->
    <div
      v-show="isOpen"
      :id="`${componentId}-content`"
      class="z-20 absolute transform -translate-x-1/2 left-1/2 mt-2 w-80 max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700"
      aria-labelledby="dropdownNotificationButton"
    >
      <div
        class="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
      >
        <div class="flex justify-between items-center">
          <span>Notificaciones</span>
          <span
            v-if="notificationStore.unreadCount > 0"
            class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {{ notificationStore.unreadCount }} nuevas
          </span>
        </div>
      </div>

      <div class="divide-y divide-gray-100 dark:divide-gray-700 max-h-80 overflow-y-auto">
        <!-- Mensaje cuando no hay notificaciones -->
        <div
          v-if="!notificationStore.hasNotifications"
          class="py-4 px-4 text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          No tienes notificaciones
        </div>

        <!-- Listado de notificaciones -->
        <div
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          class="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          @click="handleNotificationClick(notification)"
        >
          <div class="shrink-0">
            <!-- Iconos según el tipo de notificación -->
            <div
              class="flex items-center justify-center w-8 h-8 rounded-full"
              :class="getNotificationIconClass(notification.type)"
            >
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
            <div class="text-xs text-blue-600 dark:text-blue-500">
              {{ formatTime(notification.timestamp) }}
            </div>
          </div>

          <!-- Botón para eliminar notificación -->
          <button
            @click.stop="removeNotification(notification.id)"
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
      </div>

      <div class="flex py-2 text-sm justify-between px-4 bg-gray-50 dark:bg-gray-800">
        <button
          v-if="notificationStore.hasNotifications"
          @click="notificationStore.markAllAsRead()"
          class="text-blue-600 hover:underline dark:text-blue-500"
        >
          Marcar todo como leído
        </button>
        <button
          v-if="notificationStore.hasNotifications"
          @click="notificationStore.clearAllNotifications()"
          class="text-red-600 hover:underline dark:text-red-500"
        >
          Borrar todo
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Notification, NotificationType } from '@/stores/notificationStore'

export default defineComponent({
  name: 'NotificationDropdown',
  setup() {
    const notificationStore = useNotificationStore()
    const isOpen = ref(false)

    // Identificador único para los elementos del DOM
    const componentId = `notification-dropdown-${Date.now()}`

    // Cerrar el dropdown al hacer clic fuera - optimizado
    const handleClickOutside = (event: MouseEvent) => {
      // Solo procesar si el dropdown está abierto
      if (!isOpen.value) return

      const button = document.getElementById(`${componentId}-button`)
      const dropdown = document.getElementById(`${componentId}-content`)

      if (
        button &&
        !button.contains(event.target as Node) &&
        dropdown &&
        !dropdown.contains(event.target as Node)
      ) {
        isOpen.value = false
      }
    }

    // Manejar clic en una notificación
    const handleNotificationClick = (notification: Notification) => {
      if (!notification.read) {
        notificationStore.markAsRead(notification.id)
      }
    }

    // Eliminar una notificación
    const removeNotification = (id: string) => {
      notificationStore.removeNotification(id)
    }

    // Alternar visibilidad del dropdown
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    // Formatear tiempo relativo mejorado
    const formatTime = (timestamp: number): string => {
      try {
        const now = Date.now()
        const diffSeconds = Math.floor((now - timestamp) / 1000)

        if (diffSeconds < 5) return 'Ahora mismo'
        if (diffSeconds < 60) return 'Hace unos segundos'
        if (diffSeconds < 3600) {
          const minutes = Math.floor(diffSeconds / 60)
          return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
        }
        if (diffSeconds < 86400) {
          const hours = Math.floor(diffSeconds / 3600)
          return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
        }

        // Para fechas más antiguas, mostrar la fecha formateada
        const days = Math.floor(diffSeconds / 86400)
        if (days <= 30) {
          return `Hace ${days} ${days === 1 ? 'día' : 'días'}`
        } else {
          const date = new Date(timestamp)
          return date.toLocaleDateString()
        }
      } catch (e) {
        console.error('Error formateando tiempo:', e)
        return 'Fecha desconocida'
      }
    }

    // Obtener clase CSS para el ícono según tipo de notificación
    const getNotificationIconClass = (type: NotificationType): string => {
      switch (type) {
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
    }

    // Cerrar al presionar Escape
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen.value) {
        isOpen.value = false
      }
    }

    // Agregar/eliminar listeners de eventos
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    })

    return {
      componentId,
      notificationStore,
      isOpen,
      toggleDropdown,
      handleNotificationClick,
      removeNotification,
      formatTime,
      getNotificationIconClass,
    }
  },
})
</script>
