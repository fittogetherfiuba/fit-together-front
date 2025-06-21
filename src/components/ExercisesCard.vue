<template>
  <v-card class="pb-10 mt-4" elevation="10" height="670">
    <v-card-title class="bg-secondary text-white py-3 px-4">
      <v-row no-gutters class="align-center justify-space-between">
        <v-col cols="auto" class="d-flex align-center">
          <v-icon class="mr-2">mdi-run</v-icon>
          <span style="font-size: 1.5rem;" class="font-weight-bold">Actividades realizadas</span>
        </v-col>
        <v-btn size="small" icon variant="tonal" color="white" @click="showDialog = true">
          <v-icon size="x-large">mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </v-card-title>

    <v-card-text class="fill-height mt-2">
      <v-row class="justify-center align-center fill-height">
        <v-col cols="12" v-if="!exerciseHistory.length">
          <v-card elevation="0" class="d-flex align-center justify-center">
            <v-row justify="center">
              <v-col cols="12" class="text-center">
                <v-icon color="grey" size="90">mdi-star-off-outline</v-icon>
                <div style="font-size: 20px;" class="font-weight-bold mt-2 mb-10">No hay actividades registradas</div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col class="fill-height pb-7 pt-6 px-4" v-if="exerciseHistory.length" cols="12">
          <v-card class="fill-height" variant="outlined" style="border-color: lightgray;">
            <v-list class="fill-height pa-2 pt-1" style="overflow-y: auto;">
              <v-list-item class="border-b py-5"  v-for="(activity, index) in exerciseHistory" :key="index">
                <v-list-item-title class="font-weight-bold">
                  {{ activity.activityName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span v-if="activity.durationMinutes">Duración: {{ activity.durationMinutes }} min </span>
                  <span v-if="activity.durationMinutes && activity.distanceKm"> - </span>
                  <span v-if="activity.distanceKm">Distancia: {{ activity.distanceKm }} km </span>
                  <span v-if="activity.series">Series: {{ activity.series }} - </span>
                  <span v-if="activity.repetitions">Repeticiones: {{ activity.repetitions }}</span>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog v-model="showDialog" max-width="450px" @after-leave="closeDialog">
      <v-card class="d-flex align-center">
        <v-card-title class="pa-0 w-100">
          <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
            <v-col class="d-flex justify-center align-center">
              <v-icon start icon="mdi-run"></v-icon>
              <span class="text-h6 font-weight-bold">Agregar actividad fisica</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-8 w-75">
          <v-form ref="form">
            <v-autocomplete
              v-model="selectedType"
              :items="exerciseTypes"
              label="Tipo de ejercicio"
              return-object
              :rules="[rules.required]"
              clearable
              autofocus
              variant="outlined"
              item-title="name"
              @update:model-value="fetchExercises"
            />
            <v-autocomplete
              v-if="selectedType"
              v-model="selectedExercise"
              :items="exerciseList"
              label="Ejercicio"
              return-object
              :rules="[rules.required]"
              clearable
              variant="outlined"
              item-title="name"
              item-value="name"
              :menu-props="{ maxHeight: '200px' }"
            >
              <!-- ⭐ Misma estrella que en meals, sin texto duplicado -->
            <template #item="{ props, item }">
              <!-- spread manual pero sin la prop title -->
              <v-list-item v-bind="{ ...props, title: null }" class="px-4">
                <v-icon
                  v-if="item.raw.frequent"
                  icon="mdi-star"
                  color="warning"
                  size="18"
                  class="mr-1"
                />
                {{ item.raw.name }}
              </v-list-item>
            </template>
            </v-autocomplete>
            <v-text-field v-if="selectedType === 'Cardio'" variant="outlined" v-model="duration" @update:model-value="fetchCalories" label="Duración (minutos)" type="number" min="0" />
            <v-text-field v-if="selectedType === 'Cardio'" variant="outlined" v-model="distance" label="Distancia (km)" type="number" min="0" />
            <v-text-field v-if="selectedType === 'Musculacion'" variant="outlined" v-model="sets" label="Series" type="number" min="0" />
            <v-text-field v-if="selectedType === 'Musculacion'" variant="outlined" v-model="reps" @update:model-value="fetchCalories" label="Repeticiones" type="number" min="0" />
            <v-text-field v-if="selectedType" variant="outlined" v-model="calories" label="Calorias quemadas" type="number" min="0" />
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-4 justify-end">
          <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialog">Cancelar</v-btn>
          <v-btn class="border-sm bg-warning font-weight-bold" @click="handleAddExercise">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>


<script>
import axios from 'axios'
import eventBus from '../eventBus';

const API_URL = import.meta.env.VITE_APP_API_URL

export default {
  name: 'ExerciseCard',
  data () {
    return {
      exerciseList: [],
      exerciseTypes: ['Cardio', 'Musculacion'],
      exerciseHistory: [],
      showDialog: false,
      selectedExercise: null,
      selectedType: null,
      duration: '',
      distance: '',
      sets: '',
      reps: '',
      calories: '',
      form: null,
      rules: {
        required: value => !!value || 'Debe ingresar un ejercicio',
      }
    }
  },

  methods: {
    closeDialog() {
      this.showDialog = false
      this.selectedType = null
      this.restartValues()
    },

    restartValues(){
      this.selectedExercise = null
      this.duration = ''
      this.distance = ''
      this.sets = ''
      this.reps = ''
      this.calories = ''
    },

    async handleAddExercise() {
      const isValid = this.$refs.form.validate()
      if (!isValid) {
        return
      }

      if (this.selectedExercise) {
        try {
          console.log(this.selectedExercise)
          const newExercise = {
            userId: this.$store.state.main.user.userId,
            type: this.selectedType,
            activityName: this.selectedExercise.name,
            durationMinutes: this.duration,
            distanceKm: this.distance,
            series: this.sets,
            repetitions: this.reps,
            performedAt: new Date().toISOString(),
            caloriesBurned: this.calories
          }
          await axios.post(API_URL + 'activities/entry', newExercise)
          eventBus.emit('progress-updated');
          this.fetchDoneExercises()
        } catch (error) {
          console.error('Error al obtener comidas:', error)
        }
        this.closeDialog()
      }
    },

async fetchExercises () {
  if (!this.selectedType) return
  this.restartValues()
  

  try {
    // 1️⃣  llamadas en paralelo
    const [allRes, freqRes] = await Promise.all([
      axios.get(API_URL + `activities/${this.selectedType}`),
      axios.get(API_URL + 'activities/entries/frequent', {
        params: {
          userId: this.$store.state.main.user.userId,
          type:  this.selectedType.toLowerCase()   // backend espera "cardio" | "musculacion"
        }
      })
    ])
    const allActivities      = allRes.data                 // [{ id, name, … }]
    const frequentNamesSet   = new Set(freqRes.data)       // ["Correr", "Burpees", …]

    // 2️⃣  separar y marcar
    const frequent   = []
    const nonFrequent = []

    for (const act of allActivities) {
      if (frequentNamesSet.has(act.name)) {
        frequent.push({ ...act, frequent: true })
      } else {
        nonFrequent.push(act)
      }
    }

    // 3️⃣  primero las frecuentes
  let merged = [...frequent, ...nonFrequent]

  /* ---- deduplicar -------- */
  const seen = new Set()
  merged = merged.filter(item => {
    const key = item.name.toLowerCase()
    if (seen.has(key)) return false     // ya lo vimos → fuera
    seen.add(key)
    return true
  })
  console.log('Merged activities:', merged)
  this.exerciseList = merged
  } catch (error) {
    console.error('Error al obtener actividades:', error)
  }
},
    async fetchCalories(){
      if(this.selectedType){

        try {
          const response = await axios.post(API_URL + 'activities/estimate-calories',
              {
                activityName: this.selectedExercise.name,
                durationMinutes: this.duration,
                repetitions: this.reps

              })
          this.calories = response.data.estimatedCalories
        } catch (error) {
          console.error('Error al obtener calorias:', error)
        }

      }
    },

    async fetchDoneExercises() {
      try {
        const response = await axios.get(API_URL + 'activities/entry/' + this.$store.state.main.user.userId.toString())
        this.exerciseHistory = response.data.entries
      } catch (error) {
        console.error('Error al obtener actividades:', error)
      }
    }
  },

  async created () {
    await this.fetchDoneExercises()
  }

}

</script>
