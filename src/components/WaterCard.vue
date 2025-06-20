<template>
  <v-card class="pb-4 mt-4" elevation="10" height="200">
    <v-card-title class="bg-secondary text-white py-3 px-4">
      <v-row no-gutters class="align-center justify-space-between">
        <v-col cols="auto" class="d-flex align-center">
          <v-icon class="mr-2">mdi-water</v-icon>
          <span style="font-size: 1.5rem;" class="font-weight-bold">Agua consumida</span>
        </v-col>
        <v-btn size="small" icon variant="tonal" color="white" @click="showDialog = true">
          <v-icon size="x-large">mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </v-card-title>

    
    <v-card-text class="d-flex align-center justify-center text-center fill-height">
      <span class="font-weight-bold mb-8" style="font-size: 2.2rem;">
        {{ waterHistory.toFixed(2) }} 
      </span>
      <span class="mb-7 ml-2" style="font-size: 1.6rem;">
        {{ waterHistory === 1 ? ' litro' : ' litros' }}
      </span>
    </v-card-text>



    <v-dialog v-model="showDialog" max-width="450px">
      <v-card class="d-flex align-center">
        <v-card-title class="pa-0 w-100">
          <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
            <v-col class="d-flex justify-center align-center">
              <v-icon start icon="mdi-water"></v-icon>
              <span class="text-h6 font-weight-bold">Agregar agua</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-8 pb-3 w-75">
          <v-form ref="form">
            <v-text-field :rules="[rules.required]" variant="outlined" v-model="waterQuantity" label="Cantidad (litros)" type="number" min="0" />
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-4 justify-end">
          <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialog">Cancelar</v-btn>
          <v-btn class="border-sm bg-warning font-weight-bold" @click="handleAddWater">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import eventBus from '../eventBus';
const API_URL = import.meta.env.VITE_APP_API_URL

export default {
  name: 'WaterCard',
  data () {
    return {
      waterHistory: ref(0),
      showDialog: ref(false),
      waterQuantity: ref(null),
      form: ref(null),
      rules: {
        required: value => !!value || 'Debe ingresar una cantidad de agua',
      }
    }
  },

  methods: {
    closeDialog() {
      this.showDialog = false
      this.waterQuantity = null
    },
    async handleAddWater() {
      const isValid = this.$refs.form.validate()
      if (!isValid) {
        return 
      }

      if (this.waterQuantity) {
        try {
          const water = {
            "userId": this.$store.state.main.user.userId,
            "liters": parseFloat(this.waterQuantity),
          }
          await axios.post(API_URL + 'water/entry', water)
          this.fetchConsumedWater()
          eventBus.emit('progress-updated');
          console.log('[WaterCard] Emitido "progress-updated" tras agregar agua');
        } catch (error) {
          console.error('Error al obtener agua consumida:', error)
        }
        this.closeDialog()
      }
    },
    async fetchConsumedWater() {
      try {
        const response = await axios.get(API_URL + 'water/entries?userId=' + this.$store.state.main.user.userId.toString())
        const waterEntries = response.data.entries
        this.waterHistory = waterEntries.reduce((total, entry) => { 
          return total + parseFloat(entry.liters) 
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