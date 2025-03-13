import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080', // Ajusta según el backend
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
