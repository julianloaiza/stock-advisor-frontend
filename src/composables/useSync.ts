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

    let limit: number
    if (typeof limitValue === 'string') {
      const trimmed = limitValue.trim()
      // Si está vacío, se asume que la validación "required" lo gestionará
      if (trimmed === '') return
      limit = parseInt(trimmed, 10)
    } else {
      limit = limitValue
    }

    // Si el número es inválido o menor a 1, se fuerza a 1
    if (isNaN(limit) || limit < 1) {
      limit = 1
    }
    syncParams.limit = limit

    // Mostrar el modal de confirmación
    showModal.value = true
  }

  // Confirmar sincronización
  const confirmSync = async () => {
    showModal.value = false
    loading.value = true
    syncStore.startSync()

    try {
      // Llamar al servicio de sincronización con el límite determinado
      const response = await syncStocks(syncParams.limit)

      // Marcar como exitoso y agregar notificación
      syncStore.completeSync(true)
      notificationStore.addNotification(
        'La sincronización se ha completado exitosamente.',
        'success',
      )

      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      syncStore.completeSync(false)
      notificationStore.addNotification(
        `Error durante la sincronización: ${errorMessage}.`,
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
        'La sincronización anterior no se completó correctamente.',
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
