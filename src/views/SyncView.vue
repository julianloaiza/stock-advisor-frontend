<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 dark:text-white text-center">
      Actualización de Datos Financieros
    </h1>

    <!-- Panel principal del formulario -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <AlertBanner
        :show="true"
        message="Advertencia: Esta acción reemplazará completamente los datos actuales de instrumentos financieros en el sistema. Asegúrese de que desea proceder, ya que esta operación no se puede deshacer."
        icon="⚠️"
      />

      <!-- Formulario de sincronización y última actualización -->
      <div class="mt-6">
        <div class="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
          <div class="text-gray-700 dark:text-gray-300 mb-4">
            Por favor, ingrese el número de consultas que desea ejecutar. Cada consulta actualizará
            10 registros de acciones bursátiles en nuestra base de datos.
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Columna izquierda: Formulario -->
            <div class="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
              <CustomForm
                ref="syncFormRef"
                :config="syncFormConfig"
                @search="handleSyncSubmit"
                :disabled="loading || syncStore.syncInProgress"
              />
            </div>

            <!-- Columna derecha: Estado de sincronización -->
            <div
              class="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm flex items-center justify-center"
            >
              <div v-if="loading || syncStore.syncInProgress" class="flex flex-col items-center">
                <LoadingIndicator size="lg" color="primary" label="Sincronizando datos..." />
              </div>
              <div v-else class="w-full flex flex-col items-center justify-center">
                <div class="text-center mb-2 text-gray-700 dark:text-gray-300 font-medium">
                  Última sincronización
                </div>
                <div class="text-center text-gray-800 dark:text-gray-200">
                  {{
                    syncStore.lastSyncTime
                      ? new Date(syncStore.lastSyncTime).toLocaleString()
                      : 'No hay sincronizaciones recientes'
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
      title="Al presionar Sincronizar, el sistema llevará a cabo las siguientes acciones:"
      :items="syncInfoItems"
      note="Nota: Este proceso reemplazará todos los datos actuales con los nuevos registros obtenidos."
    />

    <!-- Modal de confirmación -->
    <ConfirmationModal
      :show="showModal"
      title="Confirmar Actualización de Datos"
      :message="`¿Confirma la actualización con ${syncParams.limit} consultas? Esto actualizará exactamente ${syncParams.limit * 10} registros y reemplazará completamente los datos actuales.`"
      confirmLabel="Continuar"
      cancelLabel="Cancelar"
      icon="warning"
      confirmVariant="primary"
      @confirm="confirmSync"
      @cancel="cancelSync"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
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
    const syncInfoItems = ref([
      'Eliminará por completo los datos financieros existentes en el sistema, asegurando que no quede información desactualizada.',
      'Establecerá una conexión directa con la fuente de datos externa para obtener la información más reciente y precisa.',
      'Importará nuevos registros de instrumentos financieros de manera selectiva, según el número de consultas especificado.',
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
