<!-- src/views/StocksView.vue -->
<script setup lang="ts">
import { useStockStore } from '@/stores/stockStore'
import BaseFilter from '@/components/common/BaseFilter.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import BasePaginator from '@/components/common/BasePaginator.vue'
import { ref, onMounted } from 'vue'

const stockStore = useStockStore()
const isMobile = ref(false)

const toggleFilter = () => {
  stockStore.showFilter = !stockStore.showFilter
}

// Detectar si es dispositivo móvil para manejo adecuado de clases
onMounted(() => {
  const checkIfMobile = () => {
    isMobile.value = window.innerWidth < 768
  }

  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)

  return () => {
    window.removeEventListener('resize', checkIfMobile)
  }
})
</script>

<template>
  <section class="min-h-[calc(100vh-5rem)]">
    <div class="flex flex-col md:flex-row md:gap-6">
      <!-- Panel de filtros -->
      <div class="w-full md:w-1/4 mb-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xl font-semibold">Filtros</h2>

          <!-- Botón para mostrar/ocultar filtros en mobile -->
          <div class="md:hidden">
            <button
              @click="toggleFilter"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md transition-colors duration-300 flex items-center space-x-1"
            >
              <span>{{ stockStore.showFilter ? 'Ocultar' : 'Mostrar' }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Panel de filtros (siempre visible en desktop, colapsable en mobile) -->
        <div
          :class="[
            'transition-all duration-300 ease-in-out',
            'md:static md:block md:opacity-100',
            'bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700',
            stockStore.showFilter ? 'block' : 'hidden',
          ]"
        >
          <BaseFilter />

          <!-- Botón para cerrar el panel en mobile -->
          <div class="mt-4 text-right md:hidden">
            <button
              @click="toggleFilter"
              class="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 flex items-center ml-auto space-x-1"
            >
              <span>Cerrar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla y paginador -->
      <div
        class="w-full md:w-3/4 transition-opacity duration-300"
        :class="{
          'opacity-50 pointer-events-none': stockStore.showFilter && isMobile,
          'opacity-100': !stockStore.showFilter || !isMobile,
        }"
      >
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xl font-semibold">Lista de Acciones</h2>
          <div class="hidden md:block text-sm text-gray-400">
            <span>{{ new Date().toLocaleDateString() }}</span>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
          <BaseTable />
          <div class="mt-6 pt-4 border-t border-gray-700">
            <BasePaginator />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
