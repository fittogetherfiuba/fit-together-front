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
            <span v-if="activity.durationMinutes">Duración: {{ activity.durationMinutes }} min · </span>
            <span v-if="activity.distanceKm">Distancia: {{ activity.distanceKm }} km · </span>
            <span v-if="activity.series">Series: {{ activity.series }} · </span>
            <span v-if="activity.repetitions">Repeticiones: {{ activity.repetitions }}</span>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn variant="tonal" class="border-sm font-weight-bold bg-warning" @click="showDialog = true">Agregar actividad</v-btn>
    </v-card-actions>

    <v-dialog v-model="showDialog" max-width="450px">
      <v-card class="d-flex align-center">
        <v-card-title class="pa-3"><span class="text-h6 font-weight-bold">Agregar actividad física</span></v-card-title>
        <v-card-text class="w-75">
          <v-form ref="form">
            <v-autocomplete
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
            <v-text-field variant="outlined" v-model="duration" label="Duración (minutos)" type="number" min="0" />
            <v-text-field variant="outlined" v-model="distance" label="Distancia (km)" type="number" min="0" />
            <v-text-field variant="outlined" v-model="sets" label="Series" type="number" min="0" />
            <v-text-field variant="outlined" v-model="reps" label="Repeticiones" type="number" min="0" />
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
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'ExerciseCard',
  data () {
    return {
      exerciseList: null,
      exerciseHistory: ref([]),
      showDialog: ref(false),
      selectedExercise: ref(null),
      duration: ref(''),
      distance: ref(''),
      sets: ref(''),
      reps: ref(''),
      form: ref(null),
      rules: {
        required: value => !!value || 'Debe ingresar un ejercicio',
      }
    }
  },

  methods: {
    closeDialog() {
      this.showDialog = false
      this.selectedExercise = null
      this.duration = ''
      this.distance = ''
      this.sets = ''
      this.reps = ''
    },

    async handleAddExercise() {
      const isValid = this.$refs.form.validate()
      if (!isValid) {
        return // No continúa si el formulario no es válido
      }

      if (this.selectedExercise) {
        try {
          console.log(this.selectedExercise)
          const newExercise = {
            userId: this.$store.state.main.user.userId,
            activityName: this.selectedExercise.name,
            durationMinutes: this.duration,
            distanceKm: this.distance,
            series: this.sets,
            repetitions: this.reps,
            performedAt: new Date().toLocaleString()
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
      try {
        const response = await axios.get('http://localhost:3000/api/activities')
        this.exerciseList = response.data
      } catch (error) {
        console.error('Error al obtener actividades:', error)
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
    await this.fetchExercises()
  }

}

</script>
