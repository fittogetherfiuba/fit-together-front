<template>
  <div class="chart-wrapper" style="flex:1">
    <Bar v-if="isChartDataReady" :data="chartData" :options="chartOptions"/>
    <div v-else class="text-center py-4">Cargando gráfico de calorías…</div>
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
  entries: { type: Array, required: true } // array crudo de la API
});

const chartData = ref(null);
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true } }
};
const isChartDataReady = ref(false);

function buildChart() {
  const totalsByDay = new Map(); // yyyy-mm-dd → kcal
  props.entries.forEach(e => {
    const day = e.consumedAt.slice(0, 10);
    totalsByDay.set(day, (totalsByDay.get(day) || 0) + Number(e.calories));
  });

  const labels = [];
  const data = [];
  const today = new Date();
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
    datasets: [
        { 
        label: 'Calorías (kcal)',
        data,
        backgroundColor: 'orange' 
        }
    ]
  };
  isChartDataReady.value = true;
}

watch(() => props.entries, buildChart, { immediate: true, deep: true });
</script>
