<template>
  <div>
    <!-- Encabezado de la tabla con título y selector de entries -->
    <TableHeader
      :title="config.title"
      :page-size="currentPageSize"
      :page-size-options="pageSizeOptions"
      @update:page-size="$emit('page-size-change', $event)"
    />

    <!-- Banner de recomendación -->
    <slot name="banner"></slot>

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
              :class="getRowClasses(index)"
            >
              <td
                v-for="column in config.columns"
                :key="`${typeof item.id !== 'undefined' ? item.id : index}-${column.key}`"
                class="px-6 py-4"
                :class="getCellClasses(column, index)"
              >
                <!-- Agrega icono de recomendación para la primera columna en las filas recomendadas -->
                <template
                  v-if="
                    highlightedRows > 0 && index < highlightedRows && column === config.columns[0]
                  "
                >
                  <div class="flex items-center">
                    <span class="mr-2 text-yellow-500 dark:text-yellow-300" v-if="index === 0"
                      >🏆</span
                    >
                    <span class="mr-2 text-slate-400 dark:text-slate-300" v-else-if="index === 1"
                      >🥈</span
                    >
                    <span class="mr-2 text-amber-600 dark:text-amber-400" v-else-if="index === 2"
                      >🥉</span
                    >

                    <template
                      v-if="column.type === 'currency' && typeof item[column.key] !== 'undefined'"
                    >
                      {{ formatCurrency(String(item[column.key]), String(item.currency || 'USD')) }}
                    </template>
                    <template v-else>
                      {{ item[column.key] }}
                    </template>
                  </div>
                </template>

                <!-- Visualización normal para las demás celdas -->
                <template v-else>
                  <template
                    v-if="column.type === 'currency' && typeof item[column.key] !== 'undefined'"
                  >
                    {{ formatCurrency(String(item[column.key]), String(item.currency || 'USD')) }}
                  </template>
                  <template v-else>
                    {{ item[column.key] }}
                  </template>
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
import type { TableConfig, TableItem, TableColumn } from '@/interfaces/BaseTable.interface'

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
    // Número de filas a destacar (0 para ninguna)
    highlightedRows: {
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

    // Función para aplicar clases a cada fila
    const getRowClasses = (index: number) => {
      if (props.highlightedRows <= 0 || index >= props.highlightedRows) {
        return {}
      }

      // Clases para filas destacadas
      if (index === 0) {
        return {
          'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-l-yellow-500 dark:border-l-yellow-400':
            true,
        }
      } else if (index === 1) {
        return {
          'bg-slate-50 dark:bg-slate-900/20 border-l-4 border-l-slate-400 dark:border-l-slate-300':
            true,
        }
      } else if (index === 2) {
        return {
          'bg-amber-50 dark:bg-amber-900/10 border-l-4 border-l-amber-600 dark:border-l-amber-500':
            true,
        }
      }

      // Para más de 3 filas destacadas, usamos un estilo genérico
      return {
        'bg-gray-50 dark:bg-gray-900/10 border-l-4 border-l-gray-400 dark:border-l-gray-300': true,
      }
    }

    // Función para aplicar clases a cada celda
    const getCellClasses = (column: TableColumn, index: number) => {
      const classes = {
        'font-medium text-gray-900 dark:text-white': column.highlight,
      }

      // Clases adicionales para celdas en filas recomendadas
      if (props.highlightedRows > 0 && index < props.highlightedRows) {
        if (index === 0) {
          return {
            ...classes,
            'font-medium': true,
            'text-yellow-800 dark:text-yellow-200': column.highlight,
          }
        } else if (index === 1) {
          return {
            ...classes,
            'font-medium': true,
            'text-slate-800 dark:text-slate-200': column.highlight,
          }
        } else if (index === 2) {
          return {
            ...classes,
            'font-medium': true,
            'text-amber-800 dark:text-amber-200': column.highlight,
          }
        } else {
          return {
            ...classes,
            'font-medium': true,
            'text-gray-800 dark:text-gray-200': column.highlight,
          }
        }
      }

      return classes
    }

    return {
      hasResults,
      pageSizeOptions,
      currentPageSize,
      formatCurrency,
      getRowClasses,
      getCellClasses,
    }
  },
})
</script>
