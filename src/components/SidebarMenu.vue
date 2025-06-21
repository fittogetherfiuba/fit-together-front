<template>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="#E2E2E2"
    >
      <v-list>
        <v-list
          :items="user_info"
          item-props
          lines="three"
        >
          <template v-slot:subtitle="{ subtitle }">
            <div v-html="subtitle"></div>
          </template>
        </v-list>
      </v-list>
  
      <v-divider></v-divider>
  
      <v-list density="compact">
        <v-list-item
  v-for="item in items"
  :key="item.title"
  :to="item.route"
  link
  class="d-flex align-center"
>
  <v-icon color="primary" class="me-3">{{ item.icon }}</v-icon>
  <span class="me-3">{{ item.title }}</span>
</v-list-item>

      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script>
  import UserService from '../services/user.service'
  //import generateMediaURL from '../services/firebase'
  export default {
    name: 'SidebarMenu',
    data: () => ({
      drawer: null,
      user_info: [{
        prependAvatar: '',
        title: null,
        subtitle: null
      }],
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/' },
        //{ title: 'Planes', icon: 'mdi-dumbbell', route: '/plans' },
        //{ title: 'Servicios', icon: 'mdi-wrench-cog', route: '/services' },
        { title: 'Métricas', icon: 'mdi-poll', route: '/metrics' },
        { title: 'Recetas', icon: 'mdi-food-apple', route: '/recipes'},
        { title: 'Comunidades', icon: 'mdi-account-group', route: '/communities' },
        //{ title: 'Registro de nuevos admins', icon: 'mdi-account-tie', route: '/register' }
      ],
      fullname: '',
      email: ''
    }),
    async mounted () {
      const response = await UserService.getCurrentUserInfo()
      this.user_info[0].title = response.data.fullname
      console.log(response.data)
      this.user_info[0].subtitle = response.data.username
      this.user_info[0].prependAvatar = response.data.image_url
      //this.user_info[0].prependAvatar = await generateMediaURL('users/' + response.data.profileimage)
    }
  }
  </script>