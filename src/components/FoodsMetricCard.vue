<template>
  <v-card class="mx-auto my-4" elevation="10" max-width="550">
    <v-card-title class="text-h6 text-center font-weight-bold bg-secondary">
      <v-icon left>mdi-food</v-icon>
      Comidas Consumidas esta semana
    </v-card-title>

    <v-card-text class="d-flex flex-column" style="gap: 24px; flex:1">
      <CaloriesBarChart         :entries="entries"/>
      <CaloriesByPeriodBarChart :entries="entries"/>
      <NutrientsPieChart        :entries="entries"/>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
import { defineComponent } from 'vue';
import CaloriesBarChart from '@/components/Charts/CaloriesBar.vue';
import CaloriesByPeriodBarChart from '@/components/Charts/CaloriesByPeriodBar.vue';
import NutrientsPieChart from '@/components/Charts/NutrientsPie.vue';

export default defineComponent({
  name: 'FoodsMetricCard',
  components: {
    CaloriesBarChart,
    CaloriesByPeriodBarChart,
    NutrientsPieChart
  },
  data() {
    return { entries: [] };
  },
  mounted() {
    this.fetchEntries();
  },
  methods: {
    async fetchEntries() {
      const userId = this.$store.state.main.user.userId?.toString();
      if (!userId) {
        console.warn('userId no disponible');
        return;
      }

      try {
        const resp = await axios.get(
          `http://localhost:3000/api/foods/entries/since-last-monday?userId=${userId}`
        );
        this.entries = resp.data?.entries ?? [];
        console.log(this.entries)
      } catch (err) {
        console.error(err);
      }
    }
  }
});
</script>
