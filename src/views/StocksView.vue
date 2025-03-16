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
      const { query, recommends, minTargetTo, maxTargetTo } = stockStore.filters

      console.log('Initial values from store:', { query, recommends, minTargetTo, maxTargetTo })

      return {
        query: query || '',
        recommends: recommends || false,
        minTargetTo: minTargetTo !== undefined ? minTargetTo : '',
        maxTargetTo: maxTargetTo !== undefined ? maxTargetTo : '',
      }
    })

    // Manejar envío de formulario de filtros
    const handleFilterSubmit = (formData: Record<string, unknown>) => {
      console.log('Form data received:', formData)

      // Preparar objeto de filtros para la API
      const filters: Partial<GetStocksParams> = {
        query: typeof formData.query === 'string' ? formData.query : undefined,
        recommends: formData.recommends === true,
      }

      // Manejo específico para los campos numéricos
      if ('minTargetTo' in formData) {
        if (formData.minTargetTo === '' || formData.minTargetTo === null) {
          filters.minTargetTo = undefined
        } else {
          // Convertir a número si es posible
          const numValue =
            typeof formData.minTargetTo === 'number'
              ? formData.minTargetTo
              : parseFloat(String(formData.minTargetTo))

          filters.minTargetTo = isNaN(numValue) ? undefined : numValue
        }
      }

      if ('maxTargetTo' in formData) {
        if (formData.maxTargetTo === '' || formData.maxTargetTo === null) {
          filters.maxTargetTo = undefined
        } else {
          // Convertir a número si es posible
          const numValue =
            typeof formData.maxTargetTo === 'number'
              ? formData.maxTargetTo
              : parseFloat(String(formData.maxTargetTo))

          filters.maxTargetTo = isNaN(numValue) ? undefined : numValue
        }
      }

      console.log('Filters to apply:', filters)

      // Actualizar filtros (también desencadena la búsqueda)
      stockStore.updateFilters(filters)
    }

    // Carga inicial de datos
    onMounted(() => {
      // Verificamos los filtros guardados en localStorage
      const stored = localStorage.getItem('stockFilters')
      if (stored) {
        console.log('Stored filters found:', JSON.parse(stored))
      }

      stockStore.fetchStocks()
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
