<template>
  <v-card class="pb-10 mt-4" elevation="10" height="453">
    <v-card-title class="bg-secondary text-white py-3 px-4">
      <v-row no-gutters class="align-center justify-space-between">
        <v-col cols="auto" class="d-flex align-center">
          <v-icon class="mr-2">mdi-food-drumstick</v-icon>
          <span style="font-size: 1.5rem;" class="font-weight-bold">Alimentos consumidos</span>
        </v-col>
        <v-btn size="small" icon variant="tonal" color="white" @click="showDialog = true">
          <v-icon size="x-large">mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </v-card-title>

    <v-card-text class="fill-height mt-2">
      <v-row class="justify-center align-center fill-height">
        <v-col cols="12" v-if="!mealHistory.length">
          <v-card elevation="0" class="d-flex align-center justify-center">
            <v-row justify="center">
              <v-col cols="12" class="text-center">
                <v-icon color="grey" size="90">mdi-star-off-outline</v-icon>
                <div style="font-size: 20px;" class="mt-2 mb-10">No hay alimentos registrados</div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col v-if="mealHistory.length" class="fill-height pb-7 pt-6 px-4" cols="12">
          <v-card class="fill-height" variant="outlined" style="border-color: lightgray;">
            <v-list class="fill-height pa-2 pt-1" style="overflow-y: auto;">
              <v-list-item
                class="border-b py-5"
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
                <v-list-item-subtitle class="mt-1">
                  <span v-if="meal.consumedAt" class="mt-4">Fecha: {{ meal.consumedAt.split('T')[0] }} </span>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog v-model="showDialog" max-width="450px" @after-leave="resetAddDialog">
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
          <v-form ref="form">
            <v-row dense>
              <v-col cols="12">
                <v-autocomplete
                  v-model="selectedPeriod"
                  :items="mealPeriods"
                  label="Periodo"
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
                  v-model.number="grams"
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
              <v-btn class="border-sm bg-error font-weight-bold" text @click="closeAddDialog">
                Cancelar
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                class="border-sm bg-warning font-weight-bold"
                :disabled="!selectedMeal || selectedMeal.name === 'Otra'"
                @click="onAddConfirm"
              >
                Continuar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog para nueva comida personalizada -->
    <v-dialog v-model="showCustomDialog" max-width="500px" @after-leave="resetCustomDialog">
      <v-card>
        <v-card-title class="pa-0">
          <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
            <v-col class="d-flex justify-center align-center">
              <v-icon start icon="mdi-food-plus"></v-icon>
              <span class="text-h6 font-weight-bold">Nueva comida</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-6 pb-3 d-flex justify-center">
          <v-form ref="customForm">
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="customName"
                  :rules="[rules.required]"
                  variant="outlined"
                  label="Nombre de la comida"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="customCaloriesPer100g"
                  :rules="[rules.nonNegative]"
                  variant="outlined"
                  label="Calorías por 100g"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="customProteinPer100g"
                  :rules="[rules.nonNegative]"
                  variant="outlined"
                  label="Proteínas por 100g"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="customCarbsPer100g"
                  :rules="[rules.nonNegative]"
                  variant="outlined"
                  label="Carbohidratos por 100g"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="customFatPer100g"
                  :rules="[rules.nonNegative]"
                  variant="outlined"
                  label="Grasas por 100g"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="customSodiumPer100g"
                  :rules="[rules.nonNegative]"
                  variant="outlined"
                  label="Sodio por 100g"
                  type="number"
                  min="0"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.number="customFiberPer100g"
                  :rules="[rules.nonNegative]"
                  variant="outlined"
                  label="Fibra por 100g"
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
              <v-btn class="border-sm bg-error font-weight-bold" text @click="cancelCustom">
                Cancelar
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn class="border-sm bg-warning font-weight-bold" @click="onCustomSave">
                Guardar comida
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
              <span class="text-h6 font-weight-bold">{{ selectedMealInfo?.foodName }}</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="w-75">
          <p><strong>Periodo: </strong> {{ selectedMealInfo?.period }}</p>
          <p><strong>Cantidad: </strong> {{ selectedMealInfo?.grams }}g</p>
          <p><strong>Calorías: </strong> {{ selectedMealInfo?.calories }}</p>
          <br/>
          <p class="font-weight-bold mb-2 text-center">Nutrientes</p>
          <v-data-table
            class="border-md"
            :items="selectedMealInfo?.nutrients || []"
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
const API_URL = import.meta.env.VITE_APP_API_URL

