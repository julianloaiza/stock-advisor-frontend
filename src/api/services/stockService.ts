import api from '../axios'
import type { Stock } from '@/interfaces/Stock.interface'
import type { ApiResponse } from '@/interfaces/Response.interface'

/**
 * Parámetros para solicitar datos de acciones a la API
 */
export interface GetStocksParams {
  /** Ordenar por puntuación de recomendación */
  recommends?: boolean
  /** Texto para filtrar resultados */
  query?: string
  /** Número de página solicitada */
  page: number
  /** Cantidad de registros por página */
  size: number
  /** Valor mínimo del precio objetivo */
  minTargetTo?: number
  /** Valor máximo del precio objetivo */
  maxTargetTo?: number
  /** Moneda para filtrar resultados */
  currency?: string
}

/**
 * Obtiene el listado de acciones según los parámetros de filtrado
 */
export const getStocks = async (params: GetStocksParams): Promise<ApiResponse<Stock>> => {
  try {
    const response = await api.get<ApiResponse<Stock>>('/stocks', { params })
    return response.data
  } catch (error) {
    console.error('Error al obtener stocks:', error)
    throw error
  }
}

/**
 * Sincroniza la base de datos con datos actualizados
 * @param limit Número máximo de iteraciones para la sincronización
 */
export const syncStocks = async (limit?: number): Promise<ApiResponse<null>> => {
  try {
    const response = await api.post<ApiResponse<null>>('/stocks/sync', { limit })
    return response.data
  } catch (error) {
    console.error('Error al sincronizar stocks:', error)
    throw error
  }
}
