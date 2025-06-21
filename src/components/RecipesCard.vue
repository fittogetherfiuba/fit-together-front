<template>
  <v-card class="pb-4" elevation="10">
      <v-img
        :src="recipe.pic ? recipe.pic : 'https://media.istockphoto.com/id/962353378/es/vector/icono-de-la-l%C3%ADnea-de-comida-r%C3%A1pida.jpg?s=612x612&w=0&k=20&c=Cwpt-q18AddBFbP0QXPrECC9VlUYK1CDtnXnr6k7a5A='"
        height="200"
        cover
      ></v-img>
    <v-card-title class="mb-4 font-weight-bold bg-primary d-flex flex-column" style="font-size: 1.4rem;">
      {{ recipe.name }}
<span style="font-size: 0.9rem;">
  <span class="font-weight-bold">Autor:  </span>
  <span class="font-weight-regular"> {{ recipe.username }}</span>
</span>
    </v-card-title>
    <v-card-text>
<span class="text-h6">
  <span class="font-weight-bold">Calorías totales:  </span>
  <span class="font-weight-regular"> {{ recipe.totalCalories }}</span>
</span>
      <br/>
      <span class="font-weight-bold text-h6">Ingredientes:</span>
      <v-list-item class="border-b"  v-for="(food, index) in recipe.items" :key="index">
        <v-list-item-title> 
          {{ food.foodName }}: {{ food.grams }}g
        </v-list-item-title>
      </v-list-item>
      <br/>
      <span class="font-weight-bold text-h6">Pasos:</span>
      <v-list-item class="border-b"  v-for="(line, index) in stepsArray" :key="index">
        <v-list-item-title> 
          {{ line }}
        </v-list-item-title>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'RecipesCard',
  data () {
    return {
      
    }
  },

  props: {
    recipe: Object,
  },

  computed: {
    stepsArray() {
      return this.recipe.steps.split('\n');
    }
  },

  methods: {
    
  },
}


</script>