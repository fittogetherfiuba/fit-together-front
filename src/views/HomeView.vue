<template>
  <v-container fluid class="d-flex align-center justify-center fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <Exercises :exerciseList="exerciseList" />
        <Meals :mealList="mealList" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Exercises from '../components/ExercisesCard.vue'
import Meals from '../components/MealsCard.vue'

const exerciseList = []
const mealList = []

</script>


