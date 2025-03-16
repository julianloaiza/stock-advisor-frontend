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

        <!-- Switch field -->
        <BaseSwitch
          v-else-if="field.type === 'switch'"
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
import { defineComponent, reactive, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import BaseInput from '../atoms/BaseInput.vue'
import BaseSwitch from '../atoms/BaseSwitch.vue'
import BaseDropdown from '../atoms/BaseDropdown.vue'
import BaseButton from '../atoms/BaseButton.vue'
import type { FormConfig, Field, FieldInputType } from '@/interfaces/BaseForm.interface'

export default defineComponent({
  name: 'CustomForm',
  components: {
    BaseInput,
    BaseSwitch,
    BaseDropdown,
    BaseButton,
  },
  props: {
    config: {
      type: Object as PropType<FormConfig>,
      required: true,
    },
    initialValues: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
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
        switch: () => false,
        dropdown: (field) =>
          field.options && field.options.length > 0 ? field.options[0].value : '',
      }

      props.config.fields.forEach((field: Field) => {
        // Primero intentamos usar el valor inicial si existe
        if (props.initialValues && props.initialValues[field.name] !== undefined) {
          // Manejo especial para campos numéricos (trata el valor 0 como válido)
          if (['minTargetTo', 'maxTargetTo'].includes(field.name)) {
            const value = props.initialValues[field.name]
            if (value === 0 || value) {
              data[field.name] = value as FormValue
            } else {
              data[field.name] = ''
            }
          } else {
            data[field.name] = props.initialValues[field.name] as FormValue
          }
        } else {
          // Si no hay valor inicial, usamos el inicializador
          data[field.name] = initializers[field.type](field)
        }
      })

      return data
    }

    const formData = reactive<Record<string, FormValue>>(initFormData())

    // Actualizar el formulario cuando cambian los valores iniciales
    watch(
      () => props.initialValues,
      (newValues) => {
        if (newValues) {
          Object.keys(newValues).forEach((key) => {
            // Solo actualizar si el campo existe en el formulario
            if (key in formData) {
              // Manejo especial para campos numéricos (trata el valor 0 como válido)
              if (['minTargetTo', 'maxTargetTo'].includes(key)) {
                const value = newValues[key]
                // Preservar valor numérico (incluso 0) o usar cadena vacía
                formData[key] = value === 0 || value ? (value as FormValue) : ''
              } else {
                formData[key] = newValues[key] as FormValue
              }
            }
          })
        }
      },
      { deep: true, immediate: true },
    )

    // Asegurarse de que los valores iniciales se apliquen al montar el componente
    onMounted(() => {
      if (props.initialValues) {
        Object.keys(props.initialValues).forEach((key) => {
          // Solo actualizar si el campo existe en el formulario
          if (key in formData) {
            // Manejo especial para campos numéricos (trata el valor 0 como válido)
            if (['minTargetTo', 'maxTargetTo'].includes(key)) {
              const value = props.initialValues[key]
              // Preservar valor numérico (incluso 0) o usar cadena vacía
              formData[key] = value === 0 || value ? (value as FormValue) : ''
            } else {
              formData[key] = props.initialValues[key] as FormValue
            }
          }
        })
      }
    })

    const handleSubmit = () => {
      // Preparar datos para el envío
      const processedData: Record<string, unknown> = {}

      // Procesar cada campo para asegurar tipos correctos
      Object.entries(formData).forEach(([key, value]) => {
        if (['minTargetTo', 'maxTargetTo'].includes(key)) {
          if (value === '' || value === null || value === undefined) {
            // Enviar undefined para campos vacíos
            processedData[key] = undefined
          } else {
            // Intentar convertir a número para los campos numéricos
            const numValue = typeof value === 'number' ? value : parseFloat(String(value))
            processedData[key] = isNaN(numValue) ? undefined : numValue
          }
        } else {
          // Para otros campos, usar el valor tal cual
          processedData[key] = value
        }
      })

      emit('search', processedData)
    }

    return {
      formData,
      handleSubmit,
    }
  },
})
</script>
