import { createI18n } from 'vue-i18n'

import EN from './locales/en.json'
import ES from './locales/es.json'

// Obtener el idioma guardado en localStorage, o usar 'EN' como predeterminado
const savedLanguage = localStorage.getItem('user-locale') || 'EN'

const messages: Record<string, Record<string, string>> = {
  EN,
  ES,
}

export const i18n = createI18n({
  locale: savedLanguage, // Usar el idioma guardado
  messages,
})
