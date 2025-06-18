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

                                                                                          <v-btn
                      icon
                      elevation="2"
                      class="google-icon-btn ml-7"
                      @click="googleLogin"
                    >
                      <v-img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                        width="34"
                        height="34"
                        cover
                      />
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
  import axios from 'axios'
  import { googleTokenLogin } from "vue3-google-login"

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
          sessionStorage.setItem('justLoggedIn', 'true')
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
    },

    async googleLogin() {
      const response = await googleTokenLogin()
      const userData = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      })
      console.log(userData.data)

      const user = {
        email: userData.data.email,
        fullname: userData.data.name,
        username: userData.data.email.split("@")[0],
        password: userData.data.sub,
        imageUrl: userData.data.picture
      }

      this.$store.dispatch('login', user).then(
        () => {
          console.log('Login exitoso')
          sessionStorage.setItem('justLoggedIn', 'true')
          this.$router.push('/')
          console.log(this.$router)
        },
        (error) => {
          console.log(error)
          this.$store.dispatch('register', user).then(
            () => {
              console.log('Login exitoso')
              this.$router.push('/')
              console.log(this.$router)
            },
            (error) => {
              console.log(error)
            }
          )
        }
      )

      this.$router.push('/dashboard')

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

.google-icon-btn {
  background-color: white;
  padding: 10px;
}

.google-icon-btn:hover {
  background-color: #f5f5f5;
}

</style>