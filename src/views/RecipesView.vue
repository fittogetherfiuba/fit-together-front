<template>
  <v-container fluid class="d-flex align-center justify-center fill-height">
    <v-row justify="center" align="start">
      <v-col cols="12" class="text-center mb-4 text-h6">
        <v-btn class="border-sm bg-secondary text-h5 w-25 mb-4 font-weight-bold" @click="showDialog = true">Agregar Receta</v-btn>
        <span class="d-flex text-h5 justify-center font-weight-bold" v-if="recipesList.length === 0">No hay recetas registradas</span>
        <v-dialog v-model="showDialog" max-width="625px" style="overflow-y: auto; max-height: 80vh;" @after-leave="closeDialog">
          <v-card class="d-flex align-center">
            <v-card-title class="pa-0 w-100">
              <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
                <v-col class="d-flex justify-center align-center">
                  <v-icon start icon="mdi-note-text-outline"></v-icon>
                  <span class="text-h6 font-weight-bold">Agregar receta</span>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="pt-8 w-75">
              <v-form ref="form">
                <v-text-field v-model="name" :rules="[rules.nameRequired]" variant="outlined" label="Nombre" />
                <span class="font-weight-bold">Ingredientes:</span>
                <div class="d-flex ga-3 mt-2" v-for="(ingredient, index) in ingredients" :key="index">
                  <v-autocomplete
                    v-model="ingredient.selectedMeal"
                    :items="mealList"
                    class="flex-grow-1"
                    label="Comida"
                    variant="outlined"
                    return-object
                    :rules="[rules.required]"
                    clearable
                    item-title="name"
                    :menu-props="{ maxHeight: '200px' }"
                  />
                  <v-text-field v-model="ingredient.grams" 
                    :rules="[rules.foodRequired]"
                    class="flex-grow-0 w-33"
                    variant="outlined" 
                    label="Cantidad (g)"
                    type="number" 
                    min="0" 
                  />
                </div>
                <v-col cols="12" class="d-flex justify-center pa-0">
                  <v-btn class="border-sm bg-secondary w-25 text-h5 font-weight-bold" @click="addIngredient">+</v-btn>
                </v-col>
                <br/>
                <span class="font-weight-bold">Pasos:</span>
                <v-textarea v-model="steps" 
                  class="mt-3" 
                  :rules="[rules.stepsRequired]" 
                  variant="outlined"
                  :placeholder="'Escribe los pasos de la receta de esta forma: \n1. Paso uno. \n2. Paso dos. \n3. Paso tres.'"
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="pb-4 justify-end">
              <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialog">Cancelar</v-btn>
              <v-btn class="border-sm bg-warning font-weight-bold" @click="handleAddRecipe">Agregar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col cols="12" sm="8" md="10">
        <v-row justify="center" align="start">
          <v-col cols="12" sm="4" v-for="(recipe, index) in recipesList" :key="index">
            <Recipes :recipe="recipe" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import Recipes from '../components/RecipesCard.vue'
import axios from 'axios'

export default {
  name: 'RecipesView',
  components: {
    Recipes
  },

  data () {
    return {
      showDialog: false,
      mealList: [],
      name: '',
      steps: '',
      ingredients: [
        {
          selectedMeal: null,
          grams: ''
        }
      ],
      form: null,
      recipesList: [],
      rules: {
        required: value => !!value || 'Debe ingresar una comida',
        nameRequired: value => !!value || 'Debe ingresar un nombre',
        foodRequired: value => !!value || 'Ingrese un valor',
        stepsRequired: value => !!value || 'Debe ingresar los pasos de la receta'
      }
    }
  },

  methods: {
    addIngredient() {
      this.ingredients.push({ selectedMeal: null, grams: '' });
    },
    closeDialog() {
      this.showDialog = false;
      this.ingredients = [{ selectedMeal: null, grams: '' }];
      this.name = '';
      this.steps = '';
    },
    async handleAddRecipe(){
      const isValid = this.$refs.form.validate()
      if (!isValid) {
        return
      }

      if (this.name && this.steps && this.ingredients.length > 0) {
        try {
          const recipe = {
            "userId": this.$store.state.main.user.userId,
            "name": this.name,
            "items": this.ingredients.map(ingredient => ({
              foodId: ingredient.selectedMeal.id,
              grams: parseInt(ingredient.grams)
            })),
            "steps": this.steps,
          }
          await axios.post('http://localhost:3000/api/recipes/create', recipe)
          this.fetchRecipes()
        } catch (error) {
          console.error('Error al obtener recetas:', error)
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
    async fetchRecipes() {
      try {
        const response = await axios.get('http://localhost:3000/api/recipes/get?userId=' + this.$store.state.main.user.userId.toString())
        this.recipesList = response.data.recipes
      } catch (error) {
        console.error('Error al obtener recetas:', error)
      }
    },
  },

  async created () {
    await this.fetchMeals()
    await this.fetchRecipes()
  }
}

</script>