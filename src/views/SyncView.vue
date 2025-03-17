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

      <!-- Formulario de sincronización -->
      <div class="mt-6">
        <div class="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
          <div class="text-gray-700 dark:text-gray-300 mb-4">
            Por favor, ingrese el número de consultas que desea ejecutar. Cada consulta actualizará
            10 registros de acciones bursátiles en nuestra base de datos.
          </div>

          <div class="bg-white dark:bg-gray-700 p-5 rounded-lg shadow-sm">
            <CustomForm
              :config="syncFormConfig"
              @search="handleSyncSubmit"
              :disabled="loading || syncStore.syncInProgress"
            />
          </div>
        </div>
      </div>

      <!-- Estado de carga -->
      <div
        v-if="loading || syncStore.syncInProgress"
        class="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
      >
        <div class="flex items-center justify-center">
          <div class="relative w-8 h-8">
            <div
              class="absolute top-0 left-0 w-8 h-8 border-4 border-blue-200 dark:border-blue-900 rounded-full"
            ></div>
            <div
              class="absolute top-0 left-0 w-8 h-8 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"
            ></div>
          </div>
          <div class="ml-4">
            <p class="font-medium text-blue-700 dark:text-blue-300">Actualizando información</p>
            <p class="text-sm text-blue-600/70 dark:text-blue-400/70">
              El proceso puede tardar varios minutos.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel informativo -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div class="space-y-5 text-gray-700 dark:text-gray-300">
        <div class="border-l-4 border-gray-200 dark:border-gray-700 pl-4">
          <h3 class="font-semibold text-gray-800 dark:text-gray-200">
            Al presionar Sincronizar, el sistema llevará a cabo las siguientes acciones:
          </h3>
          <ul class="list-disc pl-5 mt-2 space-y-2">
            <li>
              Eliminará por completo los datos financieros existentes en el sistema, asegurando que
              no quede información desactualizada.
            </li>
            <li>
              Establecerá una conexión directa con la fuente de datos externa para obtener la
              información más reciente y precisa.
            </li>
            <li>
              Importará nuevos registros de instrumentos financieros de manera selectiva, según el
              número de consultas especificado.
            </li>
          </ul>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Nota: Este proceso reemplazará todos los datos actuales con los nuevos registros
            obtenidos.
          </p>

          <!-- Información de última sincronización si existe -->
          <div
            v-if="syncStore.lastSyncTime"
            class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <p class="text-sm">
              <span class="font-medium">Última sincronización:</span>
              {{ formattedLastSyncTime }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <ConfirmationModal
      :show="showModal"
      title="Confirmar Actualización de Datos"
      :message="`¿Confirma la actualización con ${syncParams.limit || 1} consultas? Esto actualizará exactamente ${(syncParams.limit || 1) * 10} registros y reemplazará completamente los datos actuales.`"
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
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import { syncFormConfig } from '@/config/syncConfig'
import { syncStocks } from '@/api/services/stockService'
import { useNotificationStore } from '@/stores/notificationStore'
import { useSyncStore } from '@/stores/syncStore'
import CustomForm from '@/components/molecules/CustomForm.vue'
import AlertBanner from '@/components/atoms/AlertBanner.vue'
import ConfirmationModal from '@/components/molecules/ConfirmationModal.vue'
import type { FormData } from '@/interfaces/BaseForm.interface'

export default defineComponent({
  name: 'SyncView',
  components: {
    CustomForm,
    AlertBanner,
    ConfirmationModal,
  },
  setup() {
    // Stores
    const notificationStore = useNotificationStore()
    const syncStore = useSyncStore()

    // Estado del formulario
    const syncParams = reactive<{ limit?: number }>({
      limit: 1,
    })

    // Estados para UI
    const loading = ref(false)
    const showModal = ref(false)

    // Formatear la fecha de última sincronización
    const formattedLastSyncTime = computed(() => {
      if (!syncStore.lastSyncTime) return ''

      try {
        return new Date(syncStore.lastSyncTime).toLocaleString()
      } catch (e) {
        console.error('Error formateando fecha:', e)
        return 'Fecha no disponible'
      }
    })

    // Al montar el componente, verificar si hay una sincronización en curso
    onMounted(() => {
      // Si hay una sincronización marcada como en curso pero la página se recargó,
      // resetear el estado para evitar que quede en estado inconsistente
      if (syncStore.syncInProgress) {
        syncStore.startSync() // Reseteamos el estado
        syncStore.completeSync(false) // Marcamos como fallida
        notificationStore.addNotification(
          'La sincronización anterior no se completó correctamente. Por favor intente nuevamente.',
          'warning',
        )
      }
    })

    // Manejar envío del formulario (muestra el modal de confirmación)
    const handleSyncSubmit = (formData: FormData) => {
      // Obtener y validar el limit - simplificado
      const limitValue = formData.limit
      const limit =
        typeof limitValue === 'string'
          ? parseInt(limitValue.trim(), 10)
          : typeof limitValue === 'number'
            ? limitValue
            : undefined

      // Validar que sea un número válido
      if (!limit || isNaN(limit) || limit < 1) {
        notificationStore.addNotification('Por favor ingrese un número válido mayor a 0', 'error')
        return
      }

      // Guardar el valor para usarlo en la confirmación
      syncParams.limit = limit

      // Mostrar modal de confirmación
      showModal.value = true
    }

    // Confirmar sincronización (después de aceptar en el modal)
    const confirmSync = async () => {
      // Cerrar modal
      showModal.value = false

      // Activar estado de carga local y global
      loading.value = true
      syncStore.startSync()

      try {
        // Llamar al servicio de sincronización
        const response = await syncStocks(syncParams.limit)

        // Actualizar el estado de sincronización como completado exitosamente
        const success = syncStore.completeSync(true)

        // Añadir notificación manualmente para evitar dependencia circular
        if (success) {
          notificationStore.addNotification(
            'La sincronización se ha completado exitosamente. Por favor actualice la vista de datos.',
            'success',
          )
        }

        return response
      } catch (error) {
        // Determinar mensaje de error específico
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

        // Actualizar el estado de sincronización como fallido
        syncStore.completeSync(false)

        // Añadir notificación manualmente
        notificationStore.addNotification(
          `Error durante la sincronización: ${errorMessage}. Por favor intente nuevamente.`,
          'error',
        )

        console.error('Error en sincronización:', error)
      } finally {
        // Desactivar estado de carga local
        loading.value = false
      }
    }

    // Cancelar sincronización
    const cancelSync = () => {
      showModal.value = false
    }

    return {
      syncFormConfig,
      syncParams,
      loading,
      showModal,
      notificationStore,
      syncStore,
      formattedLastSyncTime,
      handleSyncSubmit,
      confirmSync,
      cancelSync,
    }
  },
})
</script>
