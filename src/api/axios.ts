import axios from 'axios'
import { API_BASE_URL } from '@/config/constants'

/**
 * Cliente HTTP configurado para comunicarse con la API de Stock Advisor
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
