<template>
  <p v-if="show" class="mt-1 text-sm text-red-600 dark:text-red-500">
    {{ $t(message) }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
