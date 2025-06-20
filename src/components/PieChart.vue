<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  filled: Number,
  total: Number,
  goalType: String // 'calories' o 'water'
})

const chartData = computed(() => {
  const over = props.goalType === 'calories' ? props.filled > props.total : 0
  const fill = over ? props.total : props.filled
  const remaining = Math.max(props.total - props.filled, 0)
  const excess = over ? props.filled - props.total : 0

  return {
    labels: ['Progreso', 'Restante', 'Exceso'],
    datasets: [
      {
        data: [fill, remaining, excess],
        backgroundColor: [
          props.goalType === 'calories' ? '#4caf50' : '#2196f3',
          '#e0e0e0', 
          over ? '#f44336' : 'transparent'
        ],
        borderWidth: 0
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  cutout: '65%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || ''
          const value = context.parsed
          return `${label}: ${value}`
        }
      }
    }
  }
}
</script>