<template>
  <v-card elevation="10">
    <v-card-title
      class="mb-4 text-center text-main font-weight-bold bg-secondary"
      style="font-size: 1.4rem;"
    >
      <v-icon start icon="mdi-flag-checkered" />
      Objetivos Establecidos
    </v-card-title>

    <v-card-text>
      <v-row class="d-flex flex-wrap">
        <v-col
          cols="12"
          sm="6"
          :offset-sm="goalsHistory.length === 1 ? 3 : 0"
          v-for="(goalItem, index) in goalsHistory"
          :key="index"
          class="pb-6"
        >
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="font-weight-bold">
              {{ goalItem.type === 'calories' ? 'Calorías' : 'Agua' }}:
              {{ goalItem.goal }}
              <span v-if="goalItem.type === 'water'"> litros</span>
              <span v-else> kcal</span>
            </span>
            <v-btn icon @click="deleteGoal(index)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <PieChart
            :filled="goalItem.currentProgress"
            :total="goalItem.goal"
            class="mx-auto my-4"
            style="max-width: 160px;"
          />

          <div class="text-center font-weight-bold">
            {{ goalItem.currentProgress.toFixed(1) }}/{{ goalItem.goal }}
            <span v-if="goalItem.type === 'water'">L</span>
            <span v-else>kcal</span>
          </div>
        </v-col>

        <v-col cols="12" v-if="!goalsHistory.length">
          <div class="text--disabled text-center">No hay objetivos aún</div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="justify-center">
      <v-btn
        v-if="goalsHistory.length < 2"
        class="border-sm bg-warning"
        @click="showDialog = true"
      >
        Agregar objetivo
      </v-btn>
    </v-card-actions>

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
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import PieChart from './PieChart.vue';

const store = useStore();
const userId = ref(null);
const goalsHistory = ref([]);
const showDialog = ref(false);
const selectedType = ref(null);
const selectedGoal = ref(null);

const typeOptions = [
  { label: 'Calorías', value: 'calories' },
  { label: 'Agua', value: 'water' }
];

const valueRule = v => v > 0 || 'El valor debe ser mayor a 0';
const availableTypeOptions = computed(() =>
  typeOptions.filter(opt => !goalsHistory.value.some(g => g.type === opt.value))
);
const canAdd = computed(
  () =>
    selectedType.value &&
    selectedGoal.value > 0 &&
    !goalsHistory.value.some(g => g.type === selectedType.value)
);

const fetchProgress = async goalItem => {
  try {
    const date = new Date().toISOString().slice(0, 10);
    if (goalItem.type === 'calories') {
      const { data } = await axios.get(
        'http://localhost:3000/api/foods/calories/daily',
        { params: { userId: userId.value, date } }
      );
      goalItem.currentProgress = data.totalCalories;
    } else {
      const { data } = await axios.get(
        'http://localhost:3000/api/water/daily',
        { params: { userId: userId.value, date } }
      );
      goalItem.currentProgress = data.totalLiters;
    }
  } catch (err) {
    console.error('Error al obtener progreso:', err);
  }
};

const fetchGoals = async () => {
  userId.value = store.state.main.user.userId;
  if (!userId.value) return;
  try {
    const res = await axios.get(
      `http://localhost:3000/api/goals/${userId.value}`
    );
    const data = res.data.goals || {};
    goalsHistory.value = Object.keys(data).map(key => ({
      type: key,
      goal: data[key],
      currentProgress: 0
    }));
    for (const item of goalsHistory.value) {
      await fetchProgress(item);
    }
  } catch (err) {
    console.error('Error al obtener objetivos:', err);
  }
};

const handleAddGoal = async () => {
  if (!canAdd.value) return;
  try {
    await axios.post('http://localhost:3000/api/goals', {
      userId: userId.value,
      type: selectedType.value,
      goal: selectedGoal.value
    });
    const newItem = {
      type: selectedType.value,
      goal: selectedGoal.value,
      currentProgress: 0
    };
    goalsHistory.value.unshift(newItem);
    await fetchProgress(newItem);
  } catch (err) {
    console.error('Error al guardar objetivo:', err);
  }
  showDialog.value = false;
  selectedType.value = null;
  selectedGoal.value = null;
};

const deleteGoal = idx => goalsHistory.value.splice(idx, 1);

onMounted(fetchGoals);
</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
