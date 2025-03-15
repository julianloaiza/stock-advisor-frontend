import type { FormConfig } from '@/interfaces/BaseForm.interface'
import type { TableConfig } from '@/interfaces/BaseTable.interface'

export const stocksFormConfig: FormConfig = {
  fields: [
    {
      name: 'query',
      type: 'input-search',
      placeholder: 'Enter search text',
    },
    {
      name: 'min_target_to',
      type: 'input-currency',
      placeholder: 'Min price',
    },
    {
      name: 'max_target_to',
      type: 'input-currency',
      placeholder: 'Max price',
    },
    {
      name: 'currency',
      type: 'dropdown',
      options: [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
      ],
    },
    {
      name: 'recommends',
      type: 'checkbox',
    },
  ],
  actionLabel: 'Search',
}

export const stocksTableConfig: TableConfig = {
  title: 'Stocks Table',
  columns: [
    {
      key: 'ticker',
      header: 'Ticker',
      type: 'text',
    },
    {
      key: 'company',
      header: 'Company',
      type: 'text',
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
  },
}
