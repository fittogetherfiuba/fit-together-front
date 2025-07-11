<template>
  <div class="chart-wrapper" style="flex: 1">
    <Bar v-if="isChartDataReady" :data="chartData" :options="chartOptions" />
    <div v-else class="text-center py-4">Cargando gráfico de agua…</div>
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
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true, max: 4 } } 
};

function buildChart() {
  if (!Array.isArray(props.entries) || !props.entries.length) {
    isChartDataReady.value = false;
    return;
  }

  const totalsByDay = new Map();         
  props.entries.forEach(e => {
    const day = e.consumedAt.slice(0, 10);
    totalsByDay.set(day, (totalsByDay.get(day) || 0) + Number(e.liters));
  });

  const labels = [];
  const data   = [];

  const today     = new Date();
  const startDate = new Date(today);

  // Retrocedemos 6 días para cubrir los últimos 7 días (incluyendo hoy)
  startDate.setDate(today.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    // Abreviatura del día en español (es-AR)
    labels.push(d.toLocaleDateString('es-AR', { weekday: 'short' }));
    // Si no hay valor, caemos en 0
    data.push(totalsByDay.get(key) || 0);
  }

  chartData.value = {
    labels,
    datasets: [{ 
        label: 'Agua (litros)',
        data, 
        backgroundColor: 'lightblue'
    }],
  };

  isChartDataReady.value = true;
}

watch(() => props.entries, buildChart, { immediate: true, deep: true });
</script>
