<template>
    <v-list class="pa-0">
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
                        @click="accessProfile"
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
                        @click="accessProfile"
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
import UserService from '../services/user.service'
//import generateMediaURL from '../services/firebase'
export default {
  name: 'FriendRequestTable',
  data: () => ({
    drawer: null,
    users_info: [{
      prependAvatar: '/user-icon-white-background.png',
      title: null,
      subtitle: null
    }],
    fullname: '',
    email: ''
  }),
  async mounted () {
    for (var i = 0; i < 3; i++) {

        const response = await UserService.getCurrentUserInfo()
        console.log(response.data)

        this.users_info[i] = {
            title: response.data.fullname,
            subtitle: response.data.username,
            prependAvatar: '/user-icon-white-background.png'
        }
    }

  }
}
</script>
