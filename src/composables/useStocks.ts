// src/composables/useStocks.ts
import { computed } from 'vue'
import { useStockStore } from '@/stores/stockStore'
import { useSyncStore } from '@/stores/syncStore'
import { stocksTableConfig } from '@/config/stocksConfig'
import type { GetStocksParams } from '@/api/services/stockService'
import type { FormData } from '@/interfaces/BaseForm.interface'

export function useStocks() {
  const stockStore = useStockStore()
  const syncStore = useSyncStore()

  // Valores iniciales para el formulario
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

  // Estado computado para la UI
  const shouldShowRecommendations = computed(
    () =>
      stockStore.filters.recommends === true &&
      stockStore.currentPage === 1 &&
      !stockStore.error &&
      stockStore.hasResults,
  )

  const highlightedRowsCount = computed(() =>
    shouldShowRecommendations.value ? Math.min(3, stockStore.data.length) : 0,
  )

  const hasPendingDataUpdate = computed(() => syncStore.dataUpdated)

  const tableConfig = computed(() => ({
    ...stocksTableConfig,
    pagination: {
      ...stocksTableConfig.pagination,
      currentPage: stockStore.currentPage,
      itemsPerPage: stockStore.itemsPerPage,
    },
  }))

  // Función auxiliar para verificar actualizaciones pendientes
  const checkPendingUpdates = () => {
    if (hasPendingDataUpdate.value) {
      syncStore.markDataChecked()
    }
  }

  // Acciones
  const handlePageChange = (page: number) => stockStore.setPage(page)

  const handlePageSizeChange = (size: number) => stockStore.setPageSize(size)

  const handleFilterSubmit = (formData: FormData) => {
    checkPendingUpdates()
    stockStore.updateFilters(formData as Partial<GetStocksParams>)
  }

  const handleFilterReset = (defaultData: FormData) => {
    checkPendingUpdates()
    stockStore.resetFilters(defaultData as Partial<GetStocksParams>)
  }

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
