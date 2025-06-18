<template>
  <v-card class="pb-4 mt-4" elevation="10">
    <v-card-title class="mb-4 text-center font-weight-bold bg-secondary" style="font-size: 1.4rem;">
      <v-icon start icon="mdi-food-drumstick" />
      Alimentos consumidos
    </v-card-title>
    <v-card-text>
      <v-list style="overflow-y: auto; max-height: 400px;">
        <span
          class="d-flex text-h6 justify-center font-weight-bold"
          v-if="mealHistory.length === 0"
        >
          No hay alimentos registrados
        </span>
        <v-list-item
          class="border-b"
          v-for="(meal, index) in mealHistory"
          @click="handleMealInfo(meal)"
          :key="index"
        >
          <v-list-item-title class="font-weight-bold">
            {{ meal.foodName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <span>Cantidad: {{ meal.grams }}g - </span>
            <span>Calorías: {{ meal.calories }}</span>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn class="border-sm bg-warning font-weight-bold" @click="showDialog = true">
        Agregar comida
      </v-btn>
    </v-card-actions>

    <!-- Diálogo para agregar comida -->
    <v-dialog v-model="showDialog" max-width="450px" @after-leave="closeDialog">
      <v-card>
        <v-card-title class="pa-0">
          <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
            <v-col class="d-flex justify-center align-center">
              <v-icon start icon="mdi-food-drumstick"></v-icon>
              <span class="text-h6 font-weight-bold">Agregar comida</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-6 pb-3 d-flex justify-center">
          <v-form class="w-75" ref="form">
            <v-row dense>
              <v-col cols="12">
                <v-autocomplete
                  v-model="selectedPeriod"
                  :items="mealPeriods"
                  label="Periodo"
                  return-object
                  :rules="[rules.required]"
                  clearable
                  variant="outlined"
                  :menu-props="{ maxHeight: '200px' }"
                />
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="selectedMeal"
                  :items="mealList"
                  label="Comida"
                  return-object
                  :rules="[rules.required]"
                  clearable
                  variant="outlined"
                  item-title="nameWithStar"
                  :menu-props="{ maxHeight: '200px' }"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="grams"
                  :rules="[rules.foodRequired]"
                  variant="outlined"
                  label="Cantidad (gramos)"
                  type="number"
                  min="0"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-4">
          <v-row justify="center" class="w-100">
            <v-col cols="auto">
              <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialog">
                Cancelar
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn class="border-sm bg-warning font-weight-bold" @click="handleAddMeal">
                Agregar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo info comida -->
    <v-dialog v-model="showFoodInfo" max-width="450px" @after-leave="closeFoodInfo">
      <v-card class="d-flex align-center">
        <v-card-title class="pa-0 w-100">
          <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
            <v-col>
              <span class="text-h6 font-weight-bold">{{ selectedMealInfo ? selectedMealInfo.foodName : '' }}</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="w-75">
          <p><strong>Periodo: </strong> {{ selectedMealInfo.period }}</p>
          <p><strong>Cantidad: </strong> {{ selectedMealInfo.grams }}g</p>
          <p><strong>Calorías: </strong> {{ selectedMealInfo.calories }}</p>
          <br />
          <p class="font-weight-bold mb-2 text-center">Nutrientes</p>
          <v-data-table
            class="border-md"
            :items="selectedMealInfo.nutrients"
            :headers="headers"
            hide-default-header
            hide-default-footer
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from 'axios'
import eventBus from '../eventBus'

export default {
  name: 'MealsCard',
  data () {
    return {
      mealList: [],        
      mealHistory: [],
      mealPeriods: ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'],
      showDialog: false,
      showFoodInfo: false,
      selectedPeriod: null,
      selectedMeal: null,
      selectedMealInfo: null,
      topFoods: [],            // comidas destacadas (⭐)
      grams: '',
      form: null,
      headers: [
        { title: 'Name', value: 'name' },
        { title: 'Amount', value: 'amount' }
      ],
      rules: {
        required: value => !!value || 'Debe ingresar una comida',
        foodRequired: value => !!value || 'Debe ingresar una cantidad de comida'
      }
    }
  },

  watch: {
    async selectedPeriod (newVal) {
      if (newVal) {
        await this.fetchTopFoods()
      } else {
        this.topFoods = []
        this.decorateAndSortMealList()
      }
    }
  },

  methods: {
    decorateAndSortMealList () {
      // Añade la estrella y reordena: primero top‑foods, luego resto alfabético
      const topSet = new Set(this.topFoods.map(n => n.toLowerCase()))

      this.mealList.forEach(item => {
        item.nameWithStar = topSet.has(item.name.toLowerCase()) ? `⭐ ${item.name}` : item.name
      })

      this.mealList.sort((a, b) => {
        const aStar = topSet.has(a.name.toLowerCase())
        const bStar = topSet.has(b.name.toLowerCase())
        if (aStar && !bStar) return -1
        if (!aStar && bStar) return 1
        return a.name.localeCompare(b.name)
      })
    },

    async fetchTopFoods () {
      try {
        const userId = this.$store.state.main.user.userId
        const periodParam = this.selectedPeriod.toLowerCase()
        const res = await axios.get(`http://localhost:3000/api/foods/top-foods?userId=${userId}&period=${periodParam}`)
        this.topFoods = res.data.foods || []
      } catch (error) {
        console.error('Error al obtener top foods:', error)
        this.topFoods = []
      } finally {
        this.decorateAndSortMealList()
      }
    },

    async fetchMeals () {
      try {
        const [mealsRes, restrictedRes] = await Promise.all([
          axios.get('http://localhost:3000/api/foods'),
          axios.get(`http://localhost:3000/api/diet/restricted-foods/${this.$store.state.main.user.userId}`)
        ])

        const restrictedNames = restrictedRes.data.map(f => f.name.toLowerCase())

        // Construimos mealList básica (sin estrella todavía)
        this.mealList = mealsRes.data
          .filter(meal => !restrictedNames.includes(meal.name.toLowerCase()))
          .map(meal => ({ ...meal, nameWithStar: meal.name }))

        // Si ya hay período seleccionado, asegura que queden primero los top foods
        this.decorateAndSortMealList()
      } catch (error) {
        console.error('Error al obtener comidas:', error)
      }
    },

    async fetchEatenMeals () {
      try {
        const response = await axios.get(`http://localhost:3000/api/foods/entry/${this.$store.state.main.user.userId}`)
        this.mealHistory = response.data.entries
      } catch (error) {
        console.error('Error al obtener comidas:', error)
      }
    },

    closeDialog () {
      this.showDialog = false
      this.selectedMeal = null
      this.selectedPeriod = null
      this.grams = ''
    },

    async handleAddMeal () {
      const isValid = this.$refs.form.validate()
      if (!isValid) return

      if (this.selectedMeal && this.grams) {
        try {
          const meal = {
            userId: this.$store.state.main.user.userId,
            foodName: this.selectedMeal.name,
            grams: parseInt(this.grams, 10),
            period: this.selectedPeriod,
            consumedAt: new Date().toISOString()
          }
          await axios.post('http://localhost:3000/api/foods/entry', meal)
          await this.fetchEatenMeals()
          eventBus.emit('progress-updated')
          console.log('[MealsCard] Emitido progress-updated tras agregar comida')
        } catch (error) {
          console.error('Error al registrar comida:', error)
        }
        this.closeDialog()
      }
    },

    async handleMealInfo (meal) {
      this.selectedMealInfo = meal
      this.showFoodInfo = true
    },
    closeFoodInfo () {
      this.selectedMealInfo = null
      this.showFoodInfo = false
    }
  },

  async created () {
    await this.fetchMeals()
    await this.fetchEatenMeals()
  }
}
</script>

<style scoped>
/* Puedes añadir estilos específicos si lo deseas */
</style>
