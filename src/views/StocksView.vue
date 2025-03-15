<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4 dark:text-white">Stock Advisor</h1>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <StockFilter @filter-change="updateFilters" />
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <StockTable
        :loading="stocksState.loading"
        :stocks="stocksState.data"
        :error="stocksState.error"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch } from 'vue'
import StockFilter from '@/components/stocks/StockFilter.vue'
import StockTable from '@/components/stocks/StockTable.vue'
import { getStocks } from '@/api/services/stockService'
import type { GetStocksParams } from '@/api/services/stockService'
import type { Stock } from '@/interfaces/Stock.interface'

interface StocksState {
  data: Stock[]
  loading: boolean
  error: string | null
  filters: GetStocksParams
}

export default defineComponent({
  name: 'StocksView',
  components: {
    StockFilter,
    StockTable,
  },
  setup() {
    // Estado unificado para mejor gestión
    const stocksState = reactive<StocksState>({
      data: [],
      loading: false,
      error: null,
      filters: {
        page: 1,
        size: 10,
      },
    })

    // Función para obtener datos con manejo de errores
    const fetchStocks = async () => {
      stocksState.loading = true
      stocksState.error = null

      try {
        const response = await getStocks(stocksState.filters)
        stocksState.data = response.data.content
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        stocksState.error = `Error al cargar los datos: ${errorMessage}`
        console.error(stocksState.error)
      } finally {
        stocksState.loading = false
      }
    }

    // Actualizar filtros y reiniciar paginación
    const updateFilters = (newFilters: GetStocksParams) => {
      stocksState.filters = {
        ...stocksState.filters,
        ...newFilters,
        page: 1, // Resetear a página 1 cuando cambian los filtros
      }
    }

    // Observar cambios en los filtros para cargar datos automáticamente
    watch(
      () => stocksState.filters,
      () => fetchStocks(),
      { deep: true },
    )

    // Carga inicial de datos
    onMounted(fetchStocks)

    return {
      stocksState,
      updateFilters,
    }
  },
})
</script>
