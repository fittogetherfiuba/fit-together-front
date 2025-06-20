<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="pa-6" elevation="10" max-width="450">
      <v-card-title class="text-h6 font-weight-bold text-center">
        Verificá tu cuenta
      </v-card-title>

      <v-card-text>
        <template v-if="loading">
          <v-row justify="center"><v-progress-circular indeterminate color="primary" /></v-row>
        </template>

        <template v-else-if="isVerified">
          <v-alert type="success" text>
            Tu cuenta ya está verificada.
          </v-alert>
        </template>

        <template v-else>
          <p class="text-subtitle-2 text-center mt-1 mb-4">
            Te enviamos un código de 6 dígitos a tu correo. Ingresalo abajo para verificar tu cuenta.
          </p>

          <v-row justify="center" class="mb-4">
            <v-col
              v-for="(digit, index) in codeDigits"
              :key="index"
              cols="2"
              class="pa-1"
            >
              <v-text-field
                v-model="codeDigits[index]"
                maxlength="1"
                type="text"
                class="text-center"
                variant="outlined"
                hide-details
                @input="handleInput(index, $event)"
                @keydown.backspace="handleBackspace(index, $event)"
                ref="codeRefs"
              />
            </v-col>
          </v-row>

          <v-row justify="center" class="mb-4">
            <v-btn variant="text" color="primary" class="text-caption" @click="resendCode">
              Reenviar email
            </v-btn>
          </v-row>

          <v-alert
            v-if="showAlert"
            :type="alertType"
            text
            class="mb-4"
            density="compact"
          >
            {{ alertMessage }}
          </v-alert>

          <v-row justify="center" class="mt-4">
            <v-col cols="6" class="d-flex justify-center">
              <v-btn
                color="success"
                class="font-weight-bold"
                @click="verifyCode"
                :disabled="!isCodeComplete"
              >
                VERIFICAR
              </v-btn>
            </v-col>
            <v-col cols="6" class="d-flex justify-center">
              <v-btn
                variant="text"
                class="font-weight-bold"
                @click="skipVerification"
              >
                Más tarde
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const API_URL = import.meta.env.VITE_APP_API_URL

const store = useStore()
const router = useRouter()
const codeDigits = ref(Array(6).fill(''))
const codeRefs = ref([])
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('error')
const isVerified = ref(false)
const loading = ref(true)

const isCodeComplete = computed(() =>
  codeDigits.value.every((digit) => digit && digit.length === 1)
)

onMounted(async () => {
  try {
    const username = store.state.main.user.username
    const response = await axios.get(API_URL + `users/${username}`)
    isVerified.value = response.data.verified
  } catch {
    alertMessage.value = 'No se pudo verificar el estado de la cuenta.'
    alertType.value = 'error'
    showAlert.value = true
  } finally {
    loading.value = false
    nextTick(() => {
      if (!isVerified.value) codeRefs.value[0]?.focus()
    })
  }
})

function handleInput(index, event) {
  const value = event.target.value
  if (/^\d$/.test(value)) {
    codeDigits.value[index] = value
    if (index < 5) {
      nextTick(() => codeRefs.value[index + 1]?.focus())
    }
  } else {
    codeDigits.value[index] = ''
  }
}

function handleBackspace(index, event) {
  if (event.target.value === '') {
    if (index > 0) {
      nextTick(() => codeRefs.value[index - 1]?.focus())
    }
  }
}

async function verifyCode() {
  try {
    const code = codeDigits.value.join('')
    const user = store.state.main.user

    await axios.post(API_URL + 'users/verify', {
      userId: user.userId,
      code
    })

    alertMessage.value = 'Cuenta verificada con éxito'
    alertType.value = 'success'
    showAlert.value = true

    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch (error) {
    alertMessage.value =
      error.response?.data?.error || 'Error al verificar el código'
    alertType.value = 'error'
    showAlert.value = true

    setTimeout(() => {
      showAlert.value = false
    }, 4000)
  }
}

async function resendCode() {
  try {
    const user = store.state.main.user

    await axios.post(API_URL + 'users/resend-verification-code', {
      userId: user.userId
    })

    alertMessage.value = 'Correo reenviado con éxito'
    alertType.value = 'success'
    showAlert.value = true

    setTimeout(() => {
      showAlert.value = false
    }, 3000)
  } catch (error) {
    alertMessage.value =
      error.response?.data?.error || 'Error al reenviar el correo'
    alertType.value = 'error'
    showAlert.value = true

    setTimeout(() => {
      showAlert.value = false
    }, 4000)
  }
}

function skipVerification() {
  router.push('/')
}
</script>

<style scoped>
.v-text-field input {
  text-align: center;
  font-size: 1.4rem;
  padding: 0;
}
</style>
