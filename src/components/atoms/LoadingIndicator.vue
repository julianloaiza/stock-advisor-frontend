<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="animate-spin rounded-full" :class="spinnerClass">
      <svg class="w-full h-full text-current" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <span v-if="label" class="ml-2 text-gray-700 dark:text-gray-300">{{ $t(label) }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Indicador de carga animado con opciones configurables de tamaño y color
 */
export default defineComponent({
  name: 'LoadingIndicator',
  props: {
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary', 'gray'].includes(value),
    },
    label: {
      type: String,
      default: 't_components_loadingIndicator_default_label',
    },
    containerClass: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const spinnerSizes = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    }

    const spinnerColors = {
      primary: 'text-blue-600',
      secondary: 'text-purple-600',
      gray: 'text-gray-600',
    }

    const spinnerClass = `${spinnerSizes[props.size as keyof typeof spinnerSizes]} ${spinnerColors[props.color as keyof typeof spinnerColors]}`

    return {
      spinnerClass,
    }
  },
})
</script>
