<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4 dark:text-white">Stock Advisor</h1>

    <!-- Panel de filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <CustomFilter
        title="Filtrar Acciones"
        :formConfig="stocksFormConfig"
        :initialValues="formInitialValues"
        @filter-applied="handleFilterSubmit"
        @filter-reset="handleFilterReset"
      />
    </div>

    <!-- Panel de resultados -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <CustomTable
        :config="tableConfig"
        :data="stockStore.data"
        :loading="stockStore.loading"
        :error="stockStore.error || ''"
        :current-page="stockStore.currentPage"
        :total-pages="stockStore.totalPages"
        :total-items="stockStore.totalItems"
        :highlighted-rows="getHighlightedRowsCount"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <!-- Slot para el banner de recomendaciones -->
        <template #banner>
          <AlertBanner
            :show="shouldShowRecommendations"
            message="Las acciones destacadas representan las mejores oportunidades de inversión según nuestro algoritmo."
            icon="💡"
          />
        </template>
      </CustomTable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useStockStore } from '@/stores/stockStore'
import { stocksFormConfig, stocksTableConfig } from '@/config/stocksConfig'
import CustomFilter from '@/components/organisms/CustomFilter.vue'
import CustomTable from '@/components/organisms/CustomTable.vue'
import AlertBanner from '@/components/atoms/AlertBanner.vue'
import type { GetStocksParams } from '@/api/services/stockService'
import type { FormData } from '@/interfaces/BaseForm.interface'

export default defineComponent({
  name: 'StocksView',
  components: {
    CustomFilter,
    CustomTable,
    AlertBanner,
  },
  setup() {
    const stockStore = useStockStore()

    // Valores iniciales para el formulario basados en el estado actual
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

    // Lógica para determinar cuándo mostrar recomendaciones
    const shouldShowRecommendations = computed(() => {
      // Solo mostrar recomendaciones si:
      // 1. El filtro de recomendaciones está activo
      // 2. Estamos en la primera página
      // 3. No hay error de carga
      // 4. Hay datos para mostrar
      return (
        stockStore.filters.recommends === true &&
        stockStore.currentPage === 1 &&
        !stockStore.error &&
        stockStore.hasResults
      )
    })

    // Número de filas a destacar
    const getHighlightedRowsCount = computed(() => {
      // Si debemos mostrar recomendaciones y hay al menos 3 elementos
      if (shouldShowRecommendations.value) {
        // Destacar hasta 3 filas, o menos si no hay suficientes datos
        return Math.min(3, stockStore.data.length)
      }
      // Si no se muestran recomendaciones, no destacar filas
      return 0
    })

    // Configuración de la tabla con la paginación actualizada
    const tableConfig = computed(() => ({
      ...stocksTableConfig,
      pagination: {
        ...stocksTableConfig.pagination,
        currentPage: stockStore.currentPage,
        itemsPerPage: stockStore.itemsPerPage,
      },
    }))

    // Manejadores de eventos de paginación
    const handlePageChange = (page: number) => {
      stockStore.setPage(page)
    }

    const handlePageSizeChange = (size: number) => {
      stockStore.setPageSize(size)
    }

    // Manejar envío de formulario de filtros
    const handleFilterSubmit = (formData: FormData) => {
      stockStore.updateFilters(formData as Partial<GetStocksParams>)
    }

    // Manejar reset de formulario
    const handleFilterReset = (defaultData: FormData) => {
      stockStore.resetFilters(defaultData as Partial<GetStocksParams>)
    }

    // Carga inicial de datos solo si no hay datos ya cargados
    onMounted(() => {
      if (!stockStore.hasResults && !stockStore.loading) {
        stockStore.fetchStocks()
      }
    })

    return {
      stockStore,
      stocksFormConfig,
      tableConfig,
      formInitialValues,
      shouldShowRecommendations,
      getHighlightedRowsCount,
      handleFilterSubmit,
      handleFilterReset,
      handlePageChange,
      handlePageSizeChange,
    }
  },
})
</script>
