<template>
  <v-menu offset-y v-model="menuOpen">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        icon
        size="x-large"
        color="white"
      >
        <v-icon>{{ hasNewNotifications ? 'mdi-bell-alert' : 'mdi-bell' }}</v-icon>
      </v-btn>
    </template>

    <v-card width="600" class="bg-primary d-flex flex-column border-md align-center justify-center">
      <v-card-title class="w-100 px-4 d-flex align-center justify-space-between">
        <span style="font-size: 1.3rem;" class="ml-2 font-weight-bold">Notificaciones</span>
        <v-btn v-if="notifications.length" size="small" class="mr-2" variant="outlined" color="black" @click="clearAll">
          Borrar todo
        </v-btn>
      </v-card-title>
      
      <v-card class="d-flex flex-column justify-center mb-4" width="550">
          <v-table v-if="notifications.length">
            <tbody>
              <tr v-for="(notification, index) in notifications" :key="index">
                <td class="d-flex flex-row justify-center align-center">
                    <div class="font-weight-bold mr-2">{{ notification.message }}</div>
                    <div class="text-caption text-grey">
                      {{ new Date(notification.createdAt).toLocaleTimeString() }}
                    </div>
                </td>
              </tr>
            </tbody>
          </v-table>

          <div v-else class="text-center my-4">
            No hay notificaciones nuevas
          </div>
      </v-card>
    </v-card>
  </v-menu>
</template>

<script>
import axios from 'axios'
import eventBus from '../eventBus';

export default {
  name: 'NotificationsMenu',
  data() {
    return {
      notifications: [],
      oldNotifications: 0,
      menuOpen: false,
      hasNewNotifications: false,
    }
  },
  methods: {
    async clearAll() {
      try {
        await axios.delete('http://localhost:3000/api/notifications/delete_all/' + this.$store.state.main.user.userId.toString());

      } catch (error) {
        console.error('Error deleting notifications:', error);
      }
    },
    async fetchNotifications(){
      try {
        const response = await axios.get('http://localhost:3000/api/notifications?userId=' + this.$store.state.main.user.userId.toString());
        this.notifications = response.data.notifications;

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    },
    async fetchHasNewNotifications() {
      try {
        const response = await axios.get('http://localhost:3000/api/notifications/has_unread/' + this.$store.state.main.user.userId.toString());
        this.hasNewNotifications = response.data.hasUnread;
        console.log('Has new notifications:', this.hasNewNotifications);
      } catch (error) {
        console.error('Error checking for new notifications:', error);
      }
    }
  },
  watch: {
    menuOpen(val) {
      if (val) {
        this.fetchNotifications();
        this.hasNewNotifications = false;
      }
    }
  },
  async created() {
    await this.fetchHasNewNotifications();
    eventBus.on('new-notification', this.fetchHasNewNotifications);
  }
}

</script>
