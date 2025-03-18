import { reactive, watch } from 'vue'
import type { FormConfig, Field, FormValue } from '@/interfaces/BaseForm.interface'

/**
 * Tipo de evento de emisión para el formulario personalizado
 */
type EmitEvent = {
  (event: 'search', payload: Record<string, unknown>): void
  (event: 'reset', payload: Record<string, unknown>): void
}

/**
 * Hook para gestionar formularios dinámicos con validación y estado
 *
 * @param props - Configuración del formulario, valores iniciales y estado de deshabilitación
 * @param emit - Función para emitir eventos del formulario
 * @returns Objeto con datos del formulario, métodos de validación y reseteo
 */
export function useCustomForm(
  props: {
    config: FormConfig
    initialValues: Record<string, unknown>
    disabled: boolean
  },
  emit: EmitEvent,
) {
  // Mensaje de error por defecto para campos requeridos
  const defaultErrorMessage = 't_components_errorMessage_required'

  // Objeto reactivo para rastrear errores de campos
  const fieldErrors = reactive<Record<string, boolean>>({})

  /**
   * Obtiene un valor vacío predeterminado según el tipo de campo
   * @param field - Configuración del campo de formulario
   * @returns Valor vacío o predeterminado para el campo
   */
  function getEmptyValue(field: Field): FormValue {
    if (field.type === 'switch') return false
    if (field.type === 'dropdown' && field.options && field.options.length > 0) {
      return field.options[0].value
    }
    return ''
  }

  // Datos reactivos del formulario
  const formData = reactive<Record<string, FormValue>>({})

  // Inicializar datos del formulario con valores por defecto o iniciales
  props.config.fields.forEach((field) => {
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

  /**
   * Validar formulario verificando campos requeridos
   * @returns Booleano indicando si el formulario es válido
   */
  function validateForm(): boolean {
    let isValid = true

    // Reiniciar todos los errores
    Object.keys(fieldErrors).forEach((key) => (fieldErrors[key] = false))

    // Verificar campos requeridos
    props.config.fields.forEach((field) => {
      if (field.required) {
        const isEmpty =
          formData[field.name] === '' ||
          formData[field.name] === undefined ||
          formData[field.name] === null

        // Manejar caso especial para switches
        const isEmptySwitch = field.type === 'switch' && formData[field.name] === false

        if (isEmpty || isEmptySwitch) {
          fieldErrors[field.name] = true
          isValid = false
        }
      }
    })

    return isValid
  }

  /**
   * Validar y enviar formulario si es válido
   * Emite evento 'search' con los datos del formulario
   */
  function validateAndSubmit() {
    if (props.disabled) return

    if (!validateForm()) return

    const result: Record<string, unknown> = {}

    // Copiar valores a un nuevo objeto
    Object.keys(formData).forEach((key) => {
      result[key] = formData[key]
    })

    emit('search', result)
  }

  /**
   * Resetear formulario a valores por defecto
   * Emite evento 'reset' con los valores reseteados
   */
  function resetForm() {
    if (props.disabled) return

    // Limpiar todos los errores
    Object.keys(fieldErrors).forEach((key) => (fieldErrors[key] = false))

    // Resetear a valores por defecto
    props.config.fields.forEach((field) => {
      formData[field.name] = (field.defaultValue as FormValue) || getEmptyValue(field)
    })

    const result: Record<string, unknown> = {}

    // Copiar valores a un nuevo objeto
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
