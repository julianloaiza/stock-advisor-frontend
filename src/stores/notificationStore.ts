import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Tipos de notificaciones posibles en la aplicación
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

/**
 * Estructura de una notificación en el sistema
 */
export interface Notification {
  id: string // Identificador único
  message: string // Mensaje de la notificación
  type: NotificationType // Tipo de notificación
  timestamp: number // Momento de creación
  read: boolean // Estado de lectura
}

/**
 * Clave de almacenamiento local para persistir notificaciones
 */
const STORAGE_KEY = 'stock-advisor-notifications'

/**
 * Umbral de tiempo para considerar notificaciones duplicadas (5 segundos)
 */
const DUPLICATE_THRESHOLD = 5000

/**
 * Número máximo de notificaciones a mantener
 */
const MAX_NOTIFICATIONS = 50

/**
 * Tiempo máximo de retención de notificaciones (14 días)
 */
const MAX_NOTIFICATION_AGE = 14 * 24 * 60 * 60 * 1000

/**
 * Store de gestión de notificaciones para Stock Advisor
 *
 * Proporciona funcionalidades de:
 * - Añadir notificaciones
 * - Marcar como leídas
 * - Eliminar notificaciones
 * - Persistencia en localStorage
 * - Limpieza automática de notificaciones antiguas
 */
export const useNotificationStore = defineStore('notification', () => {
  /**
   * Recupera notificaciones almacenadas en localStorage
   *
   * @returns Array de notificaciones o vacío en caso de error
   */
  const getStoredNotifications = (): Notification[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('An error occurred while loading notifications.', e)
      return []
    }
  }

  // Estado de notificaciones recuperado de localStorage
  const notifications = ref<Notification[]>(getStoredNotifications())

  // Getters
  /**
   * Número de notificaciones sin leer
   */
  const unreadCount = computed(
    () => notifications.value.filter((notification) => !notification.read).length,
  )

  /**
   * Indica si hay notificaciones disponibles
   */
  const hasNotifications = computed(() => notifications.value.length > 0)

  /**
   * Guarda las notificaciones en localStorage,
   * limitando su número máximo
   */
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

  /**
   * Elimina notificaciones con más de 14 días de antigüedad
   */
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

  /**
   * Añade una nueva notificación, evitando duplicados recientes
   *
   * @param message - Mensaje de la notificación
   * @param type - Tipo de notificación (por defecto 'info')
   * @returns ID de la notificación
   */
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

  /**
   * Marca una notificación específica como leída
   *
   * @param id - Identificador de la notificación
   */
  function markAsRead(id: string) {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      persistNotifications()
    }
  }

  /**
   * Marca todas las notificaciones como leídas
   */
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

  /**
   * Elimina una notificación específica
   *
   * @param id - Identificador de la notificación
   */
  function removeNotification(id: string) {
    const previousLength = notifications.value.length
    notifications.value = notifications.value.filter((n) => n.id !== id)

    if (notifications.value.length !== previousLength) {
      persistNotifications()
    }
  }

  /**
   * Elimina todas las notificaciones
   */
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
