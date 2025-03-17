<template>
  <button :type="type" :class="getButtonClasses" @click="$emit('click')" :disabled="disabled">
    <slot>{{ label }}</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'BaseButton',
  props: {
    label: {
      type: String,
      default: 'Button',
    },
    type: {
      type: String as () => 'button' | 'submit' | 'reset',
      default: 'button',
    },
    variant: {
      type: String as () => 'primary' | 'secondary' | 'outline',
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup(props) {
    const getButtonClasses = computed(() => {
      const baseClasses =
        'font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed'

      switch (props.variant) {
        case 'primary':
          return `${baseClasses} text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`
        case 'secondary':
          return `${baseClasses} text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700`
        case 'outline':
          return `${baseClasses} text-blue-700 border border-blue-700 hover:text-white hover:bg-blue-800 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800`
        default:
          return `${baseClasses} text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`
      }
    })

    return {
      getButtonClasses,
    }
  },
})
</script>
