import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store"
import vuetify from './plugins/vuetify'
import vue3GoogleLogin from 'vue3-google-login'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(vuetify)

app.use(vue3GoogleLogin, {
  clientId: '932138056175-eb0qjg3b6g27glr5te71q0gcrdcp34j6.apps.googleusercontent.com'
})

app.mount('#app')