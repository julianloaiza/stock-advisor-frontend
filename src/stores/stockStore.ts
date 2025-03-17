import { defineStore } from 'pinia'
import type { Stock } from '@/interfaces/Stock.interface'
import type { GetStocksParams } from '@/api/services/stockService'
import { getStocks } from '@/api/services/stockService'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

// Valores por defecto para los filtros
const DEFAULT_FILTERS: GetStocksParams = {
  query: '',
  recommends: false,
  minTargetTo: undefined,
  maxTargetTo: undefined,
  currency: 'USD',
  page: 1,
  size: 10,
}

// Definición del tipo de estado del store
interface StockState {
  data: Stock[]
  loading: boolean
  error: string | null
  total: number
  filters: GetStocksParams
}

// Sintaxis correcta: defineStore('id', options)
export const useStockStore = defineStore('stock', {
  state: (): StockState => ({
    data: [],
    loading: false,
    error: null,
    total: 0,
    filters: { ...DEFAULT_FILTERS },
  }),

  getters: {
    totalPages(state): number {
      // Asegurar que size nunca sea undefined usando un valor por defecto
      const size = state.filters.size || DEFAULT_FILTERS.size
      return Math.ceil(state.total / size) || 1
    },
    hasResults(state): boolean {
      return state.data.length > 0
    },
    currentPage(state): number {
      // Asegurar que page nunca sea undefined
      return state.filters.page || DEFAULT_FILTERS.page
    },
    itemsPerPage(state): number {
      // Asegurar que size nunca sea undefined
      return state.filters.size || DEFAULT_FILTERS.size
    },
    totalItems(state): number {
      return state.total
    },
    hasActiveFilters(state): boolean {
      return (
        state.filters.query !== '' ||
        state.filters.recommends === true ||
        state.filters.minTargetTo !== undefined ||
        state.filters.maxTargetTo !== undefined ||
        state.filters.currency !== 'USD'
      )
    },
  },

  actions: {
    async fetchStocks() {
      this.loading = true
      this.error = null

      try {
        // Filtrar valores undefined para la API
        const activeFilters = Object.fromEntries(
          Object.entries(this.filters).filter(([, value]) => value !== undefined),
        ) as unknown as GetStocksParams

        const response = await getStocks(activeFilters)

        this.data = response.data.content
        this.total = response.data.total

        // Actualizar estado de paginación con lo que responde el servidor
        // Asegurar que nunca se asigna undefined
        this.filters.page = response.data.page || DEFAULT_FILTERS.page
        this.filters.size = response.data.size || DEFAULT_FILTERS.size

        return response
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Error desconocido'
        console.error('Error al cargar stocks:', this.error)
        return null
      } finally {
        this.loading = false
      }
    },

    updateFilters(newFilters: Partial<GetStocksParams>) {
      // Si cambiamos filtros (no paginación), reseteamos a página 1
      if (Object.keys(newFilters).some((key) => key !== 'page' && key !== 'size')) {
        this.filters.page = DEFAULT_FILTERS.page
      }

      // Actualizar los filtros directamente
      this.filters = {
        ...this.filters,
        ...newFilters,
      }

      // Cargar datos automáticamente
      this.fetchStocks()
    },

    resetFilters(defaultData?: Partial<GetStocksParams>) {
      this.filters = {
        ...DEFAULT_FILTERS,
        size: this.filters.size || DEFAULT_FILTERS.size, // Mantener el tamaño de página actual
        ...defaultData, // Aplicar valores por defecto proporcionados
        page: DEFAULT_FILTERS.page, // Siempre volver a la primera página
      }

      this.fetchStocks()
    },

    setPage(pageNum: number) {
      this.filters.page = pageNum
      this.fetchStocks()
    },

    setPageSize(sizeNum: number) {
      this.filters.size = sizeNum
      this.filters.page = DEFAULT_FILTERS.page
      this.fetchStocks()
    },
  },

  persist: {
    key: 'stock-filters',
    paths: ['filters'],
  } as PersistenceOptions<StockState>,
})
