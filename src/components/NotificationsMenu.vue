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
                      {{ new Date(notification.timestamp).toLocaleTimeString() }}
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
import { mapGetters } from 'vuex'
import { watch } from 'vue'

export default {
  name: 'NotificationsMenu',
  computed: {
    ...mapGetters('notifications', ['notifications'])
  },
  data() {
    return {
      menuOpen: false,
      hasNewNotifications: false
    }
  },
  methods: {
    clearAll() {
      this.$store.dispatch('notifications/clearNotifications');
    }
  },
  watch: {
    menuOpen(val) {
      if (val) {
        this.hasNewNotifications = false
      }
    }
  },
  mounted() {
    // Watch manual del getter computado
    watch(
      () => this.notifications,
      (newList) => {
        if (newList.length > 0) {
          this.hasNewNotifications = true
        }
      },
      { immediate: true, deep: true }
    )
  }
}

</script>
