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
        <v-card-title class="pa-3"><span class="text-h6 font-weight-bold">Agregar actividad física</span></v-card-title>
        <v-card-text class="w-75">
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
              autofocus
              variant="outlined"
              item-title="name"
              :menu-props="{ maxHeight: '200px' }"
            />
            <v-text-field v-if="selectedType === 'Cardio'" variant="outlined" v-model="duration" @update:model-value="fetchCalories" label="Duración (minutos)" type="number" min="0" />
            <v-text-field v-if="selectedType === 'Cardio'" variant="outlined" v-model="distance" label="Distancia (km)" type="number" min="0" />
            <v-text-field v-if="selectedType === 'Musculacion'" variant="outlined" v-model="sets" label="Series" type="number" min="0" />
            <v-text-field v-if="selectedType === 'Musculacion'" variant="outlined" v-model="reps" @update:model-value="fetchCalories" label="Repeticiones" type="number" min="0" />
            <v-text-field v-if="selectedType" variant="outlined" v-model="calories" label="Calorias quemadas" type="number" min="0" />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
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
      this.selectedExercise = null
      this.selectedType = null
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
            /*type: this.selectedType,*/
            activityName: this.selectedExercise.name,
            durationMinutes: this.duration,
            distanceKm: this.distance,
            series: this.sets,
            repetitions: this.reps,
            performedAt: new Date().toISOString(),
            /* caloriesBurned: this.calories,*/
          }
          await axios.post('http://localhost:3000/api/activities/entry', newExercise)
          this.fetchDoneExercises()
        } catch (error) {
          console.error('Error al obtener comidas:', error)
        }
        this.closeDialog()
      }
    },

    async fetchExercises() {
      if(this.selectedType){
        try {
          const response = await axios.get('http://localhost:3000/api/activities')
          //const response = await axios.get('http://localhost:3000/api/activities/type/' + this.selectedType)
          this.exerciseList = response.data
        } catch (error) {
          console.error('Error al obtener actividades:', error)
        }
      }
    },

    async fetchCalories(){
      if(this.selectedType){
        /*
        try {
          const exercise = {
            type: this.selectedType,
            ...(this.duration
              ? { duration: this.duration }
              : { reps: this.reps }),
          }
          const response = await axios.get('http://localhost:3000/api/calories' + exercise)
          this.calories = response.data
        } catch (error) {
          console.error('Error al obtener calorias:', error)
        }
          */
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
