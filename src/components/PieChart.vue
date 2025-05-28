<template>
  <div>
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { computed } from 'vue';

// Registrar los elementos necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Props: valor actual y total del objetivo
const props = defineProps({
  filled: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

// Datos del pie chart: progreso vs resto
const chartData = computed(() => ({
  labels: ['Progreso', 'Restante'],
  datasets: [
    {
      data: [
        Math.min(props.filled, props.total),
        Math.max(props.total - props.filled, 0)
      ],
      backgroundColor: [
        props.filled > props.total ? 'rgb(255,99,132)' : 'rgb(75,192,192)',
        'rgb(211,211,211)'
      ],
      borderWidth: 0
    }
  ]
}));

// Opciones del gráfico
const chartOptions = {
  cutout: '70%',       // para estilo donut
  animation: {
    animateRotate: true
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  }
};
</script>

<style scoped>
/* Ajustes de tamaño si es necesario */
</style>