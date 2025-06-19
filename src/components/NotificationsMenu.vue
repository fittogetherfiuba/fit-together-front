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

    <v-card width="600" class=" d-flex flex-column border-md align-center justify-center">
      <v-card-title>Notificaciones</v-card-title>
      <v-btn v-if="notifications.length" variant="text" color="secondary" class="mb-1" @click="clearAll">Borrar todo</v-btn>
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

          <div v-else class="text-center font-weight-bold my-4">
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
        this.notifications = [];
        localStorage.setItem('lastSeenNotifications', '0');
      } catch (error) {
        console.error('Error deleting notifications:', error);
      }
    },
    async fetchNotifications(){
      try {
        const response = await axios.get('http://localhost:3000/api/notifications?userId=' + this.$store.state.main.user.userId.toString());
        this.notifications = response.data.notifications;

        const lastSeenCount = parseInt(localStorage.getItem('lastSeenNotifications')) || 0;

        if (this.notifications.length > lastSeenCount) {
          this.hasNewNotifications = true;
        }
        else {
          this.hasNewNotifications = false;
        }

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  },
  watch: {
    menuOpen(val) {
      if (val) {
        this.hasNewNotifications = false
        localStorage.setItem('lastSeenNotifications', this.notifications.length.toString());
      }
    }
  },
  
  async created() {
    await this.fetchNotifications();
    eventBus.on('new-notification', this.fetchNotifications);
  }
}

</script>
