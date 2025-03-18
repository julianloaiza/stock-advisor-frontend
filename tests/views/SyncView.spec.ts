import { mount, VueWrapper } from '@vue/test-utils'
import { describe, beforeEach, it, expect, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick, ref } from 'vue'
import SyncView from '../../src/views/SyncView.vue'

// Mocks de componentes hijos
vi.mock('@/components/molecules/CustomForm.vue', () => ({
  default: {
    name: 'CustomForm',
    template: '<div class="custom-form"></div>',
    props: ['config', 'disabled'],
    emits: ['search'],
    methods: {
      resetForm: vi.fn(),
    },
  },
}))

vi.mock('@/components/atoms/AlertBanner.vue', () => ({
  default: {
    name: 'AlertBanner',
    template: '<div class="alert-banner"></div>',
    props: ['show', 'message', 'icon'],
  },
}))

vi.mock('@/components/molecules/ConfirmationModal.vue', () => ({
  default: {
    name: 'ConfirmationModal',
    template: '<div class="confirmation-modal"></div>',
    props: ['show', 'title', 'message', 'confirmLabel', 'cancelLabel', 'icon', 'confirmVariant'],
    emits: ['confirm', 'cancel'],
  },
}))

vi.mock('@/components/atoms/InfoPanel.vue', () => ({
  default: {
    name: 'InfoPanel',
    template: '<div class="info-panel"></div>',
    props: ['title', 'items', 'note'],
  },
}))

vi.mock('@/components/atoms/LoadingIndicator.vue', () => ({
  default: {
    name: 'LoadingIndicator',
    template: '<div class="loading-indicator"></div>',
    props: ['size', 'color', 'label'],
  },
}))

// Mock del composable useSync con referencias reactivas
const createMockUseSync = () => ({
  loading: ref(false),
  showModal: ref(false),
  syncParams: ref({ limit: 1 }),
  syncStore: ref({
    syncInProgress: false,
    lastSyncTime: null as number | null,
  }),
  handleSyncSubmit: vi.fn(),
  confirmSync: vi.fn().mockResolvedValue(true),
  cancelSync: vi.fn(),
  checkIncompleteSync: vi.fn(),
})

let mockUseSync: ReturnType<typeof createMockUseSync>

vi.mock('@/composables/useSync', () => ({
  useSync: () => mockUseSync,
}))

describe('SyncView', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Configurar Pinia
    const pinia = createPinia()
    setActivePinia(pinia)

    // Resetear mocks
    vi.clearAllMocks()

    // Crear nuevo mock
    mockUseSync = createMockUseSync()

    // Montar componente
    wrapper = mount(SyncView, {
      global: {
        plugins: [pinia],
        // Mock de i18n
        mocks: {
          $t: (key: string, params?: Record<string, unknown>) => {
            const translations: Record<string, string> = {
              t_sync_confirm_modal_message: params
                ? `Confirm sync with ${params.limit} queries, total ${params.total} records`
                : key,
              t_sync_no_recent_sync: 'No recent sync',
              t_sync_last_sync_title: 'Last Sync',
              t_sync_synchronizing: 'Synchronizing',
              t_sync_title: 'Sync Title',
              t_sync_instruction_text: 'Sync Instructions',
            }
            return translations[key] || key
          },
        },
      },
    })
  })

  it('renderiza correctamente', () => {
    // Verificar componentes hijos
    expect(wrapper.findComponent({ name: 'CustomForm' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'AlertBanner' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ConfirmationModal' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'InfoPanel' }).exists()).toBe(true)
  })

  it('verifica sincronización incompleta al montar', () => {
    // Verificar que se llamó a checkIncompleteSync
    expect(mockUseSync.checkIncompleteSync).toHaveBeenCalledTimes(1)
  })

  it('muestra indicador de carga cuando está sincronizando', async () => {
    // Cambiar estado de carga
    mockUseSync.loading.value = true
    mockUseSync.syncStore.value.syncInProgress = true

    // Forzar actualización
    await nextTick()

    // Verificar que se muestra el indicador de carga
    const loadingIndicators = wrapper.findAllComponents({ name: 'LoadingIndicator' })
    expect(loadingIndicators.length).toBeGreaterThan(0)
  })

  it('muestra última hora de sincronización', async () => {
    // Usar una fecha específica y fija
    const testTime = new Date('2025-01-01T12:00:00Z')
    mockUseSync.syncStore.value.lastSyncTime = testTime.getTime()

    // Montar nuevamente con la hora configurada
    wrapper = mount(SyncView, {
      global: {
        plugins: [createPinia()],
        mocks: {
          $t: (key: string) => {
            const translations: Record<string, string> = {
              t_sync_last_sync_title: 'Last Sync',
              t_sync_no_recent_sync: 'No recent sync',
            }
            return translations[key] || key
          },
        },
      },
    })

    // Forzar actualización
    await nextTick()

    // Obtener todo el texto renderizado
    const text = wrapper.text()

    // DIAGNOSTICO: Imprimir el texto completo
    console.log('Texto renderizado completo:', text)

    // Verificar partes específicas de la fecha
    expect(text).toContain('2025')
  })

  it('muestra mensaje cuando no hay sincronizaciones recientes', async () => {
    // Forzar actualización
    await nextTick()

    // Buscar el elemento de última sincronización
    const syncTimeElement = wrapper.text()
    expect(syncTimeElement).toContain('No recent sync')
  })

  it('maneja envío de formulario de sincronización', async () => {
    // Obtener el componente de formulario
    const customForm = wrapper.findComponent({ name: 'CustomForm' })

    // Simular evento de búsqueda
    customForm.vm.$emit('search')

    // Verificar que se llamó al método de envío
    expect(mockUseSync.handleSyncSubmit).toHaveBeenCalled()
  })

  it('maneja confirmación de sincronización', async () => {
    // Mostrar modal de confirmación
    mockUseSync.showModal.value = true

    // Forzar actualización
    await nextTick()

    // Obtener el modal de confirmación
    const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })

    // Simular confirmación
    confirmationModal.vm.$emit('confirm')

    // Verificar que se llamó al método de confirmación
    expect(mockUseSync.confirmSync).toHaveBeenCalled()
  })

  it('maneja cancelación de sincronización', async () => {
    // Mostrar modal de confirmación
    mockUseSync.showModal.value = true

    // Forzar actualización
    await nextTick()

    // Obtener el modal de confirmación
    const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })

    // Simular cancelación
    confirmationModal.vm.$emit('cancel')

    // Verificar que se llamó al método de cancelación
    expect(mockUseSync.cancelSync).toHaveBeenCalled()
  })

  it('verifica elementos informativos en el panel', () => {
    // Obtener el componente de panel informativo
    const infoPanel = wrapper.findComponent({ name: 'InfoPanel' })

    // Verificar props de elementos informativos
    const expectedItems = ['t_sync_info_item_1', 't_sync_info_item_2', 't_sync_info_item_3']

    // Comparar con los items pasados al panel
    expect(infoPanel.props('items')).toEqual(expectedItems)
  })
})
