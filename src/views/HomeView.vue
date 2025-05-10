<template>
  <v-container fluid class="d-flex align-center justify-center fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4" elevation="10">
          <v-card-title class="text-h5 text-center">Actividades Realizadas</v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item v-for="(activity, index) in exerciseHistory" :key="index">
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">
                    {{ activity.exercise.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Duración: {{ activity.duracion || 'N/A' }} min ·
                    Distancia: {{ activity.distancia || 'N/A' }} km ·
                    Series: {{ activity.series || 'N/A' }} ·
                    Repeticiones: {{ activity.repeticiones || 'N/A' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="showDialog = true">
              Agregar actividad
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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
import { ref, /*onMounted*/ } from 'vue'
//import axios from 'axios'

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

// Lista local de actividades agregadas
const exerciseHistory = ref([])

function handleAddExercise() {
  if (selectedExercise.value) {
    const newExercise = {
      exercise: selectedExercise.value,
      duracion: duration.value,
      distancia: distance.value,
      series: sets.value,
      repeticiones: reps.value
    }

    // await axios.post('http://localhost:3000/api/user/dashboard', newExercise)

    // Guardar localmente
    exerciseHistory.value.push(newExercise)

    console.log('Actividad agregada:', newExercise)

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

// Esta función queda preparada para cuando el backend esté listo
/* async function fetchExercises() {
  try {
    const response = await axios.get('http://localhost:3000/api/user/dashboard')
    exerciseHistory.value = response.data
  } catch (error) {
    console.error('Error al obtener actividades:', error)
  }
}

onMounted(() => {
  // fetchExercises()
}) */
</script>

