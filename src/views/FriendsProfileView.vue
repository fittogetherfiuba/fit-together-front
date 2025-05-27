<template>
    <div>
      <v-row align="center" justify="center"> 
        <v-col cols="12" sm="10" class="mx-5 my-5">
          <v-card class="mx-5 my-5 rounded-sm">
            <v-sheet :color="isEditing ? '#FF5537' : 'primary'" height="6"></v-sheet>
            <v-card-item>
              <v-row class="fill-height">
                <v-col cols="3" class="mt-2 mb-10">
                  <div class="font-weight-bold font-italic">
                    Foto de perfil
                  </div>
                  <v-row class="mt-2">
                    <img
                      :src=profile_pic
                      class="rounded-circle mx-auto my-5"
                    />
                  </v-row>
                  <v-textarea
                    class="mx-7 mt-5" 
                    label="Biografía" 
                    variant="outlined"
                    v-model="user.description"
                    readonly
                    placeholder="Pensando en una biografía..."
                    persistent-placeholder
                  ></v-textarea>
                  <v-row justify="center" class="mt-5" v-if="user.city || user.country">
                    <v-icon end icon="mdi-map-marker-outline" color="#8AB82D" class="mr-2"></v-icon>
                  </v-row>
                  <v-row justify="center" v-if="user.city || user.country">
                    <div class="font-weight-bold" v-if="user.city && !user.country">
                      {{ user.city }}
                    </div>
                    <div class="font-weight-bold" v-if="!user.city && user.country">
                      {{ user.country }}
                    </div>
                    <div class="font-weight-bold" v-if="user.city && user.country">
                      {{ user.city }}, {{ user.country }}
                    </div>
                  </v-row>
                </v-col>
                <v-divider vertical class="mt-5 mb-5" style="height: auto;" thickness="2"></v-divider>
                <v-col cols="7" class="mt-2 mb-4">
                  <div class="mb-15 font-weight-bold font-italic mx-auto">
                    Información del usuario
                  </div>
                  <v-row class="ml-8 mt-15 d-flex align-center" justify="center" align="start">
                    <v-col cols="10" offset="2" justify="center" align="center">
                      <v-row justify="center" align="center" class="mb-7">
                        <v-col cols="5" class="ml-4">
                          <v-text-field
                            class="info-icon"
                            :value="user.username"
                            label="Usuario"
                            prepend-icon="mdi-at"
                            readonly
                            variant="underlined"
                            persistent-placeholder
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            :class="editing ? 'ml-4 edit-icon' : 'ml-4 info-icon'"
                            v-model="user.fullname"
                            label="Nombre completo"
                            prepend-icon="mdi-run"
                            readonly
                            variant="underlined"
                            persistent-placeholder
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row justify="center" align="center" class="mb-7">
                        <v-col cols="5" class="ml-4">
                          <v-text-field
                            class="info-icon"             
                            :value="user.registrationday"
                            label="Fecha de registro"
                            prepend-icon="mdi-calendar-account-outline"
                            readonly
                            variant="underlined"
                            persistent-placeholder
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            class="ml-4 info-icon"
                            v-model="user.email"
                            label="Correo electrónico"
                            prepend-icon="mdi-email-outline"
                            readonly
                            variant="underlined"
                            persistent-placeholder
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row justify="center" align="center">
                        <v-col cols="5" class="ml-4">
                          <v-date-input
                            :class="editing ? 'edit-icon date' : 'info-icon date'"
                            v-model="user.birthday"
                            label="Fecha de nacimiento"
                            prepend-icon="mdi-cake-variant-outline"
                            readonly
                            variant="underlined"
                            persistent-placeholder
                          ></v-date-input>
                        </v-col>
                        <v-col class="mr-5">
                          <v-text-field
                            :class="editing ? 'ml-4 edit-icon' : 'ml-4 info-icon'"
                            v-model="user.weight"
                            suffix="kg"
                            label="Peso"
                            placeholder="N/A"
                            prepend-icon="mdi-weight-kilogram"
                            readonly
                            variant="underlined"
                            persistent-placeholder
                          ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                          <v-text-field
                            suffix="cm"
                            :class="editing ? 'edit-icon' : 'info-icon'"
                            v-model="user.height"
                            placeholder="N/A"
                            label="Altura"
                            prepend-icon="mdi-human-male-height"
                            readonly
                            variant="underlined"
                            persistent-placeholder
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col align="right">
                <!--
                  <v-btn
                    :color="editing ? '#FF5537' : 'secondary'"
                    size="small"
                    v-on:click="handleEditButton()"
                    class="my-2"
                  >
                    <v-icon class="mr-2">
                      {{ editing ? 'mdi-check' : 'mdi-pencil' }}
                    </v-icon>
                    {{ editing ? 'CONFIRMAR' : 'EDITAR' }}
                  </v-btn>
                -->
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  
  
  <script>
  import UserService from '../services/user.service'
  //import generateMediaURL from '../services/firebase'
  export default {
    name: 'FriendsProfile',
    data () {
      return {
        user: {
          fullname: '',
          registrationday: '',
          username: '',
          email: '',
          description: '',
          birthday: '',
          weight: '',
          height: '',
        },
        editing: false,
        loading: true,
        profile_pic: '/user-icon-white-background.png',
        block_loading: false,
        tab: null,
  
      }
    },
    async mounted () {
    
      const response = await UserService.getUserInfoByUsername(this.$route.params.id)
      console.log(this.$route.params.id)
      this.user = response.data
      console.log(this.user)
  
      console.log(localStorage.getItem('user'))
      this.loading = false
    },
    methods: {
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