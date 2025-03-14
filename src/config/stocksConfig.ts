// src/config/stocksConfig.ts
import type { FilterConfig } from '@/interfaces/BaseFilter.interface'
import type { TableConfig } from '@/interfaces/BaseTable.interface'

export const stocksFilterConfig: FilterConfig = {
  title: 'Filter Stocks',
  fields: [
    {
      name: 'query',
      label: 'Query',
      type: 'text',
      placeholder: 'Enter search text',
      style: 'default',
    },
    {
      name: 'recommends',
      label: 'Recommends',
      type: 'switch',
      style: 'default',
    },
    {
      name: 'min_target_to',
      label: 'Minimum Target To',
      type: 'number',
      placeholder: 'Min price',
      style: 'default',
    },
    {
      name: 'max_target_to',
      label: 'Maximum Target To',
      type: 'number',
      placeholder: 'Max price',
      style: 'default',
    },
  ],
  style: 'default',
}

export const stocksTableConfig: TableConfig = {
  title: 'Stocks Table',
  columns: [
    {
      key: 'ticker',
      header: 'Ticker',
      type: 'text',
      style: 'default',
    },
    {
      key: 'company',
      header: 'Company',
      type: 'text',
      style: 'default',
    },
    {
      key: 'brokerage',
      header: 'Brokerage',
      type: 'text',
      style: 'default',
    },
    {
      key: 'action',
      header: 'Action',
      type: 'text',
      style: 'default',
    },
    {
      key: 'rating_from',
      header: 'Rating From',
      type: 'text',
      style: 'default',
    },
    {
      key: 'rating_to',
      header: 'Rating To',
      type: 'text',
      style: 'default',
    },
    {
      key: 'target_from',
      header: 'Target From',
      type: 'currency',
      style: 'default',
    },
    {
      key: 'target_to',
      header: 'Target To',
      type: 'currency',
      style: 'default',
    },
    {
      key: 'currency',
      header: 'Currency',
      type: 'text',
      style: 'default',
    },
  ],
  rowStyle: 'default',
  style: 'default',
  pagination: {
    itemsPerPage: 10,
    currentPage: 1,
    style: 'default',
  },
}
