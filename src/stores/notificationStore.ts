// src/stores/notificationStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  timestamp: number
  read: boolean
}

const STORAGE_KEY = 'stock-advisor-notifications'
const DUPLICATE_THRESHOLD = 5000 // 5 segundos
const MAX_NOTIFICATIONS = 50 // Límite máximo de notificaciones guardadas
const MAX_NOTIFICATION_AGE = 14 * 24 * 60 * 60 * 1000 // 14 días en milisegundos

export const useNotificationStore = defineStore('notification', () => {
  // Cargar notificaciones guardadas
  const getStoredNotifications = (): Notification[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('An error occurred while loading notifications.', e)
      return []
    }
  }

  // Estado
  const notifications = ref<Notification[]>(getStoredNotifications())

  // Getters
  const unreadCount = computed(
    () => notifications.value.filter((notification) => !notification.read).length,
  )

  const hasNotifications = computed(() => notifications.value.length > 0)

  // Guardar notificaciones en localStorage
  const persistNotifications = () => {
    try {
      // Si hay demasiadas notificaciones, eliminar las más antiguas
      if (notifications.value.length > MAX_NOTIFICATIONS) {
        notifications.value = notifications.value.slice(0, MAX_NOTIFICATIONS)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.value))
    } catch (e) {
      console.error('An error occurred while saving notifications.', e)
    }
  }

  // Limpiar notificaciones viejas
  const pruneOldNotifications = () => {
    const now = Date.now()
    const previousLength = notifications.value.length

    notifications.value = notifications.value.filter(
      (n) => now - n.timestamp < MAX_NOTIFICATION_AGE,
    )

    if (notifications.value.length !== previousLength) {
      persistNotifications()
    }
  }

  // Ejecutar limpieza inicial
  pruneOldNotifications()

  // Acciones
  function addNotification(message: string, type: NotificationType = 'info') {
    // Evitar duplicados recientes (mismos mensajes en los últimos 5 segundos)
    const recentDuplicate = notifications.value.find(
      (n) =>
        n.message === message && n.type === type && Date.now() - n.timestamp < DUPLICATE_THRESHOLD,
    )

    if (recentDuplicate) {
      return recentDuplicate.id
    }

    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now(),
      read: false,
    }

    notifications.value.unshift(newNotification)

    pruneOldNotifications()
    persistNotifications()

    return newNotification.id
  }

  function markAsRead(id: string) {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      persistNotifications()
    }
  }

  function markAllAsRead() {
    let changed = false

    notifications.value.forEach((notification) => {
      if (!notification.read) {
        notification.read = true
        changed = true
      }
    })

    if (changed) {
      persistNotifications()
    }
  }

  function removeNotification(id: string) {
    const previousLength = notifications.value.length
    notifications.value = notifications.value.filter((n) => n.id !== id)

    if (notifications.value.length !== previousLength) {
      persistNotifications()
    }
  }

  function clearAllNotifications() {
    if (notifications.value.length > 0) {
      notifications.value = []
      persistNotifications()
    }
  }

  return {
    // Estado
    notifications,

    // Getters
    unreadCount,
    hasNotifications,

    // Acciones
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    pruneOldNotifications,
  }
})
