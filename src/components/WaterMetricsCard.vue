<template>
  <v-card class="mx-auto my-4" elevation="10" max-width="550">
    <v-card-title class="text-h6 text-center font-weight-bold bg-secondary">
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

export default defineComponent({
  name: 'WaterMetricsCard',
  components: { WaterBar },

  props: {
    userId: { type: [String, Number], required: true }
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
          `http://localhost:3000/api/water/entries?userId=${this.userId}`
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
