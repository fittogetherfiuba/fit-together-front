<template>
  <v-card class="pb-4 mt-4" elevation="10">
    <v-card-title class="mb-4 text-center text-main font-weight-bold bg-secondary" style="font-size: 1.4rem;">
      <v-icon start icon="mdi-run"></v-icon>
      Actividades Realizadas
    </v-card-title>
    <v-card-text>
      <v-list>
        <span class="d-flex text-h6 justify-center font-weight-bold" v-if="exerciseHistory.length === 0">No hay actividades registradas</span>
        <v-list-item class="border-b" v-for="(activity, index) in exerciseHistory" :key="index">
          <v-list-item-title class="font-weight-bold">
            {{ activity.activityName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <span v-if="activity.durationMinutes">Duración: {{ activity.durationMinutes }} min - </span>
            <span v-if="activity.distanceKm">Distancia: {{ activity.distanceKm }} km </span>
            <span v-if="activity.series">Series: {{ activity.series }} - </span>
            <span v-if="activity.repetitions">Repeticiones: {{ activity.repetitions }}</span>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn variant="tonal" class="border-sm font-weight-bold bg-warning" @click="showDialog = true">Agregar actividad</v-btn>
    </v-card-actions>

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
                <v-list-item
                  :value="props.value"
                  :active="props.active"
                  :active-class="props.activeClass"
                  class="px-4"
                >
                  <v-list-item-title>
                    <v-icon
                      v-if="item.raw.frequent"
                      icon="mdi-star"
                      color="warning"
                      size="18"
                      class="mr-1"
                    />
                    {{ item.raw.name }}
                  </v-list-item-title>
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
          await axios.post('http://localhost:3000/api/activities/entry', newExercise)
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
      axios.get(`http://localhost:3000/api/activities/${this.selectedType}`),
      axios.get('http://localhost:3000/api/activities/frequent', {
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
          const response = await axios.post('http://localhost:3000/api/activities/estimate-calories',
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
        const response = await axios.get('http://localhost:3000/api/activities/entry/' + this.$store.state.main.user.userId.toString())
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
