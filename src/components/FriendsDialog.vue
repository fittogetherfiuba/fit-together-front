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

            <v-alert
            v-if="showAlert"
            :type="alertType"
            text
            class="mx-2 mb-3"
            density="compact"
            :color="alertType === 'success' ? 'info' : undefined"
            >
            {{ alertMessage }}
            </v-alert>

            <v-card class="mx-2 mb-3">
                <v-text-field
                placeholder="Introducí un nombre de usuario"
                hide-details
                v-model="request_username"
                @click:append-inner="handleNewRequest"
                append-inner-icon="mdi-account-plus"
                class="custom-icon"
                @keydown.enter="handleNewRequest"
                ></v-text-field>
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
                            <FriendsTable :refresh="refresh" @close-dialog="isActive.value = false" />
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
            refresh: false,
            alertMessage: '',
            alertType: '', // 'success' o 'error'
            showAlert: false,
        }
    },
    watch: {
        request_username(newVal) {
            if (this.showAlert && newVal.trim() !== '') {
                this.showAlert = false;
            }
        }
    },
    methods: {
        async handleNewRequest() {
            try {
                const request = await FriendsService.sendFriendRequest(this.$store.state.main.user.username, this.request_username)
                console.log(request)
                this.alertMessage = 'Solicitud enviada con éxito';
                this.alertType = 'success';
                this.showAlert = true;
                this.request_username = '';

            } catch (error) {
                console.log(error.response.data.error)
                this.alertMessage = 'Usuario no encontrado';
                this.alertType = 'error';
                this.showAlert = true;
            }

            setTimeout(() => {
                this.showAlert = false;
            }, 5000);
        },

        refreshFriends () {
            console.log(this.refresh)
            this.refresh = !this.refresh
        }
    }
}
</script>

<style>
.custom-icon .v-icon {
  color: #000000;
  opacity: 0.8;
}
</style>