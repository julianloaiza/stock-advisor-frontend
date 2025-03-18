// tests/composables/useCustomTable.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCustomTable } from '../../src/composables/useCustomTable'
import type { TableConfig, TableItem } from '../../src/interfaces/BaseTable.interface'

describe('useCustomTable composable', () => {
  let mockProps: {
    config: TableConfig
    highlightRecommendations: boolean
    loading: boolean
    error: string
    data: TableItem[]
  }

  let mockEmit: (event: string, ...args: unknown[]) => void

  beforeEach(() => {
    // Configuración predeterminada para las pruebas
    mockProps = {
      config: {
        title: 'Test Table',
        columns: [
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'price', header: 'Price', type: 'currency' },
        ],
        pagination: {
          itemsPerPage: 10,
          pageSizeOptions: [10, 25, 50, 100],
        },
      },
      highlightRecommendations: false,
      loading: false,
      error: '',
      data: [
        { id: 1, name: 'Item 1', price: 100 },
        { id: 2, name: 'Item 2', price: 200 },
        { id: 3, name: 'Item 3', price: 300 },
      ],
    }

    // Mock para función emit
    mockEmit = vi.fn()
  })

  it('initializes with default values from config', () => {
    const { selectedItemsPerPage, pageSizeOptions } = useCustomTable(mockProps, mockEmit)

    expect(selectedItemsPerPage.value).toBe(10)
    expect(pageSizeOptions.value).toEqual([10, 25, 50, 100])
  })

  it('emits page-change event when handlePageChange is called', () => {
    const { handlePageChange } = useCustomTable(mockProps, mockEmit)

    handlePageChange(2)

    expect(mockEmit).toHaveBeenCalledWith('page-change', 2)
  })

  it('emits page-size-change event when handleItemsPerPageChange is called', () => {
    const { handleItemsPerPageChange, selectedItemsPerPage } = useCustomTable(mockProps, mockEmit)

    // Cambiar el tamaño de página seleccionado
    selectedItemsPerPage.value = 25

    handleItemsPerPageChange()

    expect(mockEmit).toHaveBeenCalledWith('page-size-change', 25)
  })

  it('formats cell values correctly based on type', () => {
    const { formatCellValue } = useCustomTable(mockProps, mockEmit)

    // Valor normal
    expect(formatCellValue('test')).toBe('test')

    // Valor numérico normal
    expect(formatCellValue(123)).toBe('123')

    // Valor de moneda
    expect(formatCellValue(1000, 'currency')).toBe('$1,000.00')

    // Valor nulo
    expect(formatCellValue(null)).toBe('t_customTable_placeholder_value')

    // Valor undefined
    expect(formatCellValue(undefined)).toBe('t_customTable_placeholder_value')
  })

  it('returns appropriate row classes based on index and highlightRecommendations', () => {
    // Sin destacar recomendaciones
    const { getRowClasses } = useCustomTable(mockProps, mockEmit)
    expect(getRowClasses(0)).toBe('bg-white dark:bg-gray-800 border-b dark:border-gray-700')

    // Cambiar a modo de destacar recomendaciones
    mockProps.highlightRecommendations = true
    const highlightTable = useCustomTable(mockProps, mockEmit)

    // Verificar clases para las primeras 3 filas
    expect(highlightTable.getRowClasses(0)).toContain('bg-yellow-50')
    expect(highlightTable.getRowClasses(1)).toContain('bg-gray-50')
    expect(highlightTable.getRowClasses(2)).toContain('bg-amber-50')

    // Verificar clase para filas después de las primeras 3
    expect(highlightTable.getRowClasses(3)).toBe(
      'bg-white dark:bg-gray-800 border-b dark:border-gray-700',
    )
  })

  it('returns correct medal icons based on index', () => {
    const { getMedalIcon } = useCustomTable(mockProps, mockEmit)

    expect(getMedalIcon(0)).toBe('🏆')
    expect(getMedalIcon(1)).toBe('🥈')
    expect(getMedalIcon(2)).toBe('🥉')
    expect(getMedalIcon(3)).toBe('')
  })

  it('determines table state type correctly based on props', () => {
    // Estado inicial (datos presentes)
    const table = useCustomTable(mockProps, mockEmit)
    expect(table.getTableStateType.value).toBeNull()

    // Estado de carga
    mockProps.loading = true
    const loadingTable = useCustomTable(mockProps, mockEmit)
    expect(loadingTable.getTableStateType.value).toBe('loading')

    // Estado de error
    mockProps.loading = false
    mockProps.error = 'Error message'
    const errorTable = useCustomTable(mockProps, mockEmit)
    expect(errorTable.getTableStateType.value).toBe('error')

    // Estado vacío
    mockProps.error = ''
    mockProps.data = []
    const emptyTable = useCustomTable(mockProps, mockEmit)
    expect(emptyTable.getTableStateType.value).toBe('empty')
  })
})
