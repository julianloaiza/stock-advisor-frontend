import { defineStore } from 'pinia'
import { getStocks } from '@/api/services/stockService'
import type { GetStocksParams } from '@/api/services/stockService'
import type { Stock } from '@/interfaces/Stock.interface'

const STORAGE_KEY = 'stockFilters'

// Función para guardar filtros en localStorage
const saveFiltersToStorage = (filters: Partial<GetStocksParams>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  } catch (e) {
    console.error('Error saving filters to storage:', e)
  }
}

// Función para recuperar filtros de localStorage
const getFiltersFromStorage = (): Partial<GetStocksParams> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (e) {
    console.error('Error parsing stored filters:', e)
    return {}
  }
}

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

interface StockState {
  // Datos de los stocks
  data: Stock[]
  loading: boolean
  error: string | null
  total: number
  page: number
  size: number

  // Filtros
  filters: GetStocksParams
}

export const useStockStore = defineStore('stock', {
  state: (): StockState => {
    // Recuperar filtros guardados
    const savedFilters = getFiltersFromStorage()

    return {
      // Datos de stocks
      data: [],
      loading: false,
      error: null,
      total: 0,
      page: 1,
      size: 10,

      // Filtros (con valores iniciales + persistencia)
      filters: {
        ...DEFAULT_FILTERS,
        ...savedFilters,
      } as GetStocksParams,
    }
  },

  actions: {
    // Normalizar valores de filtros para asegurar tipos correctos
    normalizeFilterValue(key: string, value: unknown): unknown {
      // Para campos numéricos
      if (['minTargetTo', 'maxTargetTo'].includes(key)) {
        if (value === '' || value === null || value === undefined) {
          return undefined
        }

        const numValue = typeof value === 'number' ? value : parseFloat(String(value))
        return isNaN(numValue) ? undefined : numValue
      }

      // Para campos booleanos
      if (key === 'recommends') {
        return Boolean(value)
      }

      // El campo currency siempre debe tener un valor
      if (key === 'currency') {
        return value || 'USD'
      }

      // Para otros campos
      return value
    },

    // Actualizar filtros
    updateFilters(newFilters: Partial<GetStocksParams>) {
      // Si cambiamos filtros (no paginación), reseteamos a página 1
      const isNonPaginationChange = Object.keys(newFilters).some(
        (key) => key !== 'page' && key !== 'size',
      )

      if (isNonPaginationChange) {
        this.filters.page = 1
      }

      // Normalizar los valores del filtro
      const normalizedFilters = Object.entries(newFilters).reduce(
        (acc, [key, value]) => {
          acc[key] = this.normalizeFilterValue(key, value)
          return acc
        },
        {} as Record<string, unknown>,
      )

      // Actualizamos los filtros
      this.filters = {
        ...this.filters,
        ...normalizedFilters,
      }

      // Guardamos en localStorage para persistencia
      saveFiltersToStorage(this.filters)

      // Cargar datos automáticamente
      this.fetchStocks()
    },

    // Resetear filtros
    resetFilters() {
      this.filters = { ...DEFAULT_FILTERS }
      localStorage.removeItem(STORAGE_KEY)
      this.fetchStocks()
    },

    // Cambiar página
    setPage(page: number) {
      this.updateFilters({ page })
    },

    // Cambiar tamaño de página
    setPageSize(size: number) {
      this.updateFilters({ size, page: 1 }) // Al cambiar el tamaño de página, volvemos a la primera
    },

    // Obtener datos de stocks
    async fetchStocks() {
      this.loading = true
      this.error = null

      try {
        // Filtrar valores undefined para la API
        const activeFilters = Object.fromEntries(
          Object.entries(this.filters).filter(([, value]) => value !== undefined),
        ) as GetStocksParams

        const response = await getStocks(activeFilters)
        this.data = response.data.content
        this.total = response.data.total
        this.page = response.data.page
        this.size = response.data.size

        // Sincronizar página en caso de redirección
        if (this.page !== this.filters.page) {
          this.filters.page = this.page
          saveFiltersToStorage(this.filters)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        this.error = `Error al cargar los datos: ${errorMessage}`
        console.error(this.error)
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    // Getters de datos
    hasResults: (state) => state.data.length > 0,
    totalPages: (state) => Math.ceil(state.total / state.size),
    currentPage: (state) => state.page,
    itemsPerPage: (state) => state.size,
    totalItems: (state) => state.total,

    // Getters de filtros
    hasActiveFilters: (state) => {
      return (
        (state.filters.query !== undefined && state.filters.query !== '') ||
        state.filters.recommends === true ||
        state.filters.minTargetTo !== undefined ||
        state.filters.maxTargetTo !== undefined ||
        // Currency ya no es un filtro opcional, siempre tiene valor
        (state.filters.currency !== undefined && state.filters.currency !== 'USD')
      )
    },
  },
})
