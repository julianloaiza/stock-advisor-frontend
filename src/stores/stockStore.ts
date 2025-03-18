// src/stores/stockStore.ts
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
      const size = state.filters.size ?? DEFAULT_FILTERS.size
      return Math.ceil(state.total / size) || 1
    },

    hasResults(state): boolean {
      return state.data.length > 0
    },

    currentPage(state): number {
      return state.filters.page ?? DEFAULT_FILTERS.page
    },

    itemsPerPage(state): number {
      return state.filters.size ?? DEFAULT_FILTERS.size
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
        const activeFilters: GetStocksParams = { ...this.filters }

        // Eliminar las propiedades undefined
        Object.keys(activeFilters).forEach((key) => {
          if (activeFilters[key as keyof GetStocksParams] === undefined) {
            delete activeFilters[key as keyof GetStocksParams]
          }
        })

        const response = await getStocks(activeFilters)

        this.data = response.data.content
        this.total = response.data.total

        // Actualizar estado de paginación con lo que responde el servidor
        this.filters.page = response.data.page ?? DEFAULT_FILTERS.page
        this.filters.size = response.data.size ?? DEFAULT_FILTERS.size

        return response
      } catch (err) {
        this.error = err instanceof Error ? err.message : 't_errors_stockStore_unknown_error'
        console.error('Error loading stocks:', this.error)
        return null
      } finally {
        this.loading = false
      }
    },

    updateFilters(newFilters: Partial<GetStocksParams>) {
      // Resetear a página 1 si cambian filtros que no son de paginación
      const isContentFilterChanged = Object.keys(newFilters).some(
        (key) => key !== 'page' && key !== 'size',
      )

      if (isContentFilterChanged) {
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
      // Mantener el tamaño de página pero resetear a la primera página
      const currentSize = this.filters.size ?? DEFAULT_FILTERS.size

      this.filters = {
        ...DEFAULT_FILTERS,
        size: currentSize,
        ...defaultData,
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
