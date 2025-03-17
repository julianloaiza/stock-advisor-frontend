export interface TableColumn {
  /** La clave de la propiedad en el objeto de datos */
  key: string
  /** Título del encabezado para la columna */
  header: string
  /** Tipo de columna para formateo (por ejemplo, moneda) */
  type?: 'text' | 'number' | 'currency' | 'icon'
  /** Estilo especial para esta columna (por ejemplo, resaltado) */
  highlight?: boolean
}

export interface PaginationConfig {
  /** Número de elementos por página */
  itemsPerPage: number
  /** Número de página actual (opcional, para gestión de estado) */
  currentPage?: number
  /** Opciones de tamaño de página */
  pageSizeOptions?: number[]
}

export interface TableConfig {
  /** Título de la tabla */
  title: string
  /** Lista de columnas a mostrar */
  columns: TableColumn[]
  /** Configuración para la paginación (BasePaginator) */
  pagination?: PaginationConfig
}

// Interfaz básica para los elementos de la tabla
export interface TableItem {
  [key: string]: unknown
  id?: string | number
}
