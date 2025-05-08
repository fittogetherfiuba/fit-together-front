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
              <v-btn color="primary" :disabled="!valid" @click="login">
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
  
  <script setup>
  import { ref } from 'vue'
  
  const email = ref('')
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
  ]
  
  const login = () => {
    console.log('Logueando con:', email.value, password.value)
  }
  </script>
  