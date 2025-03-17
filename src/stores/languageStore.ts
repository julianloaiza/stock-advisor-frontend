// src/stores/languageStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'user-locale'

export const useLanguageStore = defineStore('language', () => {
  // Estado
  const currentLanguage = ref(localStorage.getItem(STORAGE_KEY) || 'EN')

  // Acciones
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
