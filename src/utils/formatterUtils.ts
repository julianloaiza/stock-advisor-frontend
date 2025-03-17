/**
 * Formatea un valor a formato de moneda
 * @param value Valor a formatear
 * @param currency Código de moneda (por defecto: 'USD')
 * @returns Valor formateado como moneda
 */
export const formatCurrency = (value: string | number, currency: string = 'USD'): string => {
  if (value === null || value === undefined) return ''

  const numValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numValue)) return String(value)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(numValue)
}

/**
 * Formatea un timestamp a un formato relativo para mostrar en la UI
 * @param timestamp - El timestamp en milisegundos
 * @returns Texto formateado para mostrar en la UI
 */
export function formatRelativeTime(timestamp: number): string {
  try {
    const now = Date.now()
    const diffSeconds = Math.floor((now - timestamp) / 1000)

    if (diffSeconds < 5) return 'Ahora mismo'
    if (diffSeconds < 60) return 'Hace unos segundos'
    if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60)
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
    }
    if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600)
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
    }

    // Para fechas más antiguas, mostrar la fecha formateada
    const days = Math.floor(diffSeconds / 86400)
    if (days <= 30) {
      return `Hace ${days} ${days === 1 ? 'día' : 'días'}`
    } else {
      const date = new Date(timestamp)
      return date.toLocaleDateString()
    }
  } catch (e) {
    console.error('Error formateando tiempo:', e)
    return 'Fecha desconocida'
  }
}
