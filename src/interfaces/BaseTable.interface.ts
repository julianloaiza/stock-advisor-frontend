export interface TableColumn {
  /** La clave de la propiedad en el objeto de datos */
  key: string
  /** Título del encabezado para la columna */
  header: string
  /** Tipo de columna para formateo (por ejemplo, moneda) */
  type?: 'text' | 'number' | 'currency' | 'icon'
}

export interface PaginationConfig {
  /** Número de elementos por página */
  itemsPerPage: number
  /** Número de página actual (opcional, para gestión de estado) */
  currentPage?: number
}

export interface TableConfig {
  /** Título de la tabla */
  title: string
  /** Lista de columnas a mostrar */
  columns: TableColumn[]
  /** Estilo personalizado para el contenedor de la tabla */
  style?: 'recommend'
  /** Configuración para la paginación (BasePaginator) */
  pagination?: PaginationConfig
}
