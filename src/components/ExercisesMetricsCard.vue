<template>
  <v-card
    class="mx-auto my-4"
    elevation="10"
    max-width="550"
  >    <v-card-title class="text-h5 text-center font-weight-bold bg-secondary">
      <v-icon left>mdi-run</v-icon>
      Actividades realizadas esta semana
    </v-card-title>

    <v-divider />

    <v-card-text class="metrics-content">
      <div v-if="entries.length">
        <div
          v-for="entry in entries"
          :key="entry.id"
          class="entry-block"
        >
          <div class="entry-name">{{ entry.activityName }}</div>
          <ul class="entry-details-list">
            <li v-if="entry.durationMinutes != null">
              Duración: {{ entry.durationMinutes }} min
            </li>
            <li v-if="entry.distanceKm != null">
              Distancia: {{ entry.distanceKm }} km
            </li>
            <li v-if="entry.series != null">
              Series: {{ entry.series }}
            </li>
            <li v-if="entry.repetitions != null">
              Repeticiones: {{ entry.repetitions }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="no-entries">
        No hay actividades esta semana
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ExercisesMetricsCard',
  data() {
    return {
      entries: []
    };
  },
  async created() {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}activities/since-last-monday`,
        { params: { userId: this.$store.state.main.user.userId } }
      );
      this.entries = data.entries;
    } catch (e) {
      console.error('Error al cargar actividades semanales:', e);
    }
  }
};
</script>

<style scoped>
.metrics-content {
  background-color: #e8f5e9; /* verde muy claro */
  color: #000;
  padding: 16px !important;
}
.entry-block {
  margin-bottom: 16px;
}
.entry-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 4px;
}
.entry-details-list {
  list-style-type: disc;
  padding-left: 1.2rem;
  margin: 0;
}
.no-entries {
  text-align: center;
  font-style: italic;
}
</style>
