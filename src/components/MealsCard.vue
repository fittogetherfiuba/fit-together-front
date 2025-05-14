<template>
  <v-card class="pa-4 mt-4" elevation="10">
    <v-card-title class="text-h5 text-center">Alimentos consumidos</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item class="border-b" v-for="(meal, index) in mealHistory" :key="index">
          <v-list-item-title class="font-weight-bold">{{ meal.food_name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn class="border-sm bg-warning" @click="showDialog = true">Agregar comida</v-btn>
    </v-card-actions>

    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title><span class="text-h6">Agregar comida</span></v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="selectedMeal"
            :items="mealList"
            label="Comida"
            prepend-icon="mdi-magnify"
            return-object
            autofocus
            item-title="name"
            :menu-props="{ maxHeight: '200px' }"
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="handleAddMeal">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'MealsCard',
  data () {
    return {
      mealList: null,
      mealHistory: ref([]),
      showDialog: ref(false),
      selectedMeal: ref(null)
    }
  },

  methods: {
    closeDialog() {
      this.showDialog = false
      this.selectedMeal = null
    },
    async handleAddMeal() {
      if (this.selectedMeal) {
        try {
          const meal = {
            "userId": this.$store.state.main.user.userId,
            "foodName": this.selectedMeal.name,
            "quantity": 1,
          }
          const response = await axios.post('http://localhost:3000/api/foods/entry', meal)
          response.data.entry["food_name"] = this.selectedMeal.name // esto no tiene que ser así, hay que cambiarlo
          this.mealHistory.push(response.data.entry)
        } catch (error) {
          console.error('Error al obtener comidas:', error)
        }
        this.closeDialog()
      }
    },
    async fetchMeals() {
      try {
        const response = await axios.get('http://localhost:3000/api/foods')
        this.mealList = response.data
      } catch (error) {
        console.error('Error al obtener comidas:', error)
      }
    },
    async fetchEatenMeals() {
      try {
        const response = await axios.get('http://localhost:3000/api/foods/entry/' + this.$store.state.main.user.userId.toString())
        this.mealHistory = response.data.entries
      } catch (error) {
        console.error('Error al obtener comidas:', error)
      }
    }
  },

  async created () {
    await this.fetchEatenMeals()
    await this.fetchMeals()
  }

}

/* 

*/



</script>
