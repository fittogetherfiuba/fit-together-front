<template>
  <v-card 
  max-width="550"
  :class="friend ? 'mx-auto mb-4' : 'mx-auto my-4'" 
  :elevation="friend ? '0' : '10'"
  :variant="friend ? 'outlined' : undefined"
  >
    <v-card-title v-if="!friend" class="text-center bg-secondary">
      <v-icon left>mdi-water</v-icon>
      Agua consumida esta semana
    </v-card-title>

    <v-card-text class="d-flex flex-column" style="flex: 1">
      <WaterBar :entries="entries" />
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
import { defineComponent } from 'vue';
import WaterBar from '@/components/Charts/WaterBar.vue';
const API_URL = import.meta.env.VITE_APP_API_URL

export default defineComponent({
  name: 'WaterMetricsCard',
  components: { WaterBar },

  props: {
    userId: { type: [String, Number], required: true },
    friend: {
      type: [Boolean],
      required: false
    }
  },

  data() {
    return { entries: [] };
  },

  watch: {
    userId: 'fetchEntries'
  },

  mounted() {
    this.fetchEntries();
  },

  methods: {
    async fetchEntries() {
      if (!this.userId) {
        console.warn('userId no disponible');
        return;
      }

      try {
        const { data } = await axios.get(
          API_URL + `water/entries?userId=${this.userId}`
        );
        this.entries = Array.isArray(data.entries) ? data.entries : [];
      } catch (err) {
        console.error(err);
      }
    }
  }
});
</script>

<style scoped>
.v-card-text {
  display: flex;
  flex-direction: column;
}
</style>
