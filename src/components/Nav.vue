<template>
    <v-app-bar app clipped-left color="#2b3c4b" class="elevation-1" height="70" v-if="currentUser">
    <v-app-bar-nav-icon @click="toggleSideBar"></v-app-bar-nav-icon>
    <!--
    <v-img
    max-width="33"
    :src="require('@/assets/login-logo.png')"
    alt="kinetix logo"
    class="ml-2 pointer"
    @click="redirect('DashboardView')"
    ></v-img>

    <v-img
    max-width="70"
    :src="require('@/assets/kinetix-name-white.png')"
    alt="kinetix name"
    class="ml-1 pointer"
    @click="redirect('DashboardView')"
    ></v-img>
    -->

    <template v-slot:append>
    <v-btn
        color="#9ACD32"
        icon
        size="x-large"
        @click="logOut"
        class="ml-12"
    >
        <v-icon>
        mdi-logout
        </v-icon>
    </v-btn>
    </template>
</v-app-bar>
</template>

<script>
import router from '@/router'
export default {
  name: 'WebNav',
  methods: {
    //redirect (routeName) {
      //this.$router.push({ name: routeName })
    //},
    logOut () {
      this.$store.dispatch('logout')
      router.push('/login')

    },
    toggleSideBar () {
      this.$store.dispatch('toggleSideBar')
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.main.user
    }
  }
}
</script>