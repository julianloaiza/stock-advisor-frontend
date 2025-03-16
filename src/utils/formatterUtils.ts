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
