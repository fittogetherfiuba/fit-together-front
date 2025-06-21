<template>
  <v-card 
  :class="friend ? 'mx-4 mb-4' : 'mx-auto my-4'" 
  :elevation="friend ? '0' : '10'"
  :variant="friend ? 'outlined' : undefined"
  >
    <v-card-title v-if="!friend" class="text-center bg-secondary">
      <v-icon left>mdi-run</v-icon>
      Ejercicios realizados esta semana
    </v-card-title>


    <v-card-text class="d-flex flex-column" style="gap: 24px; flex:1">
      <v-row justify="center" align="center">
        
        <v-col cols="12" sm="6" class="mb-4">
          <CaloriesBurnedBarChart :entries="entries" />
        </v-col>

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
const API_URL = import.meta.env.VITE_APP_API_URL;
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
    },
    friend: {
      type: [Boolean],
      required: false
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
        const resp = await axios.get(
          API_URL + `activities/since-last-monday?userId=${this.userId}`
        );

        this.entries = resp.data?.entries ?? [];
      } catch (err) {
        console.error(err);
      }
    }
  }
});
</script>
