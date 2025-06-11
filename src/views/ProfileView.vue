<template>
  <div>
    <v-row align="center" justify="center"> 
      <v-col cols="12" sm="10" class="mx-5 my-5">
      <v-alert
          v-if="!user.verified && !loading"
          type="warning"
          text
          class="mb-4 mx-5"
          density="compact"
        >
          Tu cuenta no está verificada. 
          <RouterLink to="/verify-email"   style="text-decoration: underline; color: white; font-weight: bold; margin-left: 4px;">
            Ingresá acá</RouterLink> para verificarla
          
        </v-alert>
        <v-card class="mx-5 my-5 rounded-sm">
          <v-sheet :color="isEditing ? '#FF5537' : 'primary'" height="6"></v-sheet>
          <v-card-item>
            <v-row class="fill-height">
              <v-col cols="3" class="mt-2 mb-10">
                <div class="font-weight-bold font-italic">
                  Foto de perfil
                </div>
                <v-row class="mt-2">
                  <div class="perfil-wrapper mx-auto my-5">
                    <v-img
                      :src="user.image_url"
                      class="mx-3 rounded-circle borde-foto"
                      width="180"
                      height="180"
                      :style= "editing ? 'border: 3px solid #FF5537;' : ''"
                      cover
                    ></v-img>
                    <v-btn
                      icon
                      v-if="editing"
                      size="small"
                      color="#FF5537"
                      class="btn-editar"
                      @click="editingProfilePic = true"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </div>

                  <v-dialog v-model="editingProfilePic" max-width="700px">
                    <v-card color="secondary">
                      <v-row justify="center">
                        <v-col>
                          <v-card-title class="my-1 font-weight-bold bg-secondary" style="font-size: 1.4rem;">
                            <v-icon start icon="mdi-camera"></v-icon>
                            Editar foto de perfil
                          </v-card-title>
                        </v-col>
                        <v-col align="end">
                          <v-btn
                          class="mr-1 mt-1"
                          icon
                          color="secondary"
                          @click="editingProfilePic = false"
                          size="medium"
                          elevation="0"
                          >
                            <v-icon>
                            mdi-close
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>

                      <v-card class="mx-3 mb-3">
                        <v-text-field
                          v-model="profilePicUrl"
                          label="Introducí el URL de la nueva foto"
                          placeholder="https://..."
                          hide-details
                          append-inner-icon="mdi-link-variant"
                          @click:append="searchPicUrl"
                          @keydown.enter="searchPicUrl"
                        ></v-text-field>
                      </v-card>

                      <v-card v-if="showEditingProfilePic" class="mx-auto mb-3 rounded-circle">
                        <v-img
                          @error="handleEditPicError"
                          :src="profilePicUrl"
                          class="mx-auto rounded-circle"
                          width="180"
                          height="180"
                          cover
                        ></v-img>
                      </v-card>

                      <v-alert
                        v-if="editPicError"
                        text
                        type="error"
                        max-width="500"
                        class="mx-auto mt-2 mb-1"
                        density="compact"
                        >
                        La URL introducida no es correcta.
                        </v-alert>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="!showEditingProfilePic || editPicError" @click="applyNewProfilePic">Aplicar</v-btn>
                      </v-card-actions>
                    </v-card>

                  </v-dialog>

                </v-row>
                <v-textarea
                  class="mx-7 mt-5" 
                  label="Biografía" 
                  variant="outlined"
                  v-model="user.description"
                  :readonly="!editing"
                  placeholder="Contanos un poco más sobre vos."
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
                          :readonly="!editing"
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
                          :readonly="!editing"
                          variant="underlined"
                          persistent-placeholder
                        ></v-date-input>
                      </v-col>
                      <v-col class="mr-5">
                        <v-text-field
                          :class="editing ? 'ml-4 edit-icon' : 'ml-4 info-icon'"
                          v-model="user.weight"
                          :rules="weightRules"
                          suffix="kg"
                          label="Peso"
                          placeholder="N/A"
                          prepend-icon="mdi-weight-kilogram"
                          :readonly="!editing"
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
                          :readonly="!editing"
                          variant="underlined"
                          persistent-placeholder
                        ></v-text-field>
                      </v-col>
                      <v-row justify="center" class="mt-10" v-if="editing">
                        <v-col cols="10">
                          <v-checkbox
                              v-model="hasDietRestrictions"
                              label="¿Tenés restricciones alimenticias?"
                          />
                          <v-select
                              v-if="hasDietRestrictions"
                              v-model="selectedProfiles"
                              :items="availableProfiles"
                              item-title="profile_name"
                              item-value="profile_name"
                              label="Seleccioná tus perfiles dietarios"
                              multiple
                              chips
                              return-object
                          />
                        </v-col>
                      </v-row>
                      <v-row v-if="userDietProfiles.length > 0 && !editing" class="mt-5">
                        <v-col class="text-left">
                          <div class="text-subtitle-1 font-weight-bold mb-2">
                            Perfiles dietarios
                          </div>
                          <v-chip-group column>
                            <v-chip
                                v-for="(profile, index) in userDietProfiles"
                                :key="index"
                                color="primary"
                                class="ma-1"
                                label
                                variant="elevated"
                            >
                              {{ profile }}
                            </v-chip>
                          </v-chip-group>
                        </v-col>
                      </v-row>

                    </v-row>


                  </v-col>
                </v-row>
              </v-col>
              <v-col align="right">
                <v-btn
                  :color="editing ? '#FF5537' : 'secondary'"
                  size="small"
                  v-on:click="handleEditButton()"
                  :disabled="editing && (!isWeightValid() || !isHeightValid())"
                  class="my-2"
                >
                  <v-icon class="mr-2">
                    {{ editing ? 'mdi-check' : 'mdi-pencil' }}
                  </v-icon>
                  {{ editing ? 'CONFIRMAR' : 'EDITAR' }}
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
import UserService from '../services/user.service'
//import generateMediaURL from '../services/firebase'
export default {
  name: 'UsersDetailuser',
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
        verified: '',
      },
      hasDietRestrictions: false,
      availableProfiles: [],
      selectedProfiles: [],
      userDietProfiles: [],
      editingProfilePic: false,
      profilePicUrl: '',
      showEditingProfilePic: false,
      editPicError: false,
      loading: true,
      block_loading: false,
      tab: null,
      editing: false,

      weightRules: [
        v => !isNaN(v) || 'Debe ser un número',
        v => v.length >= 2 || 'Entre 2 y 3 caracteres',
        v => v.length <= 3 || 'Entre 2 y 3 caracteres',
      ],
      heightRules: [
        v => !isNaN(v) || 'Debe ser un número',
        v => v.length >= 2 || 'Entre 2 y 3 caracteres',
        v => v.length <= 3 || 'Entre 2 y 3 caracteres',
      ],

    }
  },
  watch: {
    profilePicUrl() {
      console.log()
      if (this.showEditingProfilePic) {
        this.showEditingProfilePic = false

      }
      if (this.editPicError) {
        this.editPicError = false
      }
    }
  },
  async mounted () {
    const response = await UserService.getCurrentUserInfo()
    this.user = response.data
    this.fetchUserDietProfiles(this.user.id);

    console.log(this.user)

    console.log(this.isWeightValid())
    //this.markers[0].position.lat = parseFloat(this.user.latitude)
    //this.markers[0].position.lng = parseFloat(this.user.longitude)
    //console.log(!(this.user.city || ''))
    //console.log(this.user)
    //if (this.user.profileimage !== '') {
    //  this.profile_pic = await generateMediaURL('users/' + this.user.profileimage)
    //};

    console.log(localStorage.getItem('user'))
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
    async handleEditButton() {
      if (this.editing) {
        await UserService.editCurrentUserInfo(this.user)

        if (this.hasDietRestrictions && this.selectedProfiles.length > 0) {
          await this.applyDietProfiles()
        }

        await this.fetchUserDietProfiles(this.user.id)
      }
      else {
        await this.fetchAvailableProfiles()
      }

      this.editing = !this.editing
    }
    ,
    isWeightValid () {
      const weight = this.user.weight
      const isNumber = !isNaN(weight)
      const lengthValid = weight?.toString().length >= 2 && weight.toString().length <= 3
      return isNumber && lengthValid
    },
    isHeightValid () {
      const height = this.user.height
      const isNumber = !isNaN(height)
      const lengthValid = height?.toString().length >= 2 && height.toString().length <= 3
      return isNumber && lengthValid
    },
    searchPicUrl () {
      this.showEditingProfilePic = true
    },
    applyNewProfilePic () {
      this.user.image_url = this.profilePicUrl
      this.editingProfilePic = false
      this.profilePicUrl = ''
    },
    handleEditPicError () {
      this.editPicError = true;
      this.showEditingProfilePic = false;
    },
    async fetchAvailableProfiles() {
      try {
        const res = await UserService.getAvailableDietProfiles()
        this.availableProfiles = res.data
      } catch (err) {
        console.error('Error al obtener perfiles dietarios', err)
      }
    },

    async applyDietProfiles() {
      const userId = this.user.id
      for (const profile of this.selectedProfiles) {
        try {
          console.log(profile.profile_name);
          console.log(userId);

          await UserService.addUserDietProfile(profile.profile_name, userId)
        } catch (err) {
          console.error('Error al asignar perfil dietario', profile.name, err)
        }
      }
    },
    async fetchUserDietProfiles(userId) {
      try {
        const res = await UserService.getUserDietProfiles(userId)
        this.userDietProfiles = res.data.map(p => p.profile_name)
      } catch (err) {
        console.error('Error al obtener perfiles del usuario:', err)
        this.userDietProfiles = []
      }
    }



  }
}

</script>

<style>

.perfil-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
}

.btn-editar {
  position: absolute;
  bottom: 168px;
  left: 150px;
  background-color: white;
  border: 1px solid #ccc;
}

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