import { reactive, watch } from 'vue'
import type { FormConfig, Field, FormValue } from '@/interfaces/BaseForm.interface'

type EmitEvent = {
  (event: 'search', payload: Record<string, unknown>): void
  (event: 'reset', payload: Record<string, unknown>): void
}

export function useCustomForm(
  props: {
    config: FormConfig
    initialValues: Record<string, unknown>
    disabled: boolean
  },
  emit: EmitEvent,
) {
  // Mensaje de error por defecto
  const defaultErrorMessage = 'This field is required'

  // Objeto para rastrear qué campos tienen errores
  const fieldErrors = reactive<Record<string, boolean>>({})

  // Obtener valor vacío según el tipo de campo
  function getEmptyValue(field: Field): FormValue {
    if (field.type === 'switch') return false
    if (field.type === 'dropdown' && field.options && field.options.length > 0) {
      return field.options[0].value
    }
    return ''
  }

  // Inicializar datos del formulario - corregido para manejar los tipos correctamente
  const formData = reactive<Record<string, FormValue>>({})

  // Llenar formData con valores iniciales
  props.config.fields.forEach((field) => {
    // Usar valor inicial si está disponible, sino usar valor por defecto o vacío
    formData[field.name] =
      props.initialValues[field.name] !== undefined
        ? (props.initialValues[field.name] as FormValue)
        : (field.defaultValue as FormValue) || getEmptyValue(field)

    // Inicializar estado de error como falso
    fieldErrors[field.name] = false
  })

  // Actualizar datos del formulario cuando cambian los valores iniciales
  watch(
    () => props.initialValues,
    (newValues) => {
      if (!newValues) return

      Object.entries(newValues).forEach(([key, value]) => {
        if (key in formData) {
          formData[key] = value as FormValue
          fieldErrors[key] = false
        }
      })
    },
    { deep: true },
  )

  // Validación simple - solo verificar si los campos requeridos tienen valores
  function validateForm(): boolean {
    let isValid = true

    // Reiniciar todos los errores primero
    Object.keys(fieldErrors).forEach((key) => (fieldErrors[key] = false))

    // Verificar campos requeridos
    props.config.fields.forEach((field) => {
      if (field.required) {
        const isEmpty =
          formData[field.name] === '' ||
          formData[field.name] === undefined ||
          formData[field.name] === null

        // Para switches, considerar false como vacío
        const isEmptySwitch = field.type === 'switch' && formData[field.name] === false

        if (isEmpty || isEmptySwitch) {
          fieldErrors[field.name] = true
          isValid = false
        }
      }
    })

    return isValid
  }

  // Enviar formulario si es válido
  function validateAndSubmit() {
    if (props.disabled) return

    if (!validateForm()) return

    const result: Record<string, unknown> = {}

    // Copiar los valores a un nuevo objeto
    Object.keys(formData).forEach((key) => {
      result[key] = formData[key]
    })

    emit('search', result)
  }

  // Resetear formulario a valores por defecto
  function resetForm() {
    if (props.disabled) return

    // Limpiar todos los errores
    Object.keys(fieldErrors).forEach((key) => (fieldErrors[key] = false))

    // Resetear a valores por defecto
    props.config.fields.forEach((field) => {
      formData[field.name] = (field.defaultValue as FormValue) || getEmptyValue(field)
    })

    const result: Record<string, unknown> = {}

    // Copiar los valores a un nuevo objeto
    Object.keys(formData).forEach((key) => {
      result[key] = formData[key]
    })

    emit('reset', result)
  }

  return {
    formData,
    fieldErrors,
    defaultErrorMessage,
    validateAndSubmit,
    resetForm,
  }
}
