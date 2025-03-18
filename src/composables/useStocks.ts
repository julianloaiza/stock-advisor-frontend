import { computed } from 'vue'
import { useStockStore } from '@/stores/stockStore'
import { useSyncStore } from '@/stores/syncStore'
import { stocksTableConfig } from '@/config/stocksConfig'
import type { GetStocksParams } from '@/api/services/stockService'
import type { FormData } from '@/interfaces/BaseForm.interface'

/**
 * Hook para gestionar la lógica de visualización y filtrado de acciones
 *
 * Proporciona estado computado, configuraciones y manejadores de eventos
 * para la vista de acciones, integrando el store de acciones y de sincronización
 *
 * @returns Objeto con estado, configuraciones y métodos para gestionar acciones
 */
export function useStocks() {
  const stockStore = useStockStore()
  const syncStore = useSyncStore()

  /**
   * Valores iniciales para el formulario de filtrado de acciones
   * Derivados de los filtros actuales del store
   */
  const formInitialValues = computed(() => {
    const { query, recommends, minTargetTo, maxTargetTo, currency } = stockStore.filters

    return {
      query: query || '',
      recommends: Boolean(recommends),
      minTargetTo: minTargetTo !== undefined ? minTargetTo : '',
      maxTargetTo: maxTargetTo !== undefined ? maxTargetTo : '',
      currency: currency || 'USD',
    }
  })

  /**
   * Determina si se deben mostrar recomendaciones en la tabla
   * Basado en varios criterios de estado del store
   */
  const shouldShowRecommendations = computed(
    () =>
      stockStore.filters.recommends === true &&
      stockStore.currentPage === 1 &&
      !stockStore.error &&
      stockStore.hasResults,
  )

  /**
   * Calcula el número de filas que se deben resaltar
   * Limitado a un máximo de 3 o menos según los resultados
   */
  const highlightedRowsCount = computed(() =>
    shouldShowRecommendations.value ? Math.min(3, stockStore.data.length) : 0,
  )

  /**
   * Verifica si hay una actualización de datos pendiente
   */
  const hasPendingDataUpdate = computed(() => syncStore.dataUpdated)

  /**
   * Configuración de la tabla con paginación actualizada
   */
  const tableConfig = computed(() => ({
    ...stocksTableConfig,
    pagination: {
      ...stocksTableConfig.pagination,
      currentPage: stockStore.currentPage,
      itemsPerPage: stockStore.itemsPerPage,
    },
  }))

  /**
   * Verificar y marcar actualizaciones pendientes como revisadas
   */
  const checkPendingUpdates = () => {
    if (hasPendingDataUpdate.value) {
      syncStore.markDataChecked()
    }
  }

  /**
   * Cambiar página actual en la tabla
   * @param page - Número de página a establecer
   */
  const handlePageChange = (page: number) => stockStore.setPage(page)

  /**
   * Cambiar número de elementos por página
   * @param size - Número de elementos por página
   */
  const handlePageSizeChange = (size: number) => stockStore.setPageSize(size)

  /**
   * Manejar el envío de filtros
   * @param formData - Datos de filtrado del formulario
   */
  const handleFilterSubmit = (formData: FormData) => {
    checkPendingUpdates()
    stockStore.updateFilters(formData as Partial<GetStocksParams>)
  }

  /**
   * Resetear filtros a valores por defecto
   * @param defaultData - Datos por defecto para los filtros
   */
  const handleFilterReset = (defaultData: FormData) => {
    checkPendingUpdates()
    stockStore.resetFilters(defaultData as Partial<GetStocksParams>)
  }

  /**
   * Cargar datos iniciales si no hay resultados
   */
  const loadInitialData = () => {
    if (!stockStore.hasResults && !stockStore.loading) {
      stockStore.fetchStocks()
    }
  }

  return {
    // Estado del store expuesto de forma selectiva
    stockData: computed(() => stockStore.data),
    stockLoading: computed(() => stockStore.loading),
    stockError: computed(() => stockStore.error),
    currentPage: computed(() => stockStore.currentPage),
    totalPages: computed(() => stockStore.totalPages),
    totalItems: computed(() => stockStore.totalItems),

    // Estado derivado
    tableConfig,
    formInitialValues,
    shouldShowRecommendations,
    highlightedRowsCount,
    hasPendingDataUpdate,

    // Acciones
    handlePageChange,
    handlePageSizeChange,
    handleFilterSubmit,
    handleFilterReset,
    loadInitialData,
  }
}
