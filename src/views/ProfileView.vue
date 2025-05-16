<template>
  <div>
    <v-row align="center" justify="center"> 
      <v-col cols="12" sm="10" class="mx-5 my-5">
        <v-card class="mx-5 my-5 rounded-sm">
          <v-sheet :color="isBlocked ? '#FF0000' : 'primary'" height="6"></v-sheet>
          <v-card-item>
            <v-row>
              <v-col cols="3" class="mt-2 mb-10">
                <div class="font-weight-bold font-italic">
                  Foto de perfil
                </div>
                <v-row align="center" class="mt-2">
                  <img
                    :src=profile_pic
                    class="rounded-circle mx-auto my-5"
                  />
                </v-row>
                <v-textarea
                  class="mx-7 mt-5" 
                  label="Biografía" 
                  variant="outlined"
                  :value="user.description"
                  :readonly="editing"
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
              <v-divider vertical thickness="2"></v-divider>
              <v-col cols="7" class="mt-2 mb-4">
                <div class="font-weight-bold font-italic mx-auto">
                  Información del usuario
                </div>
                <v-row class="ml-8 mt" justify="center" align="center">
                  <v-col cols="10" offset="2" justify="center" align="center">
                    <v-row>
                      <v-col cols="5" class="ml-4">
                        <v-text-field
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
                          class="ml-4"
                          :value="user.createdAt.split('T')[0]"
                          label="Fecha de registro"
                          prepend-icon="mdi-calendar-account-outline"
                          readonly
                          variant="underlined"
                          persistent-placeholder
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="5" class="ml-4">
                        <v-text-field
                          :value="user.fullname"
                          label="Nombre completo"
                          prepend-icon="mdi-run"
                          :readonly="editing"
                          variant="underlined"
                          persistent-placeholder
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          class="ml-4"
                          :value="user.email"
                          label="Correo electrónico"
                          prepend-icon="mdi-email-outline"
                          readonly
                          variant="underlined"
                          persistent-placeholder
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="5" class="ml-4">
                        <v-text-field
                          :value="user.weight ? user.weight : 'N/A'"
                          suffix="kg"
                          label="Peso"
                          prepend-icon="mdi-weight-kilogram"
                          :readonly="editing"
                          variant="underlined"
                          persistent-placeholder
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          class="ml-4"
                          suffix="cm"
                          :value="user.height ? user.height : 'N/A'"
                          label="Altura"
                          prepend-icon="mdi-human-male-height"
                          :readonly="editing"
                          variant="underlined"
                          persistent-placeholder
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
              <v-col align="right">
                <v-btn
                  color="secondary"
                  size="small"
                  v-on:click="handleEditButton()"
                  :disabled="block_loading"
                  class="my-2"
                >
                  <v-icon class="mr-2">
                    mdi-pencil
                  </v-icon>
                  {{ editing ? 'EDITAR' : 'CONFIRMAR' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>



<script>
//import UserService from '../services/user.service'
//import generateMediaURL from '../services/firebase'
export default {
  name: 'UsersDetail',
  data () {
    return {
      user: null,
      loading: true,
      profile_pic: '/user-icon-white-background.png',
      block_loading: false,
      tab: null,
      editing: true
    }
  },
  created () {
    //const userResponse = await UserService.getUserInfoById(this.$route.params.id)
    this.user = { // userResponse.data
      fullname: 'Mario Gonzalez',
      createdAt: '16/05/2025',
      username: 'maritolml',
      email: 'mgonzalez@gmail.com',
      description: 'Hola que tal soy el chico de las poesías'
    } 
    this.user.isBlocked = false
    this.user.balance = 0
    //this.markers[0].position.lat = parseFloat(this.user.latitude)
    //this.markers[0].position.lng = parseFloat(this.user.longitude)
    //console.log(!(this.user.city || ''))
    //console.log(this.user)
    //if (this.user.profileimage !== '') {
    //  this.profile_pic = await generateMediaURL('users/' + this.user.profileimage)
    //};

    this.loading = false
  },
  computed: {
    isEditing () {
      return this.editing
    },
  },
  methods: {
    goToUsersList () {
      this.$router.push('/users')
    },
    handleEditButton() {
      this.editing = !this.editing
    }
  }
}
</script>

<style>
.ml-4 .v-icon {
  color: #6FCF97 !important;
}
.rounded-sm {
  background: #F7F7F7;
}

.rounded-circle {
  width: 180px;
  height: 180px;
}
</style>