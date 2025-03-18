import { setActivePinia, createPinia } from 'pinia'
import { describe, beforeEach, it, expect, vi } from 'vitest'
import { useLanguageStore } from '../../src/stores/languageStore'

describe('Language Store', () => {
  // Variable para almacenar la instancia del store
  let store: ReturnType<typeof useLanguageStore>

  // Configuración antes de cada prueba
  beforeEach(() => {
    // Crear una nueva instancia de Pinia
    setActivePinia(createPinia())

    // Inicializar el store
    store = useLanguageStore()

    // Limpiar localStorage antes de cada prueba
    localStorage.clear()
  })

  // Prueba de inicialización del store
  it('debe inicializarse con el idioma predeterminado', () => {
    // Configurar el idioma predeterminado en las variables de entorno
    vi.stubEnv('VITE_DEFAULT_LANGUAGE', 'EN')

    // Recrear el store para reflejar el nuevo entorno
    store = useLanguageStore()

    // Verificar que el idioma inicial sea correcto
    expect(store.currentLanguage).toBe('EN')
  })

  // Prueba de cambio de idioma
  it('debe cambiar el idioma correctamente', () => {
    // Cambiar el idioma a español
    store.setLanguage('ES')

    // Verificar que el idioma se haya actualizado
    expect(store.currentLanguage).toBe('ES')

    // Verificar que se haya guardado en localStorage
    expect(localStorage.getItem('user-locale')).toBe('ES')
  })

  // Prueba de normalización de idioma
  it('debe normalizar el idioma a mayúsculas', () => {
    // Cambiar el idioma con minúsculas
    store.setLanguage('es')

    // Verificar que se convierta a mayúsculas
    expect(store.currentLanguage).toBe('ES')
    expect(localStorage.getItem('user-locale')).toBe('ES')
  })

  // Prueba de persistencia de idioma en localStorage
  it('debe cargar el idioma desde localStorage', () => {
    // Desactivar Pinia actual
    setActivePinia(undefined)

    // Configurar manualmente el localStorage
    localStorage.setItem('user-locale', 'FR')

    // Crear una nueva instancia de Pinia
    const pinia = createPinia()

    // Configurar el contexto de Pinia
    setActivePinia(pinia)

    // Recrear el store para que cargue desde localStorage
    store = useLanguageStore()

    // Verificar que se cargue el idioma correcto
    expect(store.currentLanguage).toBe('FR')
  })

  // Prueba de comportamiento con múltiples cambios de idioma
  it('debe manejar múltiples cambios de idioma', () => {
    // Cambios sucesivos de idioma
    store.setLanguage('EN')
    store.setLanguage('ES')
    store.setLanguage('FR')

    // Verificar el último estado
    expect(store.currentLanguage).toBe('FR')
    expect(localStorage.getItem('user-locale')).toBe('FR')
  })
})
