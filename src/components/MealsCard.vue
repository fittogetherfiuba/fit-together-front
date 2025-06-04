<!-- src/components/MealsCard.vue -->
<template>
  <v-card class="pb-4 mt-4" elevation="10">
    <v-card-title class="mb-4 text-center font-weight-bold bg-secondary" style="font-size: 1.4rem;">
      <v-icon start icon="mdi-food-drumstick" />
      Alimentos consumidos
    </v-card-title>

    <v-card-text>
      <v-list>
        <span
          class="d-flex text-h6 justify-center font-weight-bold"
          v-if="mealHistory.length === 0"
        >
          No hay alimentos registrados
        </span>
        <v-list-item
          class="border-b"
          v-for="(meal, index) in mealHistory"
          @click="handleMealInfo(meal)"
          :key="index"
        >
          <v-list-item-title class="font-weight-bold">
            {{ meal.foodName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <span>Cantidad: {{ meal.grams }}g - </span>
            <span>Calorías: {{ meal.calories }}</span>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-card-actions class="justify-center">
      <v-btn class="border-sm bg-warning font-weight-bold" @click="showDialog = true">
        Agregar comida
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="showDialog" max-width="450px" @after-leave="closeDialog">
      <v-card>
        <!-- Título -->
        <v-card-title class="pa-0">
          <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
            <v-col class="d-flex justify-center align-center">
              <v-icon start icon="mdi-food-drumstick"></v-icon>
              <span class="text-h6 font-weight-bold">Agregar comida</span>
            </v-col>
          </v-row>
        </v-card-title>

        <!-- Contenido del formulario -->
        <v-card-text class="pt-6 pb-3 d-flex justify-center">
          <v-form class="w-75" ref="form">
            <v-row dense>
              <v-col cols="12">
                <v-autocomplete
                  v-model="selectedPeriod"
                  :items="mealPeriods"
                  label="Periodo"
                  return-object
                  :rules="[rules.required]"
                  clearable
                  variant="outlined"
                  item-title="name"
                  :menu-props="{ maxHeight: '200px' }"
                />
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="selectedMeal"
                  :items="mealList"
                  label="Comida"
                  return-object
                  :rules="[rules.required]"
                  clearable
                  variant="outlined"
                  item-title="name"
                  :menu-props="{ maxHeight: '200px' }"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="grams"
                  :rules="[rules.foodRequired]"
                  variant="outlined"
                  label="Cantidad (gramos)"
                  type="number"
                  min="0"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <!-- Botones de acción -->
        <v-card-actions class="pb-4">
          <v-row justify="center" class="w-100">
            <v-col cols="auto">
              <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialog">
                Cancelar
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn class="border-sm bg-warning font-weight-bold" @click="handleAddMeal">
                Agregar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="showFoodInfo" max-width="450px" @after-leave="closeFoodInfo">
      <v-card class="d-flex align-center">
        <v-card-title class="pa-0 w-100">
          <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
            <v-col>
              <span class="text-h6 font-weight-bold">{{ selectedMealInfo ? selectedMealInfo.foodName : '' }}</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="w-75">
          <p><strong>Periodo: </strong> {{ selectedMealInfo.period }}</p>
          <p><strong>Cantidad: </strong> {{ selectedMealInfo.grams }}g</p>
          <p><strong>Calorias: </strong> {{ selectedMealInfo.calories }}</p>
          <br/>
          <p class="font-weight-bold mb-2 text-center">Nutrientes </p>
          <v-data-table
            class="border-md"
            :items="selectedMealInfo.nutrients"
            :headers="headers"
            hide-default-header
            hide-default-footer
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import eventBus from '../eventBus'; // <-- IMPORTA el bus

const store = useStore();

const mealList = ref([]);
const mealHistory = ref([]);
const mealPeriods = [
  { name: 'Desayuno' },
  { name: 'Almuerzo' },
  { name: 'Merienda' },
  { name: 'Cena' },
];
const showDialog = ref(false);
const showFoodInfo = ref(false);
const selectedPeriod = ref(null);
const selectedMeal = ref(null);
const selectedMealInfo = ref(null);
const grams = ref('');
const formRef = ref(null);

const headers = [
  { title: 'Nutriente', value: 'name' },
  { title: 'Cantidad', value: 'amount' },
];

const rules = {
  required: (value) => !!value || 'Debe ingresar una comida',
  foodRequired: (value) => !!value || 'Debe ingresar una cantidad de comida',
};

const closeDialog = () => {
  showDialog.value = false;
  selectedMeal.value = null;
  selectedPeriod.value = null;
  grams.value = '';
};
const closeFoodInfo = () => {
  selectedMealInfo.value = null;
  showFoodInfo.value = false;
};

const fetchMeals = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/foods');
    mealList.value = response.data;
  } catch (error) {
    console.error('Error al obtener comidas:', error);
  }
};

const fetchEatenMeals = async () => {
  try {
    const userId = store.state.main.user.userId;
    const response = await axios.get(
      `http://localhost:3000/api/foods/entry/${userId}`
    );
    mealHistory.value = response.data.entries;
  } catch (error) {
    console.error('Error al obtener comidas consumidas:', error);
    mealHistory.value = [];
  }
};

const handleAddMeal = async () => {
  // Validar formulario
  const isValid = formRef.value?.validate();
  if (!isValid) return;

  if (selectedMeal.value && grams.value) {
    try {
      const userId = store.state.main.user.userId;
      await axios.post('http://localhost:3000/api/foods/entry', {
        userId,
        foodName: selectedMeal.value.name,
        grams: Number(grams.value),
        period: selectedPeriod.value.name,
        consumedAt: new Date().toISOString(),
      });

      // 1) Actualiza histórico local
      await fetchEatenMeals();

      // 2) Emite evento global para actualizar GoalsCard
      eventBus.emit('progress-updated');
      console.log('[MealsCard] Emitido progress-updated tras agregar comida');
    } catch (error) {
      console.error('Error al agregar comida:', error);
    }
    closeDialog();
  }
};

const handleMealInfo = (meal) => {
  selectedMealInfo.value = meal;
  showFoodInfo.value = true;
};

// Carga inicial
fetchMeals();
fetchEatenMeals();
</script>

<style scoped>
/* Estilos opcionales */
</style>
