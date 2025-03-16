<template>
  <div>
    <!-- Encabezado de la tabla con título y selector de entries -->
    <TableHeader
      :title="config.title"
      :page-size="currentPageSize"
      :page-size-options="pageSizeOptions"
      @update:page-size="$emit('page-size-change', $event)"
    />

    <!-- Tabla de resultados siempre visible -->
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mb-4">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th v-for="column in config.columns" :key="column.key" scope="col" class="px-6 py-3">
              <span class="flex items-center">
                {{ column.header }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Mensajes de estado (carga, error, sin datos) -->
          <TableEmptyMessage
            v-if="loading || error || !data || !data.length"
            :loading="loading"
            :error="error"
            :col-span="config.columns.length"
          />

          <!-- Datos de la tabla -->
          <template v-else>
            <tr
              v-for="(item, index) in data"
              :key="typeof item.id !== 'undefined' ? item.id : index"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              :class="{
                'bg-blue-50 dark:bg-blue-900': config.style === 'recommend' && index === 0,
              }"
            >
              <td
                v-for="column in config.columns"
                :key="`${typeof item.id !== 'undefined' ? item.id : index}-${column.key}`"
                class="px-6 py-4"
                :class="{
                  'font-medium text-gray-900 whitespace-nowrap dark:text-white': column.highlight,
                }"
              >
                <template
                  v-if="column.type === 'currency' && typeof item[column.key] !== 'undefined'"
                >
                  {{ formatCurrency(String(item[column.key]), String(item.currency || 'USD')) }}
                </template>
                <template v-else>
                  {{ item[column.key] }}
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Paginación (abajo de la tabla) -->
    <TablePagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :items-per-page="currentPageSize"
      :total-items="totalItems"
      :loading="loading"
      :has-results="hasResults"
      @page-change="$emit('page-change', $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import { formatCurrency } from '@/utils/formatterUtils'
import TableHeader from '@/components/molecules/CustomTable/TableHeader.vue'
import TablePagination from '@/components/molecules/CustomTable/TablePagination.vue'
import TableEmptyMessage from '@/components/molecules/CustomTable/TableEmptyMessage.vue'
import type { TableConfig, TableItem } from '@/interfaces/BaseTable.interface'

export default defineComponent({
  name: 'CustomTable',
  components: {
    TableHeader,
    TablePagination,
    TableEmptyMessage,
  },
  props: {
    config: {
      type: Object as PropType<TableConfig>,
      required: true,
    },
    data: {
      type: Array as PropType<TableItem[]>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String as PropType<string | null | undefined>,
      default: '',
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
  },
  emits: ['page-change', 'page-size-change'],
  setup(props) {
    // Valores computados básicos
    const hasResults = computed(() => props.data && props.data.length > 0)

    // Opciones de paginación
    const pageSizeOptions = computed(() => {
      return props.config.pagination?.pageSizeOptions || [10, 25, 50, 100]
    })

    // Tamaño de página actual
    const currentPageSize = computed(() => {
      return props.config.pagination?.itemsPerPage || 10
    })

    return {
      hasResults,
      pageSizeOptions,
      currentPageSize,
      formatCurrency,
    }
  },
})
</script>
