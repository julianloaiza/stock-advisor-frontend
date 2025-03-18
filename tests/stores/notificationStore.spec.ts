import { setActivePinia, createPinia } from 'pinia'
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import { useNotificationStore } from '../../src/stores/notificationStore'

describe('Notification Store', () => {
  let store: ReturnType<typeof useNotificationStore>

  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear()

    // Crear una nueva instancia de Pinia
    setActivePinia(createPinia())

    // Inicializar el store
    store = useNotificationStore()

    // Simular el tiempo para pruebas consistentes
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Restaurar timers
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('debe inicializarse con un array de notificaciones vacío', () => {
    expect(store.notifications).toEqual([])
    expect(store.unreadCount).toBe(0)
    expect(store.hasNotifications).toBe(false)
  })

  it('debe añadir una nueva notificación', () => {
    const id = store.addNotification('Test message', 'success')

    expect(store.notifications.length).toBe(1)
    expect(store.notifications[0].message).toBe('Test message')
    expect(store.notifications[0].type).toBe('success')
    expect(store.notifications[0].read).toBe(false)
    expect(store.unreadCount).toBe(1)
    expect(store.hasNotifications).toBe(true)
    expect(id).toBe(store.notifications[0].id)
  })

  it('debe prevenir notificaciones duplicadas en un corto período', () => {
    const firstId = store.addNotification('Test message', 'success')

    // Avanzar el tiempo justo antes del umbral de duplicados
    vi.advanceTimersByTime(4999)

    const secondId = store.addNotification('Test message', 'success')

    // El segundo ID debe ser igual al primero
    expect(secondId).toBe(firstId)
    expect(store.notifications.length).toBe(1)
  })

  it('debe permitir notificaciones duplicadas después del umbral', () => {
    const firstId = store.addNotification('Test message', 'success')

    // Avanzar el tiempo más allá del umbral de duplicados
    vi.advanceTimersByTime(5001)

    const secondId = store.addNotification('Test message', 'success')

    // El segundo ID debe ser diferente
    expect(secondId).not.toBe(firstId)
    expect(store.notifications.length).toBe(2)
  })

  it('debe marcar una notificación como leída', () => {
    store.addNotification('Test message')

    // Verificar estado inicial
    expect(store.unreadCount).toBe(1)

    // Marcar como leída
    store.markAsRead(store.notifications[0].id)

    // Verificar cambios
    expect(store.unreadCount).toBe(0)
    expect(store.notifications[0].read).toBe(true)
  })

  it('debe marcar todas las notificaciones como leídas', () => {
    // Añadir múltiples notificaciones
    store.addNotification('Message 1')
    store.addNotification('Message 2')
    store.addNotification('Message 3')

    // Verificar estado inicial
    expect(store.unreadCount).toBe(3)

    // Marcar todas como leídas
    store.markAllAsRead()

    // Verificar cambios
    expect(store.unreadCount).toBe(0)
    store.notifications.forEach((notification) => {
      expect(notification.read).toBe(true)
    })
  })

  it('debe eliminar una notificación específica', () => {
    // Crear una implementación de addNotification que use IDs predecibles
    const originalAddNotification = store.addNotification
    store.addNotification = vi.fn((message: string, type = 'info') => {
      const notification = {
        id: message === 'Message 1' ? 'id1' : 'id2',
        message,
        type,
        timestamp: Date.now(),
        read: false,
      }
      store.notifications.unshift(notification)
      return notification.id
    })

    // Añadir dos notificaciones
    const id1 = store.addNotification('Message 1')
    const id2 = store.addNotification('Message 2')

    // Verificar estado inicial
    expect(store.notifications.length).toBe(2)

    // Eliminar una notificación
    store.removeNotification(id2)

    // Verificar cambios
    expect(store.notifications.length).toBe(1)
    expect(store.notifications[0].id).toBe(id1)

    // Restaurar la implementación original
    store.addNotification = originalAddNotification
  })

  it('debe limpiar todas las notificaciones', () => {
    // Añadir múltiples notificaciones
    store.addNotification('Message 1')
    store.addNotification('Message 2')

    // Verificar estado inicial
    expect(store.notifications.length).toBe(2)

    // Limpiar todas las notificaciones
    store.clearAllNotifications()

    // Verificar estado final
    expect(store.notifications.length).toBe(0)
    expect(store.hasNotifications).toBe(false)
  })

  it('debe respetar el número máximo de notificaciones', () => {
    // Simular añadir más de 50 notificaciones
    for (let i = 0; i < 55; i++) {
      store.addNotification(`Message ${i}`)
    }

    // Verificar que solo se mantengan 50 notificaciones
    expect(store.notifications.length).toBe(50)
  })
})
