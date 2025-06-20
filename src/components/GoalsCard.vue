<template>
  <v-card class="pb-10 mt-4" elevation="10" height="670">
    <v-card-title class="bg-secondary text-white py-3 px-4">
      <v-row no-gutters class="align-center justify-space-between">
        <v-col cols="auto" class="d-flex align-center">
          <v-icon class="mr-2">mdi-flag-checkered</v-icon>
          <span style="font-size: 1.5rem;" class="font-weight-bold">Objetivos</span>
        </v-col>
        <v-btn :disabled="goalsHistory.length === 2" size="small" icon variant="tonal" color="white" @click="showDialog = true">
          <v-icon size="x-large">mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </v-card-title>

    <v-card-text class="fill-height mt-2">
      <v-row class="justify-center align-center fill-height">
        <v-col
          cols="12"
          v-for="(goalItem, index) in goalsHistory"
          :key="goalItem.type"
          class="justify-center align-center"
        >
          <div class="d-flex justify-space-between align-center mx-10">
            <span class="font-weight-bold">
              {{ goalItem.type === 'calories' ? 'Calorías' : 'Agua' }}: {{ goalItem.goal }}
              <span v-if="goalItem.type === 'water'"> litros</span>
              <span v-else> kcal</span>
            </span>
            <v-btn size="small" icon @click="deleteGoal(index)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <PieChart
            :filled="goalItem.currentProgress"
            :total="goalItem.goal"
            :goalType="goalItem.type"
            class="mx-auto my-3"
            style="max-width: 160px;"
          />

          <div class="text-center font-weight-bold">
            {{ goalItem.currentProgress.toFixed(1) }}/{{ goalItem.goal }}
            <span v-if="goalItem.type === 'water'">L</span>
            <span v-else>kcal</span>
          </div>

        </v-col>

        <v-col cols="12" v-if="!goalsHistory.length">
          <v-card elevation="0" class="d-flex align-center justify-center">
            <v-row justify="center">
              <v-col cols="12" class="text-center">
                <v-icon color="grey" size="90">mdi-star-off-outline</v-icon>
                <div style="font-size: 20px;" class="font-weight-bold mt-2">No hay objetivos</div>
                <div style="font-size: 20px;" class="font-weight-bold">definidos</div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      
    </v-card-text>
    

    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title class="pa-0">
          <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
            <v-col class="d-flex justify-center align-center">
              <v-icon start icon="mdi-flag-checkered"></v-icon>
              <span class="text-h6 font-weight-bold">Agregar objetivo</span>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text class="pt-6 pb-3 d-flex justify-center">
          <v-form ref="formRef" lazy-validation>
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="selectedType"
                  :items="availableTypeOptions"
                  label="Tipo de objetivo"
                  item-title="label"
                  item-value="value"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="selectedGoal"
                  label="Valor"
                  type="number"
                  min="1"
                  :rules="[valueRule]"
                  :suffix="selectedType === 'water' ? ' litros' : ' kcal'"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-row justify="center" class="w-100">
            <v-col cols="auto">
              <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialog">
                Cancelar
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                class="border-sm bg-warning font-weight-bold"
                :disabled="!canAdd"
                @click="handleAddGoal"
              >
                Agregar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>

      </v-card>
    </v-dialog>

    
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import PieChart from './PieChart.vue';
import eventBus from '../eventBus';
const API_URL = import.meta.env.VITE_APP_API_URL;
const store = useStore();

// Reactive refs
const userId = ref(null);
const goalsHistory = ref([]);

// Dialog y campos para agregar objetivo
const showDialog = ref(false);
const selectedType = ref(null);
const selectedGoal = ref(null);
const formRef = ref(null);

// Opciones de tipo de objetivo
const typeOptions = [
  { label: 'Calorías', value: 'calories' },
  { label: 'Agua', value: 'water' }
];

// Regla para validar que valor > 0
const valueRule = (v) => (v > 0) || 'El valor debe ser mayor a 0';

// Computed de opciones disponibles (evita duplicar tipo de objetivo)
const availableTypeOptions = computed(() =>
  typeOptions.filter(opt => !goalsHistory.value.some(g => g.type === opt.value))
);

// El botón “Agregar” solo habilitado si hay tipo + valor válido + no existe ya ese tipo
const canAdd = computed(() =>
  selectedType.value &&
  selectedGoal.value > 0 &&
  !goalsHistory.value.some(g => g.type === selectedType.value)
);

/**
 * fetchGoals(): Recupera lista de objetivos del backend y mergea el flag `notified`.
 * Mantiene el estado `notified` de cada tipo de objetivo si ya existía.
 */
const fetchGoals = async () => {
  userId.value = store.state.main.user.userId;
  if (!userId.value) return;

  try {
    const res = await axios.get(API_URL + `goals/${userId.value}`);
    const data = res.data.goals || {};

    // Ahora cada meta trae su value y notified
    const newArr = Object.entries(data).map(([type, goalData]) => ({
      type,
      goal: goalData.value,
      notified: goalData.notified,
      currentProgress: 0
    }));

    goalsHistory.value = newArr;

    for (const item of goalsHistory.value) {
      await fetchProgress(item);
    }
    if (sessionStorage.getItem('justLoggedIn') === 'true') {
      sessionStorage.removeItem('justLoggedIn');
    }
    
  } catch (err) {
    console.error('[GoalsCard] Error al obtener objetivos:', err);
    goalsHistory.value = [];
  }
};


