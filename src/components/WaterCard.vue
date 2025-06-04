<template>
  <v-card class="pb-4 mt-4" elevation="10">
    <!-- Título -->
    <v-card-title
      class="mb-4 text-center font-weight-bold bg-secondary"
      style="font-size: 1.4rem;"
    >
      <v-icon start icon="mdi-water" />
      Agua consumida
    </v-card-title>

    <!-- Muestra la cantidad total de agua consumida -->
    <v-card-text
      class="font-weight-medium text-h4 d-flex justify-center"
      style="font-size: 1.2rem;"
    >
      {{ waterHistory }} {{ waterHistory === 1 ? 'litro' : 'litros' }}
    </v-card-text>

    <!-- Botón para abrir el diálogo -->
    <v-card-actions class="justify-center">
      <v-btn
        class="border-sm font-weight-bold bg-warning"
        @click="showDialog = true"
      >
        Agregar agua
      </v-btn>
    </v-card-actions>

    <!-- Diálogo para ingresar nueva cantidad de agua -->
    <v-dialog v-model="showDialog" max-width="450px">
      <v-card class="d-flex align-center">
        <v-card-title class="pa-0 w-100">
          <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
            <v-col class="d-flex justify-center align-center">
              <v-icon start icon="mdi-water"></v-icon>
              <span class="text-h6 font-weight-bold">Agregar agua</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-8 pb-3 w-75">
          <v-form ref="form">
            <v-text-field :rules="[rules.required]" variant="outlined" v-model="waterQuantity" label="Cantidad (litros)" type="number" min="0" />
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-4 justify-end">
          <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialog">Cancelar</v-btn>
          <v-btn class="border-sm bg-warning font-weight-bold" @click="handleAddWater">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import eventBus from '../eventBus'; // <-- Mitt EventBus

// 1) Configuración de reactividad
const store = useStore();
const waterHistory = ref(0);
const showDialog = ref(false);
const waterQuantity = ref(null);
const formRef = ref(null);

// 2) Reglas de validación del formulario
const rules = {
  required: (value) => !!value || 'Debe ingresar una cantidad de agua',
};

// 3) Cerrar el diálogo y limpiar campo
const closeDialog = () => {
  showDialog.value = false;
  waterQuantity.value = null;
};

// 4) Función para obtener la suma total de agua consumida
const fetchConsumedWater = async () => {
  try {
    const userId = store.state.main.user.userId;
    if (!userId) return;
    const response = await axios.get(
      `http://localhost:3000/api/water/entries?userId=${userId}`
    );
    const waterEntries = response.data.entries || [];
    // Sumamos todos los litros registrados
    waterHistory.value = waterEntries.reduce(
      (total, entry) => total + Number(entry.liters),
      0
    );
  } catch (error) {
    console.error('[WaterCard] Error al obtener agua consumida:', error);
  }
};

// 5) Función que se dispara al hacer clic en "Agregar" dentro del diálogo
const handleAddWater = async () => {
  // 5.1) Validar formulario
  const isValid = formRef.value?.validate();
  if (!isValid) return;

  // 5.2) Si hay cantidad válida, enviamos POST al backend
  if (waterQuantity.value !== null && waterQuantity.value > 0) {
    try {
      const userId = store.state.main.user.userId;
      await axios.post('http://localhost:3000/api/water/entry', {
        userId,
        liters: Number(waterQuantity.value),
      });

      // 5.3) Recalcular el total local
      await fetchConsumedWater();

      // 5.4) Emitir evento para que GoalsCard se actualice
      eventBus.emit('progress-updated');
      console.log('[WaterCard] Emitido "progress-updated" tras agregar agua');
    } catch (error) {
      console.error('[WaterCard] Error al agregar agua:', error);
    }
    // 5.5) Cerrar diálogo y limpiar
    closeDialog();
  }
};

// 6) Carga inicial: traer el total al montar el componente
onMounted(() => {
  fetchConsumedWater();
});
</script>

<style scoped>
/* Quitar spinner nativo en inputs numéricos si lo deseas */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
