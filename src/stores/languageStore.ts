/**
 * Store para gestionar el idioma de la aplicación
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

// Clave para localStorage
const STORAGE_KEY = 'user-locale'

// Idioma predeterminado de las variables de entorno o 'EN'
const defaultLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE?.toUpperCase() || 'EN'

export const useLanguageStore = defineStore('language', () => {
  // Estado del idioma actual
  const currentLanguage = ref(localStorage.getItem(STORAGE_KEY) || defaultLanguage)

  /**
   * Cambia el idioma de la aplicación
   */
  function setLanguage(lang: string) {
    // Normalizar a mayúsculas
    const normalizedLang = lang.toUpperCase()

    // Actualizar estado y localStorage
    currentLanguage.value = normalizedLang
    localStorage.setItem(STORAGE_KEY, normalizedLang)
  }

  return {
    currentLanguage,
    setLanguage,
  }
})