/**
 * fetchProgress(goalItem): Obtiene progreso diario de calorías o agua y
 * actualiza goalItem.currentProgress. Si se cumple la meta y notificado==false,
 * marca notificado=true y llama a notifyGoalCompleted().
 */
const fetchProgress = async (goalItem) => {
  try {
    const date = new Date().toISOString().slice(0, 10);

    if (goalItem.type === 'calories') {
      const { data } = await axios.get(
        API_URL + 'foods/calories/daily',
        { params: { userId: userId.value, date } }
      );
      goalItem.currentProgress = data.totalCalories || 0;
    } else {
      const { data } = await axios.get(
        API_URL + `water/entries?userId=${userId.value}`
      );
      const entries = data.entries || [];
      goalItem.currentProgress = entries.reduce((sum, item) => sum + Number(item.liters), 0);
    }

    if (
      goalItem.currentProgress >= goalItem.goal &&
      goalItem.notified === false
    ) {
      goalItem.notified = true;
      notifyGoalCompleted(goalItem);

      // Marcar como notificado en backend
      await axios.post(API_URL + 'goals/mark-notified', {
        userId: userId.value,
        type: goalItem.type
      });
    }

    const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
    if (justLoggedIn && goalItem.currentProgress < goalItem.goal) {
      notifyGoalPending(goalItem);
    }

  } catch (err) {
    console.error('[GoalsCard] Error al obtener progreso:', err);
    goalItem.currentProgress = 0;
  }
};

/**
 * notifyGoalCompleted(goalItem): Prepara el texto según tipo de objetivo
 * y activa el snackbar.
 */
const notifyGoalCompleted = async (goalItem) => {
  try{
    const notificationMessage = goalItem.type === 'calories'
      ? `✅ ¡Felicidades! Has alcanzado tu objetivo de ${goalItem.goal} kcal.`
      : `✅ ¡Genial! Has bebido ${goalItem.goal} L de agua.`;

    const notification = {
      user_id: userId.value,
      message: notificationMessage,
    };
  
    await axios.post('http://localhost:3000/api/notifications/create', notification)
    eventBus.emit('new-notification');
  }catch (error) {
    console.error('Error al enviar notificación:', error);
  }
};

const notifyGoalPending = async (goalItem) => {
  try{
    const notificationMessage = goalItem.type === 'calories'
      ? `⚠️ Tienes pendiente tu objetivo de ${goalItem.goal} kcal.`
      : `⚠️ Aún no alcanzaste tu meta de ${goalItem.goal} L de agua.`;

    const notification = {
      user_id: userId.value,
      message: notificationMessage,
    };
  
    await axios.post('http://localhost:3000/api/notifications/create', notification)
    eventBus.emit('new-notification');
  }catch (error) {
    console.error('Error al enviar notificación:', error);
  }
};


/**
 * handleAddGoal(): Guarda un nuevo objetivo en el backend y lo agrega al arreglo
 * local con notified=false, luego dispara fetchProgress para este nuevo item.
 */
const handleAddGoal = async () => {
  if (!canAdd.value) return;

  try {
    await axios.post(API_URL + 'goals', {
      userId: userId.value,
      type: selectedType.value,
      goal: selectedGoal.value
    });

    // Crear objeto local con notified:false
    const newItem = {
      type: selectedType.value,
      goal: selectedGoal.value,
      currentProgress: 0,
      notified: false
    };
    // Agregar al inicio del arreglo
    goalsHistory.value.unshift(newItem);
    // Cargar progreso inmediatamente (para notificar si ya lo alcanzó de alguna forma)
    await fetchProgress(newItem);

    // Emitir evento para que otras partes (si aplican) recarguen datos
    eventBus.emit('progress-updated');
  } catch (err) {
    console.error('[GoalsCard] Error al guardar objetivo:', err);
  }

  closeDialog();
};

/**
 * deleteGoal(idx): Elimina del arreglo local. No estamos llamando al backend,
 * asumo que la persistencia se maneja en otro lado si hace falta.
 */
const deleteGoal = async (idx) => {
  const goalItem = goalsHistory.value[idx];
  try {
    await axios.delete(API_URL + 'goals', {
      data: {
        userId: userId.value,
        type: goalItem.type
      }
    });

    goalsHistory.value.splice(idx, 1);
    eventBus.emit('progress-updated'); // opcional
  } catch (err) {
    console.error('[GoalsCard] Error al eliminar objetivo:', err);
  }
};

const closeDialog = () => {
  showDialog.value = false;
  selectedType.value = null;
  selectedGoal.value = null;
};

// ------------------------
// Ciclo de vida
// ------------------------
onMounted(() => {
  fetchGoals();
  // Suscribir fetchGoals al evento “progress-updated”
  eventBus.on('progress-updated', fetchGoals);
});
onBeforeUnmount(() => {
  eventBus.off('progress-updated', fetchGoals);
});
</script>

<style scoped>
/* Remover flechas de input number en browsers */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
