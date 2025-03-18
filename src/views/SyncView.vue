<template>
  <div class="container mx-auto p-4">
    <!-- Título de la vista de sincronización -->
    <h1 class="text-3xl font-bold mb-6 dark:text-white text-center">
      {{ $t('t_sync_title') }}
    </h1>

    <!-- Panel principal del formulario de sincronización -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <!-- Banner de advertencia -->
      <AlertBanner :show="true" :message="'t_sync_warning_banner'" icon="⚠️" />

      <!-- Formulario y última actualización -->
      <div class="mt-6">
        <div class="bg-gray-50 dark:bg-gray-700/50 p-4 md:p-6 rounded-lg">
          <!-- Instrucciones de sincronización -->
          <div class="text-gray-700 dark:text-gray-300 mb-4">
            {{ $t('t_sync_instruction_text') }}
          </div>

          <!-- Contenedor de formulario y última sincronización -->
          <div class="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6 items-center">
            <!-- Formulario de sincronización -->
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

            <!-- Última sincronización -->
            <div
              class="md:col-span-4 bg-white dark:bg-gray-700 p-4 md:p-5 rounded-lg shadow-sm flex items-center justify-center min-h-[120px]"
            >
              <!-- Indicador de carga -->
              <div v-if="loading || syncStore.syncInProgress" class="flex flex-col items-center">
                <LoadingIndicator size="lg" color="primary" :label="'t_sync_synchronizing'" />
              </div>

              <!-- Información de última sincronización -->
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

    <!-- Panel informativo de sincronización -->
    <InfoPanel
      :title="'t_sync_info_panel_title'"
      :items="syncInfoItems"
      :note="'t_sync_info_panel_note'"
    />

    <!-- Modal de confirmación de sincronización -->
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

/**
 * Vista de sincronización de datos
 *
 * Gestiona el proceso de actualización de datos financieros:
 * - Formulario de sincronización
 * - Información de última sincronización
 * - Modal de confirmación
 * - Panel informativo
 */
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
    // Referencia al formulario para reseteo
    const syncFormRef = ref<InstanceType<typeof CustomForm> | null>(null)

    // Items informativos para el panel
    const syncInfoItems = computed(() => [
      't_sync_info_item_1',
      't_sync_info_item_2',
      't_sync_info_item_3',
    ])

    // Lógica de sincronización desde composable
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

    // Función de confirmación personalizada con reseteo de formulario
    const confirmSync = async () => {
      const success = await originalConfirmSync()

      if (success && syncFormRef.value) {
        syncFormRef.value.resetForm()
      }

      return success
    }

    // Verificar sincronización incompleta al montar
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
