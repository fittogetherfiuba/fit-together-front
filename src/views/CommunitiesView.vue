<template>
  <v-container fluid class="d-flex align-start justify-center fill-height">
    <v-row justify="center" align="start">
      <v-col cols="12" class="text-center mt-10 mb-4 text-h6">
        <span class="d-flex text-h4 justify-center font-weight-bold">Comunidades suscriptas</span>
        <v-divider :thickness="2"></v-divider>
        <v-btn class="border-sm bg-secondary text-h5 w-25 mt-4 mr-4 mb-4 font-weight-bold" @click="showDialog = true">Crear Comunidad</v-btn>
        <v-btn class="border-sm bg-secondary text-h5 w-25 mt-4 mb-4 font-weight-bold" @click="showDialogSubscribe = true">Suscribirse a comunidad</v-btn>
        <span class="d-flex text-h5 justify-center font-weight-bold" v-if="communitiesList.length === 0">No estas suscripto a ninguna comunidad</span>

        <v-dialog v-model="showDialog" max-width="650px" style="overflow-y: auto; max-height: 70vh;" @after-leave="closeDialog">
          <v-card class="d-flex align-center">
            <v-card-title class="pa-3"><span class="text-h6 font-weight-bold">Crear Comunidad</span></v-card-title>
            <v-card-text class="w-75">
              <v-form ref="form">
                <v-text-field v-model="name" :rules="[rules.nameRequired]" variant="outlined" label="Nombre" />
                <span class="font-weight-bold">Descripcion:</span>
                <v-textarea v-model="description" 
                  class="mt-3" 
                  :rules="[rules.descriptionRequired]" 
                  variant="outlined"
                  placeholder="Escribe una descripcion sobre la comunidad"
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialog">Cancelar</v-btn>
              <v-btn class="border-sm bg-warning font-weight-bold" @click="handleCreateCommunity">Crear</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
        <v-dialog v-model="showDialogSubscribe" max-width="650px" style="overflow-y: auto; max-height: 70vh;" @after-leave="closeDialogSubscribe">
          <v-card class="d-flex align-center">
            <v-card-title class="pa-3"><span class="text-h6 font-weight-bold">Suscribirse a Comunidad</span></v-card-title>
            <v-card-text class="w-75">
              
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>

      <v-col cols="12" sm="8" md="10">
        <v-row justify="center" align="start">
          <v-col cols="12" sm="4" v-for="(community, index) in communitiesList" :key="index">
            <Communities :community="community" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import Communities from '../components/CommunitiesCard.vue'
import axios from 'axios'

export default {
  name: 'CommunitiesView',
  components: {
    Communities
  },

  data () {
    return {
      showDialog: false,
      showDialogSubscribe: false,
      communitiesList: [],
      name: '',
      description: '',
      form: null,
      rules: {
        nameRequired: value => !!value || 'Debe ingresar un nombre',
        descriptionRequired: value => !!value || 'Debe ingresar una descripcion'
      }
    }
  },

  methods: {
    closeDialog() {
      this.showDialog = false;
      this.name = '';
      this.description = '';
    },
    closeDialogSubscribe() {
      this.showDialogSubscribe = false
    },
    async handleCreateCommunity(){
      const isValid = this.$refs.form.validate()
      if (!isValid) {
        return
      }

      if (this.name && this.description) {
        try {
          const community = {
            "userId": this.$store.state.main.user.userId,
            "name": this.name,
            "description": this.description,
          }
          await axios.post('http://localhost:3000/api/communities/create', community)
          this.fetchCommunities()
        } catch (error) {
          console.error('Error al obtener comunidades:', error)
        }
        this.closeDialog()
      }
    },
    async fetchCommunities() {
      try {
        const response = await axios.get('http://localhost:3000/api/communities?userId=' + this.$store.state.main.user.userId.toString())
        this.communitiesList = response.data.communities
      } catch (error) {
        console.error('Error al obtener comunidades:', error)
      }
    },
  },

  async created () {
    //await this.fetchCommunities()
  }
}

</script>