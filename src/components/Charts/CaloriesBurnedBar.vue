<template>
  <div class="text-center mt-4">Calorías quemadas esta semana (kcal)</div>

  <div class="chart-wrapper" style="min-height: 300px;">
    <Bar v-if="isChartDataReady" :data="chartData" :options="chartOptions" />
    <div v-else class="text-center py-4">Cargando gráfico…</div>
  </div>

  <div class="text-center mt-2 font-weight-medium">
    Total quemado: {{ totalWeekly }} kcal
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const props = defineProps({
  entries: { type: Array, required: true }
});

const chartData        = ref({ labels: [], datasets: [] });
const isChartDataReady = ref(false);
const totalWeekly      = ref(0);           

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true } },
  plugins: { legend: { position: 'bottom' } }
};

function buildChart () {
  const totalsByDay = new Map();
  let weeklySum = 0;                       

  props.entries.forEach(e => {
    const day = e.performedAt.slice(0, 10);
    const kcal = Number(e.caloriesBurned) || 0;
    totalsByDay.set(day, (totalsByDay.get(day) || 0) + kcal);
    weeklySum += kcal;                      
  });

  totalWeekly.value = weeklySum;           

  const labels = [];
  const data   = [];

  const today     = new Date();
  const startDate = new Date(today);

  // Retrocedemos 6 días para cubrir los últimos 7 días (incluyendo hoy)
  startDate.setDate(today.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    labels.push(d.toLocaleDateString('es-AR', { weekday: 'short' }));
    data.push(totalsByDay.get(key) || 0);
  }

  chartData.value = {
    labels,
    datasets: [{
      label: 'Calorías (kcal)',
      data,
      backgroundColor: '#FF7043'
    }]
  };
  isChartDataReady.value = true;
}

watch(() => props.entries, buildChart, { immediate: true, deep: true });
</script>
