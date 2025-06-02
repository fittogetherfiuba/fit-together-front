<template>
  <v-container fluid class="d-flex align-center justify-center fill-height">
    <v-row justify="center" align="start">
      <v-col cols="12" class="text-center mb-4 text-h6">
        <v-btn class="border-sm bg-secondary text-h5 w-25 mb-4 font-weight-bold" @click="showDialog = true">Agregar Receta</v-btn>
        <span class="d-flex text-h5 justify-center font-weight-bold" v-if="recipesList.length === 0">No hay recetas registradas</span>
        <v-dialog v-model="showDialog" max-width="650px" style="max-height: 80vh;" @after-leave="closeDialog">
          <v-card class="" color="secondary">

            <v-row justify="center">
                <v-col>
                    <v-card-title class="my-1 font-weight-bold bg-secondary" style="font-size: 1.4rem;">
                        <v-icon start icon="mdi-account-multiple-outline"></v-icon>
                        Agregar nueva receta
                    </v-card-title>
                </v-col>
                <v-col align="end">
                    
                    <v-btn
                    class="mr-1 mt-1"
                    icon
                    color="secondary"
                    @click="showDialog = false"
                    size="medium"
                    elevation="0"
                    >
                        <v-icon>
                        mdi-close
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <v-card class="mx-5 mb-3 pa-5"  style="overflow-y: auto;">
              <v-form ref="form">
                <v-text-field class="mb-4" v-model="name" :rules="[rules.nameRequired]" variant="outlined" label="Nombre" />
                <span class="font-weight-bold">Ingredientes:</span>
                <div class="d-flex ga-3 mt-2 mb-3" v-for="(ingredient, index) in ingredients" :key="index">
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
                  class="mt-3 mb-4" 
                  :rules="[rules.stepsRequired]" 
                  variant="outlined"
                  :placeholder="'Escribe los pasos de la receta de esta forma: \n1. Paso uno. \n2. Paso dos. \n3. Paso tres.'"
                />
                <span class="font-weight-bold">Foto del plato:</span>
                <v-text-field
                  class="mt-3"
                  :rules="[rules.picRequired]" 
                  v-model="picUrl"
                  label="Introducí el URL de la foto"
                  placeholder="https://..."
                  append-inner-icon="mdi-link-variant"
                  @click:append="searchPicUrl"
                  @keydown.enter="searchPicUrl"
                ></v-text-field>

                <v-img v-if="showPic"
                  @error="handlePicError"
                  :src="picUrl"
                  class="mx-auto mb-4"
                  max-width="350"
                  max-height="350"
                  cover
                ></v-img>

                <v-alert
                v-if="picError"
                text
                type="error"
                class="mx-auto mt-2 mb-1"
                density="compact"
                >
                La URL introducida no es correcta.
                </v-alert>
              </v-form>
            </v-card>
          
            <v-card-actions class="justify-end">
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
      picUrl: '',
      picError: false,
      showPic: false,
      form: null,
      recipesList: [],
      rules: {
        required: value => !!value || 'Debe ingresar una comida',
        nameRequired: value => !!value || 'Debe ingresar un nombre',
        foodRequired: value => !!value || 'Ingrese un valor',
        stepsRequired: value => !!value || 'Debe ingresar los pasos de la receta',
      }
    }
  },
  watch: {
    picUrl() {
      if (this.showPic) {
        console.log("cambie")
        this.showPic = false

      }
      if (this.picError) {
        this.picError = false
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
      this.picUrl = '';
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
          if (!this.picError && this.showPic) {
            recipe["pic"] = this.picUrl
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
    searchPicUrl () {
      this.showPic = true
    },
    handlePicError () {
      this.picError = true;
      this.showPic = false;
    }
  },

  async created () {
    await this.fetchMeals()
    await this.fetchRecipes()
  }
}

</script>