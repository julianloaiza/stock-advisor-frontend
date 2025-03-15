<template>
  <form @submit.prevent="handleSubmit" class="w-full flex justify-center">
    <div class="flex flex-wrap items-center gap-2 md:gap-4">
      <div
        v-for="field in config.fields"
        :key="field.name"
        class="flex-grow md:flex-grow-0 min-w-0"
      >
        <!-- Input field -->
        <BaseInput
          v-if="['input-search', 'input-number', 'input-currency'].includes(field.type)"
          :id="field.name"
          :type="field.type as any"
          :placeholder="field.placeholder || ''"
          :required="field.required || false"
          v-model="formData[field.name] as string | number | undefined"
        />

        <!-- Checkbox field -->
        <BaseCheckbox
          v-else-if="field.type === 'checkbox'"
          :id="field.name"
          :label="field.placeholder || 'Recommended'"
          v-model="formData[field.name] as boolean | undefined"
        />

        <!-- Dropdown field -->
        <BaseDropdown
          v-else-if="field.type === 'dropdown'"
          :id="field.name"
          :options="field.options || []"
          :modelValue="String(formData[field.name] || '')"
          @update:modelValue="(val) => (formData[field.name] = val)"
        />
      </div>

      <!-- Submit button -->
      <div class="min-w-fit">
        <BaseButton :label="config.actionLabel" type="submit" />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import type { PropType } from 'vue'
import BaseInput from '../atoms/BaseInput.vue'
import BaseCheckbox from '../atoms/BaseCheckbox.vue'
import BaseDropdown from '../atoms/BaseDropdown.vue'
import BaseButton from '../atoms/BaseButton.vue'
import type { FormConfig, Field, FieldInputType } from '@/interfaces/BaseForm.interface'

export default defineComponent({
  name: 'CustomForm',
  components: {
    BaseInput,
    BaseCheckbox,
    BaseDropdown,
    BaseButton,
  },
  props: {
    config: {
      type: Object as PropType<FormConfig>,
      required: true,
    },
  },
  emits: ['search'],
  setup(props, { emit }) {
    type FormValue = string | boolean | number | undefined

    const initFormData = () => {
      const data: Record<string, FormValue> = {}

      // Mapa de inicializadores por tipo de campo
      const initializers: Record<FieldInputType, (field: Field) => FormValue> = {
        'input-search': () => '',
        'input-number': () => '',
        'input-currency': () => '',
        checkbox: () => false,
        dropdown: (field) =>
          field.options && field.options.length > 0 ? field.options[0].value : '',
      }

      props.config.fields.forEach((field: Field) => {
        // Usa el inicializador correspondiente al tipo de campo
        data[field.name] = initializers[field.type](field)
      })

      return data
    }

    const formData = reactive<Record<string, FormValue>>(initFormData())

    const handleSubmit = () => {
      emit('search', { ...formData })
    }

    return {
      formData,
      handleSubmit,
    }
  },
})
</script>
