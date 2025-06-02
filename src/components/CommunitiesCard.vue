<template>
  <v-card class="pb-4 mt-4" elevation="10">
    <v-card-title class="mb-4 text-center d-flex justify-center align-center font-weight-bold bg-secondary" style="font-size: 1.4rem;">
      <v-icon start icon="mdi-account-group"></v-icon>
      {{ community.name }}
    </v-card-title>
    <v-card-text>
      {{ community.description }}
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'CommunitiesCard',
  data () {
    return {
      
    }
  },

  props: {
    community: Object,
  },

  methods: {
    
  },
}


</script>