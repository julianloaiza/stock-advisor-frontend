<template>
  <!-- Sección de página no encontrada con diseño responsive -->
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-sm text-center">
        <!-- Código de error 404 con estilo -->
        <h1
          class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600 dark:text-blue-500"
        >
          404
        </h1>

        <!-- Título de página no encontrada internacionalizado -->
        <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
          {{ $t('t_notFound_title') }}
        </p>

        <!-- Descripción de error internacionalizada -->
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          {{ $t('t_notFound_description') }}
        </p>

        <!-- Enlace de retorno a página de inicio -->
        <router-link
          to="/"
          class="inline-flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-900 my-4"
        >
          {{ $t('t_notFound_back_to_home') }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Vista de página no encontrada (404)
 *
 * Muestra un mensaje amigable cuando un usuario intenta
 * acceder a una ruta inexistente en la aplicación
 */
export default defineComponent({
  name: 'NotFoundView',
})
</script>
