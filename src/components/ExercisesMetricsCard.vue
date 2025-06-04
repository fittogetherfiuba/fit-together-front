<template>
  <v-card class="mx-auto my-4" elevation="10">
    <!-- Título -->
    <v-card-title class="text-h6 text-center font-weight-bold bg-secondary">
      <v-icon left>mdi-run</v-icon>
      Ejercicios realizados esta semana
    </v-card-title>

    <!-- Contenido con los gráficos -->
    <v-card-text class="d-flex flex-column" style="gap: 24px; flex:1">
      <v-row justify="center" align="center">
        <!-- Calorías quemadas día a día -->
        <v-col cols="12" sm="6" class="mb-4">
          <CaloriesBurnedBarChart :entries="entries" />
        </v-col>

        <!-- Calorías por tipo de actividad -->
        <v-col cols="12" sm="6" class="mb-4">
          <ActivitiesTypePieChart :entries="entries" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
import { defineComponent } from 'vue';

import CaloriesBurnedBarChart   from '@/components/Charts/CaloriesBurnedBar.vue';
import ActivitiesTypePieChart   from '@/components/Charts/ActivitiesTypePie.vue';

export default defineComponent({
  name: 'ExercisesMetricCard',

  components: {
    CaloriesBurnedBarChart,
    ActivitiesTypePieChart
  },

  props: {
    userId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      entries: []
    };
  },

  mounted() {
    this.fetchEntries();
  },

  watch: {
    userId() {
      this.fetchEntries();
    }
  },

  methods: {
    async fetchEntries() {
      if (!this.userId) {
        console.warn('userId no disponible');
        return;
      }

      try {
        // Endpoint análogo al de foods; ajusta si tu ruta difiere
        const resp = await axios.get(
          `http://localhost:3000/api/activities/since-last-monday?userId=${this.userId}`
        );

        this.entries = resp.data?.entries ?? [];
      } catch (err) {
        console.error(err);
      }
    }
  }
});
</script>
