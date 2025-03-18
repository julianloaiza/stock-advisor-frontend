<template>
  <div>
    <button
      type="button"
      data-dropdown-toggle="language-dropdown-menu"
      class="inline-flex items-center font-medium justify-center px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      <!-- Bandera inglés (US) -->
      <svg
        v-if="currentLocale === 'EN'"
        class="w-5 h-5 rounded-full me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 3900 3900"
      >
        <path fill="#b22234" d="M0 0h7410v3900H0z" />
        <path
          d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
          stroke="#fff"
          stroke-width="300"
        />
        <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
        <g fill="#fff">
          <g id="d">
            <g id="c">
              <g id="e">
                <g id="b">
                  <path id="a" d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z" />
                  <use xlink:href="#a" y="420" />
                  <use xlink:href="#a" y="840" />
                  <use xlink:href="#a" y="1260" />
                </g>
                <use xlink:href="#a" y="1680" />
              </g>
              <use xlink:href="#b" x="247" y="210" />
            </g>
            <use xlink:href="#c" x="494" />
          </g>
          <use xlink:href="#d" x="988" />
          <use xlink:href="#c" x="1976" />
          <use xlink:href="#e" x="2470" />
        </g>
      </svg>

      <!-- Bandera española -->
      <svg
        v-else-if="currentLocale === 'ES'"
        class="w-5 h-5 rounded-full me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <g fill-rule="evenodd" stroke-width="1pt">
          <path fill="#aa151b" d="M0 0h512v512H0z" />
          <path fill="#f1bf00" d="M0 170.7h512v170.6H0z" />
        </g>
      </svg>

      <!-- Texto del idioma seleccionado -->
      <span v-if="currentLocale === 'EN'">{{ $t('t_language_english') }}</span>
      <span v-else-if="currentLocale === 'ES'">{{ $t('t_language_spanish') }}</span>
    </button>

    <!-- Dropdown -->
    <div
      class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700"
      id="language-dropdown-menu"
    >
      <ul class="py-2 font-medium" role="none">
        <li>
          <a
            href="#"
            @click.prevent="changeLanguage('EN')"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem"
          >
            <div class="inline-flex items-center">
              <svg
                aria-hidden="true"
                class="h-3.5 w-3.5 rounded-full me-2"
                xmlns="http://www.w3.org/2000/svg"
                id="flag-icon-css-us"
                viewBox="0 0 512 512"
              >
                <g fill-rule="evenodd">
                  <g stroke-width="1pt">
                    <path
                      fill="#bd3d44"
                      d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                      transform="scale(3.9385)"
                    />
                    <path
                      fill="#fff"
                      d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                      transform="scale(3.9385)"
                    />
                  </g>
                  <path fill="#192f5d" d="M0 0h98.8v70H0z" transform="scale(3.9385)" />
                  <path
                    fill="#fff"
                    d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z"
                    transform="scale(3.9385)"
                  />
                </g>
              </svg>
              {{ $t('t_language_english') }}
            </div>
          </a>
        </li>
        <li>
          <a
            href="#"
            @click.prevent="changeLanguage('ES')"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem"
          >
            <div class="inline-flex items-center">
              <svg
                class="h-3.5 w-3.5 rounded-full me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                id="flag-icon-css-es"
                viewBox="0 0 512 512"
              >
                <g fill-rule="evenodd" stroke-width="1pt">
                  <path fill="#aa151b" d="M0 0h512v512H0z" />
                  <path fill="#f1bf00" d="M0 170.7h512v170.6H0z" />
                </g>
              </svg>
              {{ $t('t_language_spanish') }}
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/languageStore'

export default defineComponent({
  name: 'LanguageSwitcher',
  setup() {
    const { locale } = useI18n()
    const languageStore = useLanguageStore()

    // Usar el valor del store para mantener el estado
    const currentLocale = computed(() => languageStore.currentLanguage)

    // Inicializar el idioma al montar el componente
    onMounted(() => {
      // Obtener idioma guardado o usar el predeterminado (EN)
      const savedLanguage = localStorage.getItem('user-locale') || 'EN'

      // Inicializar tanto el store como la configuración i18n
      languageStore.setLanguage(savedLanguage)
      locale.value = savedLanguage
    })

    // Cambiar idioma
    const changeLanguage = (lang: string) => {
      // Actualizar el store
      languageStore.setLanguage(lang)

      // Actualizar i18n
      locale.value = lang

      // Guardar en localStorage para persistencia
      localStorage.setItem('user-locale', lang)
    }

    return {
      currentLocale,
      changeLanguage,
    }
  },
})
</script>
