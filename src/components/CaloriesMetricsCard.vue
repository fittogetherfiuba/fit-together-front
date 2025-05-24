
<template>
  <v-card class="pa-4" elevation="10">
    <v-card-title class="text-h6 text-center">
      Calorías por tipo
    </v-card-title>
    <v-card-text class="d-flex">
      <Pie :chart-data="chartData" :chart-options="chartOptions" />
      <ul class="ml-4" style="list-style:none; padding:0;">
        <li v-for="(label, i) in labels" :key="label">
          <span
            :style="{
              backgroundColor: colors[i],
              display: 'inline-block',
              width: '12px',
              height: '12px',
              marginRight: '8px'
            }"
          ></span>
          {{ label }}: {{ dataValues[i] }} kcal
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>
<!--

<script>
import { Pie } from 'vue-chartjs';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

Chart.register(ArcElement, Tooltip, Legend);

export default {
  name: 'CaloriesMetricsCard',
  components: { Pie },
  data() {
    return {
      chartData: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
      chartOptions: { plugins: { legend: { position: 'right' } } },
      labels: [],
      dataValues: [],
      colors: []
    };
  },
  created() {
    this.fetchCaloriesMetrics();
  },
  methods: {
    async fetchCaloriesMetrics() {
      const userId = this.$store.state.main.user.userId;
      try {
        const resp = await axios.get('/api/foods/entries/since-last-monday', {
          params: { userId }
        });
        const { entries } = resp.data;
        const totals = {};
        entries.forEach(e => {
          totals[e.foodname || e.foodName] = (totals[e.foodname || e.foodName] || 0) + e.calories;
        });
        this.labels = Object.keys(totals);
        this.dataValues = this.labels.map(k => totals[k]);
        this.colors = this.labels.map((_, idx) =>
          `hsl(${(idx * 360) / this.labels.length},70%,70%)`
        );
        this.chartData = {
          labels: this.labels,
          datasets: [{ data: this.dataValues, backgroundColor: this.colors }]
        };
      } catch (error) {
        console.error('Error cargando métricas de calorías:', error);
      }
    }
  }
};
</script>

-->