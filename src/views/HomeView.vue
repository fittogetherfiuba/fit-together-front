<template>
  <v-container fluid class="d-flex align-center justify-center fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <Exercises :exerciseList="exerciseList" />
        <Meals :mealList="mealList" />
        <Goals />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Exercises from '../components/ExercisesCard.vue'
import Meals from '../components/MealsCard.vue'
import Goals from '../components/GoalsCard.vue'

/*
const exerciseList = [
  { name: 'Correr' },
  { name: 'Caminar' },
  { name: 'Nadar' },
  { name: 'Bicicleta' },
  { name: 'Sentadillas' },
  { name: 'Flexiones' },
  { name: 'Plancha' },
  { name: 'Burpees' },
  { name: 'Abdominales' },
  { name: 'Yoga' },
]

const mealList = [
  { name: 'Ensalada' },
  { name: 'Pollo a la plancha' },
  { name: 'Pasta integral' },
  { name: 'Frutas' },
  { name: 'Pescado al horno' },
  { name: 'Arroz integral' },
  { name: 'Legumbres' },
  { name: 'Batido de proteínas' },
]
*/
</script>


