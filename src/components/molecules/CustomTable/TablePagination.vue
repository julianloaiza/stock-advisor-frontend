<template>
  <div class="flex flex-col md:flex-row justify-between items-center">
    <!-- Información de resultados -->
    <div
      class="text-sm text-gray-700 dark:text-gray-400 mb-4 md:mb-0 text-center md:text-left w-full md:w-auto"
    >
      <template v-if="hasResults">
        {{
          $t('t_components_tablePagination_showing', {
            start: (currentPage - 1) * itemsPerPage + 1,
            end: Math.min(currentPage * itemsPerPage, totalItems),
            total: totalItems,
          })
        }}
      </template>
      <template v-else>
        {{
          loading
            ? $t('t_components_tablePagination_loading')
            : $t('t_components_tablePagination_no_results')
        }}
      </template>
    </div>

    <!-- Paginación unificada -->
    <div class="flex space-x-1 justify-center md:justify-end w-full md:w-auto">
      <!-- Botón anterior con icono -->
      <button
        @click="$emit('page-change', currentPage - 1)"
        :disabled="isDisabled || currentPage === 1"
        class="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        :class="{
          'opacity-50 cursor-not-allowed': isDisabled || currentPage === 1,
          'cursor-pointer': !(isDisabled || currentPage === 1),
        }"
        :aria-label="$t('t_components_tablePagination_previous_page')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Números de página (responsive) -->
      <template v-for="page in paginationRange" :key="page">
        <button
          @click="$emit('page-change', page)"
          :disabled="isDisabled"
          class="hidden sm:block px-3 py-1 text-sm font-medium border rounded-lg"
          :class="[
            page === currentPage
              ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
            isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ]"
        >
          {{ page }}
        </button>
      </template>

      <!-- Indicador móvil (solo visible en pantallas muy pequeñas) -->
      <div
        class="sm:hidden px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        {{
          $t('t_components_tablePagination_mobile_page_indicator', {
            current: currentPage,
            total: totalPages,
          })
        }}
      </div>

      <!-- Botón siguiente con icono -->
      <button
        @click="$emit('page-change', currentPage + 1)"
        :disabled="isDisabled || currentPage === totalPages"
        class="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        :class="{
          'opacity-50 cursor-not-allowed': isDisabled || currentPage === totalPages,
          'cursor-pointer': !(isDisabled || currentPage === totalPages),
        }"
        :aria-label="$t('t_components_tablePagination_next_page')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

/**
 * Componente de paginación para tablas con diseño responsive
 * Muestra navegación numérica en pantallas medianas y grandes,
 * y simplifica la interfaz en dispositivos móviles
 */
export default defineComponent({
  name: 'TablePagination',
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasResults: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['page-change'],
  setup(props) {
    const isDisabled = computed(() => props.loading || !props.hasResults || props.disabled)

    /**
     * Calcula el rango de números de página a mostrar,
     * limitando a 5 páginas visibles con la página actual centrada cuando es posible
     */
    const paginationRange = computed(() => {
      const maxVisiblePages = 5
      let startPage = Math.max(1, props.currentPage - Math.floor(maxVisiblePages / 2))
      const endPage = Math.min(props.totalPages, startPage + maxVisiblePages - 1)

      // Ajustar el rango si estamos cerca del final
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
    })

    return {
      isDisabled,
      paginationRange,
    }
  },
})
</script>
