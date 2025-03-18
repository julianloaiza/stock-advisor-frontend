import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Clave de almacenamiento local para el estado de sincronización
 */
const STORAGE_KEY = 'stock-advisor-sync-state'

/**
 * Store de gestión de sincronización para Stock Advisor
 *
 * Responsabilidades:
 * - Controlar el estado de sincronización
 * - Gestionar la marca de última actualización
 * - Persistir el estado de sincronización
 */
export const useSyncStore = defineStore('sync', () => {
  // Estado reactivo
  const syncInProgress = ref(false) // Indica si hay una sincronización en curso
  const dataUpdated = ref(false) // Marca si los datos han sido actualizados
  const lastSyncTime = ref<number | null>(null) // Marca de tiempo de la última sincronización

  /**
   * Recupera el estado de sincronización guardado en localStorage
   */
  const loadStoredState = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        dataUpdated.value = data.dataUpdated || false
        lastSyncTime.value = data.lastSyncTime || null
      }
    } catch (e) {
      console.error('Error loading sync state:', e)
    }
  }

  /**
   * Guarda el estado de sincronización en localStorage
   */
  const persistState = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          dataUpdated: dataUpdated.value,
          lastSyncTime: lastSyncTime.value,
        }),
      )
    } catch (e) {
      console.error('Error saving sync state:', e)
    }
  }

  // Cargar estado al inicializar
  loadStoredState()

  /**
   * Getter computado para obtener el estado de sincronización
   */
  const syncData = computed(() => ({
    dataUpdated: dataUpdated.value,
    lastSyncTime: lastSyncTime.value,
    syncInProgress: syncInProgress.value,
  }))

  /**
   * Inicia el proceso de sincronización
   */
  function startSync() {
    syncInProgress.value = true
  }

  /**
   * Completa el proceso de sincronización
   *
   * @param success - Indica si la sincronización fue exitosa
   * @returns Resultado de la sincronización
   */
  function completeSync(success: boolean) {
    syncInProgress.value = false

    if (success) {
      dataUpdated.value = true
      lastSyncTime.value = Date.now()
      persistState()
    }

    return success
  }

  /**
   * Marca los datos como revisados
   */
  function markDataChecked() {
    dataUpdated.value = false
    persistState()
  }

  /**
   * Recupera de una sincronización incompleta
   *
   * @returns Si había una sincronización en progreso
   */
  function recoverFromIncompleteSync() {
    if (syncInProgress.value) {
      syncInProgress.value = false
      return true
    }
    return false
  }

  return {
    // Estado
    syncInProgress,
    dataUpdated,
    lastSyncTime,

    // Getters
    syncData,

    // Acciones
    startSync,
    completeSync,
    markDataChecked,
    recoverFromIncompleteSync,
  }
})
