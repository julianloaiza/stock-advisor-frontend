import type { FormConfig } from '@/interfaces/BaseForm.interface'

/**
 * Configuración del formulario de sincronización
 *
 * Define la estructura y propiedades del formulario utilizado para
 * especificar los parámetros de sincronización de datos
 */
export const syncFormConfig: FormConfig = {
  fields: [
    {
      name: 'limit',
      type: 'input_number',
      placeholder: 't_sync_input_placeholder',
      required: true,
    },
  ],
  actionLabel: 't_sync_synchron',
}
