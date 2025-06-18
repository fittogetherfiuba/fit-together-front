<template>
    <v-app-bar app clipped-left color="secondary" class="elevation-1" height="70" v-if="currentUser">
    <v-app-bar-nav-icon @click="toggleSideBar"></v-app-bar-nav-icon>

    <v-img
    max-width="40"
    src="/icon-white.png"
    alt="fittogether logo"
    class="ml-2 pointer"
    @click="redirect('DashboardView')"
    ></v-img>

    <v-img
    max-width="100"
    src="/name-white.png"
    alt="kinetix name"
    class="ml-1 mt-1 pointer"
    @click="redirect('DashboardView')"
    ></v-img>

    <template v-slot:append>

      

      <NotificationsMenu />

      <FriendsDialog />

      <v-btn
        color="FFFFFF"
        icon
        size="x-large"
        @click="accessProfile"
    >
        <v-icon>
        mdi-account
        </v-icon>
    </v-btn>

    <v-btn
        color="FFFFFF"
        icon
        size="x-large"
        @click="logOut"

    >
        <v-icon>
        mdi-logout
        </v-icon>
    </v-btn>
    </template>
</v-app-bar>
</template>

<script>
import FriendsDialog from './FriendsDialog.vue'
import NotificationsMenu from './NotificationsMenu.vue'

export default {
  name: 'WebNav',
  components: {
    FriendsDialog,
    NotificationsMenu
  },
  methods: {
    //redirect (routeName) {
      //this.$router.push({ name: routeName })
    //},
    logOut () {
      this.$store.dispatch('logout')
      this.$router.push('/login')

    },
    toggleSideBar () {
      this.$store.dispatch('toggleSideBar')
    },
    accessProfile () {
      this.$router.push('/profile')
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.main.user
    }
  }
}
</script>