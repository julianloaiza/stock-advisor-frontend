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
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useStockStore } from '@/stores/stockStore'
import { stocksFormConfig, stocksTableConfig } from '@/config/stocksConfig'
import CustomFilter from '@/components/organisms/CustomFilter.vue'
import CustomTable from '@/components/organisms/CustomTable.vue'
import type { GetStocksParams } from '@/api/services/stockService'
import type { FormData } from '@/interfaces/BaseForm.interface'

export default defineComponent({
  name: 'StocksView',
  components: {
    CustomFilter,
    CustomTable,
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
      handleFilterSubmit,
      handleFilterReset,
      handlePageChange,
      handlePageSizeChange,
    }
  },
})
</script>
