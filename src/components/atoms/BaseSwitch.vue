<template>
  <div>
    <label
      :for="id"
      class="inline-flex items-center"
      :class="{ 'cursor-pointer': !disabled, 'opacity-50 cursor-not-allowed': disabled }"
    >
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        @change="handleToggle($event)"
        :disabled="disabled"
        class="sr-only peer"
      />
      <div
        class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
      ></div>
      <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {{ $t(label) }}
      </span>
    </label>

    <ErrorMessage :show="showError" :message="$t(errorMessage)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ErrorMessage from './ErrorMessage.vue'

export default defineComponent({
  name: 'BaseSwitch',
  components: {
    ErrorMessage,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: 't_components_baseSwitch_default_label',
    },
    modelValue: {
      type: Boolean,
      default: false,
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
      default: 't_components_baseSwitch_default_error',
    },
  },
  emits: ['update:modelValue'],
  methods: {
    handleToggle(event: Event) {
      if (this.disabled) return
      const target = event.target as HTMLInputElement
      this.$emit('update:modelValue', target.checked)
    },
  },
})
</script>
