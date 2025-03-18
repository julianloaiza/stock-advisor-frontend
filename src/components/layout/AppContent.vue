<template>
  <main class="container mx-auto p-4 flex-grow w-full">
    <slot></slot>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Contenedor principal para el contenido de la aplicación.
 * Utiliza flex-grow para ocupar el espacio disponible entre NavBar y Footer.
 */
export default defineComponent({
  name: 'AppContent',
})
</script>
