<template>
  <div>
    <h2 class="text-lg font-semibold mb-3 dark:text-white">Filtrar Acciones</h2>
    <CustomForm :config="stocksFormConfig" @search="handleFilterSubmit" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CustomForm from '@/components/molecules/CustomForm.vue'
import { stocksFormConfig } from '@/config/stocksConfig' // Importa la configuración original
import type { GetStocksParams } from '@/api/services/stockService'

// Definir el tipo para los valores del formulario
type FormValue = string | boolean | number | undefined

export default defineComponent({
  name: 'StockFilter',
  components: {
    CustomForm,
  },
  emits: ['filter-change'],
  setup(_, { emit }) {
    // Helper function to safely parse form values
    const parseFormValue = (value: FormValue): string | undefined => {
      return value !== undefined && value !== null ? String(value) : undefined
    }

    // Manejador para el envío del formulario
    const handleFilterSubmit = (formData: Record<string, FormValue>) => {
      // Preparar objeto de filtros para la API
      const filters: GetStocksParams = {
        query: typeof formData.query === 'string' ? formData.query : undefined,
        recommends: formData.recommends === true ? true : undefined,
        minTargetTo: parseFormValue(formData.minTargetTo),
        maxTargetTo: parseFormValue(formData.maxTargetTo),
      }

      // Emitir evento con los filtros, eliminando claves con valores undefined
      emit(
        'filter-change',
        Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined)),
      )
    }

    return {
      stocksFormConfig, // Usa la configuración importada
      handleFilterSubmit,
    }
  },
})
</script>
