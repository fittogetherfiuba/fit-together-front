<template>
	<div class="text-center mt-4">
    	Calorias Por Comida (kcal)
  	</div>
	<div class="chart-wrapper" style="min-height: 250px;">
		<Bar v-if="isChartDataReady" :data="chartData" :options="chartOptions"/>
		<div v-else class="text-center py-4">Cargando gráfico de calorías por período…</div>
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

const chartData = ref(null);
const isChartDataReady = ref(false);
const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	scales: { y: { beginAtZero: true } },
	plugins: { legend: { position: 'bottom' } }
};

const PERIODS = ['desayuno', 'almuerzo', 'merienda', 'cena', 'Sin período definido'];

function buildChart() {
	const map = {};
	PERIODS.forEach(p => (map[p] = new Map()));

	props.entries.forEach(e => {
		const day = e.consumedAt.slice(0, 10);
		const period = e.period ?? 'Sin período definido';
		map[period].set(day, (map[period].get(day) || 0) + Number(e.calories));
	});

	const labels = [];
	const today = new Date();
	const monday = new Date(today);
	monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
	monday.setHours(0, 0, 0, 0);

	for (let d = new Date(monday); d <= today; d.setDate(d.getDate() + 1)) {
		labels.push(d.toLocaleDateString('es-AR', { weekday: 'short' }));
	}
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
	const NULL_COLOR = '#9E9E9E';// gris para “Sin período definido”

	const colorByPeriod = new Map();
	let paletteIndex = 0;

	PERIODS.forEach(period => {
	if (period === 'Sin período definido') {
		colorByPeriod.set(period, NULL_COLOR);
	} else {
		colorByPeriod.set(period, PALETTE[paletteIndex % PALETTE.length]);
		paletteIndex++;
	}
	});

	const datasets = PERIODS.map(period => ({
		label: period,
		data: labels.map((_, i) => {
		const dateStr = new Date(monday.getTime() + i * 864e5).toISOString().slice(0, 10);
		return map[period].get(dateStr) || 0;
		}),
		backgroundColor: colorByPeriod.get(period)
	}));

	chartData.value = 
		{ 
		labels,
		datasets 
		};
	isChartDataReady.value = true;
}

watch(() => props.entries, buildChart, { immediate: true, deep: true });
</script>
