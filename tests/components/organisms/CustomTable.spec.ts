// tests/components/organisms/CustomTable.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import CustomTable from '../../../src/components/organisms/CustomTable.vue'
import { useCustomTable } from '../../../src/composables/useCustomTable'
import type { TableConfig, TableItem } from '../../../src/interfaces/BaseTable.interface'

// Mock del composable useCustomTable
vi.mock('../../../src/composables/useCustomTable', () => ({
  useCustomTable: vi.fn(),
}))

// Mocks para componentes hijos
vi.mock('../../../src/components/molecules/CustomTable/TablePagination.vue', () => ({
  default: {
    name: 'TablePagination',
    props: [
      'currentPage',
      'totalPages',
      'totalItems',
      'itemsPerPage',
      'loading',
      'hasResults',
      'disabled',
    ],
    template: '<div data-test="table-pagination"></div>',
  },
}))

vi.mock('../../../src/components/molecules/CustomTable/TableState.vue', () => ({
  default: {
    name: 'TableState',
    props: ['type', 'columnsCount', 'message'],
    template: '<tr data-test="table-state"><td></td></tr>',
  },
}))

// Configuración para i18n
const mockI18n = {
  t: (key: string): string => key,
}

// Interfaz para las propiedades del CustomTable
interface CustomTableProps {
  config: TableConfig
  data: TableItem[]
  loading: boolean
  error: string
  currentPage: number
  totalPages: number
  totalItems: number
  highlightedRows: number
  paginationDisabled: boolean
  highlightRecommendations: boolean
}

describe('CustomTable', () => {
  let mockProps: CustomTableProps

  beforeEach(() => {
    // Resetear los mocks
    vi.clearAllMocks()

    // Configuración de props por defecto
    mockProps = {
      config: {
        title: 'Test Table',
        columns: [
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email', highlight: true },
        ],
        pagination: {
          itemsPerPage: 10,
          pageSizeOptions: [10, 25, 50, 100],
        },
      },
      data: [
        { id: 1, name: 'Test User 1', email: 'test1@example.com' },
        { id: 2, name: 'Test User 2', email: 'test2@example.com' },
        { id: 3, name: 'Test User 3', email: 'test3@example.com' },
      ],
      loading: false,
      error: '',
      currentPage: 1,
      totalPages: 1,
      totalItems: 3,
      highlightedRows: 0,
      paginationDisabled: false,
      highlightRecommendations: false,
    }

    vi.mocked(useCustomTable).mockImplementation((props, emit) => {
      // Crear valores reactivos para el test
      const selectedItemsPerPage = ref(10)
      const pageSizeOptions = ref([10, 25, 50, 100])
      const getTableStateType = ref(null)

      // Devolver con un cast de tipo para evitar errores
      return {
        selectedItemsPerPage,
        pageSizeOptions,
        handlePageChange: (page: number) => {
          emit('page-change', page)
        },
        handleItemsPerPageChange: () => {
          emit('page-size-change', 25)
        },
        formatCellValue: (value: unknown): string => String(value || ''),
        getRowClasses: (): string => 'bg-white dark:bg-gray-800 border-b dark:border-gray-700',
        getMedalIcon: (index: number): string =>
          index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '',
        getTableStateType,
      } as unknown as ReturnType<typeof useCustomTable>
    })
  })

  it('renders the table title correctly', () => {
    const wrapper = mount(CustomTable, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    const title = wrapper.find('h2')
    expect(title.text()).toBe('Test Table')
  })

  it('renders table headers correctly', () => {
    const wrapper = mount(CustomTable, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    const headers = wrapper.findAll('thead th')
    expect(headers).toHaveLength(3)
    expect(headers[0].text()).toBe('ID')
    expect(headers[1].text()).toBe('Name')
    expect(headers[2].text()).toBe('Email')
  })

  it('renders table rows correctly', () => {
    const wrapper = mount(CustomTable, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)

    const firstRowCells = rows[0].findAll('td')
    expect(firstRowCells[0].text()).toContain('1')
    expect(firstRowCells[1].text()).toContain('Test User 1')
    expect(firstRowCells[2].text()).toContain('test1@example.com')
  })

  it('highlights cells correctly based on column config', () => {
    const wrapper = mount(CustomTable, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    const rows = wrapper.findAll('tbody tr')
    const firstRowCells = rows[0].findAll('td')

    // La tercera columna (email) debe tener una clase font-bold
    expect(firstRowCells[2].find('span').classes()).toContain('font-bold')

    // Las otras columnas no deben tener la clase font-bold
    expect(firstRowCells[0].find('span').classes()).not.toContain('font-bold')
    expect(firstRowCells[1].find('span').classes()).not.toContain('font-bold')
  })

  it('shows medal icons when highlightRecommendations is true', async () => {
    // Actualizar mockProps para habilitar highlightRecommendations
    mockProps.highlightRecommendations = true
    mockProps.highlightedRows = 3

    const wrapper = mount(CustomTable, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    const rows = wrapper.findAll('tbody tr')
    const medalIcons = rows[0].findAll('.medal-icon')

    expect(medalIcons.length).toBeGreaterThan(0)
    expect(medalIcons[0].text()).toBe('🥇') // Primer lugar
  })

  it('shows TableState component when in loading state', async () => {
    // Configurar un nuevo mock para el estado de carga
    vi.mocked(useCustomTable).mockImplementation(() => {
      return {
        selectedItemsPerPage: ref(10),
        pageSizeOptions: ref([10, 25, 50, 100]),
        handlePageChange: vi.fn(),
        handleItemsPerPageChange: vi.fn(),
        formatCellValue: (value: unknown): string => String(value || ''),
        getRowClasses: (): string => '',
        getMedalIcon: (): string => '',
        getTableStateType: ref('loading'),
      } as unknown as ReturnType<typeof useCustomTable>
    })

    mockProps.loading = true

    const wrapper = mount(CustomTable, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    expect(wrapper.findComponent('[data-test="table-state"]').exists()).toBe(true)
  })

  it('emits page-change event when handlePageChange is called', async () => {
    const wrapper = mount(CustomTable, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    // Simular un cambio de página desde el componente TablePagination
    await wrapper.findComponent({ name: 'TablePagination' }).vm.$emit('page-change', 2)

    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')?.[0]).toEqual([2])
  })

  it('emits page-size-change event when items per page changes', async () => {
    const wrapper = mount(CustomTable, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    const select = wrapper.find('select#itemsPerPage')
    await select.setValue(25)

    expect(wrapper.emitted('page-size-change')).toBeTruthy()
  })

  it('disables pagination when paginationDisabled is true', () => {
    mockProps.paginationDisabled = true

    const wrapper = mount(CustomTable, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    const select = wrapper.find('select#itemsPerPage')
    expect(select.attributes('disabled')).toBeDefined()
  })
})
