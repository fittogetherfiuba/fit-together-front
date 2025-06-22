<template>
  <v-container fluid class="bg-background">
  <v-card class="mx-5 my-8" style="max-height: 480px; min-height: 480px; overflow-y: auto;">
    <v-card-title
      class="font-weight-bold d-flex align-center flex-row bg-secondary"
      style="font-size: 1.8rem; position: sticky; top: 0; z-index: 1;"
    >
      <v-icon start class="mb-1" icon="mdi-account-group" style="font-size: 2.2rem;"></v-icon>
      Comunidades suscriptas

      <v-spacer></v-spacer>

      <v-btn class="mr-5" variant="tonal" @click="showDialog = true">
        Nueva comunidad
      </v-btn>
    </v-card-title>

    <v-container class="py-4">
      <v-row dense>
        <template v-if="subscribedCommunitiesList.length">
          <v-col
            v-for="(community, i) in subscribedCommunitiesList"
            :key="i"
            cols="12"
          >
            <v-card elevation="10" class="d-flex flex-column mb-2 border-sm border-opacity-50">
              <v-card-title class="font-weight-bold border-b" style="font-size: 1.4rem;">
                <v-icon start icon="mdi-account-file-outline"></v-icon>
                {{ community.name }}
              </v-card-title>
              <div class="d-flex flex-row">
                <v-card-text>
                  <p class="text-h6">{{ community.description }}</p>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    class="border-sm bg-secondary mr-5 font-weight-bold"
                    @click="handleViewPosts(community)"
                  >
                    Ingresar
                  </v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </v-col>
        </template>

        <template v-else>
          <v-col
            cols="12"
            class="d-flex align-center justify-center flex-column text-center"
            style="height: 100%; min-height: 380px;"
          >
            <v-icon color="grey" size="90">mdi-account-off-outline</v-icon>
            <div style="font-size: 20px;" class="mt-2">No estás suscripto a ninguna comunidad</div>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-card>


  
  <v-card class="mx-5 my-8" style="max-height: 480px; min-height: 480px; overflow-y: auto;">
    <v-card-title
      class="font-weight-bold d-flex align-center flex-row bg-secondary"
      style="font-size: 1.8rem; position: sticky; top: 0; z-index: 1;"
    >
      <v-icon start class="mb-1" icon="mdi-account-tag" style="font-size: 2.2rem;"></v-icon>
      Comunidades disponibles
    </v-card-title>

    <v-container class="py-4">
      <v-row dense>
        <template v-if="communitiesList.length">
          <v-col
            v-for="(community, i) in communitiesList"
            :key="i"
            cols="12"
          >
            <v-card elevation="10" class="d-flex flex-column mb-2 border-sm border-opacity-50">
              <v-card-title class="font-weight-bold border-b" style="font-size: 1.4rem;">
                <v-icon start icon="mdi-account-group"></v-icon>
                {{ community.name }}
              </v-card-title>
              <div class="d-flex flex-row">
                <v-card-text>
                  <p class="text-h6">{{ community.description }}</p>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    class="border-sm bg-secondary mr-5 font-weight-bold"
                    @click="handleSubscribeCommunity(community)"
                  >
                    Suscribirse
                  </v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </v-col>
        </template>

        <template v-else>
          <v-col
            cols="12"
            class="d-flex align-center justify-center flex-column text-center"
            style="height: 100%; min-height: 380px;"
          >
            <v-icon color="grey" size="90">mdi-account-off-outline</v-icon>
            <div style="font-size: 20px;" class="mt-2">No hay comunidades nuevas disponibles</div>
          </v-col>
        </template>

      </v-row>
    </v-container>
  </v-card>


  
  <v-dialog v-model="showDialog" max-width="550px" style="overflow-y: auto; max-height: 70vh;" @after-leave="closeDialog">
    <v-card class="d-flex align-center">
      <v-card-title class="pa-0 w-100">
        <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
          <v-col class="d-flex justify-center align-center">
            <v-icon start icon="mdi-account-group"></v-icon>
            <span class="text-h6 font-weight-bold">Crear comunidad</span>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-8 w-75">
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
      <v-card-actions class="pb-3 justify-end">
        <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialog">Cancelar</v-btn>
        <v-btn class="border-sm bg-warning font-weight-bold" @click="handleCreateCommunity">Crear</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-container>
</template>


<script>
import axios from 'axios'
const API_URL = import.meta.env.VITE_APP_API_URL

export default {
  name: 'CommunitiesView',

  data () {
    return {
      showDialog: false,
      communitiesList: [],
      subscribedCommunitiesList: [],
      name: '',
      description: '',
      form: null,
      itemsPerPage: 3,
      rules: {
        nameRequired: value => !!value || 'Debe ingresar un nombre',
        descriptionRequired: value => !!value || 'Debe ingresar un texto',
        commentRequired: value => !!value || '',
        picRequired: value => !!value || 'Debe ingresar una foto'
      }
    }
  },

  methods: {
    closeDialog() {
      this.showDialog = false;
      this.name = '';
      this.description = '';
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
          await axios.post(API_URL + 'communities/create', community)
          await this.fetchSubscribedCommunities()
          await this.fetchCommunities()
        } catch (error) {
          console.error('Error al crear comunidad:', error)
        }
        this.closeDialog()
      }
    },
    async handleSubscribeCommunity(community) {
      try {
        const communitySuscription = {
            userId: this.$store.state.main.user.userId, 
            communityId: community.id
        }
        await axios.post(API_URL + 'communities/subscribe', communitySuscription)
        await this.fetchSubscribedCommunities()
        await this.fetchCommunities()
      } catch (error) {
        console.error('Error al suscribirse a la comunidad:', error)
      }
    },
    async handleViewPosts(community) {
      console.log(community)
      this.$router.push('/communities/' + community.communityId)
    },
    async fetchCommunities() {
      
      try {
        const response = await axios.get(API_URL + 'communities/all')    
        this.communitiesList = response.data.communities.filter(
          community => !this.subscribedCommunitiesList.some(
            subscribed => subscribed.communityId === community.id
          )
        );
      } catch (error) {
        console.error('Error al obtener comunidades:', error)
      }
    },
    async fetchSubscribedCommunities() {
      try {
        const response = await axios.get(API_URL + 'communities?userId=' + this.$store.state.main.user.userId.toString())
        this.subscribedCommunitiesList = response.data.communities
        console.log(this.subscribedCommunitiesList)
      } catch (error) {
        console.error('Error al obtener comunidades suscriptas:', error)
      }
    },
  },

  async created () {
    await this.fetchSubscribedCommunities()
    await this.fetchCommunities()
  }
}

</script>