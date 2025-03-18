/**
 * Interfaz genérica para los datos de respuesta de una solicitud paginada
 * @template T Tipo de los elementos en la respuesta
 */
export interface ResponseData<T> {
  /** Contenido de la respuesta (array de elementos) */
  content: T[]

  /** Número total de elementos */
  total: number

  /** Número de página actual */
  page: number

  /** Número de elementos por página */
  size: number
}

/**
 * Interfaz genérica para la estructura de respuesta de la API
 * @template T Tipo de los elementos en la respuesta
 */
export interface ApiResponse<T> {
  /** Código de estado de la respuesta */
  code: number

  /** Datos de la respuesta */
  data: ResponseData<T>

  /** Mensaje descriptivo de la respuesta */
  message: string
}
