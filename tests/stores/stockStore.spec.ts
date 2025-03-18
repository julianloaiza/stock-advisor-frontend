import { setActivePinia, createPinia } from 'pinia'
import { describe, beforeEach, it, expect, vi } from 'vitest'
import { useStockStore } from '../../src/stores/stockStore'
import { getStocks } from '../../src/api/services/stockService'
import type { Stock } from '../../src/interfaces/Stock.interface'

// Mock del servicio de stocks
vi.mock('../../src/api/services/stockService', () => ({
  getStocks: vi.fn(),
}))

describe('Stock Store', () => {
  let store: ReturnType<typeof useStockStore>

  beforeEach(() => {
    // Crear una nueva instancia de Pinia
    setActivePinia(createPinia())

    // Inicializar el store
    store = useStockStore()

    // Limpiar mocks
    vi.clearAllMocks()
  })

  it('debe inicializarse con estado por defecto', () => {
    expect(store.data).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.total).toBe(0)
    expect(store.filters.query).toBe('')
    expect(store.filters.recommends).toBe(false)
    expect(store.filters.currency).toBe('USD')
  })

  it('debe recuperar acciones exitosamente', async () => {
    // Datos de ejemplo para la respuesta de la API
    const mockStocks: Stock[] = [
      {
        id: 1,
        ticker: 'AAPL',
        company: 'Apple Inc.',
        brokerage: 'Goldman Sachs',
        action: 'Buy',
        rating_from: 'Hold',
        rating_to: 'Buy',
        target_from: 150,
        target_to: 180,
        currency: 'USD',
      },
    ]

    // Mockear la respuesta del servicio
    vi.mocked(getStocks).mockResolvedValue({
      data: {
        content: mockStocks,
        total: 1,
        page: 1,
        size: 10,
      },
    })

    // Ejecutar la acción de recuperar acciones
    await store.fetchStocks()

    // Verificaciones
    expect(store.data).toEqual(mockStocks)
    expect(store.total).toBe(1)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('debe manejar errores al recuperar acciones', async () => {
    // Mockear un error en la recuperación
    const errorMessage = 'Error de red'
    vi.mocked(getStocks).mockRejectedValue(new Error(errorMessage))

    // Ejecutar la acción de recuperar acciones
    await store.fetchStocks()

    // Verificaciones
    expect(store.data).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe(errorMessage)
  })

  it('debe actualizar filtros y recuperar acciones', async () => {
    // Mockear la respuesta del servicio
    vi.mocked(getStocks).mockResolvedValue({
      data: {
        content: [],
        total: 0,
        page: 1,
        size: 10,
      },
    })

    // Actualizar filtros
    await store.updateFilters({
      query: 'Apple',
      recommends: true,
    })

    // Verificaciones
    expect(store.filters.query).toBe('Apple')
    expect(store.filters.recommends).toBe(true)
    expect(store.filters.page).toBe(1) // Debe resetear a la primera página
    expect(getStocks).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'Apple',
        recommends: true,
      }),
    )
  })

  it('debe resetear filtros', async () => {
    // Mockear la respuesta del servicio
    vi.mocked(getStocks).mockResolvedValue({
      data: {
        content: [],
        total: 0,
        page: 1,
        size: 10,
      },
    })

    // Establecer algunos filtros personalizados
    store.updateFilters({
      query: 'Test',
      currency: 'EUR',
      page: 3,
    })

    // Resetear filtros
    await store.resetFilters()

    // Verificaciones
    expect(store.filters.query).toBe('')
    expect(store.filters.recommends).toBe(false)
    expect(store.filters.currency).toBe('USD')
    expect(store.filters.page).toBe(1)
  })

  it('debe establecer página específica', async () => {
    // Mockear la respuesta del servicio
    vi.mocked(getStocks).mockResolvedValue({
      data: {
        content: [],
        total: 0,
        page: 2,
        size: 10,
      },
    })

    // Establecer página
    await store.setPage(2)

    // Verificaciones
    expect(store.filters.page).toBe(2)
    expect(getStocks).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
      }),
    )
  })

  it('debe cambiar el tamaño de página', async () => {
    // Mockear la respuesta del servicio
    vi.mocked(getStocks).mockResolvedValue({
      data: {
        content: [],
        total: 0,
        page: 1,
        size: 25,
      },
    })

    // Cambiar tamaño de página
    await store.setPageSize(25)

    // Verificaciones
    expect(store.filters.size).toBe(25)
    expect(store.filters.page).toBe(1) // Debe resetear a la primera página
    expect(getStocks).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 25,
        page: 1,
      }),
    )
  })

  // Pruebas de getters
  describe('Getters', () => {
    it('debe calcular total de páginas correctamente', () => {
      store.total = 25
      store.filters.size = 10

      expect(store.totalPages).toBe(3)
    })

    it('debe verificar si hay resultados', () => {
      store.data = []
      expect(store.hasResults).toBe(false)

      store.data = [
        {
          id: 1,
          ticker: 'TEST',
          company: 'Test Company',
          brokerage: 'Test Brokerage',
          action: 'Buy',
          rating_from: 'Hold',
          rating_to: 'Buy',
          target_from: 100,
          target_to: 150,
          currency: 'USD',
        },
      ]
      expect(store.hasResults).toBe(true)
    })

    it('debe detectar filtros activos', () => {
      // Filtro por defecto (sin filtros activos)
      expect(store.hasActiveFilters).toBe(false)

      // Probar diferentes combinaciones de filtros
      store.filters.query = 'Apple'
      expect(store.hasActiveFilters).toBe(true)

      store.filters.query = ''
      store.filters.recommends = true
      expect(store.hasActiveFilters).toBe(true)

      store.filters.recommends = false
      store.filters.minTargetTo = 100
      expect(store.hasActiveFilters).toBe(true)

      store.filters.minTargetTo = undefined
      store.filters.currency = 'EUR'
      expect(store.hasActiveFilters).toBe(true)
    })
  })
})
