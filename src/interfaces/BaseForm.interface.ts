export type FieldInputType =
  | 'input-search'
  | 'input-number'
  | 'input-currency'
  | 'switch'
  | 'dropdown'

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
}

export interface FormConfig {
  /** Lista de campos del formulario */
  fields: Field[]
  /** Etiqueta para el botón de acción del formulario */
  actionLabel: string
  /** Etiqueta para el botón de limpiar (opcional) */
  clearLabel?: string
}

// Tipo para los valores de un formulario (usado en varios componentes)
export type FormValue = string | boolean | number | undefined

// Tipo para los datos procesados del formulario (usado al emitir eventos)
export type FormData = Record<string, unknown>
