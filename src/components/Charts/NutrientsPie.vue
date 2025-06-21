<template>
    <div class="text-center mt-4">
    	Nutrientes (gramos)
  	</div>
    <div v-if="chartData.labels.length" class="chart-wrapper" style="flex:1" >
        <Pie v-if="isChartDataReady" :data="chartData" :options="chartOptions"/>
        <div v-else class="text-center py-4">Cargando gráfico de nutrientes…</div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Pie } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);

import {
    Chart,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(ArcElement, Title, Tooltip, Legend);

const props = defineProps({
    entries: { type: Array, required: true }
});

const chartData = ref(null);
const isChartDataReady = ref(false);
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    datalabels: {
      formatter: (value, ctx) => {
        const dataset = ctx.chart.data.datasets[0].data;
        const total = dataset.reduce((acc, val) => acc + val, 0);
        const percentage = (value / total) * 100;
        return percentage >= 5 ? percentage.toFixed(1) + '%' : ''; // oculta < 5%
      },
      color: '#fff',
      font: {
        weight: 'bold'
      }
    }

  }
};


function buildChart() {
const PALETTE = [
  '#81C784', // verde atenuado
  '#64B5F6', // azul atenuado
  '#FFB74D', // naranja atenuado
  '#BA68C8', // violeta atenuado
  '#FFD54F', // amarillo atenuado
  '#4DB6AC', // turquesa atenuado
  '#EC407A', // rosa atenuado
  '#9575CD', // lavanda intermedia 
  '#FF8A65'  // coral intermedio 
    ];
    
    const totals = new Map(); 
    props.entries.forEach(e => {
        (e.nutrients || []).forEach(n => {
        totals.set(n.name, (totals.get(n.name) || 0) + Number(n.amount));
        });
    });
    const segmentColors = Array.from(totals.keys()).map((_, index) => PALETTE[index % PALETTE.length]);
    chartData.value = {
        labels: [...totals.keys()],
        datasets: [{ data: [...totals.values()], backgroundColor: segmentColors }]
    };
    console.log(chartData)
    isChartDataReady.value = true;
}

watch(() => props.entries, buildChart, { immediate: true, deep: true });
</script>
