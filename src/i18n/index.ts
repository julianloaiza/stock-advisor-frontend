import { createI18n } from 'vue-i18n'

import EN from './locales/en.json'
import ES from './locales/es.json'

const messages: Record<string, Record<string, string>> = {
  EN,
  ES,
}

export const i18n = createI18n({
  locale: 'ES',
  messages,
})
