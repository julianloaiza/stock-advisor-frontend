<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
  >
    <div
      class="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow-sm dark:bg-gray-700"
    >
      <!-- Botón de cierre -->
      <button
        type="button"
        class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
        @click="$emit('cancel')"
      >
        <svg
          class="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span class="sr-only">{{ $t('t_components_confirmationModal_close_modal') }}</span>
      </button>

      <!-- Contenido del modal -->
      <div class="p-4 md:p-5 text-center">
        <div
          v-if="icon === 'warning'"
          class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
        >
          <svg
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
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>

        <div
          v-else-if="icon === 'question'"
          class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
        >
          <svg
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
              d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>

        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{{ $t(title) }}</h3>
        <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>

        <div class="flex justify-center space-x-4">
          <BaseButton :label="confirmLabel" :variant="confirmVariant" @click="$emit('confirm')" />
          <BaseButton :label="cancelLabel" variant="secondary" @click="$emit('cancel')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseButton from '../atoms/BaseButton.vue'

export default defineComponent({
  name: 'ConfirmationModal',
  components: {
    BaseButton,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 't_components_confirmationModal_default_title',
    },
    message: {
      type: String,
      default: 't_components_confirmationModal_default_message',
    },
    confirmLabel: {
      type: String,
      default: 't_components_confirmationModal_confirm',
    },
    cancelLabel: {
      type: String,
      default: 't_components_confirmationModal_cancel',
    },
    confirmVariant: {
      type: String as () => 'primary' | 'secondary',
      default: 'primary',
    },
    icon: {
      type: String as () => 'warning' | 'question' | 'info' | 'none',
      default: 'question',
    },
  },
  emits: ['confirm', 'cancel'],
})
</script>
