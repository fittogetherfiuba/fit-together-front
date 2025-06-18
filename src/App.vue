<template>
  <v-app>
    <div v-if="currentUser">
      <WebNav />
    </div>

    <div v-if="currentUser && showSideBar">
      <SideBarMenu class="font-semibold" />
    </div>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import WebNav from './components/Nav.vue'
import SideBarMenu from './components/SidebarMenu.vue'

export default {
  name: 'App',
  components: {
    WebNav,
    SideBarMenu
  },
  computed: {
    currentUser () {
      return this.$store.state.main.user
    },
    showSideBar () {
      return this.$store.state.main.sideBarOpen
    }
  }
}
</script>

<style>

body {
  font-family: 'Montserrat', sans-serif;
}
</style>
