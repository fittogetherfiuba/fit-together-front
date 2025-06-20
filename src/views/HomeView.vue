<template>
  <v-container fluid class="d-flex align-center justify-center fill-height">
    <v-row align="center" justify="center">
      <v-col cols="10">
        <v-row align="center" justify="center">
          <v-col cols="3" offset="0">
            <Goals />
          </v-col> 
          <v-col cols="4">
            <Exercises />
          </v-col>
          <v-col cols="4">
            <Meals />
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

</script>



