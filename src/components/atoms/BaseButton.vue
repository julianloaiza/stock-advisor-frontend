<template>
  <button
    :id="id"
    :type="type"
    :class="getButtonClasses"
    @click="$emit('click')"
    :disabled="disabled"
  >
    <slot>{{ $t(label) }}</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

/**
 * Botón base con múltiples variantes y tamaños
 * Soporta: primary, secondary, outline, icon y link
 */
export default defineComponent({
  name: 'BaseButton',
  props: {
    id: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: 't_components_baseButton_default_label_primary',
    },
    type: {
      type: String as () => 'button' | 'submit' | 'reset',
      default: 'button',
    },
    variant: {
      type: String as () => 'primary' | 'secondary' | 'outline' | 'icon' | 'link',
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as () => 'sm' | 'md' | 'lg',
      default: 'md',
    },
  },
  emits: ['click'],
  setup(props) {
    const getButtonClasses = computed(() => {
      const sizeClasses = {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-5 py-2.5',
        lg: 'text-base px-6 py-3',
      }

      const baseClasses =
        'font-medium rounded-lg text-center focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

      const sizeClass = sizeClasses[props.size] || sizeClasses.md

      switch (props.variant) {
        case 'primary':
          return `${baseClasses} ${sizeClass} text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`
        case 'secondary':
          return `${baseClasses} ${sizeClass} text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700`
        case 'outline':
          return `${baseClasses} ${sizeClass} text-blue-700 border border-blue-700 hover:text-white hover:bg-blue-800 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800`
        case 'icon':
          return 'inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400 cursor-pointer'
        case 'link':
          return 'bg-transparent border-0 p-0 focus:outline-none text-sm hover:underline cursor-pointer'
        default:
          return `${baseClasses} ${sizeClass} text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`
      }
    })

    return {
      getButtonClasses,
    }
  },
})
</script>
