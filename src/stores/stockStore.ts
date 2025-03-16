import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Stock } from '@/interfaces/Stock.interface'
import type { GetStocksParams } from '@/api/services/stockService'
import { getStocks } from '@/api/services/stockService'

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

export const useStockStore = defineStore('stock', () => {
  // Recuperar filtros guardados
  const savedFilters = getFiltersFromStorage()

  // Estado
  const data = ref<Stock[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const page = ref(1)
  const size = ref(10)
  const filters = ref<GetStocksParams>({
    ...DEFAULT_FILTERS,
    ...savedFilters,
  })

  // Getters
  const totalPages = computed(() => {
    return Math.ceil(total.value / size.value)
  })

  const hasResults = computed(() => {
    return data.value.length > 0
  })

  const hasActiveFilters = computed(() => {
    return (
      (filters.value.query !== undefined && filters.value.query !== '') ||
      filters.value.recommends === true ||
      filters.value.minTargetTo !== undefined ||
      filters.value.maxTargetTo !== undefined ||
      (filters.value.currency !== undefined && filters.value.currency !== 'USD')
    )
  })

  const currentPage = computed(() => page.value)
  const itemsPerPage = computed(() => size.value)
  const totalItems = computed(() => total.value)

  // Normalizar valores de filtros para asegurar tipos correctos
  function normalizeFilterValue(key: string, value: unknown): unknown {
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
  }

  // Actualizar filtros
  function updateFilters(newFilters: Partial<GetStocksParams>) {
    // Si cambiamos filtros (no paginación), reseteamos a página 1
    const isNonPaginationChange = Object.keys(newFilters).some(
      (key) => key !== 'page' && key !== 'size',
    )

    if (isNonPaginationChange) {
      filters.value.page = 1
    }

    // Normalizar los valores del filtro
    const normalizedFilters = Object.entries(newFilters).reduce(
      (acc, [key, value]) => {
        acc[key] = normalizeFilterValue(key, value)
        return acc
      },
      {} as Record<string, unknown>,
    )

    // Actualizamos los filtros
    filters.value = {
      ...filters.value,
      ...normalizedFilters,
    }

    // Guardamos en localStorage para persistencia
    saveFiltersToStorage(filters.value)

    // Cargar datos automáticamente
    fetchStocks()
  }

  // Resetear filtros
  function resetFilters(defaultData?: Partial<GetStocksParams>) {
    if (defaultData) {
      // Normalizar los valores por defecto
      const normalizedDefaults = Object.entries(defaultData).reduce(
        (acc, [key, value]) => {
          acc[key] = normalizeFilterValue(key, value)
          return acc
        },
        {} as Record<string, unknown>,
      )

      // Mantener la configuración de paginación actual
      filters.value = {
        ...DEFAULT_FILTERS,
        ...(normalizedDefaults as Partial<GetStocksParams>),
        page: 1,
        size: size.value,
      }
    } else {
      // Reset completo a valores por defecto
      filters.value = {
        ...DEFAULT_FILTERS,
        size: size.value,
      }
    }

    // Eliminar filtros guardados
    localStorage.removeItem(STORAGE_KEY)

    // Cargar datos con filtros reseteados
    fetchStocks()
  }

  // Cambiar página
  function setPage(pageNum: number) {
    updateFilters({ page: pageNum })
  }

  // Cambiar tamaño de página
  function setPageSize(sizeNum: number) {
    updateFilters({ size: sizeNum, page: 1 }) // Al cambiar el tamaño de página, volvemos a la primera
  }

  // Obtener datos de stocks
  async function fetchStocks() {
    loading.value = true
    error.value = null

    try {
      // Filtrar valores undefined para la API
      const activeFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([, value]) => value !== undefined),
      ) as GetStocksParams

      const response = await getStocks(activeFilters)

      data.value = response.data.content
      total.value = response.data.total
      page.value = response.data.page
      size.value = response.data.size

      // Sincronizar página en caso de redirección
      if (page.value !== filters.value.page) {
        filters.value.page = page.value
        saveFiltersToStorage(filters.value)
      }

      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      error.value = `Error al cargar los datos: ${errorMessage}`
      console.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    data,
    loading,
    error,
    filters,

    // Getters
    totalPages,
    hasResults,
    hasActiveFilters,
    currentPage,
    itemsPerPage,
    totalItems,

    // Acciones
    fetchStocks,
    setPage,
    setPageSize,
    updateFilters,
    resetFilters,
    normalizeFilterValue,
  }
})
