import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStockStore = defineStore('stock', () => {
  const stocks = ref<string[]>([]) // Lista de acciones
  const showFilter = ref(false) // Estado del filtro

  function addStock(stock: string) {
    stocks.value.push(stock) // Agregar una acción
  }

  function removeStock(stock: string) {
    stocks.value = stocks.value.filter((s) => s !== stock) // Eliminar una acción
  }

  function toggleFilter() {
    showFilter.value = !showFilter.value // Alternar el estado del filtro
  }

  return { stocks, showFilter, addStock, removeStock, toggleFilter }
})
