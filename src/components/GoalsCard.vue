<template>
  <v-card elevation="10">
    <!-- Título del card -->
    <v-card-title
      class="mb-4 text-center text-main font-weight-bold bg-secondary"
      style="font-size: 1.4rem;"
    >
      <v-icon start icon="mdi-flag-checkered" />
      Objetivos Establecidos
    </v-card-title>

    <!-- Contenido: lista de objetivos con gráficos circulares -->
    <v-card-text>
      <v-row class="d-flex flex-wrap">
        <v-col
          cols="12"
          sm="6"
          :offset-sm="goalsHistory.length === 1 ? 3 : 0"
          v-for="(goalItem, index) in goalsHistory"
          :key="goalItem.type"
          class="pb-6"
        >
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="font-weight-bold">
              {{ goalItem.type === 'calories' ? 'Calorías' : 'Agua' }}: {{ goalItem.goal }}
              <span v-if="goalItem.type === 'water'"> litros</span>
              <span v-else> kcal</span>
            </span>
            <v-btn icon @click="deleteGoal(index)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <!-- PieChart muestra filled/total según tipo -->
          <PieChart
            :filled="goalItem.currentProgress"
            :total="goalItem.goal"
            :goalType="goalItem.type"
            class="mx-auto my-4"
            style="max-width: 160px;"
          />

          <div class="text-center font-weight-bold">
            {{ goalItem.currentProgress.toFixed(1) }}/{{ goalItem.goal }}
            <span v-if="goalItem.type === 'water'">L</span>
            <span v-else>kcal</span>
          </div>
        </v-col>

        <!-- Mensaje cuando no hay objetivos -->
        <v-col cols="12" v-if="!goalsHistory.length">
          <div class="text--disabled text-center">No hay objetivos aún</div>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Botón para agregar objetivo (hasta 2 objetivos) -->
    <v-card-actions class="justify-center">
      <v-btn
        v-if="goalsHistory.length < 2"
        class="border-sm bg-warning"
        @click="showDialog = true"
      >
        Agregar objetivo
      </v-btn>
    </v-card-actions>

    <!-- Dialog para crear nuevo objetivo -->
    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6">Agregar objetivo</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef" lazy-validation>
            <v-select
              v-model="selectedType"
              :items="availableTypeOptions"
              label="Tipo de objetivo"
              item-title="label"
              item-value="value"
              required
            />
            <v-text-field
              v-model.number="selectedGoal"
              label="Valor"
              type="number"
              min="1"
              :rules="[valueRule]"
              :suffix="selectedType === 'water' ? ' litros' : ' kcal'"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="handleAddGoal" :disabled="!canAdd">
            Agregar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar centrado en la parte superior -->
    <v-snackbar
      v-model="snackbar"
      :duration="5000"
      location="top"
      vertical-transition="slide-y-reverse-transition"
      class="mx-auto"
      color="success"
    >
      {{ snackbarText }}
      <template #actions>
        <v-btn text @click="snackbar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import PieChart from './PieChart.vue';
import eventBus from '../eventBus';

// Vuex store para obtener userId
const store = useStore();

// Reactive refs
const userId = ref(null);
const goalsHistory = ref([]);

// Snackbar
const snackbar = ref(false);
const snackbarText = ref('');

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

  // 1) Construir un mapa con los flags notified que teníamos previamente:
  const prevNotifiedMap = {};
  for (const oldItem of goalsHistory.value) {
    prevNotifiedMap[oldItem.type] = oldItem.notified;
  }

  try {
    // 2) Llamada al endpoint para obtener objetivos
    const res = await axios.get(`http://localhost:3000/api/goals/${userId.value}`);
    const data = res.data.goals || {};

    // 3) Generar nuevo arreglo de objetivos, copiando “notified” si existía
    const newArr = Object.keys(data).map((key) => ({
      type: key,
      goal: data[key],
      currentProgress: 0,
      // Si antes estaba notificado, lo mantenemos en true; si no, false.
      notified: prevNotifiedMap[key] === true
    }));

    goalsHistory.value = newArr;

    // 4) Para cada meta, pedir progreso y disparar notificador si corresponde
    for (const item of goalsHistory.value) {
      await fetchProgress(item);
    }
    console.log('[GoalsCard] Progreso recargado:', goalsHistory.value);

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
      // Llamada a endpoint de calorías diarias
      const { data } = await axios.get(
        'http://localhost:3000/api/foods/calories/daily',
        { params: { userId: userId.value, date } }
      );
      goalItem.currentProgress = data.totalCalories || 0;
    } else {
      // Llamada a endpoint de entradas de agua
      const { data } = await axios.get(
        `http://localhost:3000/api/water/entries?userId=${userId.value}`
      );
      const entries = data.entries || [];
      goalItem.currentProgress = entries.reduce(
        (sum, item) => sum + Number(item.liters),
        0
      );
    }

    // Si el progreso alcanza o supera la meta Y no se había notificado antes:
    if (
      goalItem.currentProgress >= goalItem.goal &&
      goalItem.notified === false
    ) {
      goalItem.notified = true;
      notifyGoalCompleted(goalItem);
    }

    const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
    if (
      justLoggedIn &&
      goalItem.currentProgress < goalItem.goal
    ) {
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
const notifyGoalCompleted = (goalItem) => {
  if (goalItem.type === 'calories') {
    snackbarText.value = `¡Felicidades! Has alcanzado tu objetivo de ${goalItem.goal} kcal.`;
  } else {
    snackbarText.value = `¡Genial! Has bebido ${goalItem.goal} L de agua.`;
  }
  snackbar.value = true;
};

const notifyGoalPending = (goalItem) => {
  if (goalItem.type === 'calories') {
    snackbarText.value = `⚠️ Tienes pendiente tu objetivo de ${goalItem.goal} kcal.`;
  } else {
    snackbarText.value = `⚠️ Aún no alcanzaste tu meta de ${goalItem.goal} L de agua.`;
  }
  snackbar.value = true;
};


/**
 * handleAddGoal(): Guarda un nuevo objetivo en el backend y lo agrega al arreglo
 * local con notified=false, luego dispara fetchProgress para este nuevo item.
 */
const handleAddGoal = async () => {
  if (!canAdd.value) return;

  try {
    await axios.post('http://localhost:3000/api/goals', {
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
const deleteGoal = (idx) => {
  goalsHistory.value.splice(idx, 1);
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
