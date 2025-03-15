export type FieldInputType =
  | 'input-search'
  | 'input-number'
  | 'input-currency'
  | 'checkbox'
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
}

export interface FormConfig {
  /** Lista de campos del formulario */
  fields: Field[]
  /** Etiqueta para el botón de acción del formulario */
  actionLabel: string
}
