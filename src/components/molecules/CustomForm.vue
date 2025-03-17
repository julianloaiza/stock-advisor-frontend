<template>
  <form @submit.prevent="validateAndSubmit" class="w-full flex justify-center">
    <div class="form-container flex flex-wrap items-center gap-2 md:gap-4">
      <div
        v-for="field in config.fields"
        :key="field.name"
        class="field-container flex-grow md:flex-grow-0 min-w-0"
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

      <!-- Buttons container -->
      <div
        class="buttons-container flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2 md:gap-4"
      >
        <!-- Submit button -->
        <BaseButton
          :label="config.actionLabel"
          type="submit"
          :disabled="disabled"
          class="w-full md:w-28"
        />

        <!-- Reset button (only shown if clearLabel is explicitly provided) -->
        <BaseButton
          v-if="config.clearLabel"
          :label="config.clearLabel"
          variant="outline"
          type="button"
          @click="resetForm"
          :disabled="disabled"
          class="w-full md:w-28"
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

<style scoped>
/* Solo en móvil: elementos en columna y centrados */
@media (max-width: 768px) {
  .form-container {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .field-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 8px;
  }

  .field-container input,
  .field-container select {
    width: 100%;
    text-align: center;
  }

  .buttons-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 8px;
  }
}
</style>
