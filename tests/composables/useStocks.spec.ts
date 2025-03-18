// tests/unit/composables/useStocks.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useStocks } from '../../src/composables/useStocks'
import { useStockStore } from '../../src/stores/stockStore'
import { useSyncStore } from '../../src/stores/syncStore'
import type { FormData } from '../../src/interfaces/BaseForm.interface'
import type { Stock } from '../../src/interfaces/Stock.interface'

// Mocks para los stores
vi.mock('@/stores/stockStore', () => ({
  useStockStore: vi.fn(),
}))

vi.mock('@/stores/syncStore', () => ({
  useSyncStore: vi.fn(),
}))

// Mock para el módulo de la configuración
vi.mock('@/config/stocksConfig', () => ({
  stocksTableConfig: {
    title: 't_stocks_table_title',
    columns: [
      { key: 'ticker', header: 't_stocks_table_columns_ticker', type: 'text', highlight: true },
      // Otras columnas...
    ],
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      pageSizeOptions: [10, 25, 50, 100],
    },
  },
}))

describe('useStocks', () => {
  // Tipos para los mocks
  type MockStockStore = {
    filters: {
      query: string
      recommends: boolean
      minTargetTo: string
      maxTargetTo: string
      currency: string
    }
    data: Stock[]
    loading: boolean
    error: string | null
    currentPage: number
    itemsPerPage: number
    totalPages: number
    totalItems: number
    hasResults: boolean
    setPage: (page: number) => void
    setPageSize: (size: number) => void
    updateFilters: (filters: Record<string, unknown>) => void
    resetFilters: () => void
    fetchStocks: () => void
  }

  type MockSyncStore = {
    dataUpdated: boolean
    markDataChecked: () => void
  }

  // Mocks de los stores
  let mockStockStore: MockStockStore
  let mockSyncStore: MockSyncStore

  beforeEach(() => {
    // Crear una nueva instancia de Pinia para cada prueba
    setActivePinia(createPinia())

    // Restablecer todos los mocks
    vi.resetAllMocks()

    // Inicializar mocks con valores por defecto
    mockStockStore = {
      filters: {
        query: '',
        recommends: false,
        minTargetTo: '',
        maxTargetTo: '',
        currency: 'USD',
      },
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 1,
      totalItems: 0,
      hasResults: false,
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      updateFilters: vi.fn(),
      resetFilters: vi.fn(),
      fetchStocks: vi.fn(),
    }

    mockSyncStore = {
      dataUpdated: false,
      markDataChecked: vi.fn(),
    }

    // Configurar mocks de los stores
    vi.mocked(useStockStore).mockReturnValue(mockStockStore as ReturnType<typeof useStockStore>)
    vi.mocked(useSyncStore).mockReturnValue(mockSyncStore as ReturnType<typeof useSyncStore>)
  })

  it('should compute initial form values from store filters', () => {
    // Configurar un estado específico en el mock del store
    mockStockStore.filters = {
      query: 'AAPL',
      recommends: true,
      minTargetTo: '100',
      maxTargetTo: '200',
      currency: 'EUR',
    }

    // Obtener el composable
    const { formInitialValues } = useStocks()

    // Verificar que los valores iniciales del formulario se calculan correctamente
    expect(formInitialValues.value).toEqual({
      query: 'AAPL',
      recommends: true,
      minTargetTo: '100',
      maxTargetTo: '200',
      currency: 'EUR',
    })
  })

  it('should determine when to show recommendations', () => {
    // Configurar para mostrar recomendaciones
    mockStockStore.filters.recommends = true
    mockStockStore.currentPage = 1
    mockStockStore.error = null
    mockStockStore.hasResults = true

    // Verificar que se muestran recomendaciones cuando se cumplen todas las condiciones
    const { shouldShowRecommendations } = useStocks()
    expect(shouldShowRecommendations.value).toBe(true)

    // Verificar que no se muestran recomendaciones cuando estamos en otra página
    mockStockStore.currentPage = 2
    expect(useStocks().shouldShowRecommendations.value).toBe(false)

    // Restaurar página y verificar que no se muestran cuando recommends es false
    mockStockStore.currentPage = 1
    mockStockStore.filters.recommends = false
    expect(useStocks().shouldShowRecommendations.value).toBe(false)

    // Restaurar recommends y verificar que no se muestran cuando hay error
    mockStockStore.filters.recommends = true
    mockStockStore.error = 'Some error'
    expect(useStocks().shouldShowRecommendations.value).toBe(false)

    // Restaurar error y verificar que no se muestran cuando no hay resultados
    mockStockStore.error = null
    mockStockStore.hasResults = false
    expect(useStocks().shouldShowRecommendations.value).toBe(false)
  })

  it('should calculate the correct number of highlighted rows', () => {
    // Caso 1: shouldShowRecommendations = true, con 5 resultados
    mockStockStore.filters.recommends = true
    mockStockStore.currentPage = 1
    mockStockStore.error = null
    mockStockStore.hasResults = true
    mockStockStore.data = new Array(5).fill({}) as Stock[]

    const { highlightedRowsCount } = useStocks()
    expect(highlightedRowsCount.value).toBe(3) // Max 3

    // Caso 2: shouldShowRecommendations = true, con 2 resultados
    mockStockStore.data = new Array(2).fill({}) as Stock[]

    const result2 = useStocks().highlightedRowsCount
    expect(result2.value).toBe(2) // Solo hay 2 elementos

    // Caso 3: shouldShowRecommendations = false
    mockStockStore.filters.recommends = false

    const result3 = useStocks().highlightedRowsCount
    expect(result3.value).toBe(0) // No destacar ninguna fila
  })

  it('should check for pending updates when submitting filters', () => {
    // Configurar un estado con actualización pendiente
    mockSyncStore.dataUpdated = true

    const { handleFilterSubmit } = useStocks()

    // Ejecutar el método
    handleFilterSubmit({ query: 'AAPL' } as FormData)

    // Verificar que se marcó como revisado
    expect(mockSyncStore.markDataChecked).toHaveBeenCalled()

    // Y que se actualizaron los filtros
    expect(mockStockStore.updateFilters).toHaveBeenCalledWith({ query: 'AAPL' })
  })

  it('should handle page change correctly', () => {
    const { handlePageChange } = useStocks()

    // Cambiar página
    handlePageChange(3)

    // Verificar que se llamó al método del store
    expect(mockStockStore.setPage).toHaveBeenCalledWith(3)
  })

  it('should handle page size change correctly', () => {
    const { handlePageSizeChange } = useStocks()

    // Cambiar tamaño de página
    handlePageSizeChange(25)

    // Verificar que se llamó al método del store
    expect(mockStockStore.setPageSize).toHaveBeenCalledWith(25)
  })

  it('should load initial data if there are no results and not loading', () => {
    // Configurar estado sin resultados y no cargando
    mockStockStore.hasResults = false
    mockStockStore.loading = false

    const { loadInitialData } = useStocks()

    // Ejecutar el método
    loadInitialData()

    // Verificar que se llamó a fetchStocks
    expect(mockStockStore.fetchStocks).toHaveBeenCalled()
  })

  it('should expose the correct computed properties', () => {
    // Configurar algunos valores en el store
    mockStockStore.data = [{ ticker: 'AAPL' } as Stock]
    mockStockStore.loading = true
    mockStockStore.error = 'Some error'
    mockStockStore.currentPage = 2
    mockStockStore.totalPages = 5
    mockStockStore.totalItems = 45

    // Obtener el composable
    const { stockData, stockLoading, stockError, currentPage, totalPages, totalItems } = useStocks()

    // Verificar valores expuestos
    expect(stockData.value).toEqual([{ ticker: 'AAPL' }])
    expect(stockLoading.value).toBe(true)
    expect(stockError.value).toBe('Some error')
    expect(currentPage.value).toBe(2)
    expect(totalPages.value).toBe(5)
    expect(totalItems.value).toBe(45)
  })
})
