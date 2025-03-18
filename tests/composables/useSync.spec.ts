// tests/unit/composables/useSync.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSync } from '../../src/composables/useSync'
import { useNotificationStore } from '../../src/stores/notificationStore'
import { useSyncStore } from '../../src/stores/syncStore'
import { syncStocks } from '../../src/api/services/stockService'

// Mocks para los stores y servicios
vi.mock('../../src/stores/notificationStore', () => ({
  useNotificationStore: vi.fn(),
}))

vi.mock('../../src/stores/syncStore', () => ({
  useSyncStore: vi.fn(),
}))

vi.mock('../../src/api/services/stockService', () => ({
  syncStocks: vi.fn(),
}))

describe('useSync composable', () => {
  // Tipos para los mocks
  type MockNotificationStore = {
    addNotification: (message: string, type: string) => void
  }

  type MockSyncStore = {
    syncInProgress: boolean
    startSync: () => void
    completeSync: (success: boolean) => void
    recoverFromIncompleteSync: () => void
  }

  // Mocks de los stores
  let mockNotificationStore: MockNotificationStore
  let mockSyncStore: MockSyncStore

  beforeEach(() => {
    // Crear una nueva instancia de Pinia para cada prueba
    setActivePinia(createPinia())

    // Restablecer todos los mocks
    vi.resetAllMocks()

    // Inicializar mocks con valores por defecto
    mockNotificationStore = {
      addNotification: vi.fn(),
    }

    mockSyncStore = {
      syncInProgress: false,
      startSync: vi.fn(),
      completeSync: vi.fn(),
      recoverFromIncompleteSync: vi.fn(),
    }

    // Configurar mocks de los stores
    // 1. Corregir el mock utilizando la función apropiada
    vi.mocked(useNotificationStore).mockReturnValue(
      mockNotificationStore as unknown as ReturnType<typeof useNotificationStore>,
    )

    vi.mocked(useSyncStore).mockReturnValue(
      mockSyncStore as unknown as ReturnType<typeof useSyncStore>,
    )
  })

  it('should initialize with default values', () => {
    const { loading, showModal, syncParams } = useSync()

    expect(loading.value).toBe(false)
    expect(showModal.value).toBe(false)
    expect(syncParams.limit).toBe(1)
  })

  it('should handle form submission with numeric limit', () => {
    const { handleSyncSubmit, showModal, syncParams } = useSync()

    handleSyncSubmit({ limit: 5 })

    expect(syncParams.limit).toBe(5)
    expect(showModal.value).toBe(true)
  })

  it('should handle form submission with string limit', () => {
    const { handleSyncSubmit, showModal, syncParams } = useSync()

    handleSyncSubmit({ limit: '10' })

    expect(syncParams.limit).toBe(10)
    expect(showModal.value).toBe(true)
  })

  it('should handle form submission with minimum limit of 1', () => {
    const { handleSyncSubmit, syncParams } = useSync()

    // Prueba con valor 0 (debería ajustarse a 1)
    handleSyncSubmit({ limit: 0 })
    expect(syncParams.limit).toBe(1)

    // Prueba con valor negativo (debería ajustarse a 1)
    handleSyncSubmit({ limit: -5 })
    expect(syncParams.limit).toBe(1)

    // Prueba con valor NaN (debería ajustarse a 1)
    handleSyncSubmit({ limit: 'invalid' as unknown as number })
    expect(syncParams.limit).toBe(1)
  })

  it('should cancel sync and hide modal', () => {
    const { handleSyncSubmit, cancelSync, showModal } = useSync()

    // Mostrar modal primero
    handleSyncSubmit({ limit: 1 })
    expect(showModal.value).toBe(true)

    // Cancelar sincronización
    cancelSync()
    expect(showModal.value).toBe(false)
  })

  it('should execute successful sync process', async () => {
    // Preparar mock de syncStocks para devolver una respuesta exitosa
    const mockResponse = { success: true }
    vi.mocked(syncStocks).mockResolvedValue(mockResponse)

    const { confirmSync, loading } = useSync()

    // Ejecutar sincronización
    const result = await confirmSync()

    // Verificar cambios de estado
    expect(loading.value).toBe(false)

    // Verificar llamadas a las funciones de los stores
    expect(mockSyncStore.startSync).toHaveBeenCalled()
    expect(mockSyncStore.completeSync).toHaveBeenCalledWith(true)
    expect(mockNotificationStore.addNotification).toHaveBeenCalledWith(
      't_sync_notifications_success',
      'success',
    )

    // Verificar resultado
    expect(result).toEqual(mockResponse)
  })

  it('should handle sync error correctly', async () => {
    // Preparar mock de syncStocks para lanzar un error
    vi.mocked(syncStocks).mockRejectedValue(new Error('API Error'))

    const { confirmSync, loading } = useSync()

    // Ejecutar sincronización (no debería lanzar error)
    await confirmSync()

    // Verificar cambios de estado
    expect(loading.value).toBe(false)

    // Verificar llamadas a las funciones de los stores
    expect(mockSyncStore.startSync).toHaveBeenCalled()
    expect(mockSyncStore.completeSync).toHaveBeenCalledWith(false)
    expect(mockNotificationStore.addNotification).toHaveBeenCalledWith(
      't_sync_notifications_error',
      'error',
    )
  })

  it('should check and recover from incomplete sync', () => {
    // Configurar estado de sincronización en progreso
    mockSyncStore.syncInProgress = true

    const { checkIncompleteSync } = useSync()

    // Ejecutar verificación
    checkIncompleteSync()

    // Verificar que se llamó a la recuperación
    expect(mockSyncStore.recoverFromIncompleteSync).toHaveBeenCalled()
    expect(mockNotificationStore.addNotification).toHaveBeenCalledWith(
      't_sync_notifications_incomplete_sync',
      'warning',
    )
  })

  it('should not attempt recovery if sync is not in progress', () => {
    // Configurar estado sin sincronización en progreso
    mockSyncStore.syncInProgress = false

    const { checkIncompleteSync } = useSync()

    // Ejecutar verificación
    checkIncompleteSync()

    // Verificar que no se llamó a la recuperación
    expect(mockSyncStore.recoverFromIncompleteSync).not.toHaveBeenCalled()
    expect(mockNotificationStore.addNotification).not.toHaveBeenCalled()
  })
})
