<template>
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
        <v-card elevation="0" height="480"  class="d-flex align-center justify-center">
          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <v-icon color="grey" size="90">mdi-account-group</v-icon>
              <div style="font-size: 20px;" class="font-weight-bold mt-2">No estas suscripto a ninguna comunidad</div>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <template v-slot:default="{ items }">
        <v-row class="mx-2 my-2">
          <v-col v-for="(item, i) in items" :key="i"
          cols="9"
          sm="6"
          xl="3">
            <v-sheet class="w-100" border>
              <Communities :community="item.raw" />              
            </v-sheet>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer="{ page, pageCount }">
        <v-footer
          class="justify-space-between mt-2"
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
  
  <v-dialog v-model="showDialogSubscribe" max-width="550px" style="overflow-y: auto; max-height: 70vh;" @after-leave="closeDialogSubscribe">
    <v-card class="d-flex align-center">
      <v-card-title class="pa-0 w-100">
        <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
          <v-col class="d-flex justify-center align-center">
            <v-icon start icon="mdi-account-group"></v-icon>
            <span class="text-h6 font-weight-bold">Suscribirse a comunidad</span>
          </v-col>
        </v-row>
      </v-card-title>
      <span class="d-flex text-h6 pa-6 justify-center font-weight-bold" v-if="communitiesList.length === 0">No hay comunidades nuevas disponibles</span>
      <v-card-text class="w-75" v-for="(community, index) in communitiesList" :key="index">
          <v-card class="border-sm">
              <v-card-title class="mb-4 text-center font-weight-bold">
                  <v-icon start icon="mdi-account-group"></v-icon>
                  {{ community.name }}
              </v-card-title>
              <v-card-text>
                  <span class="font-weight-bold">Descripción:</span>
                  <p>{{ community.description }}</p>
              </v-card-text>
              <v-card-actions class="justify-end">
                  <v-btn class="border-sm bg-secondary font-weight-bold" @click="handleSubscribeCommunity(community)">Suscribirse</v-btn>
              </v-card-actions>
          </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
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
      subscribedCommunitiesList: [],
      name: '',
      description: '',
      form: null,
      itemsPerPage: 3,
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
          this.fetchSubscribedCommunities()
          this.fetchCommunities()
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
        await axios.post('http://localhost:3000/api/communities/subscribe', communitySuscription)
        this.fetchSubscribedCommunities()
        this.fetchCommunities()
      } catch (error) {
        console.error('Error al suscribirse a la comunidad:', error)
      }
    },
    async fetchCommunities() {
      try {
        const response = await axios.get('http://localhost:3000/api/communities/all')    
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
        const response = await axios.get('http://localhost:3000/api/communities?userId=' + this.$store.state.main.user.userId.toString())
        this.subscribedCommunitiesList = response.data.communities
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