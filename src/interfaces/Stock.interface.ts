/**
 * Interfaz que representa un registro de acción o inversión
 * Contiene información detallada sobre una acción específica
 */
export interface Stock {
  /** Identificador único de la acción */
  id: number

  /** Símbolo o código de cotización de la acción */
  ticker: string

  /** Nombre completo de la compañía */
  company: string

  /** Casa de bolsa que emite la calificación */
  brokerage: string

  /** Tipo de acción o cambio en la calificación */
  action: string

  /** Calificación inicial de la acción */
  rating_from: string

  /** Calificación actualizada de la acción */
  rating_to: string

  /** Precio objetivo inicial */
  target_from: number

  /** Precio objetivo actualizado */
  target_to: number

  /** Moneda en la que se expresan los precios */
  currency: string
}
