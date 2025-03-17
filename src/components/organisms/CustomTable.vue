<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold dark:text-white">{{ config.title }}</h2>

      <!-- Selector de elementos por página -->
      <div v-if="config.pagination && !loading" class="flex items-center space-x-2">
        <select
          id="itemsPerPage"
          v-model="selectedItemsPerPage"
          @change="handleItemsPerPageChange"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 pl-3 pr-4 text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
          :class="{
            'opacity-50 cursor-not-allowed': loading || paginationDisabled,
            'cursor-pointer': !(loading || paginationDisabled),
          }"
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
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              v-for="column in config.columns"
              :key="column.key"
              scope="col"
              class="px-6 py-3 text-xs font-bold text-gray-500 dark:text-white uppercase tracking-wider"
            >
              {{ column.header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="!getTableStateType">
            <tr
              v-for="(item, index) in data"
              :key="item.id || index"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              :class="getRowClasses(index)"
            >
              <td
                v-for="(column, colIndex) in config.columns"
                :key="`${item.id || index}-${column.key}`"
                class="px-6 py-4"
                :class="[
                  { 'font-bold': column.highlight },
                  colIndex === 0 && highlightRecommendations && index < 3
                    ? 'flex items-center'
                    : '',
                ]"
              >
                <template v-if="colIndex === 0 && highlightRecommendations && index < 3">
                  <span class="medal-icon mr-2">{{ getMedalIcon(index) }}</span>
                </template>
                <span :class="{ 'font-bold': column.highlight }">
                  {{ formatCellValue(item[column.key], column.type) }}
                </span>
              </td>
            </tr>
          </template>

          <!-- Estado de la Tabla -->
          <TableState
            v-else
            :type="getTableStateType"
            :columns-count="config.columns.length"
            :message="error"
          />
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
import { defineComponent } from 'vue'
import TablePagination from '@/components/molecules/CustomTable/TablePagination.vue'
import TableState from '@/components/molecules/CustomTable/TableState.vue'
import type { TableConfig, TableItem } from '@/interfaces/BaseTable.interface'
import { useCustomTable } from '@/composables/useCustomTable'

export default defineComponent({
  name: 'CustomTable',
  components: {
    TablePagination,
    TableState,
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
    highlightRecommendations: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['page-change', 'page-size-change'],
  setup(props, { emit }) {
    const {
      selectedItemsPerPage,
      pageSizeOptions,
      handlePageChange,
      handleItemsPerPageChange,
      formatCellValue,
      getRowClasses,
      getMedalIcon,
      getTableStateType,
    } = useCustomTable(props, emit)

    return {
      selectedItemsPerPage,
      pageSizeOptions,
      handlePageChange,
      handleItemsPerPageChange,
      formatCellValue,
      getRowClasses,
      getMedalIcon,
      getTableStateType,
    }
  },
})
</script>

<style scoped>
.medal-icon {
  display: inline-flex;
  align-items: center;
  font-size: 1.25rem;
}
</style>
