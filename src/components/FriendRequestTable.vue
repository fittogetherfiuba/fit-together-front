<template>
    <v-list class="pa-0">
        <v-row v-if="!users_info.length" class="my-auto mx-auto" justify="center">
            <v-col align="center">
                <v-list-item>
                    <v-list-item-title class="text--disabled">No tenés solicitudes de amistad pendientes.</v-list-item-title>
                </v-list-item>
            </v-col>
        </v-row>
        <v-list-item class="pa-1 ma-0" v-for="(user, index) in users_info" :key="index">
            <v-row class="my-auto" justify="center">
                <v-col>
                    <v-list         
                    :items="[user]"
                    item-props
                    lines="three"
                    >
                        <template v-slot:subtitle="{ subtitle }">
                            <div v-html="subtitle"></div>
                        </template>
                    </v-list>
                </v-col>
                <v-col class="d-flex align-center justify-end ">
                    <v-btn
                        class="mr-4"
                        variant="outlined"
                        color="success"
                        icon
                        size=""
                        @click="acceptRequest(index)"
                        style="width: 38px; height: 38px;"
                    >
                        <v-icon size="25">
                        mdi-check
                        </v-icon>
                    </v-btn>

                    <v-btn
                        class="mr-4"
                        style="width: 38px; height: 38px;"
                        variant="outlined"
                        color="error"
                        icon
                        size="normal"
                        @click="rejectRequest(index)"
                    >
                        <v-icon size="25">
                        mdi-close
                        </v-icon>
                    </v-btn>

                </v-col>

                <v-divider v-if="index != users_info.length - 1"></v-divider>
            </v-row>
            
        </v-list-item>
    

  </v-list>
</template>

<script>
//import generateMediaURL from '../services/firebase'
import FriendsService from '../services/friends.service'
export default {
  name: 'FriendRequestTable',
  data: () => ({
    drawer: null,
    users_info: [],
    fullname: '',
    email: ''
  }),
  async mounted () {
    const response = await FriendsService.getFriendRequests(this.$store.state.main.user.username)
    console.log(response.data.requests)

    for (var i = 0; i < response.data.requests.length; i++) {
        this.users_info[i] = {
            title: response.data.requests[i].fullname,
            subtitle: response.data.requests[i].username,
            prependAvatar: '/user-icon-white-background.png'
        }
    }
  },

  methods: {
    async rejectRequest(k) {
        const response = await FriendsService.rejectFriendRequest(this.users_info[k].subtitle, this.$store.state.main.user.username);
        this.users_info.splice(k, 1)
        console.log(response)
    },
    async acceptRequest(k) {
        const response = await FriendsService.acceptFriendRequest(this.users_info[k].subtitle, this.$store.state.main.user.username);
        this.users_info.splice(k, 1)
        this.$emit('accepted-request')
        console.log(response)
    },
  }
}
</script>
