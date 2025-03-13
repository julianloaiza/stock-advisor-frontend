<template>
  <div class="min-h-screen bg-gray-200 p-6">
    <h1 class="text-4xl font-extrabold text-center text-blue-700 mb-6">
      Prueba de Vue + Axios + Tailwind con API
    </h1>

    <div class="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <button
        @click="fetchStocks"
        class="mb-4 px-5 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-800 transition"
      >
        Cargar datos
      </button>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead class="bg-blue-600 text-white uppercase">
            <tr>
              <th class="border px-4 py-3">Ticker</th>
              <th class="border px-4 py-3">Empresa</th>
              <th class="border px-4 py-3">Brokerage</th>
              <th class="border px-4 py-3">Target From</th>
              <th class="border px-4 py-3">Target To</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="stock in stocks"
              :key="stock.id"
              class="text-center bg-white odd:bg-gray-100 hover:bg-gray-200 transition"
            >
              <td class="border px-4 py-3 font-semibold text-gray-700">{{ stock.ticker }}</td>
              <td class="border px-4 py-3 text-gray-600">{{ stock.company }}</td>
              <td class="border px-4 py-3 text-gray-600">{{ stock.brokerage }}</td>
              <td class="border px-4 py-3 font-medium text-green-600">${{ stock.target_from }}</td>
              <td class="border px-4 py-3 font-medium text-red-600">${{ stock.target_to }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const stocks = ref([])

const fetchStocks = async () => {
  try {
    const response = await axios.get('http://localhost:8080/stocks')
    stocks.value = response.data.data.content
  } catch (error) {
    console.error('Error al obtener los datos:', error)
  }
}
</script>
