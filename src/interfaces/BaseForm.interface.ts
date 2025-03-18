/**
 * Tipos de entrada de campo soportados en formularios dinámicos
 */
export type FieldInputType =
  | 'input_search'
  | 'input_number'
  | 'input_currency'
  | 'switch'
  | 'dropdown'

/**
 * Interfaz que define la configuración de un campo de formulario
 */
export interface Field {
  /** Identificador del campo (usado como clave) */
  name: string

  /** Tipo de entrada para el campo */
  type: FieldInputType

  /** Texto de marcador de posición para entradas */
  placeholder?: string

  /** Indica si el campo es obligatorio */
  required?: boolean

  /** Opciones para campos de tipo dropdown */
  options?: Array<{ value: string; label: string }>

  /** Valor por defecto para el campo */
  defaultValue?: string | number | boolean

  /** Mensaje de error personalizado para el campo */
  errorMessage?: string
}

/**
 * Interfaz que define la configuración completa de un formulario
 */
export interface FormConfig {
  /** Lista de campos del formulario */
  fields: Field[]

  /** Etiqueta para el botón de acción del formulario */
  actionLabel: string

  /** Etiqueta para el botón de limpiar (opcional) */
  clearLabel?: string

  /** Mensaje de error por defecto para campos requeridos */
  defaultErrorMessage?: string
}

/**
 * Tipo para los valores de un formulario
 * Soporta diferentes tipos de datos para campos de formulario
 */
export type FormValue = string | boolean | number | undefined

/**
 * Tipo para los datos procesados del formulario
 * Utilizado al emitir eventos de formulario
 */
export type FormData = Record<string, unknown>

/**
 * Tipo para realizar seguimiento de errores en campos de formulario
 */
export type FieldErrors = Record<string, boolean>
