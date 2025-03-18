<template>
  <div class="relative inline-block text-left w-full">
    <button
      :id="id"
      type="button"
      @click="!disabled && (isOpen = !isOpen)"
      class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex justify-between items-center"
      :class="{
        'opacity-50 cursor-not-allowed': disabled,
        'cursor-pointer': !disabled,
      }"
      :disabled="disabled"
    >
      {{ selectedLabel }}
      <svg
        class="w-2.5 h-2.5 ms-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 4 4 4-4"
        />
      </svg>
    </button>

    <div
      v-if="isOpen && !disabled"
      class="absolute z-10 mt-1 w-full bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700"
    >
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
        <li v-for="option in options" :key="option.value">
          <a
            href="#"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
            @click.prevent="selectOption(option.value)"
          >
            {{ option.label }}
          </a>
        </li>
      </ul>
    </div>

    <ErrorMessage :show="showError" :message="errorMessage" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { PropType } from 'vue'
import ErrorMessage from './ErrorMessage.vue'

export default defineComponent({
  name: 'BaseDropdown',
  components: {
    ErrorMessage,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    options: {
      type: Array as PropType<Array<{ value: string; label: string }>>,
      required: true,
    },
    modelValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    showError: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: 't_components_baseDropdown_default_error',
    },
    placeholder: {
      type: String,
      default: 't_components_baseDropdown_default_placeholder',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isOpen = ref(false)

    const selectedLabel = computed(() => {
      const selected = props.options.find((opt) => opt.value === props.modelValue)
      return selected ? selected.label : props.placeholder
    })

    const selectOption = (value: string) => {
      if (props.disabled) return
      emit('update:modelValue', value)
      isOpen.value = false
    }

    const handleClickOutside = (e: MouseEvent) => {
      const element = document.getElementById(props.id)
      if (element && !element.contains(e.target as Node)) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isOpen,
      selectedLabel,
      selectOption,
    }
  },
})
</script>
