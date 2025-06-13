<template>
    <div>

        <v-row align="" justify="center" >

        <v-col cols="7" class="pl-7 mt-10 pa-0">
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
        <v-col class="mt-6" cols="1">
            <v-card-actions class="justify-end">
                <v-btn class="border-sm bg-secondary font-weight-bold" @click="showDialogCreatePost = true">Crear post</v-btn>
            </v-card-actions>
        </v-col>

        <v-col cols="8" class="pl-7 mt-0 pa-0">
            <v-card class="text-center bg-secondary">
                <v-row no-gutters class="text-center bg-secondary" align="start">
                    <v-col>
                        <v-autocomplete
                        class="text-truncate chip-scroll"
                        density="compact"
                        style="max-width:620px; max-height:40px; overflow-y: auto;"
                        v-model="chips"
                        :items="ingredientsList"
                        placeholder="Seleccioná ingredientes para filtrar..."
                        prepend-icon="mdi-filter-variant"
                        variant="solo"
                        multiple
                        chips
                        clearable
                        closable-chips
                        item-title="name"
                        item-value="id"
                        ></v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-date-input
                          v-model="sinceFilter"
                          density="compact"
                          prepend-icon="mdi-cake-variant-outline"
                          variant="solo"
                          persistent-placeholder
                        ></v-date-input>
                    </v-col>
                    <v-col>
                        <v-date-input
                          v-model="untilFilter"
                          density="compact"
                          prepend-icon="mdi-cake-variant-outline"
                          variant="solo"
                          persistent-placeholder
                        ></v-date-input>
                    </v-col>
                </v-row>
            </v-card>



        </v-col>

        <v-col cols="6" sm="6" class="mt-1 py-0 mb-0">
            <span class="d-flex text-h6 pa-6 pb-0 justify-center font-weight-bold" v-if="communityPosts.length === 0">No hay posteos en esta comunidad</span>
            <v-card-text v-for="(post, index) in communityPosts" :key="index">
                <v-card class="border-sm">
                    <v-card-subtitle class="pt-3">
                        <p>{{ post.topic }} | Usuario: {{ post.author }}</p>
                    </v-card-subtitle>
                    <v-card-title class="pt-0 font-weight-bold">
                        <p>{{ post.title }}</p>
                    </v-card-title>
                    <v-card-text>
                        <p class="mb-4">{{ post.body }}</p>
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
        <v-col cols="2" class="my-5 pa-0 ">
            <v-card class="border-sm mb-3">
                <v-card-text class="pt-0">
                    <p class="mt-4 font-weight-bold">Sobre esta comunidad... </p>
                </v-card-text>
                <v-card-text class="pt-0 my-2">
                    <p class="mb-2">{{ description }}</p>
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
                    <p class="mb-3"> {{ membersAmount }} </p>
                </v-card-title>
                    <!--<v-card-subtitle class="pt-3">
                        <p>Fitters suscritos</p>
                    </v-card-subtitle>-->
            </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  
  
  <script>
    import axios from 'axios'
    import UserService from '../services/user.service'
  export default {
    name: 'CommunityView',
    data () {
      return {
        sinceFilter: '',
        untilFilter: '',
        communityInfo: {
            name: ''
        },
        membersAmount: null,
        creatorInfo: [{
            prependAvatar: '',
            title: null,
            subtitle: null
        }],
        communityPosts: [],
        name: 'Tetas',
        description: 'En esta comunidad hablamos pura y exclusivamente de Tomi nuestro amo',
        postComments: [],
        postCommentBody: {},
        commentForms: [],
        rules: {
            nameRequired: value => !!value || 'Debe ingresar un nombre',
            descriptionRequired: value => !!value || 'Debe ingresar un texto',
            commentRequired: value => !!value || '',
            picRequired: value => !!value || 'Debe ingresar una foto'
        }
      }
    },
    async mounted () { 
        await this.fetchCommunityInfo();
        console.log(this.communityInfo)
        const response = await UserService.getUserInfoByUsername(this.communityInfo.creatorUsername)
        this.creatorInfo[0].title = response.data.fullname
        this.creatorInfo[0].subtitle = response.data.username
        this.creatorInfo[0].prependAvatar = response.data.image_url

        await this.fetchCommunityPosts(this.$route.params.id)
        this.membersAmount = 200
        console.log(this.communityPosts)
        console.log(this.postComments)
    },
    methods: {
        async fetchCommunityInfo() {
            try {
                const response = await axios.get('http://localhost:3000/api/communities/all') 
                console.log(response.data.communities)

                this.communityInfo = response.data.communities.find(community => community.id.toString() === this.$route.params.id)  
            } catch (error) {
                console.error('Error al obtener comunidades:', error)
            }
        },

        async fetchCommunityPosts(communityId) {
            try {
                const response = await axios.get('http://localhost:3000/api/communities/' + communityId + '/posts')
                this.communityPosts = response.data.posts
                this.communityPosts.forEach(post => {
                    this.fetchCommunityComments(post)
                })
            } catch (error) {
                console.error('Error al obtener posteos de la comunidad:', error)
            }
        },

        async fetchCommunityComments(post) {
            try {
                const response = await axios.get('http://localhost:3000/api/communities/posts/' + post.id + '/comments')
                this.postComments[post.id] = response.data.comments
            } catch (error) {
                console.error('Error al obtener comentarios del post:', error)
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
                await axios.post('http://localhost:3000/api/communities/posts/' + post.id + '/comments', comment)
                this.fetchCommunityComments(post)
                this.postCommentBody[post.id] = ''
            } catch (error) {
                console.error('Error al crear el comentario:', error)
            }
        }
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
  .info-icon .v-icon {
    color: #219653 !important;
  }
  
  .edit-icon .v-icon {
    opacity: 1 !important;
    color: #FF5537 !important;
  }
  .rounded-sm {
    background: #F7F7F7;
  }
  
  .rounded-circle {
    width: 180px;
    height: 180px;
  }
  </style>