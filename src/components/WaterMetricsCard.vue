<template>
  <v-card class="pa-4" elevation="10" style="height: 400px;">
    <v-card-title class="text-h6 text-center">
      Agua consumida esta semana
    </v-card-title>
    <v-card-text class="d-flex flex-column" style="flex: 1;">
      <div v-if="isChartDataReady" style="flex: 1;">
        <Bar :chart-data="chartData" :chart-options="chartOptions" style="flex: 1;" />
      </div>
      <div v-else class="text-center py-4">Cargando gráfico...</div>

      <div class="text-center mt-4">
        Total esta semana: {{ totalLiters.toFixed(2) }} L
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';
import { defineComponent } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

export default defineComponent({
  name: 'WaterMetricsCard',
  components: { Bar },
  data() {
    return {
      chartData: null,  // Se inicializa como null para forzar control de carga
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5
          }
        }
      },
      totalLiters: 0
    };
  },
  computed: {
    isChartDataReady() {
      return (
        this.chartData &&
        Array.isArray(this.chartData.labels) &&
        this.chartData.labels.length > 0
      );
    }
  },
  mounted() {
    this.fetchWaterMetrics();
  },
  methods: {
    async fetchWaterMetrics() {
      const userId = this.$store?.state?.main?.user?.userId;
      if (!userId) {
        console.warn("userId no disponible");
        return;
      }

      const now = new Date();
      const todayDay = now.getDay();
      const daysSinceMon = (todayDay + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - daysSinceMon);
      monday.setHours(0, 0, 0, 0);

      try {
        const resp = await axios.get('/api/water/entries/since-last-monday', {
          params: { userId }
        });
        const entries = Array.isArray(resp.data.entries) ? resp.data.entries : [];

        const labels = [];
        const data = [];
        let sum = 0;
        const endDate = new Date();

        for (let d = new Date(monday); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().slice(0, 10);
          labels.push(dateStr);
          const rec = entries.find(e => e.consumed_at === dateStr);
          const liters = rec && typeof rec.liters === 'number' ? rec.liters : 0;
          data.push(liters);
          sum += liters;
        }

        this.chartData = {
          labels,
          datasets: [
            {
              label: 'Litros',
              data,
              backgroundColor: 'lightblue'
            }
          ]
        };

        this.totalLiters = sum;
      } catch (error) {
        console.error('Error cargando métricas de agua:', error);
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
