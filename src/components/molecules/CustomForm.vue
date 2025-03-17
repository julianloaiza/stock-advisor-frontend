<template>
  <form @submit.prevent="validateAndSubmit" class="w-full flex justify-center">
    <div class="flex flex-wrap items-center gap-2 md:gap-4">
      <div
        v-for="field in config.fields"
        :key="field.name"
        class="flex-grow md:flex-grow-0 min-w-0"
      >
        <!-- Input field -->
        <BaseInput
          v-if="['input-search', 'input-number', 'input-currency'].includes(field.type)"
          :id="field.name"
          :type="field.type as any"
          :placeholder="field.placeholder || ''"
          :required="field.required || false"
          v-model="formData[field.name] as string | number | undefined"
          :disabled="disabled"
          :show-error="fieldErrors[field.name]"
          :error-message="field.errorMessage || config.defaultErrorMessage || defaultErrorMessage"
        />

        <!-- Switch field -->
        <BaseSwitch
          v-else-if="field.type === 'switch'"
          :id="field.name"
          :label="field.placeholder || 'Recommended'"
          v-model="formData[field.name] as boolean | undefined"
          :disabled="disabled"
          :required="field.required || false"
          :show-error="fieldErrors[field.name]"
          :error-message="field.errorMessage || config.defaultErrorMessage || defaultErrorMessage"
        />

        <!-- Dropdown field -->
        <BaseDropdown
          v-else-if="field.type === 'dropdown'"
          :id="field.name"
          :options="field.options || []"
          :modelValue="String(formData[field.name] || '')"
          @update:modelValue="(val) => (formData[field.name] = val)"
          :disabled="disabled"
          :required="field.required || false"
          :show-error="fieldErrors[field.name]"
          :error-message="field.errorMessage || config.defaultErrorMessage || defaultErrorMessage"
        />
      </div>

      <!-- Submit button -->
      <div>
        <BaseButton :label="config.actionLabel" type="submit" :disabled="disabled" />
      </div>

      <!-- Reset button (only shown if clearLabel is explicitly provided) -->
      <div v-if="config.clearLabel">
        <BaseButton
          :label="config.clearLabel"
          variant="outline"
          type="button"
          @click="resetForm"
          :disabled="disabled"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import BaseInput from '../atoms/BaseInput.vue'
import BaseSwitch from '../atoms/BaseSwitch.vue'
import BaseDropdown from '../atoms/BaseDropdown.vue'
import BaseButton from '../atoms/BaseButton.vue'
import type { FormConfig } from '@/interfaces/BaseForm.interface'
import { useCustomForm } from '@/composables/useCustomForm'

export default defineComponent({
  name: 'CustomForm',
  components: {
    BaseInput,
    BaseSwitch,
    BaseDropdown,
    BaseButton,
  },
  props: {
    config: {
      type: Object as PropType<FormConfig>,
      required: true,
    },
    initialValues: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['search', 'reset'],
  setup(props, { emit }) {
    const { formData, fieldErrors, defaultErrorMessage, validateAndSubmit, resetForm } =
      useCustomForm(props, emit)

    return {
      formData,
      fieldErrors,
      defaultErrorMessage,
      validateAndSubmit,
      resetForm,
    }
  },
})
</script>
