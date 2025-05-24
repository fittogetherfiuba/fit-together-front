<template>
  <v-container fluid class="d-flex align-center justify-center fill-height">
    <v-row justify="center" align="start">
      <v-col cols="12" sm="8" md="10">
        <v-col>
          <Goals />
        </v-col>    
        <v-row justify="center" align="start">
          <v-col cols="12" sm="4">
            <Exercises :exerciseList="exerciseList" />
          </v-col>
          <v-col cols="12" sm="4">
            <Meals :mealList="mealList" />
          </v-col>
          <v-col cols="12" sm="4">
            <Water />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Exercises from '../components/ExercisesCard.vue'
import Meals from '../components/MealsCard.vue'
import Water from '../components/WaterCard.vue'
import Goals from '../components/GoalsCard.vue'
const exerciseList = []
const mealList = []

</script>



