// src/composables/useSync.ts
import { ref, reactive } from 'vue'
import { syncStocks } from '@/api/services/stockService'
import { useNotificationStore } from '@/stores/notificationStore'
import { useSyncStore } from '@/stores/syncStore'

export function useSync() {
  const notificationStore = useNotificationStore()
  const syncStore = useSyncStore()

  // Estado local
  const loading = ref(false)
  const showModal = ref(false)
  const syncParams = reactive<{ limit: number }>({
    limit: 1,
  })

  // Manejar el envío del formulario
  const handleSyncSubmit = (formData: { limit: number | string }) => {
    const limitValue = formData.limit
    const limit = typeof limitValue === 'string' ? parseInt(limitValue.trim(), 10) : limitValue

    // Validar que sea un número válido
    if (!limit || isNaN(limit) || limit < 1) {
      notificationStore.addNotification('Por favor ingrese un número válido mayor a 0', 'error')
      return
    }

    // Guardar el valor para usarlo en la confirmación
    syncParams.limit = limit

    // Mostrar modal de confirmación
    showModal.value = true
  }

  // Confirmar sincronización
  const confirmSync = async () => {
    showModal.value = false
    loading.value = true
    syncStore.startSync()

    try {
      // Llamar al servicio de sincronización
      const response = await syncStocks(syncParams.limit)

      // Marcar como exitoso
      syncStore.completeSync(true)

      // Añadir notificación
      notificationStore.addNotification(
        'La sincronización se ha completado exitosamente. Los datos están listos para ser visualizados.',
        'success',
      )

      return response
    } catch (error) {
      // Determinar mensaje de error
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

      // Marcar como fallido
      syncStore.completeSync(false)

      // Añadir notificación de error
      notificationStore.addNotification(
        `Error durante la sincronización: ${errorMessage}. Por favor intente nuevamente.`,
        'error',
      )

      console.error('Error en sincronización:', error)
    } finally {
      loading.value = false
    }
  }

  // Cancelar sincronización
  const cancelSync = () => {
    showModal.value = false
  }

  // Verificar y recuperar de un estado inconsistente
  const checkIncompleteSync = () => {
    if (syncStore.syncInProgress) {
      syncStore.recoverFromIncompleteSync()
      notificationStore.addNotification(
        'La sincronización anterior no se completó correctamente. Por favor intente nuevamente.',
        'warning',
      )
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
