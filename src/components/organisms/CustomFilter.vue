<template>
  <div>
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-lg font-semibold dark:text-white">{{ title }}</h2>

      <BaseButton
        v-if="collapsible"
        :icon="isCollapsed ? 'chevron-down' : 'chevron-up'"
        variant="text"
        @click="toggleCollapse"
      />
    </div>

    <div v-show="!isCollapsed">
      <CustomForm :config="formConfig" :initialValues="initialValues" @search="onFormSubmit" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import CustomForm from '@/components/molecules/CustomForm.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import type { FormConfig } from '@/interfaces/BaseForm.interface'

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
    collapsible: {
      type: Boolean,
      default: false,
    },
    defaultCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['filter-applied'],
  setup(props, { emit }) {
    // Estado de colapso para mejorar UX en móviles
    const isCollapsed = ref(props.defaultCollapsed)

    // Toggle para colapsar/expandir el formulario
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
    }

    // Pasar los datos del formulario al componente padre
    const onFormSubmit = (formData: Record<string, unknown>) => {
      emit('filter-applied', formData)
    }

    return {
      isCollapsed,
      toggleCollapse,
      onFormSubmit,
    }
  },
})
</script>
