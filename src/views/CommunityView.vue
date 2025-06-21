<template>
    <v-container fluid class="bg-background">
    <div>

        <v-row justify="center" >

        <v-col cols="5" class="pl-7 mt-10">
            <v-card class="">
                <v-card-title class="pa-0 w-100">
                    <v-row no-gutters class="text-center pa-2 bg-secondary w-100">
                    <v-col class="d-flex justify-center align-center">
                        <v-icon start icon="mdi-account-group"></v-icon>
                        <span class="text-h6 font-weight-bold"> {{ communityInfo.name }} </span>
                    </v-col>
                    </v-row>
                </v-card-title>
            </v-card>

        </v-col>
        <v-col class="pa-0 mt-12" cols="3">
            <v-card-actions>
                <v-btn class="border-sm bg-secondary" size="small" @click="showFilters = !showFilters" style="height: 38px; flex: 1 1 48%; min-width: 0">
                    <v-icon
                    class="mr-1"
                    size="x-large"
                    icon="mdi-filter"
                    ></v-icon>
                    Filtrar
                </v-btn>
                <v-btn class="border-sm bg-secondary" size="small" block @click="showDialogCreatePost = true" style="height: 38px; flex: 1 1 60%; min-width: 0">
                    <v-icon
                    size="x-large"
                    class="mr-1"
                    icon="mdi-plus"
                    ></v-icon>
                    Crear post
                </v-btn>
              <v-btn class="border-sm bg-secondary" size="small" block @click="showDialogMembers = true; fetchCommunityMembers()" style="height: 38px; flex: 1 1 48%; min-width: 0">
                <v-icon size="x-large" class="mr-1" icon="mdi-account-multiple-outline" />
                Miembros
              </v-btn>

            </v-card-actions>
        </v-col>

        <v-col v-if="showFilters" cols="7" class="mt-1 pl-7 pa-0">
            <v-card class="text-center bg-primary px-5 pt-5">
                <v-row no-gutters class="text-center pa-0" align="start">
                    <v-col cols="6">
                        <v-autocomplete
                        class="text-truncate chip-scroll pa-0 ml-3 mr-5"
                        density="compact"
                        v-model="topicFilters"
                        :items="topicList"
                        placeholder="Seleccioná tópicos para filtrar..."
                        prepend-icon="mdi-filter-variant"
                        variant="solo"
                        multiple
                        chips
                        clearable
                        closable-chips
                        item-title="name"
                        item-value="name"
                        ></v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-date-input
                          v-model="sinceFilter"
                          placeholder="Ver posteos desde..."
                          class="ml-5"
                          density="compact"
                          variant="solo"
                          persistent-placeholder
                        ></v-date-input>
                    </v-col>
                    <v-col>
                        <v-date-input
                          v-model="untilFilter"
                          placeholder="Ver posteos hasta..."
                          class="ml-9 mr-3"
                          prepend-icon=""
                          density="compact"
                          variant="solo"
                          persistent-placeholder
                        ></v-date-input>
                    </v-col>
                </v-row>
            </v-card>

    
        </v-col>
        <v-col class="py-0" cols="12">

        </v-col>
        <v-col cols="5" class="py-0 pr-1">
            <v-card-text  v-if="communityPosts.length === 0">
                <v-card elevation="0" height="460"  class="d-flex align-center justify-center border-sm">
                    <v-row justify="center" class="ml-5">
                        <v-col cols="12" class="text-center">
                        <v-icon color="grey" size="90">mdi-note-off-outline</v-icon>
                        <div style="font-size: 20px;" class="mt-2">Todavía no hay posteos en esta comunidad</div>
                        </v-col>
                    </v-row>
                </v-card>

            </v-card-text>
            <v-card-text v-for="(post, index) in communityPosts" :key="index">
                <v-card class="border-sm">
                    <v-card-subtitle class="pt-3">
                        <div class="d-flex align-center">
                            <v-img
                            :src="post.avatar"
                            cover
                            :max-width="30"
                            :height="30"
                            class="rounded-circle mr-2"
                            ></v-img>
                            <span class="font-weight-bold mr-1"> {{ post.author }} </span>
                            <span> | {{ post.createdAt.split('T')[0] }} </span>
                        </div>
                    </v-card-subtitle>

                    <v-card-title class="pt-0 font-weight-bold mt-2 mb-2">
                        <p class="ml-1">{{ post.title }}</p>
                        <v-chip color="secondary" size="small">
                            {{ post.topic }}
                        </v-chip>
                    </v-card-title>
                    <v-card-text>
                        <p class="ml-1 mb-4">{{ post.body }}</p>
                        <v-data-iterator
                        :items="parsePhotos(post.photos)"
                        :items-per-page="1"
                        >
                        <template v-slot:default="{ items }">
                            <v-row>
                            <v-col v-for="(photo, i) in items" :key="i" cols="12" class="d-flex">
                                <v-img
                                :src="photo.raw.url"
                                height="450"
                                cover
                                class="border-lg border-opacity-25"
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
                                size="x-small"
                                variant="tonal"
                                @click="prevPage"
                            ></v-btn>

                            <v-btn
                                :disabled="page === pageCount"
                                icon="mdi-arrow-right"
                                size="x-small"
                                variant="tonal"
                                @click="nextPage"
                            ></v-btn>
                            </v-footer>
                        </template>
                        </v-data-iterator>
                    </v-card-text>
                    <v-expansion-panels>
                        <v-expansion-panel @click="fetchCommunityComments(post)">
                        <v-expansion-panel-title class="my-1 font-weight-bold">
                            Comentarios ({{ this.postComments[post.id]?.length || 0 }})
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="pt-0">
                            <v-form :ref="el => commentForms[post.id] = el" class="d-flex flex-column">
                            <v-textarea
                                v-model="postCommentBody[post.id]"
                                variant="outlined"
                                placeholder="Escribe un comentario..."
                                :rows="2"
                                :rules="[rules.commentRequired]"
                                hide-details
                            ></v-textarea>
                            <v-btn
                                class="border-sm bg-secondary font-weight-bold mt-1 mb-2"
                                @click="handleCreateComment(post)"
                            >
                                Comentar
                            </v-btn>
                            </v-form>
                            <v-list>
                            <v-list-item v-for="(comment, i) in this.postComments[post.id] || []" :key="i">
                                <v-list-item-title>
                                <span class="font-weight-bold">{{ comment.username }}</span> • {{ getRelativeTime(comment.createdAt) }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="mb-1">{{ comment.body }}</v-list-item-subtitle>
                                <v-divider></v-divider>
                            </v-list-item>
                            </v-list>
                        </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card>
            </v-card-text>
        

        </v-col>
        <v-col cols="3" class="mt-4 pa-0">
            <v-card class="border-sm mb-3">
                <v-card-text class="pt-0">
                    <p class="mt-4 font-weight-bold">Sobre esta comunidad... </p>
                </v-card-text>
                <v-card-text class="pt-0 my-2">
                    <p class="mb-2">{{ communityInfo.description }}</p>
                </v-card-text>
            </v-card>
            <v-card class="border-sm mb-3">
                <v-card-text class="pt-0">
                    <p class="mt-4 font-weight-bold">Creador de la comunidad </p>
                </v-card-text>
                <v-list class="pt-0 mt-0 mb-2 mx-2">
                    <v-list
                    :items="creatorInfo"
                    item-props
                    lines="three"
                    >
                    <template v-slot:subtitle="{ subtitle }">
                        <div v-html="subtitle"></div>
                    </template>
                    </v-list>
                </v-list>
            </v-card>
            <v-card class="border-sm">
                <v-card-text class="pt-0">
                    <p class="mt-4 font-weight-bold">Fitters suscritos </p>
                </v-card-text>
                <v-card-title class="pt-0">
                    <p class="mb-3"> {{ communityInfo.subscribers }} </p>
                </v-card-title>
                    <!--<v-card-subtitle class="pt-3">
                        <p>Fitters suscritos</p>
                    </v-card-subtitle>-->
            </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="showDialogCreatePost" max-width="650px" style="max-height: 80vh;" @after-leave="closeDialogCreatePost">
        <v-card class="" color="secondary">

        <v-row justify="center">
            <v-col>
                <v-card-title class="my-1 font-weight-bold bg-secondary" style="font-size: 1.4rem;">
                    <v-icon start icon="mdi-account-group"></v-icon>
                    Crear post
                </v-card-title>
            </v-col>
            <v-col align="end">
                
                <v-btn
                class="mr-1 mt-1"
                icon
                color="secondary"
                @click="showDialog = false"
                size="medium"
                elevation="0"
                >
                    <v-icon>
                    mdi-close
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>

        <v-card class="mx-5 mb-3 pa-5"  style="overflow-y: auto;">
            <v-form ref="postForm">
            <v-text-field class="mb-3" v-model="postTitle" :rules="[rules.nameRequired]" variant="outlined" label="Título" />
            <v-autocomplete
              v-model="postTopic"
              :items="topicList"
              label="Tópico"
              :rules="[rules.topicRequired]"
              variant="outlined"
              clearable
              item-title="name"
              :menu-props="{ maxHeight: '200px' }"
            />
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
        </v-card>
        
        <v-card-actions class="pb-3 justify-end">
            <v-btn class="border-sm bg-error font-weight-bold" text @click="closeDialogCreatePost">Cancelar</v-btn>
            <v-btn class="border-sm bg-warning font-weight-bold" @click="handleCreatePost(this.selectedCommunity)">Crear</v-btn>
        </v-card-actions>

        </v-card>
    </v-dialog>


    <v-dialog v-model="a" max-width="550px" style="overflow-y: auto; max-height: 70vh;" @after-leave="closeDialogCreatePost">
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
            <v-text-field class="mb-3" v-model="postTitle" :rules="[rules.nameRequired]" variant="outlined" label="Título" />
            <v-autocomplete
              v-model="postTopic"
              :items="topicList"
              label="Tópico"
              :rules="[rules.topicRequired]"
              variant="outlined"
              clearable
              item-title="name"
              :menu-props="{ maxHeight: '200px' }"
            />
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
  <v-dialog v-model="showDialogMembers" max-width="500px">
    <v-card>
      <v-card-title class="bg-secondary font-weight-bold d-flex justify-between align-center">
        <span>Miembros de {{ communityInfo.name }}</span>
        <v-btn icon @click="showDialogMembers = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-list v-if="communityMembers.length">
          <v-list-item
              v-for="(member, index) in communityMembers"
              :key="index"
              class="px-3 py-2"
          >
            <v-row class="align-center w-100">
              <v-col cols="auto">
                <v-avatar size="45">
                  <v-img :src="member.image_url" cover />
                </v-avatar>
              </v-col>
              <v-col>
                <div class="font-weight-medium">{{ member.fullname }}</div>
                <div class="text-caption text-grey-darken-1">{{ member.username }}</div>
              </v-col>
              <v-col cols="auto">
                <v-btn
                    icon
                    color="info"
                    @click="sendFriendRequest(member.username)"
                    :disabled="member.username === $store.state.main.user.username || pendingRequests.includes(member.username)"
                >
                  <v-icon>
                    {{ pendingRequests.includes(member.username) ? 'mdi-clock-outline' : 'mdi-account-plus' }}
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
        <v-alert v-else type="info">No hay miembros en esta comunidad</v-alert>
      </v-card-text>
    </v-card>

  </v-dialog>
  </v-container>

</template>
  
  
  
  <script>
  import axios from 'axios'
  import UserService from '../services/user.service';
  import defaultPostImage from '../assets/img1.png';
  import eventBus from '../eventBus';
  const API_URL = import.meta.env.VITE_APP_API_URL
  
  export default {
    name: 'CommunityView',
    data () {
      return {
        showDialogCreatePost: false,
        topicList: [],
        topicFilters: [],
        postTitle: '',
        postBody: '',
        postTopic: null,
        postPhotos: [{url: ''}],
        showFilters: false,
        sinceFilter: null,
        untilFilter: null,
        communityInfo: {
            name: '',
            description: '',
        },
        membersAmount: null,
        creatorInfo: [{
            prependAvatar: '',
            title: null,
            subtitle: null
        }],
        communityPosts: [],
        postComments: [],
        postCommentBody: {},
        commentForms: [],
        communityMembers: [],
        pendingRequests: [],
        showDialogMembers: false,
        rules: {
            nameRequired: value => !!value || 'Debe ingresar un nombre',
            topicRequired: value => !!value || 'Debe ingresar un tópico',
            descriptionRequired: value => !!value || 'Debe ingresar un texto',
            commentRequired: value => !!value || '',
            picRequired: value => !!value || 'Debe ingresar una foto'
        }
      }
    },
    watch: {
        async topicFilters() {
            await this.fetchCommunityPosts(this.$route.params.id)
        },
        async untilFilter() {
            await this.fetchCommunityPosts(this.$route.params.id)
        },
        async sinceFilter() {
            await this.fetchCommunityPosts(this.$route.params.id)
        }
    },
    async mounted () { 
        await this.fetchCommunityInfo();
        const response = await UserService.getUserInfoByUsername(this.communityInfo.creatorUsername)
        this.creatorInfo[0].title = response.data.fullname
        this.creatorInfo[0].subtitle = response.data.username
        this.creatorInfo[0].prependAvatar = response.data.image_url

        await this.fetchCommunityPosts(this.$route.params.id)
        await this.fetchTopicList()
        this.membersAmount = 200
        console.log(this.communityPosts)
    },

    methods: {
        closeDialogCreatePost() {
            this.showDialogCreatePost = false
            this.postTitle = '';
            this.postBody = '';
            this.postTopic = null;
            this.postPhotos = [{url: ''}];
        },
        async fetchCommunityInfo() {
            try {
                const response = await axios.get(API_URL + 'communities/all') 
                this.communityInfo = response.data.communities.find(community => community.id.toString() === this.$route.params.id)  
            } catch (error) {
                console.error('Error al obtener comunidades:', error)
            }
        },

        async fetchCommunityPosts(communityId) {
            try {
                const params = new URLSearchParams();

                if (this.sinceFilter) {
                    params.append('since', this.sinceFilter.toISOString().split('T')[0]); 
                }
                if (this.untilFilter) {
                    params.append('until', this.untilFilter.toISOString().split('T')[0]);
                }

                const response = await axios.post(API_URL + 'communities/' + communityId + '/posts?' + params.toString(), {
                    topics: this.topicFilters
                })
                this.communityPosts = response.data.posts

                for (const post of this.communityPosts) {
                    const response = await UserService.getUserInfoByUsername(post.author)
                    post.avatar = response.data.image_url
                }

                this.communityPosts.forEach(post => {
                    this.fetchCommunityComments(post)
                })
            } catch (error) {
                console.error('Error al obtener posteos de la comunidad:', error)
            }
        },
        async fetchCommunityMembers() {
          try {
            const response = await axios.get(API_URL + `communities/${this.communityInfo.id}/members`);
            this.communityMembers = response.data.members;
          } catch (err) {
            console.error('Error al obtener miembros:', err);
          }
        },
        async sendFriendRequest(username) {
            try {
                await axios.post(API_URL + 'friends/requests', {
                  senderUsername: this.$store.state.main.user.username,
                  receiverUsername: username
                });
                await this.notifyRequest(username);
                this.pendingRequests.push(username); // marcar como pendiente
                this.$toast?.success('Solicitud enviada');
            } catch (error) {
                console.error(error);
                this.$toast?.error('Error al enviar solicitud');
            }
        },
        async notifyRequest(username) {
            try {
                const notification = {
                    username: username,
                    message: `👤 Nueva solicitud de amistad de '${this.$store.state.main.user.username}'`,
                }
                await axios.post('http://localhost:3000/api/notifications/create', notification)
            } catch (error) {
                console.error('Error al enviar la notificación:', error)
            }
        },
        async fetchCommunityComments(post) {
            try {
                const response = await axios.get(API_URL + 'communities/posts/' + post.id + '/comments')
                this.postComments[post.id] = response.data.comments
            } catch (error) {
                console.error('Error al obtener comentarios del post:', error)
            }
        },

        async fetchTopicList() {
            try {
                const response = await axios.get(API_URL + 'communities/topics')
                this.topicList = response.data.topics
            } catch (error) {
                console.error('Error al obtener comentarios del post:', error)
            }
        },

        async handleCreatePost() {
            const isValid = this.$refs.postForm.validate()
            if (!isValid) {
                return
            }
          if (!this.postPhotos.some(photo => photo.url && photo.url.trim() !== '')) {
            this.postPhotos = [{ url: defaultPostImage }];
          }

            if (this.postTitle && this.postBody && this.postTopic) {
                try {
                    const post = {
                        userId: this.$store.state.main.user.userId,
                        communityId: this.communityInfo.id,
                        title: this.postTitle,
                        body: this.postBody,
                        topic: this.postTopic,
                        photos: this.postPhotos
                    }
                    await axios.post(API_URL + 'communities/posts', post)
                    this.fetchCommunityPosts(this.$route.params.id)
                    this.notifyPost()
                    this.closeDialogCreatePost()
                } catch (error) {
                    console.error('Error al crear el post:', error)
                }
            }
        },

        async notifyPost() {
            await this.fetchCommunityMembers()
            for (const member of this.communityMembers) {
                
                try {
                    const notification = {
                        user_id: member.id,
                        message: `👥 Nuevo post en la comunidad '${this.communityInfo.name}'`,
                    }
                    await axios.post('http://localhost:3000/api/notifications/create', notification)
                    eventBus.emit('new-notification');
                } catch (error) {
                    console.error('Error al enviar la notificación:', error)
                }
            }
        },

        async handleCreateComment(post) {
            const formRef = this.commentForms[post.id];
            if (!formRef) {
                console.warn('No se encontró el formulario para el índice', post.id);
                return;
            }

            const { valid } = await formRef.validate();
            if (!valid) {
                return;
            }

            const commentBody = this.postCommentBody[post.id]
            if (commentBody) {
                try {
                    const comment = {
                        userId: this.$store.state.main.user.userId,
                        postId: post.id,
                        body: commentBody
                    }
                    await axios.post(API_URL + 'communities/posts/' + post.id + '/comments', comment)
                    this.fetchCommunityComments(post)
                    this.postCommentBody[post.id] = ''
                } catch (error) {
                    console.error('Error al crear el comentario:', error)
                }
            }
        },

        addUrl(){
        this.postPhotos.push({url: ''});
        },

        getRelativeTime(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diff = Math.floor((now - date) / 1000); // diferencia en segundos

            if (diff < 60) return `${diff} s`;
            if (diff < 3600) return `${Math.floor(diff / 60)} min`;
            if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
            if (diff < 2592000) return `${Math.floor(diff / 86400)} d`;
            if (diff < 31104000) return `${Math.floor(diff / 2592000)} mes`;
            return `${Math.floor(diff / 31104000)} a`;
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
    }
  }
  
  </script>
  


  
  <style>
  .rounded-sm {
    background: #F7F7F7;
  }
  
  .rounded-circle {
    width: 180px;
    height: 180px;
  }
  </style>