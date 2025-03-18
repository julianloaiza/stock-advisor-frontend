import { ref, computed, watch } from 'vue'
import type { TableConfig, TableItem } from '@/interfaces/BaseTable.interface'

type CustomTableEmit = {
  (event: 'page-change', page: number): void
  (event: 'page-size-change', itemsPerPage: number): void
}

type CustomTableProps = {
  config: TableConfig
  highlightRecommendations: boolean
  loading: boolean
  error: string
  data: TableItem[]
}

export function useCustomTable(props: CustomTableProps, emit: CustomTableEmit) {
  // Estado local para la selección de elementos por página
  const selectedItemsPerPage = ref(props.config.pagination?.itemsPerPage || 10)

  // Opciones de tamaño de página con valor de respaldo
  const pageSizeOptions = computed(
    () => props.config.pagination?.pageSizeOptions || [10, 25, 50, 100],
  )

  // Actualizar el estado local cuando cambia la configuración
  watch(
    () => props.config.pagination?.itemsPerPage,
    (newValue) => {
      if (newValue) {
        selectedItemsPerPage.value = newValue
      }
    },
  )

  // Manejadores de eventos
  const handlePageChange = (page: number): void => {
    emit('page-change', page)
  }

  const handleItemsPerPageChange = (): void => {
    emit('page-size-change', selectedItemsPerPage.value)
  }

  // Formatear valores de las celdas según el tipo
  const formatCellValue = (value: unknown, type?: string): string => {
    if (value === null || value === undefined) {
      return 't_customTable_placeholder_value'
    }
    if (type === 'currency' && typeof value === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value)
    }
    return String(value)
  }

  // Función para definir los estilos de las filas destacadas
  const getRowClasses = (index: number): string => {
    if (!props.highlightRecommendations || index >= 3) {
      return 'bg-white dark:bg-gray-800 border-b dark:border-gray-700'
    }

    const baseClasses = 'border-b dark:border-gray-700 relative'

    switch (index) {
      case 0:
        return `${baseClasses} bg-yellow-50 dark:bg-yellow-900/25 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-yellow-400 dark:before:bg-yellow-300`
      case 1:
        return `${baseClasses} bg-gray-50 dark:bg-gray-700/40 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gray-400 dark:before:bg-gray-300`
      case 2:
        return `${baseClasses} bg-amber-50 dark:bg-amber-900/25 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-amber-600 dark:before:bg-amber-400`
      default:
        return 'bg-white dark:bg-gray-800 border-b dark:border-gray-700'
    }
  }

  // Función para retornar los emojis según el ranking
  const getMedalIcon = (index: number): string => {
    switch (index) {
      case 0:
        return '🏆'
      case 1:
        return '🥈'
      case 2:
        return '🥉'
      default:
        return ''
    }
  }

  // Función para determinar el tipo de estado de la tabla
  const getTableStateType = computed(() => {
    if (props.loading) return 'loading'
    if (props.error) return 'error'
    if (props.data.length === 0) return 'empty'
    return null
  })

  return {
    selectedItemsPerPage,
    pageSizeOptions,
    handlePageChange,
    handleItemsPerPageChange,
    formatCellValue,
    getRowClasses,
    getMedalIcon,
    getTableStateType,
  }
}
