// src/stores/stockStore.ts
import { defineStore } from 'pinia'
import { getStocks } from '@/api/services/stockService'
import type { GetStocksParams } from '@/api/services/stockService'
import type { Stock } from '@/interfaces/Stock.interface'

// Función para guardar filtros en localStorage
const saveFiltersToStorage = (filters: Partial<GetStocksParams>) => {
  localStorage.setItem('stockFilters', JSON.stringify(filters))
}

// Función para recuperar filtros de localStorage
const getFiltersFromStorage = (): Partial<GetStocksParams> => {
  const stored = localStorage.getItem('stockFilters')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Error parsing stored filters', e)
    }
  }
  return {}
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
        query: '',
        recommends: false,
        minTargetTo: undefined,
        maxTargetTo: undefined,
        page: 1,
        size: 10,
        ...savedFilters,
      } as GetStocksParams,
    }
  },

  actions: {
    // Actualizar filtros
    updateFilters(newFilters: Partial<GetStocksParams>) {
      // Si cambiamos filtros (no paginación), reseteamos a página 1
      if (Object.keys(newFilters).some((key) => key !== 'page' && key !== 'size')) {
        this.filters.page = 1
      }

      // Asegurarse que los valores numéricos sean del tipo correcto
      // Los valores vacíos o no numéricos se convierten a undefined
      if ('minTargetTo' in newFilters && newFilters.minTargetTo === null) {
        newFilters.minTargetTo = undefined
      }

      if ('maxTargetTo' in newFilters && newFilters.maxTargetTo === null) {
        newFilters.maxTargetTo = undefined
      }

      // Actualizamos los filtros
      this.filters = {
        ...this.filters,
        ...newFilters,
      }

      // Guardamos en localStorage para persistencia
      saveFiltersToStorage(this.filters)

      // Cargar datos automáticamente
      this.fetchStocks()
    },

    // Resetear filtros
    resetFilters() {
      this.filters = {
        query: '',
        recommends: false,
        minTargetTo: undefined,
        maxTargetTo: undefined,
        page: 1,
        size: 10,
      }

      localStorage.removeItem('stockFilters')
      this.fetchStocks()
    },

    // Cambiar página
    setPage(page: number) {
      this.updateFilters({ page })
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

    // Getters de filtros
    hasActiveFilters: (state) => {
      return (
        (state.filters.query !== undefined && state.filters.query !== '') ||
        state.filters.recommends === true ||
        state.filters.minTargetTo !== undefined ||
        state.filters.maxTargetTo !== undefined
      )
    },
  },
})
