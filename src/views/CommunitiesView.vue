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
              <div style="font-size: 20px;" class="font-weight-bold mt-2">No estas suscripto a ninguna comunidad</div>
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
                      Ver posteos
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
              <div style="font-size: 20px;" class="font-weight-bold mt-2">No hay comunidades nuevas disponibles</div>
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

  <v-dialog v-model="showDialogPosts" max-width="650px" style="overflow-y: auto; max-height: 70vh;" @after-leave="closeDialogPosts">
    <v-card class="d-flex align-center">
      <v-card-title class="pa-0 w-100">
        <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
          <v-col class="d-flex justify-center align-center">
            <v-icon start icon="mdi-account-group"></v-icon>
            <span class="text-h6 font-weight-bold">Posteos de {{this.selectedCommunity.name}}</span>
          </v-col>
        </v-row>
      </v-card-title>
      <span class="d-flex text-h6 pa-6 justify-center font-weight-bold" v-if="communityPosts.length === 0">No hay posteos en esta comunidad</span>
      <v-card-text class="w-75" v-for="(post, index) in communityPosts" :key="index">
          <v-card class="border-sm">
              <v-card-subtitle class="pt-3">
                <p>{{ post.topic }}</p>
              </v-card-subtitle>
              <v-card-title class="mb-4 pt-0 font-weight-bold">
                <p>{{ post.title }}</p>
              </v-card-title>
              <v-card-text>
                <v-data-iterator
                  :items="parsePhotos(post.photos)"
                  :items-per-page="1"
                >
                  <template v-slot:default="{ items }">
                    <v-row class="mx-3 mt-3">
                      <v-col v-for="(photo, i) in items" :key="i" cols="12" class="d-flex">
                        <v-img
                          :src="photo.raw.url"
                          height="250"
                          cover
                        ></v-img>
                      </v-col>
                    </v-row>
                  </template>

                  <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
                    <v-footer class="justify-center">
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
                    </v-footer>
                  </template>
                </v-data-iterator>
                <p>{{ post.body }}</p>
              </v-card-text>
          </v-card>
      </v-card-text>
      <v-card-actions class="pb-3 justify-end">
        <v-btn class="border-sm bg-secondary font-weight-bold" @click="showDialogCreatePost = true">Crear post</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showDialogCreatePost" max-width="550px" style="overflow-y: auto; max-height: 70vh;" @after-leave="closeDialogCreatePost">
    <v-card class="d-flex align-center">
      <v-card-title class="pa-0 w-100">
        <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
          <v-col class="d-flex justify-center align-center">
            <v-icon start icon="mdi-account-group"></v-icon>
            <span class="text-h6 font-weight-bold">Crear post</span>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-8 w-75">
        <v-form ref="postForm">
          <v-text-field v-model="postTopic" :rules="[rules.nameRequired]" variant="outlined" label="Topico" />
          <v-text-field v-model="postTitle" :rules="[rules.nameRequired]" variant="outlined" label="Titulo" />
          <v-textarea v-model="postBody" 
            class="mt-3" 
            :rules="[rules.descriptionRequired]" 
            variant="outlined"
            placeholder="Escribe el texto del post"
          />
          <div v-for="(photo, index) in postPhotos" :key="index">
            <v-text-field
              class="mt-3"
              :rules="[rules.picRequired]" 
              v-model="photo.url"
              label="Introducí el URL de la foto"
              placeholder="https://..."
              append-inner-icon="mdi-link-variant"
              variant="outlined"
            ></v-text-field>
          </div>
          <v-col cols="12" class="d-flex justify-center pa-0">
            <v-btn class="border-sm bg-secondary w-25 text-h5 font-weight-bold" @click="addUrl">+</v-btn>
          </v-col>
        </v-form>
      </v-card-text>
      <v-card-actions class="pb-3 justify-end">
        <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialogCreatePost">Cancelar</v-btn>
        <v-btn class="border-sm bg-warning font-weight-bold" @click="handleCreatePost(this.selectedCommunity)">Crear</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
</template>


<script>
import axios from 'axios'

export default {
  name: 'CommunitiesView',

  data () {
    return {
      showDialog: false,
      showDialogPosts: false,
      showDialogCreatePost: false,
      communitiesList: [],
      subscribedCommunitiesList: [],
      selectedCommunity: null,
      selectedPhoto: '',
      communityPosts: [],
      name: '',
      description: '',
      postTitle: '',
      postBody: '',
      postTopic: '',
      postPhotos: [{url: ''}],
      form: null,
      postForm: null,
      itemsPerPage: 4,
      rules: {
        nameRequired: value => !!value || 'Debe ingresar un nombre',
        descriptionRequired: value => !!value || 'Debe ingresar un texto',
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
    closeDialogPosts() {
      this.showDialogPosts = false
    },
    closeDialogCreatePost() {
      this.showDialogCreatePost = false
      this.postTitle = '';
      this.postBody = '';
      this.postTopic = '';
      this.postPhotos = [];
    },
    addUrl(){
      this.postPhotos.push({url: ''});
    },
    parsePhotos(photoStrings) {
      return photoStrings.map(p => {
        try {
          return JSON.parse(p);
        } catch (e) {
          console.error("Foto inválida", e);
          return {};
        }
      });
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
    async handleViewPosts(community) {
      this.selectedCommunity = community
      this.showDialogPosts = true
      this.fetchCommunityPosts(community)
    },
    async handleCreatePost(community) {
      const isValid = this.$refs.postForm.validate()
      if (!isValid) {
        return
      }

      if(this.postTitle && this.postBody && this.postTopic) {
        try{
          const post = {
            userId: this.$store.state.main.user.userId,
            communityId: community.id,
            title: this.postTitle,
            body: this.postBody,
            topic: this.postTopic,
            photos: this.postPhotos
          }
          await axios.post('http://localhost:3000/api/communities/posts', post)
          this.fetchCommunityPosts(community)
          this.closeDialogCreatePost()
        } catch (error) {
          console.error('Error al crear el post:', error)
        }
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
    async fetchCommunityPosts(community) {
      try {
        const response = await axios.get('http://localhost:3000/api/communities/' + community.id + '/posts')
        this.communityPosts = response.data.posts
      } catch (error) {
        console.error('Error al obtener posteos de la comunidad:', error)
      }
    },
  },

  async created () {
    await this.fetchSubscribedCommunities()
    await this.fetchCommunities()
  }
}

</script>