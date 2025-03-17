<template>
  <div class="relative">
    <!-- Botón de notificaciones -->
    <base-button
      :id="`${componentId}-button`"
      variant="icon"
      @click="toggleDropdown"
      class="relative"
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
    </base-button>

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
        <notification-item
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          :notification="notification"
          @click="handleNotificationClick"
          @remove="removeNotification"
        />
      </div>

      <div class="flex py-2 text-sm justify-between px-4 bg-gray-50 dark:bg-gray-800">
        <base-button
          v-if="notificationStore.hasNotifications"
          @click="notificationStore.markAllAsRead()"
          variant="link"
          label="Marcar todo como leído"
          class="text-blue-600 hover:underline dark:text-blue-500"
        />
        <base-button
          v-if="notificationStore.hasNotifications"
          @click="notificationStore.clearAllNotifications()"
          variant="link"
          label="Borrar todo"
          class="text-red-600 hover:underline dark:text-red-500"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Notification } from '@/stores/notificationStore'
import BaseButton from '@/components/atoms/BaseButton.vue'
import NotificationItem from '@/components/atoms/NotificationItem.vue'

export default defineComponent({
  name: 'NotificationDropdown',
  components: {
    BaseButton,
    NotificationItem,
  },
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
    }
  },
})
</script>
