// src/interfaces/BaseTable.interface.ts

export type ColumnType = 'text' | 'number' | 'currency' | 'icon'

export interface TableColumn {
  /** La clave de la propiedad en el objeto de datos */
  key: string
  /** Título del encabezado para la columna */
  header: string
  /** Tipo de columna para formateo (por ejemplo, moneda) */
  type?: ColumnType
  /** Identificador de estilo personalizado para la columna (para resaltar, modo oscuro, etc.) */
  style?: 'default' | 'dark'
}

export interface PaginationConfig {
  /** Número de elementos por página */
  itemsPerPage: number
  /** Número de página actual (opcional, para gestión de estado) */
  currentPage?: number
  /** Identificador de estilo personalizado para el paginador */
  style?: 'default' | 'dark'
}

export interface TableConfig {
  /** Título de la tabla */
  title: string
  /** Lista de columnas a mostrar */
  columns: TableColumn[]
  /** Estilo personalizado para cada fila (aplicado a BaseRow) */
  rowStyle?: 'default' | 'dark' | 'highlight' | 'highlight-dark'
  /** Estilo personalizado para el contenedor de la tabla */
  style?: 'default' | 'dark'
  /** Configuración para la paginación (BasePaginator) */
  pagination?: PaginationConfig
}
