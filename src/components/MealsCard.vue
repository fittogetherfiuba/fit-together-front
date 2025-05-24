<template>
  <v-card class="pb-4 mt-4" elevation="10">
    <v-card-title class="mb-4 text-center font-weight-bold bg-secondary" style="font-size: 1.4rem;">
      <v-icon start icon="mdi-food-drumstick"></v-icon>
      Alimentos consumidos
    </v-card-title>
    <v-card-text>
      <v-list>
        <span class="d-flex text-h6 justify-center font-weight-bold" v-if="mealHistory.length === 0">No hay alimentos registrados</span>
        <v-list-item class="border-b" v-for="(meal, index) in mealHistory" :key="index">
          <v-list-item-title class="font-weight-bold"> {{ meal.foodName }} </v-list-item-title>
          <v-list-item-subtitle>
            <span>Cantidad: {{ meal.grams }}gr - </span>
            <span>Calorias: {{ meal.calories }} - </span>
            <span>Proteinas: {{ meal.grams }} - </span>
            <span>Grasas: {{ meal.grams }} </span>
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <span>Carbohidratos: {{ meal.grams }} - </span>
            <span>Fibras: {{ meal.grams }} - </span>
            <span>Sodio: {{ meal.grams }} </span>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn class="border-sm bg-warning font-weight-bold" @click="showDialog = true">Agregar comida</v-btn>
    </v-card-actions>

    <v-dialog v-model="showDialog" max-width="450px" @after-leave="closeDialog">
      <v-card class="d-flex align-center">
        <v-card-title class="pa-3"><span class="text-h6 font-weight-bold">Agregar comida</span></v-card-title>
        <v-card-text class="w-75">
          <v-form ref="form">
            <v-autocomplete
              v-model="selectedPeriod"
              :items="mealPeriods"
              label="Periodo"
              return-object
              :rules="[rules.required]"
              clearable
              variant="outlined"
              item-title="name"
              :menu-props="{ maxHeight: '200px' }"
            />
            <v-autocomplete
              v-model="selectedMeal"
              :items="mealList"
              label="Comida"
              variant="outlined"
              return-object
              :rules="[rules.required]"
              clearable
              item-title="name"
              :menu-props="{ maxHeight: '200px' }"
            />
            <v-text-field v-model="grams" :rules="[rules.foodRequired]" variant="outlined" label="Cantidad (gramos)" type="number" min="0" />
          </v-form>
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
      mealHistory: ref([]),
      mealPeriods: ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'],
      showDialog: ref(false),
      selectedPeriod: ref(null),
      selectedMeal: ref(null),
      grams: ref(''),
      form: ref(null),
      rules: {
        required: value => !!value || 'Debe ingresar una comida',
        foodRequired: value => !!value || 'Debe ingresar una cantidad de comida',
      }
    }
  },

  methods: {
    closeDialog() {
      this.showDialog = false
      this.selectedMeal = null
      this.selectedPeriod = null
      this.grams = ''
    },
    async handleAddMeal() {
      const isValid = this.$refs.form.validate()
      if (!isValid) {
        return // No continúa si el formulario no es válido
      }

      if (this.selectedMeal && this.grams) {
        try {
          const meal = {
            "userId": this.$store.state.main.user.userId,
            "foodName": this.selectedMeal.name,
            "grams": parseInt(this.grams),
            /**/
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
