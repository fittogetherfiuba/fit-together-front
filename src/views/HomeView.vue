<template>
  <v-container fluid class="d-flex align-center justify-center fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4" elevation="10">
          <v-card-title class="text-h5 text-center">Actividades Realizadas</v-card-title>

          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="showDialog = true">
              Agregar actividad
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo modal -->
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">Agregar actividad física</span>
        </v-card-title>

        <v-card-text>
          <v-autocomplete
            v-model="selectedExercise"
            :items="exerciseList"
            label="Ejercicio"
            prepend-icon="mdi-magnify"
            return-object
            autofocus
            item-title="name"
            :menu-props="{ maxHeight: '200px' }"
          ></v-autocomplete>

          <v-text-field
            v-model="duration"
            label="Duración (minutos)"
            type="number"
            min="0"
          ></v-text-field>

          <v-text-field
            v-model="distance"
            label="Distancia (km)"
            type="number"
            min="0"
          ></v-text-field>

          <v-text-field
            v-model="sets"
            label="Series"
            type="number"
            min="0"
          ></v-text-field>

          <v-text-field
            v-model="reps"
            label="Repeticiones"
            type="number"
            min="0"
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="handleAddExercise">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const showDialog = ref(false)
const selectedExercise = ref(null)
const duration = ref('')
const distance = ref('')
const sets = ref('')
const reps = ref('')

const exerciseList = ref([
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
])

function handleAddExercise() {
  if (selectedExercise.value) {
    console.log('Actividad agregada:', {
      ejercicio: selectedExercise.value.name,
      duracion: duration.value,
      distancia: distance.value,
      series: sets.value,
      repeticiones: reps.value,
    })

    // Resetear campos
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
</script>

