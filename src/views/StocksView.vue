<template>
  <div class="container mx-auto p-4">
    <!-- Panel de filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <CustomFilter
        :title="'t_stocks_filter_title'"
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
        :message="'t_stocks_recommendations_banner'"
        icon="💡"
      />

      <!-- Banner de datos actualizados -->
      <AlertBanner
        :show="hasPendingDataUpdate"
        :message="'t_stocks_data_update_banner'"
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
        :highlight-recommendations="shouldShowRecommendations"
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
