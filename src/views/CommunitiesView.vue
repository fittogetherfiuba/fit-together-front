<template>
  <v-container fluid class="bg-background">
  <v-card class="mx-5 my-8">
    <v-data-iterator
      :items="subscribedCommunitiesList"
      :items-per-page="itemsPerPage"
    >
      <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
          <v-card color="secondary rounded-0" style="width:100%" flat>
            <v-row justify="center">
                <v-col>
                  <v-card-title class="my-1 font-weight-bold bg-secondary" style="font-size: 1.8rem;">
                    <v-icon start class="mb-1" icon="mdi-account-group" style="font-size: 2.2rem;"></v-icon>
                    Comunidades suscriptas
                  </v-card-title>
                </v-col>
                <v-col class="my-4 mr-3" align="end">

                  <v-btn 
                    class="mr-5"
                    variant="tonal"
                    @click="showDialog = true"
                  >Nueva comunidad</v-btn>

                  <v-btn
                    :disabled="page === 1"
                    class="me-2"
                    icon="mdi-arrow-left"
                    size="small"
                    variant="tonal"
                    @click="prevPage"
                  ></v-btn>

                  <v-btn
                    :disabled="page === pageCount"
                    icon="mdi-arrow-right"
                    size="small"
                    variant="tonal"
                    @click="nextPage"
                  ></v-btn>
          
                </v-col>
            </v-row>
          </v-card>
      </template>

      <template v-slot:no-data>
        <v-card elevation="0" height="440" class="d-flex align-center justify-center">
          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <v-icon color="grey" size="90">mdi-account-group</v-icon>
              <div style="font-size: 20px;" class="mt-2">No estas suscripto a ninguna comunidad</div>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template v-slot:default="{ items }">
        <v-card style="min-height: 440px;">
          <v-row class="mx-3 my-3" style="min-height: 400px;">
            <v-col v-for="(community, i) in items" :key="i"
            cols="9"
            sm="3"
            xl="3"
            class="d-flex">
              <v-sheet class="w-100 d-flex flex-column flex-grow-1" border>
                <v-card class="pb-4 d-flex flex-column h-100" elevation="10">
                  <v-card-title class="mb-4 text-center d-flex justify-center align-center font-weight-bold bg-secondary" style="font-size: 1.4rem;">
                    <v-icon start icon="mdi-account-group"></v-icon>
                    {{ community.raw.name }}
                  </v-card-title>
                  <v-card-text>
                    <span class="font-weight-bold text-h6">Descripción</span>
                    <p class="text-h6">{{ community.raw.description }}</p>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn
                      class="border-sm bg-secondary font-weight-bold"
                      @click="handleViewPosts(community.raw)"
                    >
                      Ingresar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template v-slot:footer="{ page, pageCount }">
        <v-footer
          class="justify-space-between"
          color="surface-variant"
        >
          Total de comunidades: {{ subscribedCommunitiesList.length }}

          <div>
            Página {{ page }} de {{ pageCount }}
          </div>
        </v-footer>
      </template>
    </v-data-iterator>
  </v-card>
  
  <v-card class="mx-5 my-8">
    <v-data-iterator
      :items="communitiesList"
      :items-per-page="itemsPerPage"
    >
      <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
          <v-card color="secondary rounded-0" style="width:100%" flat>
            <v-row justify="center">
                <v-col>
                  <v-card-title class="my-1 font-weight-bold bg-secondary" style="font-size: 1.8rem;">
                    <v-icon start class="mb-1" icon="mdi-account-group" style="font-size: 2.2rem;"></v-icon>
                    Comunidades disponibles
                  </v-card-title>
                </v-col>
                <v-col class="my-4 mr-3" align="end">

                  <v-btn
                    :disabled="page === 1"
                    class="me-2"
                    icon="mdi-arrow-left"
                    size="small"
                    variant="tonal"
                    @click="prevPage"
                  ></v-btn>

                  <v-btn
                    :disabled="page === pageCount"
                    icon="mdi-arrow-right"
                    size="small"
                    variant="tonal"
                    @click="nextPage"
                  ></v-btn>
          
                </v-col>
            </v-row>
          </v-card>
      </template>

      <template v-slot:no-data>
        <v-card elevation="0" height="440" class="d-flex align-center justify-center">
          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <v-icon color="grey" size="90">mdi-account-group</v-icon>
              <div style="font-size: 20px;" class="mt-2">No hay comunidades nuevas disponibles</div>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template v-slot:default="{ items }">
        <v-card style="min-height: 440px;">
          <v-row class="mx-3 my-3" style="min-height: 400px;">
            <v-col v-for="(community, i) in items" :key="i"
            cols="9"
            sm="3"
            xl="3"
            class="d-flex">
              <v-sheet class="w-100 d-flex flex-column flex-grow-1" border>
                <v-card class="pb-4 d-flex flex-column h-100" elevation="10">
                  <v-card-title class="mb-4 text-center d-flex justify-center align-center font-weight-bold bg-secondary" style="font-size: 1.4rem;">
                    <v-icon start icon="mdi-account-group"></v-icon>
                    {{ community.raw.name }}
                  </v-card-title>
                  <v-card-text>
                    <span class="font-weight-bold text-h6">Descripción</span>
                    <p class="text-h6">{{ community.raw.description }}</p>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn class="border-sm bg-secondary font-weight-bold" @click="handleSubscribeCommunity(community.raw)">Suscribirse</v-btn>
                  </v-card-actions>
                </v-card>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template v-slot:footer="{ page, pageCount }">
        <v-footer
          class="justify-space-between"
          color="surface-variant"
        >
          Total de comunidades: {{ communitiesList.length }}

          <div>
            Página {{ page }} de {{ pageCount }}
          </div>
        </v-footer>
      </template>
    </v-data-iterator>
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
      itemsPerPage: 4,
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