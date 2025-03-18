import type { FormConfig } from '@/interfaces/BaseForm.interface'
import type { TableConfig } from '@/interfaces/BaseTable.interface'

// Configuración del formulario de filtros de stocks
export const stocksFormConfig: FormConfig = {
  fields: [
    {
      name: 'query',
      type: 'input_search',
      placeholder: 't_stocks_form_query_placeholder',
      defaultValue: '',
    },
    {
      name: 'minTargetTo',
      type: 'input_currency',
      placeholder: 't_stocks_form_min_price_placeholder',
      defaultValue: '',
    },
    {
      name: 'maxTargetTo',
      type: 'input_currency',
      placeholder: 't_stocks_form_max_price_placeholder',
      defaultValue: '',
    },
    {
      name: 'currency',
      type: 'dropdown',
      placeholder: 't_stocks_form_currency_placeholder',
      defaultValue: 'USD',
      options: [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
      ],
    },
    {
      name: 'recommends',
      type: 'switch',
      placeholder: 't_stocks_form_recommended_placeholder',
      defaultValue: false,
    },
  ],
  actionLabel: 't_stocks_form_search_label',
  clearLabel: 't_stocks_form_clear_label',
}

// Configuración de la tabla de stocks
export const stocksTableConfig: TableConfig = {
  title: 't_stocks_table_title',
  columns: [
    {
      key: 'ticker',
      header: 't_stocks_table_columns_ticker',
      type: 'text',
      highlight: true,
    },
    {
      key: 'company',
      header: 't_stocks_table_columns_company',
      type: 'text',
      highlight: true,
    },
    {
      key: 'brokerage',
      header: 't_stocks_table_columns_brokerage',
      type: 'text',
    },
    {
      key: 'action',
      header: 't_stocks_table_columns_action',
      type: 'text',
    },
    {
      key: 'rating_from',
      header: 't_stocks_table_columns_rating_from',
      type: 'text',
    },
    {
      key: 'rating_to',
      header: 't_stocks_table_columns_rating_to',
      type: 'text',
    },
    {
      key: 'target_from',
      header: 't_stocks_table_columns_target_from',
      type: 'currency',
    },
    {
      key: 'target_to',
      header: 't_stocks_table_columns_target_to',
      type: 'currency',
      highlight: true,
    },
    {
      key: 'currency',
      header: 't_stocks_table_columns_currency',
      type: 'text',
    },
  ],
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
}
