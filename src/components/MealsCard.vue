<template>
  <v-card class="pa-4 mt-4" elevation="10">
    <v-card-title class="text-h5 text-center">Alimentos consumidos</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item class="border-b" v-for="(meal, index) in mealHistory" :key="index">
          <v-list-item-title class="font-weight-bold">{{ meal.meal.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn class="border-sm bg-warning" @click="showDialog = true">Agregar comida</v-btn>
    </v-card-actions>

    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title><span class="text-h6">Agregar comida</span></v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="selectedMeal"
            :items="props.mealList"
            label="Comida"
            prepend-icon="mdi-magnify"
            return-object
            autofocus
            item-title="name"
            :menu-props="{ maxHeight: '200px' }"
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="handleAddMeal">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
//import { Axios } from 'axios'

const props = defineProps(['mealList'])
// const mealList = ref([])
const mealHistory = ref([])

const showDialog = ref(false)
const selectedMeal = ref(null)

function handleAddMeal() {
  if (selectedMeal.value) {
    mealHistory.value.push({ meal: selectedMeal.value })
    closeDialog()
  }
}

function closeDialog() {
  showDialog.value = false
  selectedMeal.value = null
}

/* async function fetchEatenMeals() {
  try {
    const response = await axios.get('http://localhost:3000/api/user/dashboard')
    mealHistory.value = response.data
  } catch (error) {
    console.error('Error al obtener comidas:', error)
  }
}

async function fetchMeals() {
  try {
    const response = await axios.get('http://localhost:3000/api/user/dashboard')
    mealList.value = response.data
  } catch (error) {
    console.error('Error al obtener comidas:', error)
  }
}

onMounted(() => {
  // fetchEatenMeals()
  // fetchMeals()
}) */

</script>
