import { setActivePinia, createPinia } from 'pinia'
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import { useSyncStore } from '../../src/stores/syncStore'

describe('Sync Store', () => {
  let store: ReturnType<typeof useSyncStore>

  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear()

    // Crear una nueva instancia de Pinia
    setActivePinia(createPinia())

    // Inicializar el store
    store = useSyncStore()

    // Simular el tiempo para pruebas consistentes
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Restaurar timers
    vi.restoreAllMocks()
  })

  it('debe inicializarse con estado por defecto', () => {
    expect(store.syncInProgress).toBe(false)
    expect(store.dataUpdated).toBe(false)
    expect(store.lastSyncTime).toBeNull()
  })

  it('debe iniciar sincronización', () => {
    store.startSync()

    expect(store.syncInProgress).toBe(true)
  })

  it('debe completar sincronización con éxito', () => {
    // Simular tiempo específico
    vi.setSystemTime(new Date(2023, 0, 1))

    // Iniciar y completar sincronización
    store.startSync()
    const result = store.completeSync(true)

    // Verificaciones
    expect(result).toBe(true)
    expect(store.syncInProgress).toBe(false)
    expect(store.dataUpdated).toBe(true)
    expect(store.lastSyncTime).toBe(new Date(2023, 0, 1).getTime())
  })

  it('debe completar sincronización sin éxito', () => {
    // Iniciar y completar sincronización sin éxito
    store.startSync()
    const result = store.completeSync(false)

    // Verificaciones
    expect(result).toBe(false)
    expect(store.syncInProgress).toBe(false)
    expect(store.dataUpdated).toBe(false)
    expect(store.lastSyncTime).toBeNull()
  })

  it('debe marcar datos como revisados', () => {
    // Primero marcar datos como actualizados
    store.startSync()
    store.completeSync(true)

    // Luego marcar como revisados
    store.markDataChecked()

    // Verificaciones
    expect(store.dataUpdated).toBe(false)
  })

  it('debe recuperarse de una sincronización incompleta', () => {
    // Iniciar sincronización sin completarla
    store.startSync()

    // Intentar recuperarse
    const recoveryResult = store.recoverFromIncompleteSync()

    // Verificaciones
    expect(recoveryResult).toBe(true)
    expect(store.syncInProgress).toBe(false)
  })

  it('debe devolver falso si no hay sincronización incompleta', () => {
    // Intentar recuperarse sin sincronización en progreso
    const recoveryResult = store.recoverFromIncompleteSync()

    // Verificaciones
    expect(recoveryResult).toBe(false)
  })

  it('debe persistir y cargar el estado de sincronización', () => {
    // Simular tiempo específico
    vi.setSystemTime(new Date(2023, 0, 1))

    // Completar sincronización
    store.startSync()
    store.completeSync(true)

    // Recrear el store para probar la carga desde localStorage
    const newStore = useSyncStore()

    // Verificaciones
    expect(newStore.dataUpdated).toBe(true)
    expect(newStore.lastSyncTime).toBe(new Date(2023, 0, 1).getTime())
  })

  it('debe proporcionar datos de sincronización correctos', () => {
    // Completar sincronización
    store.startSync()
    store.completeSync(true)

    // Verificar getter de datos de sincronización
    const syncData = store.syncData

    expect(syncData).toEqual({
      dataUpdated: true,
      lastSyncTime: expect.any(Number),
      syncInProgress: false,
    })
  })
})
