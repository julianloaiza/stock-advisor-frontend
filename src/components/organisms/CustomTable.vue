<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold dark:text-white">{{ config.title }}</h2>

      <!-- Selector de elementos por página -->
      <div v-if="config.pagination && !loading" class="flex items-center space-x-2">
        <select
          id="itemsPerPage"
          v-model="selectedItemsPerPage"
          @change="handleItemsPerPageChange"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 pl-3 pr-4 text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
          :disabled="loading || paginationDisabled"
          style="padding-right: 1.5rem"
        >
          <option v-for="option in pageSizeOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <label for="itemsPerPage" class="text-sm font-medium text-gray-600 dark:text-gray-400">
          entradas por página
        </label>
      </div>
    </div>

    <!-- Slot para banners informativos -->
    <slot name="banner"></slot>

    <!-- Tabla de datos -->
    <div class="overflow-x-auto relative">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th
              v-for="column in config.columns"
              :key="column.key"
              scope="col"
              class="py-3 px-6"
              :class="{ 'font-bold': column.highlight }"
            >
              {{ column.header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="!loading && !error && data.length > 0">
            <tr
              v-for="(item, index) in data"
              :key="item.id || index"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              :class="{
                'bg-blue-50 dark:bg-blue-900/20':
                  index < highlightedRows && config.style === 'recommend',
              }"
            >
              <td
                v-for="column in config.columns"
                :key="`${item.id || index}-${column.key}`"
                class="py-4 px-6"
                :class="{ 'font-semibold': column.highlight }"
              >
                {{ formatCellValue(item[column.key], column.type) }}
              </td>
            </tr>
          </template>
          <tr v-else-if="loading">
            <td :colspan="config.columns.length" class="py-10 text-center">
              <div class="flex justify-center items-center">
                <div
                  class="w-6 h-6 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"
                ></div>
                <span class="ml-2">Cargando...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="error">
            <td :colspan="config.columns.length" class="py-10 text-center">
              <div class="text-red-500">{{ error }}</div>
            </td>
          </tr>
          <tr v-else>
            <td :colspan="config.columns.length" class="py-10 text-center">
              No hay datos disponibles
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="config.pagination && totalPages > 0" class="mt-4">
      <TablePagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :items-per-page="selectedItemsPerPage"
        :loading="loading"
        :has-results="data.length > 0"
        :disabled="paginationDisabled"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import TablePagination from '@/components/molecules/CustomTable/TablePagination.vue'
import type { TableConfig, TableItem } from '@/interfaces/BaseTable.interface'

export default defineComponent({
  name: 'CustomTable',
  components: {
    TablePagination,
  },
  props: {
    config: {
      type: Object as () => TableConfig,
      required: true,
    },
    data: {
      type: Array as () => TableItem[],
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    highlightedRows: {
      type: Number,
      default: 0,
    },
    paginationDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['page-change', 'page-size-change'],
  setup(props, { emit }) {
    // Estado local para la selección de elementos por página
    const selectedItemsPerPage = ref(props.config.pagination?.itemsPerPage || 10)

    // Opciones de tamaño de página con valor de respaldo
    const pageSizeOptions = computed(
      () => props.config.pagination?.pageSizeOptions || [10, 25, 50, 100],
    )

    // Actualizar el estado local cuando cambia la configuración
    watch(
      () => props.config.pagination?.itemsPerPage,
      (newValue) => {
        if (newValue) {
          selectedItemsPerPage.value = newValue
        }
      },
    )

    // Manejadores de eventos
    const handlePageChange = (page: number): void => {
      emit('page-change', page)
    }

    const handleItemsPerPageChange = (): void => {
      emit('page-size-change', selectedItemsPerPage.value)
    }

    // Formatear valores de las celdas según el tipo
    const formatCellValue = (value: unknown, type?: string): string => {
      if (value === null || value === undefined) {
        return '-'
      }

      if (type === 'currency' && typeof value === 'number') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value)
      }

      return String(value)
    }

    return {
      selectedItemsPerPage,
      pageSizeOptions,
      handlePageChange,
      handleItemsPerPageChange,
      formatCellValue,
    }
  },
})
</script>
