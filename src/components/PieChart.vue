<template>
  <div>
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Props: filled (progreso), total (objetivo) y goalType (tipo de objetivo)
const props = defineProps({
  filled: { type: Number, required: true },
  total: { type: Number, required: true },
  goalType: { type: String, required: true }  // 'water' o 'calories'
});

const chartData = computed(() => {
  // Calcular porción de progreso y resto
  const progress = Math.min(props.filled, props.total);
  const remaining = Math.max(props.total - props.filled, 0);

  // Elegir color según tipo y si excedió
  let progressColor;
  if (props.goalType === 'water') {
    // Para agua: azul si excedió, rojo si no
    progressColor = props.filled > props.total 
      ? 'rgb(75,192,192)'   // azul cuando excede
      : 'rgb(255,99,132)';  // rojo cuando no alcanza
  } else {
    // Para calorías: rojo si excede, azul si no
    progressColor = props.filled > props.total 
      ? 'rgb(255,99,132)'   // rojo cuando excede
      : 'rgb(75,192,192)';  // azul cuando no alcanza
  }

  return {
    labels: ['Progreso', 'Restante'],
    datasets: [
      {
        data: [progress, remaining],
        backgroundColor: [
          progressColor,
          'rgb(211,211,211)'  // gris para la porción restante
        ],
        borderWidth: 0
      }
    ]
  };
});

const chartOptions = {
  cutout: '70%',              // estilo donut
  animation: { animateRotate: true },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  }
};
</script>

<style scoped>
/* Aquí puedes añadir estilos si lo necesitas */
</style>
