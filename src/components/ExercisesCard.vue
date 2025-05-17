<template>
  <v-card class="pa-4" elevation="10">
    <v-card-title class="text-h5 text-center text-main font-weight-bold">Actividades Realizadas</v-card-title>
    <v-card-text>
      <v-list>
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
      <v-btn class="border-sm bg-warning" @click="showDialog = true">Agregar actividad</v-btn>
    </v-card-actions>

    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title><span class="text-h6">Agregar actividad física</span></v-card-title>
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
