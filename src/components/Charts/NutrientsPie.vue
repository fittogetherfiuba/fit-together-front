<template>
    <div class="chart-wrapper" style="flex:1">
        <Pie v-if="isChartDataReady" :data="chartData" :options="chartOptions"/>
        <div v-else class="text-center py-4">Cargando gráfico de nutrientes…</div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Pie } from 'vue-chartjs';
import {
    Chart,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
//import {PALETTE} from '@/components/Charts/Chart.js';

Chart.register(ArcElement, Title, Tooltip, Legend);

const props = defineProps({
    entries: { type: Array, required: true }
});

const chartData = ref(null);
const isChartDataReady = ref(false);
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
};

function buildChart() {
    const PALETTE = [
      '#4CAF50', // verde
      '#2196F3', // azul
      '#FF9800', // naranja
      '#9C27B0', // violeta
      '#FFC107', // amarillo
      '#009688', // turquesa
      '#E91E63'  // rosa
    ];
    
    const totals = new Map(); // nutrientName -> gramos (o mg)
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
    isChartDataReady.value = true;
}

watch(() => props.entries, buildChart, { immediate: true, deep: true });
</script>
