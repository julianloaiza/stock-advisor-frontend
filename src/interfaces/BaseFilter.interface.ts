export type FilterFieldType = 'text' | 'number' | 'switch' | 'select'

export interface FilterField {
  /** Identificador del campo (usado como clave) */
  name: string
  /** Etiqueta para mostrar encima o al lado del campo */
  label: string
  /** Tipo de entrada para el campo */
  type: FilterFieldType
  /** Texto de marcador de posición para entradas */
  placeholder?: string
  /** Opciones para campos de tipo select */
  options?: {
    label: string
    value: string | number
  }[]
  /** Indica si el campo es obligatorio */
  required?: boolean
  /** Identificador de estilo personalizado */
  style?: 'default' | 'dark'
}

export interface FilterConfig {
  /** Título del formulario de filtro */
  title: string
  /** Lista de campos a renderizar */
  fields: FilterField[]
  /** Estilo o clase adicional para el contenedor del formulario */
  style?: 'default' | 'dark'
}
