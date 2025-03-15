<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      :value="modelValue"
      :checked="modelValue"
      @change="updateValue($event)"
      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
    />
    <label :for="id" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseCheckbox',
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: 'Checkbox',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    updateValue(event: Event) {
      const target = event.target as HTMLInputElement
      this.$emit('update:modelValue', target.checked)
    },
  },
})
</script>