export default {
  name: 'MealsCard',
  data() {
    return {
      mealList: [],
      mealHistory: [],
      mealPeriods: ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'],
      showDialog: false,
      showCustomDialog: false,
      showFoodInfo: false,
      selectedPeriod: null,
      selectedMeal: null,
      grams: null,
      customName: '',
      customCaloriesPer100g: null,
      customProteinPer100g: null,
      customCarbsPer100g: null,
      customFatPer100g: null,
      customSodiumPer100g: null,
      customFiberPer100g: null,
      topFoods: [],
      headers: [
        { title: 'Name', value: 'name' },
        { title: 'Amount', value: 'amount' }
      ],
      rules: {
        required: value => !!value || 'Debe ingresar un valor',
        foodRequired: value => (value > 0) || 'Debe ingresar una cantidad de comida',
        nonNegative: value => (value === null || value >= 0) || 'Debe ser número >= 0'
      }
    }
  },
  watch: {
    selectedPeriod: async function(newVal) {
      if (newVal) {
        await this.fetchTopFoods()
      } else {
        this.topFoods = []
        this.decorateAndSortMealList()
      }
    },
    selectedMeal: function(newVal) {
      if (newVal && newVal.name === 'Otra') {
        this.showDialog = false
        this.openCustomDialog()
      }
    }
  },
  methods: {
    openAddDialog() {
      this.resetAddDialog()
      this.showDialog = true
    },
    resetAddDialog() {
      this.selectedPeriod = null
      this.selectedMeal = null
      this.grams = null
    },
    decorateAndSortMealList() {
      const topSet = new Set(this.topFoods.map(n => n.toLowerCase()))
      const otherItem = this.mealList.find(item => item.name === 'Otra')
      if (otherItem) {
        otherItem.nameWithStar = 'Otra'
      }
      const listWithoutOther = this.mealList.filter(item => item.name !== 'Otra')
      listWithoutOther.forEach(item => {
        item.nameWithStar = topSet.has(item.name.toLowerCase())
          ? `⭐ ${item.name}`
          : item.name
      })
      listWithoutOther.sort((a, b) => {
        const aStar = topSet.has(a.name.toLowerCase())
        const bStar = topSet.has(b.name.toLowerCase())
        if (aStar && !bStar) return -1
        if (!aStar && bStar) return 1
        return a.name.localeCompare(b.name)
      })
      if (otherItem) {
        this.mealList = [otherItem, ...listWithoutOther]
      } else {
        this.mealList = listWithoutOther
      }
    },
    async fetchTopFoods() {
      try {
        const userId = this.$store.state.main.user.userId
        const periodParam = this.selectedPeriod.toLowerCase()
        const res = await axios.get(API_URL + `foods/top-foods?userId=${userId}&period=${periodParam}`)
        this.topFoods = res.data.foods || []
      } catch (error) {
        console.error('Error al obtener top foods:', error)
        this.topFoods = []
      } finally {
        this.decorateAndSortMealList()
      }
    },
    async fetchEatenMeals() {
      try {
        const response = await axios.get(API_URL + `foods/entry/${this.$store.state.main.user.userId}`)
        this.mealHistory = response.data.entries
      } catch (error) {
        console.error('Error al obtener comidas:', error)
      }
    },
    closeAddDialog() {
      this.showDialog = false
      this.resetAddDialog()
    },
    async onAddConfirm() {
      const form = this.$refs.form
      if (form && typeof form.validate === 'function' && !form.validate()) return
      if (!this.selectedMeal) return
      await this.addMealEntry()
    },
    async addMealEntry() {
      if (!this.selectedMeal || !this.grams || this.grams <= 0 || !this.selectedPeriod) return
      const payload = {
        userId: this.$store.state.main.user.userId,
        foodName: this.selectedMeal.name,
        grams: this.grams,
        period: this.selectedPeriod,
        consumedAt: new Date().toISOString()
      }
      try {
        const res = await axios.post(API_URL + 'foods/entry', payload)
        if (res.status === 200 || res.status === 201) {
          await this.fetchEatenMeals()
          eventBus.emit('progress-updated')
        }
      } catch (error) {
        console.error('Error al agregar entrada de comida:', error)
      } finally {
        this.closeAddDialog()
      }
    },
    openCustomDialog() {
      this.resetCustomDialog()
      this.showCustomDialog = true
    },
    resetCustomDialog() {
      this.customName = ''
      this.customCaloriesPer100g = null
      this.customProteinPer100g = null
      this.customCarbsPer100g = null
      this.customFatPer100g = null
      this.customSodiumPer100g = null
      this.customFiberPer100g = null
    },
    cancelCustom() {
      this.selectedMeal = null
      this.showCustomDialog = false
      this.openAddDialog()
    },
    async onCustomSave() {
      const form = this.$refs.customForm
      if (form && typeof form.validate === 'function' && !form.validate()) return
      if (!this.customName) return
      const payload = {
        name: this.customName.trim(),
        userId: this.$store.state.main.user.userId,
        caloriesPer100g: this.customCaloriesPer100g,
        nutrients: []
      }
      const nutrientsArr = []
      if (this.customProteinPer100g != null) nutrientsArr.push({ nutrientId: 1, amountPer100g: this.customProteinPer100g })
      if (this.customCarbsPer100g != null) nutrientsArr.push({ nutrientId: 2, amountPer100g: this.customCarbsPer100g })
      if (this.customFatPer100g != null) nutrientsArr.push({ nutrientId: 3, amountPer100g: this.customFatPer100g })
      if (this.customSodiumPer100g != null) nutrientsArr.push({ nutrientId: 4, amountPer100g: this.customSodiumPer100g })
      if (this.customFiberPer100g != null) nutrientsArr.push({ nutrientId: 5, amountPer100g: this.customFiberPer100g })
      if (nutrientsArr.length) payload.nutrients = nutrientsArr
      try {
        const res = await axios.post(API_URL + 'foods', payload)
        if (res.status === 201) {
          await this.fetchMeals()
          const newItem = this.mealList.find(item => item.id === res.data.food.id || item.name === res.data.food.name)
          if (newItem) this.selectedMeal = newItem
          this.showCustomDialog = false
          this.showDialog = true
        }
      } catch (error) {
        console.error('Error al crear nueva comida:', error.response?.status, error.response?.data)
      }
    },
    closeFoodInfo() {
      this.showFoodInfo = false
      this.selectedMealInfo = null
    },
    async handleMealInfo(meal) {
      this.selectedMealInfo = meal
      this.showFoodInfo = true
    },
    async fetchMeals() {
      try {
        const userId = this.$store.state.main.user.userId
        const [mealsRes, restrictedRes] = await Promise.all([
          axios.get(API_URL + 'foods'),
          axios.get(API_URL + `diet/restricted-foods/${userId}`)
        ])
        const restrictedNames = restrictedRes.data.map(f => f.name.toLowerCase())
        const foods = mealsRes.data.map(m => ({
          id: m.id,
          name: m.name,
          createdByUserId: m.createdByUserId ?? m.created_by_user_id,
          caloriesPer100g: m.caloriesPer100g ?? m.calories_per_100g
        }))
        const filtered = foods.filter(m => {
          const nameLower = m.name.toLowerCase()
          if (restrictedNames.includes(nameLower)) return false
          if (m.createdByUserId == null) return true
          return m.createdByUserId === userId
        })
        const baseList = filtered.map(meal => ({
          ...meal,
          nameWithStar: meal.name
        }))
        this.mealList = [{ name: 'Otra' }, ...baseList]
        this.decorateAndSortMealList()
      } catch (error) {
        console.error('Error al obtener comidas:', error)
      }
    }
  },
  async created() {
    await this.fetchMeals()
    await this.fetchEatenMeals()
  }
}
</script>
