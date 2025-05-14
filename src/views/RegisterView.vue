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
                <v-form class="mt-5" v-model="valid">
                  <v-text-field
                    label="Email"
                    v-model="email"
                    :rules="emailRules"
                    prepend-icon="mdi-email"
                    required
                  />
    
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
                </v-form>
              </v-card-text>
  
              <v-card-actions class="justify-center">
                <v-btn variant="elevated" color="primary" :disabled="!valid" @click="handleRegister">
                  Registrarse
                </v-btn>
              </v-card-actions>
           
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

/*
  const register = () => {
    console.log('Registrando:', email.value)

    try {
      const response = axios.post('http://localhost:3000/api/register', {
        email: email.value,
        password: password.value,
      })

      // cambiarlo por un token cuando haya
      const userData = response.data
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('Registro exitoso:', userData)

      // redirigir a home
      router.push('/')
    } catch (error) {
      console.error('Error al registrar:', error.response?.data || error.message)
    }

  }
*/
  export default {
  name: 'LoginView',
  data () {
    return {
      email: ref(''),
      password: ref(''),
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
      console.log('Logueando con:', this.email, this.password)

      const user = {
        email: this.email,
        password: this.password,
      }

      this.$store.dispatch('register', user).then(
        () => {
          console.log('Register exitoso')
          this.$router.push('/')
          console.log(this.$router)
        },
        (error) => {
          this.error = error.response ? error.response.data.message : 'El usuario no puede registrarse.'
        }
      )
    }
  },
}

  </script>
  