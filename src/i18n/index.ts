import { createI18n } from 'vue-i18n'
import EN from './locales/en.json'
import ES from './locales/es.json'

/**
 * Recuperar el idioma guardado previamente del almacenamiento local
 * Usa inglés como idioma predeterminado si no hay preferencia guardada
 */
const savedLanguage = localStorage.getItem('user-locale') || 'EN'

/**
 * Mapeo de mensajes de internacionalización para los idiomas soportados
 */
const messages = {
  EN,
  ES,
}

/**
 * Configuración de i18n para soporte multilenguaje en la aplicación
 *
 * @description Inicializa Vue I18n con el idioma guardado previamente
 * y los mensajes de traducción importados
 */
export const i18n = createI18n({
  locale: savedLanguage,
  messages,
})
