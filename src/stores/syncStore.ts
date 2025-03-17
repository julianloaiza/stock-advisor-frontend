// src/stores/syncStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'stock-advisor-sync-state'

export const useSyncStore = defineStore('sync', () => {
  // Estado
  const syncInProgress = ref(false)
  const dataUpdated = ref(false)
  const lastSyncTime = ref<number | null>(null)

  // Cargar estado guardado
  const loadStoredState = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        dataUpdated.value = data.dataUpdated || false
        lastSyncTime.value = data.lastSyncTime || null
      }
    } catch (e) {
      console.error('Error al cargar estado de sincronización:', e)
    }
  }

  // Persistir estado
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
      console.error('Error al guardar estado de sincronización:', e)
    }
  }

  // Cargar estado al inicializar
  loadStoredState()

  // Getters
  const syncData = computed(() => ({
    dataUpdated: dataUpdated.value,
    lastSyncTime: lastSyncTime.value,
    syncInProgress: syncInProgress.value,
  }))

  // Acciones
  function startSync() {
    syncInProgress.value = true
  }

  function completeSync(success: boolean) {
    syncInProgress.value = false

    if (success) {
      dataUpdated.value = true
      lastSyncTime.value = Date.now()
      persistState()
    }

    return success
  }

  function markDataChecked() {
    dataUpdated.value = false
    persistState()
  }

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
