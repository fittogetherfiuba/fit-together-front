<template>
    <v-list class="pa-0">
        <v-row v-if="!users_info.length" class="my-auto mx-auto" justify="center">
            <v-col align="center">
                <v-list-item>
                    <v-list-item-title class="text--disabled">Todavía no tenés amigos.</v-list-item-title>
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
                        color="info"
                        icon
                        size=""
                        @click="lookProfile(index)"
                        style="width: 38px; height: 38px;"
                    >
                        <v-icon size="25">
                        mdi-eye
                        </v-icon>
                    </v-btn>

                    <v-btn
                        class="mr-4"
                        style="width: 38px; height: 38px;"
                        color="error"
                        icon
                        size="normal"
                        @click="deleteFriend(index)"
                    >
                        <v-icon size="25">
                        mdi-account-remove
                        </v-icon>
                    </v-btn>

                </v-col>

                <v-divider v-if="index != users_info.length - 1"></v-divider>
            </v-row>
            
        </v-list-item>
    

  </v-list>
</template>

<script>
import FriendsService from '../services/friends.service'
//import generateMediaURL from '../services/firebase'
export default {
  name: 'FriendsTable',
  props: ['refresh'],
  watch: {
    refresh () {
        this.loadFriends()
    }
  },
  data: () => ({
    drawer: null,
    users_info: [],
    fullname: '',
    email: ''
  }),
  async mounted () {
    await this.loadFriends()
  },

  methods: {
    async loadFriends() {
        const response = await FriendsService.getFriendsList(this.$store.state.main.user.username)
        console.log(response.data.friends)

        for (var i = 0; i < response.data.friends.length; i++) {
            this.users_info[i] = {
                title: response.data.friends[i].fullname,
                subtitle: response.data.friends[i].username,
                prependAvatar: response.data.friends[i].image_url,
            }
        }
    },
    async deleteFriend(k) {
        console.log(this.$store.state.main.user.username)
        const response = await FriendsService.removeFriend(this.users_info[k].subtitle, this.$store.state.main.user.username);
        this.users_info.splice(k, 1)
        console.log(response)
    },
    async lookProfile(k) {
        this.$emit('close-dialog')
        this.$router.push('/friends/' + this.users_info[k].subtitle)
        console.log(k)
    }
  }
}
</script>
