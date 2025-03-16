import type { FormConfig } from '@/interfaces/BaseForm.interface'
import type { TableConfig } from '@/interfaces/BaseTable.interface'

// Configuración del formulario de filtros de stocks
export const stocksFormConfig: FormConfig = {
  fields: [
    {
      name: 'query',
      type: 'input-search',
      placeholder: 'Enter search text',
    },
    {
      name: 'minTargetTo',
      type: 'input-currency',
      placeholder: 'Min price',
    },
    {
      name: 'maxTargetTo',
      type: 'input-currency',
      placeholder: 'Max price',
    },
    {
      name: 'currency',
      type: 'dropdown',
      placeholder: 'Currency',
      options: [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
      ],
    },
    {
      name: 'recommends',
      type: 'switch',
      placeholder: 'Recommended',
    },
  ],
  actionLabel: 'Search',
}

// Configuración de la tabla de stocks
export const stocksTableConfig: TableConfig = {
  title: 'Stocks',
  columns: [
    {
      key: 'ticker',
      header: 'Ticker',
      type: 'text',
      highlight: true,
    },
    {
      key: 'company',
      header: 'Company',
      type: 'text',
      highlight: true,
    },
    {
      key: 'brokerage',
      header: 'Brokerage',
      type: 'text',
    },
    {
      key: 'action',
      header: 'Action',
      type: 'text',
    },
    {
      key: 'rating_from',
      header: 'Rating From',
      type: 'text',
    },
    {
      key: 'rating_to',
      header: 'Rating To',
      type: 'text',
    },
    {
      key: 'target_from',
      header: 'Target From',
      type: 'currency',
    },
    {
      key: 'target_to',
      header: 'Target To',
      type: 'currency',
    },
    {
      key: 'currency',
      header: 'Currency',
      type: 'text',
    },
  ],
  style: 'recommend',
  pagination: {
    itemsPerPage: 10,
    currentPage: 1,
    pageSizeOptions: [10, 25, 50, 100],
  },
}
