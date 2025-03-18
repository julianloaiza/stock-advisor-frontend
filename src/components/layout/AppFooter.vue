<template>
  <footer class="bg-white rounded-lg shadow-sm m-4 dark:bg-gray-800">
    <div class="w-full mx-auto max-w-screen-xl p-4 flex items-center justify-between">
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        {{ $t('t_components_footer_copyright', { year: new Date().getFullYear() }) }}
      </span>
      <a
        href="https://www.linkedin.com/in/julian-andres-loaiza/"
        class="text-sm text-gray-500 hover:underline dark:text-gray-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('t_components_footer_made_by') }}
      </a>
      <a
        href="https://github.com/julianloaiza/stock-advisor-frontend"
        class="text-sm text-gray-500 hover:underline dark:text-gray-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github
      </a>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Pie de página de la aplicación con copyright, atribución al autor
 * y enlace al repositorio de GitHub
 */
export default defineComponent({
  name: 'AppFooter',
})
</script>
