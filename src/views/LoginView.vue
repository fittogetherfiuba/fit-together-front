<template>
  <v-container fluid class="d-flex align-center justify-center fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4" elevation="10">
          <v-card-title class="text-h5 text-center">Iniciar Sesión</v-card-title>

            <v-card-text>
              <v-form v-model="valid">
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
              </v-form>
            </v-card-text>
  
            <v-card-actions class="justify-center">
              <v-btn color="primary" :disabled="!valid" @click="handleLogin">
                Ingresar
              </v-btn>
            </v-card-actions>

            <v-card-text class="text-center">
            <router-link to="/register">¿No tenés cuenta? Registrate</router-link>
            </v-card-text>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>
  
<script >
  import { ref } from 'vue'
  //import axios from 'axios'
  import router from '@/router'
  /*const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const valid = ref(false)
  
  const emailRules = [
    v => !!v || 'Email es requerido',
    v => /.+@.+\..+/.test(v) || 'Email no válido',
  ]
  
  const passwordRules = [
    v => !!v || 'Contraseña es requerida',
    v => v.length >= 6 || 'Mínimo 6 caracteres',
  ]*/




    /*const response = axios.post('http://localhost:3000/api/login', {
      email: email.value,
      password: password.value,
    })

    // cambiarlo por un token cuando haya
    const userData = response.data
    localStorage.setItem('user', JSON.stringify(userData))
    console.log('Login exitoso:', userData)


    // redirigir a home
    router.push('/')
    */
  /*
  } catch (error) {
    console.error('Error al loguear:', error.response?.data || error.message)
  }*/

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
    handleLogin () {
      console.log('Logueando con:', this.email, this.password)

      const user = {
        email: this.email,
        password: this.password,
      }

      this.$store.dispatch('login', user).then(
        () => {
          console.log('Login exitoso')
          //router.push('/')
          this.$router.push('/')
          console.log(this.$router)
        },
        (error) => {
          this.error = error.response ? error.response.data.message : 'El usuario es incorrecto.'
        }
      )
    }
  },
}


</script>
  