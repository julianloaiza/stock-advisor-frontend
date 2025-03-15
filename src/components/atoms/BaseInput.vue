<template>
  <div class="relative w-full">
    <div
      v-if="showIcon"
      class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"
    >
      <!-- Search icon -->
      <svg
        v-if="type === 'input-search'"
        class="w-4 h-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>

      <!-- Number icon -->
      <svg
        v-if="type === 'input-number'"
        class="w-4 h-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h2m2 0h2m2 0h2M1 7v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7"
        />
      </svg>

      <!-- Currency icon -->
      <svg
        v-if="type === 'input-currency'"
        class="w-4 h-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14v-4m0-3V5m-8 5a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z"
        />
      </svg>
    </div>

    <input
      :id="id"
      :type="inputType"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      @input="updateValue($event)"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      :class="{ 'ps-10': showIcon }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import type { FieldInputType } from '@/interfaces/BaseForm.interface'

export default defineComponent({
  name: 'BaseInput',
  props: {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<
        Extract<FieldInputType, 'input-search' | 'input-number' | 'input-currency'>
      >,
      default: 'input-search',
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const showIcon = computed(() => true)

    const inputType = computed(() => {
      switch (props.type) {
        case 'input-search':
          return 'search'
        case 'input-number':
        case 'input-currency':
          return 'number'
        default:
          return 'text'
      }
    })

    const updateValue = (event: Event) => {
      const target = event.target as HTMLInputElement
      emit('update:modelValue', target.value)
    }

    return {
      showIcon,
      inputType,
      updateValue,
    }
  },
})
</script>
