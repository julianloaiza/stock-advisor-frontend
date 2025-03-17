import type { FormConfig } from '@/interfaces/BaseForm.interface'

// Configuración del formulario de sincronización
export const syncFormConfig: FormConfig = {
  fields: [
    {
      name: 'limit',
      type: 'input-number',
      placeholder: 'Número de consultas',
      required: true,
    },
  ],
  actionLabel: 'Sincronizar',
}
