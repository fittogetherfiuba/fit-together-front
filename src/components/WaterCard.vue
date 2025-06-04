<template>
  <v-card class="pb-4 mt-4" elevation="10">
    <v-card-title
      class="mb-4 text-center font-weight-bold bg-secondary"
      style="font-size: 1.4rem;"
    >
      <v-icon start icon="mdi-water" />
      Agua consumida
    </v-card-title>
    <v-card-text
      class="font-weight-medium text-h4 d-flex justify-center"
      style="font-size: 1.2rem;"
    >
      {{ waterHistory }} {{ waterHistory === 1 ? 'litro' : 'litros' }}
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        class="border-sm font-weight-bold bg-warning"
        @click="showDialog = true"
      >
        Agregar agua
      </v-btn>
    </v-card-actions>

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

export default {
  name: 'WaterCard',
  data () {
    return {
      waterHistory: ref([]),
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
            "liters": parseInt(this.waterQuantity),
          }
          await axios.post('http://localhost:3000/api/water/entry', water)
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