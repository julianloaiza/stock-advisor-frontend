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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 px-5 sm:px-10 py-5">
      <!-- Banner de recomendaciones -->
      <AlertBanner
        :show="shouldShowRecommendations"
        message="Las acciones destacadas representan las mejores oportunidades de inversión según nuestro algoritmo."
        icon="💡"
      />

      <!-- Banner de datos actualizados -->
      <AlertBanner
        :show="hasPendingDataUpdate"
        message="Los datos han sido actualizados recientemente. Por favor realice una nueva búsqueda para ver la información más reciente."
        icon="🔄"
        type="info"
      />

      <CustomTable
        :config="tableConfig"
        :data="stockData"
        :loading="stockLoading"
        :error="stockError || ''"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :highlighted-rows="highlightedRowsCount"
        :pagination-disabled="hasPendingDataUpdate"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStocks } from '@/composables/useStocks'
import { stocksFormConfig } from '@/config/stocksConfig'
import CustomFilter from '@/components/organisms/CustomFilter.vue'
import CustomTable from '@/components/organisms/CustomTable.vue'
import AlertBanner from '@/components/atoms/AlertBanner.vue'

export default defineComponent({
  name: 'StocksView',
  components: {
    CustomFilter,
    CustomTable,
    AlertBanner,
  },
  setup() {
    const {
      stockData,
      stockLoading,
      stockError,
      currentPage,
      totalPages,
      totalItems,
      tableConfig,
      formInitialValues,
      shouldShowRecommendations,
      highlightedRowsCount,
      hasPendingDataUpdate,
      handlePageChange,
      handlePageSizeChange,
      handleFilterSubmit,
      handleFilterReset,
      loadInitialData,
    } = useStocks()

    // Carga inicial de datos
    onMounted(loadInitialData)

    return {
      stocksFormConfig,
      stockData,
      stockLoading,
      stockError,
      currentPage,
      totalPages,
      totalItems,
      tableConfig,
      formInitialValues,
      shouldShowRecommendations,
      highlightedRowsCount,
      hasPendingDataUpdate,
      handleFilterSubmit,
      handleFilterReset,
      handlePageChange,
      handlePageSizeChange,
    }
  },
})
</script>
