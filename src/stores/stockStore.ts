import { defineStore } from 'pinia'
import type { Stock } from '@/interfaces/Stock.interface'
import type { GetStocksParams } from '@/api/services/stockService'
import { getStocks } from '@/api/services/stockService'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

/**
 * Configuración inicial de filtros para la búsqueda de acciones
 * Define valores predeterminados para la consulta de stocks
 */
const DEFAULT_FILTERS: GetStocksParams = {
  query: '',
  recommends: false,
  minTargetTo: undefined,
  maxTargetTo: undefined,
  currency: 'USD',
  page: 1,
  size: 10,
}

/**
 * Estructura del estado para el store de acciones
 * Representa el estado global de la gestión de stocks
 */
interface StockState {
  data: Stock[] // Listado de acciones
  loading: boolean // Estado de carga
  error: string | null // Mensaje de error
  total: number // Total de elementos
  filters: GetStocksParams // Filtros de búsqueda
}

/**
 * Store de gestión de acciones para Stock Advisor
 *
 * Responsabilidades:
 * - Gestionar la lista de acciones
 * - Manejar filtros y paginación
 * - Realizar consultas a la API
 * - Persistir estado de filtros
 */
export const useStockStore = defineStore('stock', {
  state: (): StockState => ({
    data: [],
    loading: false,
    error: null,
    total: 0,
    filters: { ...DEFAULT_FILTERS },
  }),

  getters: {
    /**
     * Calcula el número total de páginas según el tamaño de página
     */
    totalPages(state): number {
      const size = state.filters.size ?? DEFAULT_FILTERS.size
      return Math.ceil(state.total / size) || 1
    },

    /**
     * Verifica si hay resultados disponibles
     */
    hasResults(state): boolean {
      return state.data.length > 0
    },

    /**
     * Obtiene la página actual
     */
    currentPage(state): number {
      return state.filters.page ?? DEFAULT_FILTERS.page
    },

    /**
     * Obtiene el número de elementos por página
     */
    itemsPerPage(state): number {
      return state.filters.size ?? DEFAULT_FILTERS.size
    },

    /**
     * Obtiene el número total de elementos
     */
    totalItems(state): number {
      return state.total
    },

    /**
     * Detecta si hay filtros activos aplicados
     */
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
    /**
     * Recupera acciones desde la API con los filtros actuales
     * Gestiona el estado de carga y maneja posibles errores
     */
    async fetchStocks() {
      this.loading = true
      this.error = null

      try {
        // Filtrar valores undefined para la API
        const activeFilters: GetStocksParams = { ...this.filters }

        // Eliminar propiedades undefined para una consulta limpia
        Object.keys(activeFilters).forEach((key) => {
          if (activeFilters[key as keyof GetStocksParams] === undefined) {
            delete activeFilters[key as keyof GetStocksParams]
          }
        })

        const response = await getStocks(activeFilters)

        this.data = response.data.content
        this.total = response.data.total

        // Sincronizar estado de paginación con la respuesta del servidor
        this.filters.page = response.data.page ?? DEFAULT_FILTERS.page
        this.filters.size = response.data.size ?? DEFAULT_FILTERS.size

        return response
      } catch (err) {
        // Gestión de errores con fallback a mensaje genérico
        this.error = err instanceof Error ? err.message : 't_errors_stockStore_unknown_error'
        console.error('Error loading stocks:', this.error)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Actualiza los filtros de búsqueda
     * Resetea la página si cambian filtros de contenido
     *
     * @param newFilters - Filtros parciales a actualizar
     */
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

    /**
     * Reinicia los filtros a su estado inicial
     *
     * @param defaultData - Datos por defecto opcionales
     */
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

    /**
     * Establece una página específica
     *
     * @param pageNum - Número de página
     */
    setPage(pageNum: number) {
      this.filters.page = pageNum
      this.fetchStocks()
    },

    /**
     * Cambia el tamaño de página
     *
     * @param sizeNum - Número de elementos por página
     */
    setPageSize(sizeNum: number) {
      this.filters.size = sizeNum
      this.filters.page = DEFAULT_FILTERS.page
      this.fetchStocks()
    },
  },

  // Configuración de persistencia para mantener los filtros
  persist: {
    key: 'stock-filters',
    paths: ['filters'],
  } as PersistenceOptions<StockState>,
})
