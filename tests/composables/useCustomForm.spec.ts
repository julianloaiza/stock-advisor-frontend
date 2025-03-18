// tests/composables/useCustomForm.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCustomForm } from '../../src/composables/useCustomForm'
import type { FormConfig } from '../../src/interfaces/BaseForm.interface'

describe('useCustomForm composable', () => {
  // Mock de props
  let mockProps: {
    config: FormConfig
    initialValues: Record<string, unknown>
    disabled: boolean
  }

  // Mock de emit
  let mockEmit: (event: string, ...args: unknown[]) => void

  beforeEach(() => {
    // Configuración de formulario para pruebas
    mockProps = {
      config: {
        fields: [
          {
            name: 'name',
            type: 'input_search',
            placeholder: 'Name',
            required: true,
          },
          {
            name: 'email',
            type: 'input_search',
            placeholder: 'Email',
          },
          {
            name: 'category',
            type: 'dropdown',
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
            ],
            defaultValue: 'option1',
          },
          {
            name: 'active',
            type: 'switch',
            defaultValue: false,
          },
        ],
        actionLabel: 'Submit',
      },
      initialValues: {},
      disabled: false,
    }

    // Mock de la función emit
    mockEmit = vi.fn()
  })

  it('initializes with default values when no initialValues provided', () => {
    const { formData } = useCustomForm(mockProps, mockEmit)

    expect(formData.name).toBe('')
    expect(formData.email).toBe('')
    expect(formData.category).toBe('option1')
    expect(formData.active).toBe(false)
  })

  it('initializes with provided initialValues', () => {
    mockProps.initialValues = {
      name: 'Test User',
      email: 'test@example.com',
      category: 'option2',
      active: true,
    }

    const { formData } = useCustomForm(mockProps, mockEmit)

    expect(formData.name).toBe('Test User')
    expect(formData.email).toBe('test@example.com')
    expect(formData.category).toBe('option2')
    expect(formData.active).toBe(true)
  })

  it('validates required fields correctly', () => {
    const { formData, validateAndSubmit, fieldErrors } = useCustomForm(mockProps, mockEmit)

    // El campo 'name' es requerido pero está vacío
    formData.name = ''
    validateAndSubmit()

    // Verificar que se identificó el error
    expect(fieldErrors.name).toBe(true)

    // Verificar que no se emitió el evento search
    expect(mockEmit).not.toHaveBeenCalled()
  })

  it('emits search event with form data when validation passes', () => {
    const { formData, validateAndSubmit } = useCustomForm(mockProps, mockEmit)

    // Configurar datos válidos
    formData.name = 'Valid Name'
    formData.email = 'valid@example.com'

    validateAndSubmit()

    // Verificar que se emitió el evento search con los datos correctos
    expect(mockEmit).toHaveBeenCalledWith('search', {
      name: 'Valid Name',
      email: 'valid@example.com',
      category: 'option1',
      active: false,
    })
  })

  it('does not submit when form is disabled', () => {
    mockProps.disabled = true

    const { formData, validateAndSubmit } = useCustomForm(mockProps, mockEmit)

    formData.name = 'Test Name'
    validateAndSubmit()

    // Verificar que no se emitió ningún evento
    expect(mockEmit).not.toHaveBeenCalled()
  })

  it('resets form to default values', () => {
    const { formData, resetForm } = useCustomForm(mockProps, mockEmit)

    // Modificar valores del formulario
    formData.name = 'Modified Name'
    formData.email = 'modified@example.com'
    formData.category = 'option2'
    formData.active = true

    // Resetear formulario
    resetForm()

    // Verificar que los valores volvieron a los valores por defecto
    expect(formData.name).toBe('')
    expect(formData.email).toBe('')
    expect(formData.category).toBe('option1')
    expect(formData.active).toBe(false)

    // Verificar que se emitió el evento reset con los valores reseteados
    expect(mockEmit).toHaveBeenCalledWith('reset', {
      name: '',
      email: '',
      category: 'option1',
      active: false,
    })
  })

  it('clears field errors when form is reset', () => {
    const { formData, validateAndSubmit, resetForm, fieldErrors } = useCustomForm(
      mockProps,
      mockEmit,
    )

    // Provocar un error de validación
    formData.name = ''
    validateAndSubmit()

    // Verificar que hay un error
    expect(fieldErrors.name).toBe(true)

    // Resetear formulario
    resetForm()

    // Verificar que el error se limpió
    expect(fieldErrors.name).toBe(false)
  })

  it('identifies switch fields as invalid when required and false', () => {
    // Modificar configuración para hacer switch requerido
    mockProps.config.fields[3].required = true

    const { formData, validateAndSubmit, fieldErrors } = useCustomForm(mockProps, mockEmit)

    // Asegurar que name tiene un valor válido para aislar la prueba
    formData.name = 'Test Name'

    // Ejecutar validación - el switch debería fallar ya que es requerido y está en false
    validateAndSubmit()

    // Verificar que se marcó como error
    expect(fieldErrors.active).toBe(true)
    expect(mockEmit).not.toHaveBeenCalled()

    // Ahora cambiamos el valor a true
    formData.active = true
    validateAndSubmit()

    // Ahora debería pasar la validación
    expect(fieldErrors.active).toBe(false)
    expect(mockEmit).toHaveBeenCalledTimes(1)
  })

  it('preserves dropdown default option when none is specified', () => {
    // Quitar defaultValue de dropdown
    const newConfig = { ...mockProps.config }
    newConfig.fields = [...mockProps.config.fields]
    newConfig.fields[2] = { ...mockProps.config.fields[2] }
    delete newConfig.fields[2].defaultValue

    mockProps.config = newConfig

    const { formData } = useCustomForm(mockProps, mockEmit)

    // Debería tomar el primer valor de las opciones
    expect(formData.category).toBe('option1')
  })
})
