import { mount } from '@vue/test-utils'
import { describe, beforeEach, it, expect, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import StocksView from '../../src/views/StocksView.vue'
import type { Stock } from '../../src/interfaces/Stock.interface'

// Mocks de componentes hijos
vi.mock('@/components/organisms/CustomFilter.vue', () => ({
  default: {
    name: 'CustomFilter',
    template: '<div class="custom-filter"></div>',
    props: ['title', 'formConfig', 'initialValues'],
    emits: ['filter-applied', 'filter-reset'],
  },
}))

vi.mock('@/components/organisms/CustomTable.vue', () => ({
  default: {
    name: 'CustomTable',
    template: '<div class="custom-table"></div>',
    props: [
      'config',
      'data',
      'loading',
      'error',
      'currentPage',
      'totalPages',
      'totalItems',
      'highlightedRows',
      'highlightRecommendations',
      'paginationDisabled',
    ],
    emits: ['page-change', 'page-size-change'],
  },
}))

vi.mock('@/components/atoms/AlertBanner.vue', () => ({
  default: {
    name: 'AlertBanner',
    template: '<div class="alert-banner"></div>',
    props: ['show', 'message', 'icon', 'type'],
  },
}))

// Mock del composable useStocks
const mockUseStocks = {
  stockData: [] as Stock[],
  stockLoading: false,
  stockError: null as string | null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  tableConfig: {},
  formInitialValues: {},
  shouldShowRecommendations: false,
  highlightedRowsCount: 0,
  hasPendingDataUpdate: false,
  handlePageChange: vi.fn(),
  handlePageSizeChange: vi.fn(),
  handleFilterSubmit: vi.fn(),
  handleFilterReset: vi.fn(),
  loadInitialData: vi.fn(),
}

vi.mock('@/composables/useStocks', () => ({
  useStocks: () => mockUseStocks,
}))

describe('StocksView', () => {
  beforeEach(() => {
    // Configurar Pinia
    const pinia = createPinia()
    setActivePinia(pinia)

    // Resetear mocks antes de cada prueba
    vi.clearAllMocks()

    // Resetear estado del mock
    Object.assign(mockUseStocks, {
      stockData: [],
      stockLoading: false,
      stockError: null,
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      shouldShowRecommendations: false,
      highlightedRowsCount: 0,
      hasPendingDataUpdate: false,
    })
  })

  it('renderiza correctamente', () => {
    // Montar el componente
    const wrapper = mount(StocksView, {
      global: {
        plugins: [createPinia()],
      },
    })

    // Verificar que los componentes principales estén presentes
    expect(wrapper.findComponent({ name: 'CustomFilter' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'CustomTable' }).exists()).toBe(true)
    expect(wrapper.findAllComponents({ name: 'AlertBanner' })).toHaveLength(2)
  })

  it('carga datos iniciales al montar', () => {
    // Montar el componente
    mount(StocksView, {
      global: {
        plugins: [createPinia()],
      },
    })

    // Verificar que se llamó a loadInitialData
    expect(mockUseStocks.loadInitialData).toHaveBeenCalledTimes(1)
  })

  it('renderiza banners de recomendaciones y actualización', async () => {
    // Modificar estado de los banners
    mockUseStocks.shouldShowRecommendations = true
    mockUseStocks.hasPendingDataUpdate = true

    // Montar el componente
    const wrapper = mount(StocksView, {
      global: {
        plugins: [createPinia()],
      },
    })

    // Forzar actualización
    await nextTick()

    // Obtener todos los alert banners
    const alertBanners = wrapper.findAllComponents({ name: 'AlertBanner' })

    // Verificar que los banners estén visibles
    expect(alertBanners.length).toBe(2)
  })

  it('maneja cambio de página', () => {
    // Montar el componente
    const wrapper = mount(StocksView, {
      global: {
        plugins: [createPinia()],
      },
    })

    // Obtener el componente de tabla
    const customTable = wrapper.findComponent({ name: 'CustomTable' })

    // Simular evento de cambio de página
    customTable.vm.$emit('page-change', 2)

    // Verificar que se llamó al método correcto
    expect(mockUseStocks.handlePageChange).toHaveBeenCalledWith(2)
  })

  it('pasa props correctas a CustomTable', () => {
    // Preparar datos de prueba con tipo explícito
    const testStock: Stock = {
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
    }

    // Modificar estado del mock para prueba
    mockUseStocks.stockData = [testStock]
    mockUseStocks.stockLoading = true
    mockUseStocks.stockError = 'Test error'
    mockUseStocks.currentPage = 2
    mockUseStocks.totalPages = 5
    mockUseStocks.totalItems = 50
    mockUseStocks.highlightedRowsCount = 3

    // Montar el componente
    const wrapper = mount(StocksView, {
      global: {
        plugins: [createPinia()],
      },
    })

    // Obtener el componente de tabla
    const customTable = wrapper.findComponent({ name: 'CustomTable' })

    // Verificar props pasadas
    expect(customTable.props('data')).toEqual([testStock])
    expect(customTable.props('loading')).toBe(true)
    expect(customTable.props('error')).toBe('Test error')
    expect(customTable.props('currentPage')).toBe(2)
    expect(customTable.props('totalPages')).toBe(5)
    expect(customTable.props('totalItems')).toBe(50)
    expect(customTable.props('highlightedRows')).toBe(3)
  })
})
