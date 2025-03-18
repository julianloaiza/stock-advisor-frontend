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
 * @returns Clave de traducción para el texto formateado
 */
export function formatRelativeTime(timestamp: number): string {
  try {
    const now = Date.now()
    const diffSeconds = Math.floor((now - timestamp) / 1000)

    if (diffSeconds < 5) return 't_time_just_now'
    if (diffSeconds < 60) return 't_time_seconds_ago'

    if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60)
      // Usar claves específicas para cada cantidad de minutos
      if (minutes === 1) return 't_time_one_minute_ago'
      if (minutes === 2) return 't_time_two_minutes_ago'
      if (minutes === 3) return 't_time_three_minutes_ago'
      if (minutes === 4) return 't_time_four_minutes_ago'
      if (minutes === 5) return 't_time_five_minutes_ago'
      if (minutes <= 10) return 't_time_less_than_ten_minutes_ago'
      if (minutes <= 15) return 't_time_less_than_fifteen_minutes_ago'
      if (minutes <= 30) return 't_time_less_than_thirty_minutes_ago'
      return 't_time_less_than_hour_ago'
    }

    if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600)
      // Usar claves específicas para cada cantidad de horas
      if (hours === 1) return 't_time_one_hour_ago'
      if (hours === 2) return 't_time_two_hours_ago'
      if (hours === 3) return 't_time_three_hours_ago'
      if (hours === 4) return 't_time_four_hours_ago'
      if (hours <= 6) return 't_time_less_than_six_hours_ago'
      if (hours <= 12) return 't_time_less_than_twelve_hours_ago'
      return 't_time_less_than_day_ago'
    }

    // Para fechas más antiguas
    const days = Math.floor(diffSeconds / 86400)
    if (days === 1) return 't_time_one_day_ago'
    if (days === 2) return 't_time_two_days_ago'
    if (days === 3) return 't_time_three_days_ago'
    if (days <= 7) return 't_time_less_than_week_ago'
    if (days <= 14) return 't_time_less_than_two_weeks_ago'
    if (days <= 30) return 't_time_less_than_month_ago'

    // Para fechas muy antiguas, mantener el formato de fecha
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  } catch (e) {
    console.error('Error formatting time:', e)
    return 't_time_unknown_date'
  }
}
