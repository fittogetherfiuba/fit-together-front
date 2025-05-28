<template>
  <v-card
    class="mx-auto my-4"
    elevation="10"
    max-width="550"
  >
    <v-card-title class="text-h6 text-center font-weight-bold bg-secondary">
      <v-icon left>mdi-water</v-icon>
      Agua consumida esta semana
    </v-card-title>
    <v-card-text class="d-flex flex-column" style="flex: 1;">
      <div v-if="isChartDataReady" class="mt-4" style="flex: 1;">
        <Bar :data="chartData" :options="chartOptions"/>
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
  props: {
    userId: {
      type: [String, Number],
      required: true,
    }
  },
  watch: {
    userId(newVal) {
      console.log(newVal)
      this.fetchWaterMetrics()
    }
  },
  data() {
    return {
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 4
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
      Array.isArray(this.chartData.datasets) &&
      this.chartData.datasets.length > 0 &&
      Array.isArray(this.chartData.labels)
    );
  }
  },
  mounted() {
    this.fetchWaterMetrics();
  },
  methods: {
    async fetchWaterMetrics() {
      //const userId = this.$store.state.main.user.userId.toString();
      if (!this.userId) {
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
        const resp = await axios.get('http://localhost:3000/api/water/entries?userId=' + this.userId);
        const entries = Array.isArray(resp.data.entries) ? resp.data.entries : [];
        const labels = [];
        const data = [];
        let sum = 0;
        const endDate = new Date();

        for (let d = new Date(monday); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().slice(0, 10);
          labels.push(d.toLocaleDateString('es-AR', { weekday: 'short' }));
          const dayEntries = entries.filter(e => e.consumedAt.slice(0, 10) === dateStr);
          const liters = dayEntries.reduce((sum, e) => {
            const value = Number(e.liters); 
            return !isNaN(value) ? sum + value : sum;
          }, 0);

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
