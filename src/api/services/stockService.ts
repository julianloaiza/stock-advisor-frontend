import api from '../axios'
import type { Stock } from '@/interfaces/Stock.interface'
import type { ApiResponse } from '@/interfaces/Response.interface'

export interface GetStocksParams {
  recommends?: boolean
  query?: string
  page?: number
  size?: number
  minTargetTo?: number
  maxTargetTo?: number
  currency?: string
}

export const getStocks = async (params: GetStocksParams): Promise<ApiResponse<Stock>> => {
  try {
    const response = await api.get<ApiResponse<Stock>>('/stocks', { params })
    return response.data
  } catch (error) {
    console.error('Error al obtener stocks:', error)
    throw error
  }
}

export const syncStocks = async (limit?: number): Promise<ApiResponse<null>> => {
  try {
    const response = await api.post<ApiResponse<null>>('/stocks/sync', { limit })
    return response.data
  } catch (error) {
    console.error('Error al sincronizar stocks:', error)
    throw error
  }
}
