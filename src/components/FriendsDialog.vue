<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
        <v-btn
            v-bind="activatorProps"
            color="FFFFFF"
            icon
            size="x-large"
        >
            <v-icon>
            mdi-account-multiple-outline
            </v-icon>
        </v-btn>
        </template>

        <template v-slot:default="{ isActive }">

        <v-card color="secondary">
            <v-row justify="center">
                <v-col>
                    <v-card-title class="my-1 font-weight-bold bg-secondary" style="font-size: 1.4rem;">
                        <v-icon start icon="mdi-account-multiple-outline"></v-icon>
                        Amigos
                    </v-card-title>
                </v-col>
                <v-col align="end">
                    
                    <v-btn
                    class="mr-1 mt-1"
                    icon
                    color="secondary"
                    @click="isActive.value = false"
                    size="medium"
                    elevation="0"
                    >
                        <v-icon>
                        mdi-close
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-card class="mx-2 mb-3">
                <v-row class="d-flex mx-auto my-auto" justify="center">
                    <v-col cols=11 class="pa-0">
                        <v-text-field 
                        hide-details
                        v-model="request_username"
                        ></v-text-field>
                    </v-col>   
                    
                    <v-col cols="auto" class="d-flex pa-0">
                        <v-divider style="background-color: black; opacity: 0.7;" vertical :thickness="2" />
                    </v-col>
                    
                    <v-col class="" align="end">
                        <v-btn
                        color="FFFFFF"
                        icon
                        style="width: 15px; height: 18px"
                        @click="handleNewRequest"
                        >
                            <v-icon>
                            mdi-account-plus
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>


            <v-card class="mx-2 mb-3">
                <v-tabs
                    v-model="tab"
                    bg-color=""
                    align-tabs="center"
                    >
                    <v-tab value="friends"> Amigos </v-tab>
                    <v-tab value="requests">Solicitudes</v-tab>
                </v-tabs>
                <v-divider></v-divider>

                <v-card-text>
                    <v-tabs-window v-model="tab">
                        <v-tabs-window-item value="friends">
                            <FriendsTable :refresh="refresh"  />
                        </v-tabs-window-item>

                        <v-tabs-window-item value="requests">
                            <FriendRequestTable @accepted-request="refreshFriends" />
                        </v-tabs-window-item>
                    </v-tabs-window>
                </v-card-text>
            </v-card>
        </v-card>
        </template>
    </v-dialog>
</template>

<script>
import FriendRequestTable from './FriendRequestTable.vue'
import FriendsTable from './FriendsTable.vue'
import FriendsService from '../services/friends.service'

export default {
    name: 'FriendsDialog',
    components: {
        FriendsTable,
        FriendRequestTable,
    },
    data() {
        return {
            tab: 'friends',
            request_username: "",
            refresh: false
        }
    },
    methods: {
        async handleNewRequest() {
            try {
                const request = await FriendsService.sendFriendRequest(this.$store.state.main.user.username, this.request_username)
                console.log(request)
                this.request_username = ""
            } catch (error) {
                console.log(error.response.data.error)
            }
        },

        refreshFriends () {
            console.log(this.refresh)
            this.refresh = !this.refresh
        }
    }
}
</script>
