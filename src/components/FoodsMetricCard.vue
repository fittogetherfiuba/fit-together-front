<template>
  <v-card 
  :class="friend ? 'mx-4 mb-4' : 'mx-auto my-4'" 
  :style="friend ? 'border-color: gray;': undefined"
  :elevation="friend ? '0' : '10'"
  :variant="friend ? 'outlined' : undefined"
  >
    <v-card-title v-if="!friend" class="text-center bg-secondary">
      <v-icon left>mdi-food</v-icon>
      Comidas Consumidas esta semana
    </v-card-title>

    <v-card-text class="d-flex flex-column" style="gap: 24px; flex:1">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="6" class="mb-4" >
          <CaloriesBarChart         :entries="entries"/>
        </v-col>
        <v-col cols="12" sm="6" class="mb-4" >
          <CaloriesByPeriodBarChart :entries="entries"/>
        </v-col>
        <v-col cols="12" sm="6" class="mb-4" >
          <NutrientsPieChart        :entries="entries"/>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
const API_URL = import.meta.env.VITE_APP_API_URL;
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
  props: {
    userId: {
      type: [String, Number],
      required: true,
    },
    friend: {
      type: [Boolean],
      required: false,
    }
  },
  data() {
    return { entries: [] };
  },
  mounted() {
    this.fetchEntries();
  },
  watch: {
    userId(newVal) {
      console.log(newVal)
      this.fetchEntries()
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
          API_URL + `foods/entries/since-last-monday?userId=${this.userId}`
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
