// src/stores/languageStore.ts
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    // Valor predeterminado 'EN' si no hay nada guardado
    currentLanguage: localStorage.getItem('user-locale') || 'EN',
  }),

  actions: {
    setLanguage(lang: string) {
      this.currentLanguage = lang
    },
  },
})
