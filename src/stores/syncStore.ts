// src/stores/syncStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'stock-advisor-sync-state'
// Máximo tiempo para mantener datos de sincronización (30 días)
const MAX_SYNC_DATA_AGE = 30 * 24 * 60 * 60 * 1000

export const useSyncStore = defineStore('sync', () => {
  // Cargar estado guardado
  const getStoredState = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (e) {
      console.error('Error al cargar estado de sincronización:', e)
      return null
    }
  }

  // Recuperar estado guardado
  const storedState = getStoredState()

  // Estado
  const syncInProgress = ref(false)
  const dataUpdated = ref(storedState?.dataUpdated || false)
  const lastSyncTime = ref<number | null>(storedState?.lastSyncTime || null)

  // Getters
  const syncData = computed(() => ({
    dataUpdated: dataUpdated.value,
    lastSyncTime: lastSyncTime.value,
  }))

  const needsSync = computed(() => {
    if (!lastSyncTime.value) return true
    const now = Date.now()
    return now - lastSyncTime.value > MAX_SYNC_DATA_AGE
  })

  // Verificar si los datos guardados son demasiado antiguos
  if (lastSyncTime.value) {
    const now = Date.now()
    if (now - lastSyncTime.value > MAX_SYNC_DATA_AGE) {
      // Si los datos son muy antiguos, limpiarlos
      dataUpdated.value = false
      lastSyncTime.value = null
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

  function clearSyncData() {
    syncInProgress.value = false
    dataUpdated.value = false
    lastSyncTime.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    // Estado
    syncInProgress,
    dataUpdated,
    lastSyncTime,

    // Getters
    syncData,
    needsSync,

    // Acciones
    startSync,
    completeSync,
    markDataChecked,
    clearSyncData,
  }
})
