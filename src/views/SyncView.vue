<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 dark:text-white text-center">
      {{ $t('t_sync_title') }}
    </h1>

    <!-- Panel principal del formulario -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <AlertBanner :show="true" :message="'t_sync_warning_banner'" icon="⚠️" />

      <!-- Formulario de sincronización y última actualización -->
      <div class="mt-6">
        <div class="bg-gray-50 dark:bg-gray-700/50 p-4 md:p-6 rounded-lg">
          <div class="text-gray-700 dark:text-gray-300 mb-4">
            {{ $t('t_sync_instruction_text') }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6 items-center">
            <!-- Contenedor del formulario con flex para centrado -->
            <div
              class="md:col-span-6 bg-white dark:bg-gray-700 p-4 md:p-5 rounded-lg shadow-sm flex items-center min-h-[120px]"
            >
              <CustomForm
                ref="syncFormRef"
                :config="syncFormConfig"
                @search="handleSyncSubmit"
                :disabled="loading || syncStore.syncInProgress"
                class="w-full"
              />
            </div>

            <!-- Contenedor de la última sincronización -->
            <div
              class="md:col-span-4 bg-white dark:bg-gray-700 p-4 md:p-5 rounded-lg shadow-sm flex items-center justify-center min-h-[120px]"
            >
              <div v-if="loading || syncStore.syncInProgress" class="flex flex-col items-center">
                <LoadingIndicator size="lg" color="primary" :label="'t_sync_synchronizing'" />
              </div>
              <div v-else class="w-full flex flex-col items-center justify-center">
                <div class="text-center mb-2 text-gray-700 dark:text-gray-300 font-medium">
                  {{ $t('t_sync_last_sync_title') }}
                </div>
                <div class="text-center text-gray-800 dark:text-gray-200">
                  {{
                    syncStore.lastSyncTime
                      ? new Date(syncStore.lastSyncTime).toLocaleString()
                      : $t('t_sync_no_recent_sync')
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel informativo -->
    <InfoPanel
      :title="'t_sync_info_panel_title'"
      :items="syncInfoItems"
      :note="'t_sync_info_panel_note'"
    />

    <!-- Modal de confirmación -->
    <ConfirmationModal
      :show="showModal"
      :title="'t_sync_confirm_modal_title'"
      :message="
        $t('t_sync_confirm_modal_message', {
          limit: syncParams.limit,
          total: syncParams.limit * 10,
        })
      "
      :confirmLabel="'t_common_continue'"
      :cancelLabel="'t_common_cancel'"
      icon="warning"
      confirmVariant="primary"
      @confirm="confirmSync"
      @cancel="cancelSync"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import { syncFormConfig } from '@/config/syncConfig'
import { useSync } from '@/composables/useSync'
import CustomForm from '@/components/molecules/CustomForm.vue'
import AlertBanner from '@/components/atoms/AlertBanner.vue'
import ConfirmationModal from '@/components/molecules/ConfirmationModal.vue'
import InfoPanel from '@/components/atoms/InfoPanel.vue'
import LoadingIndicator from '@/components/atoms/LoadingIndicator.vue'

export default defineComponent({
  name: 'SyncView',
  components: {
    CustomForm,
    AlertBanner,
    ConfirmationModal,
    InfoPanel,
    LoadingIndicator,
  },
  setup() {
    // Referencia al formulario para poder acceder a sus métodos
    const syncFormRef = ref<InstanceType<typeof CustomForm> | null>(null)

    // Lista de información para el panel informativo
    const syncInfoItems = computed(() => [
      't_sync_info_item_1',
      't_sync_info_item_2',
      't_sync_info_item_3',
    ])

    // Utilizar el composable para toda la lógica de sincronización
    const {
      loading,
      showModal,
      syncParams,
      syncStore,
      handleSyncSubmit,
      confirmSync: originalConfirmSync,
      cancelSync,
      checkIncompleteSync,
    } = useSync()

    // Personalizar la función confirmSync para resetear el formulario después de una sincronización exitosa
    const confirmSync = async () => {
      const success = await originalConfirmSync()

      if (success && syncFormRef.value) {
        // Resetear el formulario después de una sincronización exitosa
        syncFormRef.value.resetForm()
      }

      return success
    }

    // Al montar el componente, verificar si hay una sincronización en curso
    onMounted(() => {
      checkIncompleteSync()
    })

    return {
      syncFormRef,
      syncFormConfig,
      syncParams,
      syncInfoItems,
      loading,
      showModal,
      syncStore,
      handleSyncSubmit,
      confirmSync,
      cancelSync,
    }
  },
})
</script>
