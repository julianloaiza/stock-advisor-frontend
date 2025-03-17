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
          :disabled="disabled"
        />

        <!-- Switch field -->
        <BaseSwitch
          v-else-if="field.type === 'switch'"
          :id="field.name"
          :label="field.placeholder || 'Recommended'"
          v-model="formData[field.name] as boolean | undefined"
          :disabled="disabled"
        />

        <!-- Dropdown field -->
        <BaseDropdown
          v-else-if="field.type === 'dropdown'"
          :id="field.name"
          :options="field.options || []"
          :modelValue="String(formData[field.name] || '')"
          @update:modelValue="(val) => (formData[field.name] = val)"
          :disabled="disabled"
        />
      </div>

      <!-- Submit button -->
      <div>
        <BaseButton :label="config.actionLabel" type="submit" :disabled="disabled" />
      </div>

      <!-- Reset button (only shown if clearLabel is explicitly provided) -->
      <div v-if="config.clearLabel">
        <BaseButton
          :label="config.clearLabel"
          variant="outline"
          type="button"
          @click="resetForm"
          :disabled="disabled"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['search', 'reset'],
  setup(props, { emit }) {
    type FormValue = string | boolean | number | undefined

    // Mapa de inicializadores por tipo de campo
    const initializers: Record<FieldInputType, (field: Field) => FormValue> = {
      'input-search': () => '',
      'input-number': () => '',
      'input-currency': () => '',
      switch: () => false,
      dropdown: (field) => {
        // Usar defaultValue si está definido, si no, usar el primer option
        if (field.defaultValue !== undefined) return field.defaultValue
        return field.options && field.options.length > 0 ? field.options[0].value : ''
      },
    }

    // Inicializar datos del formulario
    const initFormData = (): Record<string, FormValue> => {
      const data: Record<string, FormValue> = {}

      props.config.fields.forEach((field: Field) => {
        // Intentar usar el valor inicial si existe
        const hasInitialValue = props.initialValues && props.initialValues[field.name] !== undefined

        if (hasInitialValue) {
          const value = props.initialValues[field.name]

          // Manejo especial para campos numéricos
          if (['input-number', 'input-currency'].includes(field.type)) {
            data[field.name] = value === 0 || value ? (value as FormValue) : ''
          } else if (field.type === 'dropdown') {
            // Asegurar que los campos dropdown siempre tengan una cadena de texto
            data[field.name] = value === null || value === undefined ? '' : String(value)
          } else {
            data[field.name] = value as FormValue
          }
        } else {
          // Si no hay valor inicial, usar el inicializador por tipo
          data[field.name] = initializers[field.type](field)
        }
      })

      return data
    }

    const formData = reactive<Record<string, FormValue>>(initFormData())

    // Actualizar cuando cambian los valores iniciales
    watch(
      () => props.initialValues,
      (newValues) => {
        if (!newValues) return

        props.config.fields.forEach((field: Field) => {
          if (field.name in newValues) {
            const value = newValues[field.name]

            // Manejo especial para campos numéricos
            if (['input-number', 'input-currency'].includes(field.type)) {
              formData[field.name] = value === 0 || value ? (value as FormValue) : ''
            } else if (field.type === 'dropdown') {
              // Asegurar que los campos dropdown siempre tengan una cadena de texto
              formData[field.name] = value === null || value === undefined ? '' : String(value)
            } else {
              formData[field.name] = value as FormValue
            }
          }
        })
      },
      { deep: true, immediate: true },
    )

    // Procesar un campo según su tipo para dar el formato adecuado
    const processFieldValue = (name: string, value: FormValue): unknown => {
      // Buscar tipo de campo
      const field = props.config.fields.find((f) => f.name === name)
      if (!field) return value

      switch (field.type) {
        case 'input-number':
        case 'input-currency':
          if (value === '' || value === null || value === undefined) return undefined
          const numValue = typeof value === 'number' ? value : parseFloat(String(value))
          return isNaN(numValue) ? undefined : numValue

        case 'switch':
          return Boolean(value)

        case 'dropdown':
          // Tratar cadena vacía como un valor válido para dropdowns
          if (name === 'currency') {
            return value === undefined || value === '' ? field.defaultValue || 'USD' : String(value)
          }
          return value === undefined ? '' : String(value)

        default:
          return value
      }
    }

    const handleSubmit = () => {
      if (props.disabled) return

      // Preparar datos procesados según tipo de cada campo
      const processedData: Record<string, unknown> = {}

      Object.entries(formData).forEach(([key, value]) => {
        processedData[key] = processFieldValue(key, value)
      })

      emit('search', processedData)
    }

    // Función para restaurar el formulario a sus valores por defecto
    const resetForm = () => {
      if (props.disabled) return

      // Crear objeto con valores por defecto
      const defaultData: Record<string, FormValue> = {}

      props.config.fields.forEach((field) => {
        // Usar inicializador para obtener el valor por defecto
        defaultData[field.name] = initializers[field.type](field)
      })

      // Actualizar el formData
      Object.keys(formData).forEach((key) => {
        formData[key] = defaultData[key]
      })

      // Procesar los valores por defecto al mismo formato que se envía en search
      const processedDefaults: Record<string, unknown> = {}
      Object.entries(defaultData).forEach(([key, value]) => {
        processedDefaults[key] = processFieldValue(key, value)
      })

      // Emitir evento de reset
      emit('reset', processedDefaults)
    }

    return {
      formData,
      handleSubmit,
      resetForm,
    }
  },
})
</script>
