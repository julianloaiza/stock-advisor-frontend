import type { FormConfig } from '@/interfaces/BaseForm.interface'

// Configuración del formulario de sincronización
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
