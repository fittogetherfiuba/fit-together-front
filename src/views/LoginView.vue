<template>
  <v-container fluid class="d-flex align-center justify-center fill-height" >
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
              <div  v-if="loginError" class="alert alert-danger ml-4">
                {{ loginError }}
              </div>

              <v-card-text>
                <v-form class="mt-12" @submit.prevent="handleLogin" v-model="valid">
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

                  <v-card-actions class="justify-center">
                    <v-btn type="submit" variant="elevated" color="primary" :disabled="!valid">
                      Ingresar
                    </v-btn>
                  </v-card-actions>

                </v-form>

              </v-card-text>
  
              <v-card-actions class="justify-center">
                <v-btn variant="elevated" color="primary" @click="handleRegister">
                  Crear una cuenta
                </v-btn>
              </v-card-actions>     
              
            </v-col>
          </v-row>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script >
  import { ref } from 'vue'

  export default {
  name: 'LoginView',
  data () {
    return {
      email: ref(''),
      password: ref(''),
      showPassword: ref(false),
      valid: ref(false),
      loginError: null,
  
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
      this.$router.push('/')
    }
  },
  methods: {
    handleLogin () {
      console.log('Logueando con:', this.email, this.password)

      this.loginError = null;

      const user = {
        email: this.email,
        password: this.password,
      }

      this.$store.dispatch('login', user).then(
        () => {
          console.log('Login exitoso')
          this.$router.push('/')
          console.log(this.$router)
        },
        (error) => {
          console.log(error.response.data.error)
          this.loginError = error.response ? error.response.data.error : 'El usuario es incorrecto.'
          console.log(this.loginError)
        }
      )
    },
    handleRegister () {
      this.$router.push('/register')
    }
  },
}


</script>
  
<style>
.alert {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.25rem;
}
.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}
</style>