/**
 * Configuración de internacionalización para la aplicación
 */
import { createI18n } from 'vue-i18n'
import EN from './locales/en.json'
import ES from './locales/es.json'

// Clave para localStorage
export const STORAGE_KEY = 'user-locale'

// Idioma predeterminado de las variables de entorno o 'EN'
export const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE?.toUpperCase() || 'EN'

// Obtener idioma guardado o usar el predeterminado
export const INITIAL_LANGUAGE = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE

// Mensajes de traducción
const messages = { EN, ES }

// Crear instancia i18n
export const i18n = createI18n({
  locale: INITIAL_LANGUAGE,
  messages,
})
