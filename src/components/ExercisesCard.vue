<template>
  <v-card class="pa-4" elevation="10">
    <v-card-title class="text-h5 text-center text-main">Actividades Realizadas</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item class="border-b" v-for="(activity, index) in exerciseHistory" :key="index">
          <v-list-item-title class="font-weight-bold">
            {{ activity.exercise.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            Duración: {{ activity.duracion || 'N/A' }} min ·
            Distancia: {{ activity.distancia || 'N/A' }} km ·
            Series: {{ activity.series || 'N/A' }} ·
            Repeticiones: {{ activity.repeticiones || 'N/A' }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn class="border-sm bg-warning" @click="showDialog = true">Agregar actividad</v-btn>
    </v-card-actions>

    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title><span class="text-h6">Agregar actividad física</span></v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="selectedExercise"
            :items="props.exerciseList"
            label="Ejercicio"
            prepend-icon="mdi-magnify"
            return-object
            autofocus
            item-title="name"
            :menu-props="{ maxHeight: '200px' }"
          />
          <v-text-field v-model="duration" label="Duración (minutos)" type="number" min="0" />
          <v-text-field v-model="distance" label="Distancia (km)" type="number" min="0" />
          <v-text-field v-model="sets" label="Series" type="number" min="0" />
          <v-text-field v-model="reps" label="Repeticiones" type="number" min="0" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="handleAddExercise">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
//import { Axios } from 'axios'

const props = defineProps(['exerciseList'])
//const exerciseList = ref([])
const exerciseHistory = ref([])

const showDialog = ref(false)
const selectedExercise = ref(null)
const duration = ref('')
const distance = ref('')
const sets = ref('')
const reps = ref('')

function handleAddExercise() {
  if (selectedExercise.value) {
    const newExercise = {
      exercise: selectedExercise.value,
      duracion: duration.value,
      distancia: distance.value,
      series: sets.value,
      repeticiones: reps.value,
    }
    exerciseHistory.value.push(newExercise)
    closeDialog()
  }
}

function closeDialog() {
  showDialog.value = false
  selectedExercise.value = null
  duration.value = ''
  distance.value = ''
  sets.value = ''
  reps.value = ''
}

/* async function fetchDoneExercises() {
  try {
    const response = await axios.get('http://localhost:3000/api/user/dashboard')
    exerciseHistory.value = response.data
  } catch (error) {
    console.error('Error al obtener actividades:', error)
  }
}

async function fetchExercises() {
  try {
    const response = await axios.get('http://localhost:3000/api/user/dashboard')
    exerciseList.value = response.data
  } catch (error) {
    console.error('Error al obtener actividades:', error)
  }
}

onMounted(() => {
  // fetchDoneExercises()
  // fetchExercises()
}) */

</script>
