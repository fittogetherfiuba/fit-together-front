<template>
  <div class="text-center mt-4">
    Calorías consumidas esta semana (kcal)
  </div>

  <div class="chart-wrapper" style="min-height: 250px;">
    <Bar v-if="isChartDataReady" :data="chartData" :options="chartOptions" />
    <div v-else class="text-center py-4">Cargando gráfico de calorías…</div>
  </div>


  <div class="text-center mt-2 font-weight-medium">
    Total consumido: {{ totalWeekly }} kcal
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
  Tooltip
} from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const props = defineProps({
  entries: { type: Array, required: true }   
});

const chartData        = ref(null);
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
    const day  = e.consumedAt.slice(0, 10);
    const kcal = Number(e.calories) || 0;
    totalsByDay.set(day, (totalsByDay.get(day) || 0) + kcal);
    weeklySum += kcal;
  });

  totalWeekly.value = weeklySum;

  const labels = [];
  const data   = [];

  const today  = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  for (let d = new Date(monday); d <= today; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    labels.push(d.toLocaleDateString('es-AR', { weekday: 'short' }));
    data.push(totalsByDay.get(key) || 0);
  }

  chartData.value = {
    labels,
    datasets: [{
      label: 'Calorías (kcal)',
      data,
      backgroundColor: '#FFB74D'
    }]
  };
  isChartDataReady.value = true;
}

watch(() => props.entries, buildChart, { immediate: true, deep: true });
</script>
