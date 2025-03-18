import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Clave de almacenamiento local para persistir el idioma del usuario
 */
const STORAGE_KEY = 'user-locale'

/**
 * Store de gestión de idioma para la aplicación Stock Advisor
 *
 * Permite mantener y cambiar el idioma de la interfaz,
 * con persistencia en el almacenamiento local
 */
export const useLanguageStore = defineStore('language', () => {
  /**
   * Estado reactivo del idioma actual,
   * inicializado con el valor guardado en localStorage o inglés por defecto
   */
  const currentLanguage = ref(localStorage.getItem(STORAGE_KEY) || 'EN')

  /**
   * Establece el nuevo idioma y lo guarda en localStorage
   *
   * @param lang - Código de idioma a establecer (ej. 'EN', 'ES')
   */
  function setLanguage(lang: string) {
    currentLanguage.value = lang
    localStorage.setItem(STORAGE_KEY, lang)
  }

  return {
    // Estado
    currentLanguage,

    // Acciones
    setLanguage,
  }
})
