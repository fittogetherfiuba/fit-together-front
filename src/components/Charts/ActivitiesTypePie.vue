<template>
  <div class="text-center mt-4">Calorías quemadas por actividad</div>

  <div
    class="d-flex flex-column flex-md-row justify-center align-start"
    style="gap: 32px;"
  >
    <div class="chart-container">
      <div class="chart-title">Cardio</div>
      <Pie v-if="cardioReady" :data="cardioData" :options="pieOpts" />
      <div v-else class="chart-empty">Sin datos de cardio</div>

      <div class="text-center mt-2 font-weight-medium">
        Total quemado: {{ cardioTotal }} kcal
      </div>
    </div>

    <div class="chart-container">
      <div class="chart-title">Musculación</div>
      <Pie v-if="muscleReady" :data="muscleData" :options="pieOpts" />
      <div v-else class="chart-empty">Sin datos de musculación</div>

      <div class="text-center mt-2 font-weight-medium">
        Total quemado: {{ muscleTotal }} kcal
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { Pie } from 'vue-chartjs';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, Title);

const props = defineProps({
  entries: { type: Array, required: true }
});

const cardioData  = reactive({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
const muscleData  = reactive({ labels: [], datasets: [{ data: [], backgroundColor: [] }] });
const cardioReady = ref(false);
const muscleReady = ref(false);

const cardioTotal = ref(0);   
const muscleTotal = ref(0);

const pieOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, padding: 10 } },
    tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed} kcal` } }
  }
};

function buildChart () {
  const cardioMap = new Map();
  const muscleMap = new Map();

  let cTotal = 0, mTotal = 0;

  for (const { activityType, activityName, caloriesBurned } of props.entries) {
    const kcal = Number(caloriesBurned) || 0;
    if (!kcal) continue;

    const type = (activityType || '').toLowerCase();
    if (type === 'cardio') {
      cardioMap.set(activityName, (cardioMap.get(activityName) || 0) + kcal);
      cTotal += kcal;
    } else if (type === 'musculacion') {
      muscleMap.set(activityName, (muscleMap.get(activityName) || 0) + kcal);
      mTotal += kcal;
    }
  }

  cardioTotal.value = cTotal;
  muscleTotal.value = mTotal;

  updatePie(cardioData, cardioMap);
  updatePie(muscleData, muscleMap);

  cardioReady.value = cardioData.labels.length > 0;
  muscleReady.value = muscleData.labels.length > 0;
}

function updatePie (target, map) {
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

  
  const labels = [...map.keys()];
  const data   = [...map.values()];

  const colors = Array.from(labels).map((_, index) => PALETTE[index % PALETTE.length]);

  target.labels.splice(0, target.labels.length, ...labels);
  Object.assign(target.datasets[0], { data, backgroundColor: colors });
}

watch(() => props.entries, buildChart, { immediate: true, deep: true });
</script>

<style scoped>
.chart-container { position: relative; width: 100%; max-width: 340px; height: 260px; display: flex; flex-direction: column; }
.chart-title      { text-align: center; font-weight: 500; margin-bottom: 4px; }
.chart-empty      { flex: 1; display: flex; align-items: center; justify-content: center; font-size: .9rem; color:#888; }
</style>
