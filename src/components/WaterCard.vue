<template>
  <v-card class="pa-4 mt-4" elevation="10">
    <v-card-title class="text-h5 text-center font-weight-bold">Agua consumida</v-card-title>
    <v-card-text class="d-flex justify-center text-h5">
      {{ this.waterHistory }} litros
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn class="border-sm bg-warning" @click="showDialog = true">Agregar agua</v-btn>
    </v-card-actions>

    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title><span class="text-h6">Agregar agua</span></v-card-title>
        <v-text-field v-model="waterQuantity" label="Cantidad (litros)" type="number" min="0" />
        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="handleAddWater">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'WaterCard',
  data () {
    return {
      waterHistory: ref([]),
      showDialog: ref(false),
      waterQuantity: ref(null)
    }
  },

  methods: {
    closeDialog() {
      this.showDialog = false
      this.waterQuantity = null
    },
    async handleAddWater() {
      if (this.waterQuantity) {
        try {
          const water = {
            "userId": this.$store.state.main.user.userId,
            "liters": parseInt(this.waterQuantity),
          }
          await axios.post('http://localhost:3000/api/water/entry', water)
          this.fetchConsumedWater()
        } catch (error) {
          console.error('Error al obtener agua consumida:', error)
        }
        this.closeDialog()
      }
    },
    async fetchConsumedWater() {
      try {
        const response = await axios.get('http://localhost:3000/api/water/entries?userId=' + this.$store.state.main.user.userId.toString())
        const waterEntries = response.data.entries
        this.waterHistory = waterEntries.reduce((total, entry) => { 
          return total + parseInt(entry.liters) 
        }, 0)
      } catch (error) {
        console.error('Error al obtener agua consumida:', error)
      }
    }
  },

  async created () {
    await this.fetchConsumedWater()
  }

}

</script>