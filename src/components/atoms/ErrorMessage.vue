<template>
  <p
    v-if="show"
    class="absolute text-xs text-red-600 dark:text-red-500 mt-1 left-0 pl-3"
    style="top: 100%; z-index: 5"
  >
    {{ $t(message) }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Mensaje de error para validaciones de formularios
 * Posicionado absolutamente debajo del campo relacionado
 */
export default defineComponent({
  name: 'ErrorMessage',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: 't_components_errorMessage_required',
    },
  },
})
</script>
