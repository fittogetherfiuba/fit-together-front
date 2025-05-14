<template>
  <v-card class="pa-4" elevation="10">
    <v-card-title class="text-h5 text-center text-main">Actividades Realizadas</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item class="border-b" v-for="(activity, index) in exerciseHistory" :key="index">
          <v-list-item-title class="font-weight-bold">
            {{ activity.activity_name }}
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
            duracion: this.duration,
            distancia: this.distance,
            series: this.sets,
            repeticiones: this.reps,
          }
          await axios.post('http://localhost:3000/api/activities/entry', newExercise)
          newExercise["activity_name"] = this.selectedExercise.name // esto no tendría que ser así, hay que unificarlo
          this.exerciseHistory.push(newExercise)
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
        console.log(response.data)
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

/* 

*/



</script>
