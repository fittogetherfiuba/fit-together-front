<template>
  <v-card class="pb-4 mt-4" elevation="10">
    <v-card-title class="mb-4 text-center font-weight-bold bg-secondary" style="font-size: 1.4rem;">
      <v-icon start icon="mdi-food-drumstick" />
      Alimentos consumidos
    </v-card-title>
    <v-card-text>
      <v-list>
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
      <v-btn class="border-sm bg-warning font-weight-bold" @click="openAddDialog">
        Agregar comida
      </v-btn>
    </v-card-actions>

    <!-- Dialog para agregar entrada de comida existente o nueva -->
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
                  item-title="name"
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
              <v-btn class="border-sm bg-warning font-weight-bold" @click="onAddConfirm">
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

    <!-- Dialog info de comida seleccionada -->
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
      selectedMealInfo: null,
      grams: null,
      customName: '',
      customCaloriesPer100g: null,
      customProteinPer100g: null,
      customCarbsPer100g: null,
      customFatPer100g: null,
      customSodiumPer100g: null,
      customFiberPer100g: null,
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
    closeAddDialog() {
      this.showDialog = false
      this.resetAddDialog()
    },
    async onAddConfirm() {
      const form = this.$refs.form
      if (form && typeof form.validate === 'function' && !form.validate()) return
      if (!this.selectedMeal) return
      if (this.selectedMeal.name === 'Otra') {
        this.showDialog = false
        this.openCustomDialog()
      } else {
        await this.addMealEntry()
      }
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
        const res = await axios.post('http://localhost:3000/api/foods/entry', payload)
        if (res.status === 200 || res.status === 201) {
          console.log('[MealsCard] Entrada guardada')
          await this.fetchEatenMeals()
          eventBus.emit('progress-updated')
        }
      } catch (error) {
        console.error('Error al agregar entrada de comida:', error.response?.status, error.response?.data)
      }
      this.closeAddDialog()
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
        const res = await axios.post('http://localhost:3000/api/foods', payload)
        if (res.status === 201) {
          console.log('[MealsCard] Nueva comida creada')
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
          axios.get('http://localhost:3000/api/foods', { params: { userId } }),
          axios.get(`http://localhost:3000/api/diet/restricted-foods/${userId}`)
        ])
        const restrictedNames = restrictedRes.data.map(f => f.name.toLowerCase())
        // Mapear respuesta snake_case a camelCase y filtrar localmente si se desea
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
        this.mealList = [...filtered, { name: 'Otra' }]
      } catch (error) {
        console.error('Error al obtener comidas:', error)
      }
    },
    async fetchEatenMeals() {
      try {
        const userId = this.$store.state.main.user.userId
        const res = await axios.get(`http://localhost:3000/api/foods/entry/${userId}`)
        this.mealHistory = res.data.entries || []
      } catch (error) {
        console.error('Error al obtener comidas registradas:', error)
      }
    }
  },
  async created() {
    await this.fetchMeals()
    await this.fetchEatenMeals()
  }
}
</script>
