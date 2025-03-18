import { ref, reactive } from 'vue'
import { syncStocks } from '@/api/services/stockService'
import { useNotificationStore } from '@/stores/notificationStore'
import { useSyncStore } from '@/stores/syncStore'

/**
 * Hook para gestionar el proceso de sincronización de datos de acciones
 *
 * Proporciona funcionalidades para:
 * - Manejar el formulario de sincronización
 * - Confirmar y ejecutar la sincronización
 * - Gestionar estados de carga y notificaciones
 *
 * @returns Objeto con estado, manejadores y métodos de sincronización
 */
export function useSync() {
  const notificationStore = useNotificationStore()
  const syncStore = useSyncStore()

  // Estado local para gestionar la sincronización
  const loading = ref(false)
  const showModal = ref(false)
  const syncParams = reactive<{ limit: number }>({
    limit: 1,
  })

  /**
   * Manejar el envío del formulario de sincronización
   * Prepara los parámetros y muestra el modal de confirmación
   *
   * @param formData - Datos del formulario de sincronización
   */
  const handleSyncSubmit = (formData: { limit: number | string }) => {
    const limitValue = formData.limit

    let limit: number
    if (typeof limitValue === 'string') {
      const trimmed = limitValue.trim()
      // Si está vacío, se asume que la validación "required" lo gestionará
      if (trimmed === '') return
      limit = parseInt(trimmed, 10)
    } else {
      limit = limitValue
    }

    // Validar y ajustar el límite de sincronización
    if (isNaN(limit) || limit < 1) {
      limit = 1
    }
    syncParams.limit = limit

    // Mostrar el modal de confirmación
    showModal.value = true
  }

  /**
   * Confirmar y ejecutar la sincronización de datos
   * Maneja el proceso completo de sincronización con gestión de errores
   *
   * @returns Respuesta de la sincronización o undefined en caso de error
   */
  const confirmSync = async () => {
    showModal.value = false
    loading.value = true
    syncStore.startSync()

    try {
      // Llamar al servicio de sincronización con el límite determinado
      const response = await syncStocks(syncParams.limit)

      // Marcar como exitoso y agregar notificación
      syncStore.completeSync(true)
      notificationStore.addNotification('t_sync_notifications_success', 'success')

      return response
    } catch (error) {
      const errorMessage = 't_sync_notifications_error'
      syncStore.completeSync(false)
      notificationStore.addNotification(errorMessage, 'error')
      console.error('Synchronization error:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * Cancelar el proceso de sincronización
   * Oculta el modal de confirmación
   */
  const cancelSync = () => {
    showModal.value = false
  }

  /**
   * Verificar y recuperar de un estado de sincronización incompleta
   * Útil para manejar interrupciones en el proceso de sincronización
   */
  const checkIncompleteSync = () => {
    if (syncStore.syncInProgress) {
      syncStore.recoverFromIncompleteSync()
      notificationStore.addNotification('t_sync_notifications_incomplete_sync', 'warning')
    }
  }

  return {
    loading,
    showModal,
    syncParams,
    syncStore,
    handleSyncSubmit,
    confirmSync,
    cancelSync,
    checkIncompleteSync,
  }
}
