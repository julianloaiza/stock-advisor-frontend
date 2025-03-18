// tests/components/organisms/CustomFilter.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CustomFilter from '../../../src/components/organisms/CustomFilter.vue'
import type { FormConfig, FormData } from '../../../src/interfaces/BaseForm.interface'

// Mock para CustomForm
vi.mock('../../../src/components/molecules/CustomForm.vue', () => ({
  default: {
    name: 'CustomForm',
    props: ['config', 'initialValues'],
    template: '<div data-test="custom-form"></div>',
  },
}))

// Mock para BaseButton
vi.mock('../../../src/components/atoms/BaseButton.vue', () => ({
  default: {
    name: 'BaseButton',
    props: ['label', 'icon', 'variant'],
    template: '<button data-test="toggle-button"></button>',
  },
}))

// Configuración para i18n
const mockI18n = {
  t: (key: string): string => key,
}

// Interfaz para las propiedades de componente
interface CustomFilterProps {
  title: string
  formConfig: FormConfig
  initialValues: Record<string, unknown>
}

describe('CustomFilter', () => {
  let mockProps: CustomFilterProps

  beforeEach(() => {
    vi.clearAllMocks()

    // Resetear propiedades del DOM global
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024, // Por defecto, simular pantalla de escritorio
    })

    // Configuración de props por defecto
    mockProps = {
      title: 'Filter Title',
      formConfig: {
        fields: [
          { name: 'query', type: 'input_search', placeholder: 'Search' },
          { name: 'category', type: 'dropdown', options: [{ value: 'all', label: 'All' }] },
        ],
        actionLabel: 'Submit',
      },
      initialValues: { query: '', category: 'all' },
    }
  })

  it('renders the filter title correctly', () => {
    const wrapper = mount(CustomFilter, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    const title = wrapper.find('h2')
    expect(title.text()).toBe('Filter Title')
  })

  it('renders CustomForm component', () => {
    const wrapper = mount(CustomFilter, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    expect(wrapper.findComponent('[data-test="custom-form"]').exists()).toBe(true)
  })

  it('hides toggle button on desktop view', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1024, // Pantalla de escritorio
    })

    const wrapper = mount(CustomFilter, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    expect(wrapper.findComponent('[data-test="toggle-button"]').exists()).toBe(false)
  })

  it('shows toggle button on mobile view', async () => {
    // Simular pantalla móvil
    Object.defineProperty(window, 'innerWidth', {
      value: 767, // Pantalla móvil (< 768px)
    })

    const wrapper = mount(CustomFilter, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    // Permitir que los cambios se reflejen
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.findComponent('[data-test="toggle-button"]').exists()).toBe(true)
  })

  it('collapses form by default on mobile view', async () => {
    // Simular pantalla móvil
    Object.defineProperty(window, 'innerWidth', {
      value: 767, // Pantalla móvil
    })

    const wrapper = mount(CustomFilter, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    // Permitir que los cambios se reflejen
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Verificar que el formulario está oculto
    const form = wrapper.findComponent('[data-test="custom-form"]')
    expect(form.isVisible()).toBe(false)
  })

  it('emits filter-applied event when form is submitted', async () => {
    const wrapper = mount(CustomFilter, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    const formData: FormData = { query: 'test', category: 'all' }

    // Simular envío del formulario
    await wrapper.findComponent({ name: 'CustomForm' }).vm.$emit('search', formData)

    expect(wrapper.emitted('filter-applied')).toBeTruthy()
    expect(wrapper.emitted('filter-applied')?.[0]).toEqual([formData])
  })

  it('emits filter-reset event when form is reset', async () => {
    const wrapper = mount(CustomFilter, {
      props: mockProps,
      global: {
        mocks: {
          $t: mockI18n.t,
        },
      },
    })

    const defaultData: FormData = { query: '', category: 'all' }

    // Simular reseteo del formulario
    await wrapper.findComponent({ name: 'CustomForm' }).vm.$emit('reset', defaultData)

    expect(wrapper.emitted('filter-reset')).toBeTruthy()
    expect(wrapper.emitted('filter-reset')?.[0]).toEqual([defaultData])
  })
})
