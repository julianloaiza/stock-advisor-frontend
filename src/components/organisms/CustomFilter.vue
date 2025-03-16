<template>
  <div>
    <!-- En móvil: título a la izquierda, botón a la derecha -->
    <!-- En desktop: título centrado, sin botón -->
    <div class="flex md:justify-center items-center mb-3 relative">
      <div class="flex justify-between items-center w-full md:w-auto">
        <h2 class="text-lg font-semibold dark:text-white">{{ title }}</h2>

        <!-- Botón de toggle solo visible en móvil -->
        <BaseButton
          v-if="isMobile"
          :icon="isCollapsed ? 'chevron-down' : 'chevron-up'"
          :label="isCollapsed ? 'Mostrar' : 'Ocultar'"
          variant="text"
          @click="toggleCollapse"
          class="ml-4"
        />
      </div>
    </div>

    <div v-show="!isCollapsed">
      <CustomForm
        :config="formConfig"
        :initialValues="initialValues"
        @search="onFormSubmit"
        @reset="onFormReset"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import type { PropType } from 'vue'
import CustomForm from '@/components/molecules/CustomForm.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import type { FormConfig, FormData } from '@/interfaces/BaseForm.interface'

export default defineComponent({
  name: 'CustomFilter',
  components: {
    CustomForm,
    BaseButton,
  },
  props: {
    title: {
      type: String,
      default: 'Filtros',
    },
    formConfig: {
      type: Object as PropType<FormConfig>,
      required: true,
    },
    initialValues: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
  },
  emits: ['filter-applied', 'filter-reset'],
  setup(props, { emit }) {
    // Estado para detectar si estamos en móvil
    const isMobile = ref(false)

    // Estado de colapso - en móvil inicia colapsado, en desktop inicia expandido
    const isCollapsed = ref(false)

    // Verificar el tamaño de la pantalla
    const checkScreenSize = () => {
      const wasMobile = isMobile.value
      isMobile.value = window.innerWidth < 768 // md breakpoint en Tailwind

      // Solo cambiamos el estado de colapso en la detección inicial
      // o cuando cambia de escritorio a móvil o viceversa
      if (initialCheck || wasMobile !== isMobile.value) {
        isCollapsed.value = isMobile.value
        initialCheck = false
      }
    }

    let initialCheck = true

    // Configurar detección de tamaño al montar y desmontar
    onMounted(() => {
      checkScreenSize()
      window.addEventListener('resize', checkScreenSize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenSize)
    })

    // Toggle para colapsar/expandir el formulario
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
    }

    // Cuando se aplican filtros en móvil, colapsamos automáticamente
    const onFormSubmit = (formData: FormData) => {
      emit('filter-applied', formData)

      if (isMobile.value) {
        isCollapsed.value = true
      }
    }

    // Cuando se resetea el formulario
    const onFormReset = (defaultData: FormData) => {
      emit('filter-reset', defaultData)
    }

    return {
      isMobile,
      isCollapsed,
      toggleCollapse,
      onFormSubmit,
      onFormReset,
    }
  },
})
</script>
