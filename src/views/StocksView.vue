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
      />
    </div>

    <!-- Panel de resultados -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <CustomTable
        title="Resultados"
        :loading="stockStore.loading"
        :data="stockStore.data"
        :error="stockStore.error"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useStockStore } from '@/stores/stockStore'
import { stocksFormConfig } from '@/config/stocksConfig'
import CustomFilter from '@/components/organisms/CustomFilter.vue'
import CustomTable from '@/components/organisms/CustomTable.vue'
import type { GetStocksParams } from '@/api/services/stockService'

export default defineComponent({
  name: 'StocksView',
  components: {
    CustomFilter,
    CustomTable,
  },
  setup() {
    const stockStore = useStockStore()

    // Computar los valores iniciales para el formulario a partir del store
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

    // Manejar envío de formulario de filtros
    const handleFilterSubmit = (formData: Record<string, unknown>) => {
      // Solo pasamos los datos al store, que ya maneja la transformación correctamente
      stockStore.updateFilters(formData as Partial<GetStocksParams>)
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
      formInitialValues,
      handleFilterSubmit,
    }
  },
})
</script>
