<template>
  <v-card class="pb-4 mt-4" elevation="10">
    <v-card-title class="text-h5 mb-4 text-center font-weight-bold bg-secondary">Alimentos consumidos</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item class="border-b" v-for="(meal, index) in mealHistory" :key="index">
          <v-list-item-title >{{ meal.foodName }} - {{ meal.grams }} gr </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn class="border-sm bg-warning font-weight-bold" @click="showDialog = true">Agregar comida</v-btn>
    </v-card-actions>

    <v-dialog v-model="showDialog" max-width="450px">
      <v-card class="d-flex align-center">
        <v-card-title><span class="text-h6">Agregar comida</span></v-card-title>
        <v-card-text class="w-75">
          <v-autocomplete
            v-model="selectedMeal"
            :items="mealList"
            label="Comida"
            variant="outlined"
            return-object
            autofocus
            item-title="name"
            :menu-props="{ maxHeight: '200px' }"
          />
          <v-text-field v-model="grams" variant="outlined" label="Cantidad (gramos)" type="number" min="0" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialog">Cancelar</v-btn>
          <v-btn class="border-sm bg-warning font-weight-bold" @click="handleAddMeal">Agregar</v-btn>
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
      mealList: ref(null),
      mealHistory: ref(null),
      showDialog: ref(false),
      selectedMeal: ref(null),
      grams: ref('')
    }
  },

  methods: {
    closeDialog() {
      this.showDialog = false
      this.selectedMeal = null
      this.grams = ''
    },
    async handleAddMeal() {
      if (this.selectedMeal) {
        try {
          const meal = {
            "userId": this.$store.state.main.user.userId,
            "foodName": this.selectedMeal.name,
            "grams": parseInt(this.grams),
            "consumedAt": new Date().toLocaleString()
          }
          await axios.post('http://localhost:3000/api/foods/entry', meal)
          this.fetchEatenMeals()
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

</script>
