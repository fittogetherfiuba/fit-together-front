<template>
  <v-container fluid class="d-flex align-center justify-center fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="7">

        <v-card class="pa-10 justify-center" color="" elevation="10">
          <v-row justify="center" align="center">
            <v-col>
              <div class="d-flex justify-center">
                <v-img
                max-width="420"

                aspect-ratio="4/3"
                contain
                src="/login-icon.png"
              ></v-img>
              </div>
            </v-col>
            <v-divider vertical="true"></v-divider>
            <v-col>
              <v-card-text>
                <v-form class="mt-5" @submit.prevent="handleRegister" v-model="valid">
                  <v-text-field
                    label="Email"
                    v-model="email"
                    :rules="emailRules"
                    prepend-icon="mdi-email"
                    required
                  />
                  <v-text-field
                    label="Usuario"
                    v-model="username"
                    :rules="usernameRules"
                    prepend-icon="mdi-at"
                    required
                  />
                  
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="Nombre"
                        v-model="firstname"
                        :rules="nameRules"
                        prepend-icon="mdi-run"
                        required
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        class="ml-3"
                        label="Apellido"
                        v-model="surname"
                        :rules="nameRules"
                        required
                      />
                    </v-col>
                  </v-row>

                  
                  <v-text-field
                    label="Contraseña"
                    v-model="password"
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    prepend-icon="mdi-lock"
                    required
                  />
    
                  <v-text-field
                    label="Confirmar Contraseña"
                    v-model="confirmPassword"
                    :rules="confirmPasswordRules"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-lock"
                    required
                  />
                  
                  <v-card-actions class="justify-center">
                    <v-btn type="submit" variant="elevated" color="primary" :disabled="!valid">
                      Registrarse
                    </v-btn>
                  </v-card-actions>

                </v-form>

              </v-card-text>

           
            </v-col>
          </v-row>

        </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { ref } from 'vue'
  import router from '@/router'
  export default {
  name: 'LoginView',
  data () {
    return {
      email: ref(''),
      password: ref(''),
      username: ref(''),
      firstname: ref(''),
      surname: ref(''),
      showPassword: ref(false),
      valid: ref(false),
  
      emailRules: [
        v => !!v || 'Email es requerido',
        v => /.+@.+\..+/.test(v) || 'Email no válido',
      ],
      passwordRules: [
        v => !!v || 'Contraseña es requerida',
        v => v.length >= 6 || 'Mínimo 6 caracteres',
      ],
      usernameRules: [
        v => !!v || 'Contraseña es requerida',
        v => v.length >= 6 || 'Mínimo 6 caracteres',
      ],
      nameRules: [
        v => !!v || 'Nombre es requerido',
        v => v.length >= 2 || 'Mínimo 2 caracteres',
      ],

      confirmPassword: ref(''),
      confirmPasswordRules: [
        v => !!v || 'Confirmación requerida',
        v => v === this.password || 'Las contraseñas no coinciden',
      ]

    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.main.loggedIn
    }
  },
  created () {
    if (this.loggedIn) {
      router.push('/')
    }
  },
  methods: {
    handleRegister () {
      const fullname = this.firstname + ' ' + this.surname
      console.log('Registrando con:', this.email, this.password, this.username, fullname)

      const user = {
        email: this.email,
        password: this.password,
        username: this.username,
        fullname
      }

      console.log(user)

      this.$store.dispatch('register', user).then(
        () => {
          console.log('Register exitoso')
          this.$router.push('/verify-email')
          console.log(this.$router)
        },
        (error) => {
          console.log(error)
          this.error = error.response ? error.response.data.message : 'El usuario no puede registrarse.'
        }
      )
    }
  },
}

  </script>
  