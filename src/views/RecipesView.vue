<template>
  <v-container fluid class="bg-background">
  <v-card class="mx-5 my-8">
    <v-data-iterator
      :items="recipesList"
      :items-per-page="itemsPerPage"
    >
      <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
          <v-card color="secondary rounded-0" style="width:100%" flat>
            <v-row class="align-center" justify="center">
                <v-col class="d-flex align-center" cols="5">
                  <v-card-title class="my-1 font-weight-bold bg-secondary" style="font-size: 1.8rem;">
                    <v-icon start class="mb-1" icon="mdi-note-text-outline" style="font-size: 2.2rem;"></v-icon>
                    Recetas
                  </v-card-title>
                </v-col>
                <v-col class="d-flex align-center justify-end flex-wrap mr-6" align="end">
                  <v-row justify="end">

                  
                  <v-autocomplete
                    class="mr-8 text-truncate chip-scroll"
                    density="compact"
                    style="max-width:620px; max-height:40px; overflow-y: auto;"
                    v-model="chips"
                    :items="ingredientsList"
                    placeholder="Seleccioná ingredientes para filtrar..."
                    prepend-icon="mdi-filter-variant"
                    variant="solo"
                    multiple
                    chips
                    clearable
                    closable-chips
                    item-title="name"
                    item-value="id"
                  ></v-autocomplete>
              
                  <v-btn
                    class="me-8"
                    variant="text"
                    @click="onClickSeeAll"
                  >
                    <span class="text-decoration-underline text-none">Ver todas</span>
                  </v-btn>

                  <v-btn 
                    class="mr-5"
                    icon="mdi-plus"
                    size="small"
                    variant="tonal"
                    @click="showDialog = true"
                  ></v-btn>

                  <v-btn
                    :disabled="page === 1"
                    class="mr-3"
                    icon="mdi-arrow-left"
                    size="small"
                    variant="tonal"
                    @click="prevPage"
                  ></v-btn>

                  <v-btn
                    class="mr-1"
                    :disabled="page === pageCount"
                    icon="mdi-arrow-right"
                    size="small"
                    variant="tonal"
                    @click="nextPage"
                  ></v-btn>
                  </v-row>
                </v-col>
            </v-row>
          </v-card>
      </template>

      <template v-slot:no-data>
        <v-card elevation="0" height="480"  class="d-flex align-center justify-center">
          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <v-icon color="grey" size="90">mdi-food-off</v-icon>
              <div style="font-size: 20px;" class="font-weight-bold mt-2">No hay recetas disponibles</div>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template v-slot:default="{ items }">
        
        <v-row class="mx-2 my-2">
          <v-col
            v-for="(item, i) in items"
            :key="i"
            cols="12"
            sm="6"
            xl="3"
          >
            <v-sheet border>
              <Recipes :recipe="item.raw" />              
            </v-sheet>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer="{ page, pageCount }">
        <v-footer
          class="justify-space-between mt-2"
          color="surface-variant"
        >
          Total de recetas: {{ recipesList.length }}

          <div>
            Página {{ page }} de {{ pageCount }}
          </div>
        </v-footer>
      </template>
    </v-data-iterator>
  </v-card>

  <v-dialog v-model="showDialog" max-width="650px" style="max-height: 80vh;" @after-leave="closeDialog">
    <v-card class="" color="secondary">

      <v-row justify="center">
          <v-col>
              <v-card-title class="my-1 font-weight-bold bg-secondary" style="font-size: 1.4rem;">
                  <v-icon start icon="mdi-food-outline"></v-icon>
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
      chips: [],
      ingredientsList: [],
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
      },

      itemsPerPage: 4,
    }
  },
  watch: {
    async chips() {
      await this.fetchRecipes()
    },
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
            "username": this.$store.state.main.user.username,
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
        const response = await axios.post('http://localhost:3000/api/recipes', {
          filterIngredients: this.chips
        })
        this.recipesList = response.data.recipes
        console.log(this.recipesList)
      } catch (error) {
        console.error('Error al obtener recetas:', error)
      }
    },
    async fetchIngredients() {
      try {
        const response = await axios.get('http://localhost:3000/api/foods')
        this.ingredientsList = response.data
        console.log(this.ingredientsList)
      } catch (error) {
        console.error('Error al obtener comidas:', error)
      }
    },
    searchPicUrl () {
      this.showPic = true
    },
    handlePicError () {
      this.picError = true;
      this.showPic = false;
    },
    onClickSeeAll () {
      this.itemsPerPage = this.itemsPerPage === 4 ? this.recipesList.length : 4
    }
  },

  async created () {
    await this.fetchMeals()
    await this.fetchRecipes()
    await this.fetchIngredients()
  }
}

</script>

<style scoped>

</style>